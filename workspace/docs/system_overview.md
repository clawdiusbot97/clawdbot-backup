# System Overview — OpenClaw Multi-Agent System

> **Nota:** Este documento refleja la arquitectura actual y está diseñado para evolucionar. Consulta `context_state.md` para el estado de integraciones activas.

## 1. Filosofía Multiagente

### 1.1 Principios Fundamentales

| Principio | Descripción |
|-----------|-------------|
| **Especialización** | Cada agente tiene un rol definido (research, writing, planning, etc.) |
| **Orquestación** | Un orquestador principal delega tareas según el dominio |
| **Checkpointing** | Estado persistido en cada etapa para recuperación ante fallos |
| **Separación de contexto** | Memoria a corto plazo por sesión, memoria compartida en archivos |
| **Delegación explícita** | Todo task debe incluir: deliverable, contexto, formato, constraints |

### 1.2 Modelo de Orquestación

```
┌─────────────────────────────────────────────────────────────┐
│                    MAIN AGENT (Orquestador)                  │
│  - Routing de tareas a agentes especializados                │
│  - Síntesis de resultados                                    │
│  - Coordinación de workflows multi-agente                   │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   researcher  │    │     writer    │    │    builder    │
│  - Web search │    │  - Documentos │    │  - Arquitectura│
│  - Comparación│    │  - Drafting   │    │  - Código      │
│  - Facts      │    │  - Editing    │    │  - Debugging   │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  AGENTES DE DOMINIO                                        │
│  - chief: planificación, priorización                      │
│  - ops: seguridad, infraestructura                         │
│  - brokia: thesis/producto Brokia                          │
│  - qubika: contexto corporativo Qubika                     │
└─────────────────────────────────────────────────────────────┘
```

## 2. Arquitectura de Componentes

### 2.1 Gateway Layer

| Componente | Propósito | Estado |
|------------|-----------|--------|
| `openclaw gateway` | Daemon central que gestiona agentes y mensajes | Activo |
| `workspace-state.json` | metadata del workspace (version, seed time) | Operativo |
| Subagents | Sesiones efímeras spawnneadas por el agente principal | Gestión activa |

### 2.2 Capa de Memoria

| Tipo | Ubicación | Propósito |
|------|-----------|-----------|
| **Sesión** | Memoria RAM del LLM | Contexto vivo de la sesión actual |
| **Daily notes** | `memory/YYYY-MM-DD.md` | Logs raw de cada sesión |
| **Long-term** | `MEMORY.md` | Memorias curadas, preferencias, contexto importante |
| **Checkpoints** | `checkpoints/` | Estado intermedio de pipelines (JSON) |
| **Planes** | `plans/` | Stage-based plans con checkpoints por etapa |

### 2.3 Capa de Skills

| Skill | Agente | Función |
|-------|--------|---------|
| `newsletter-digest` | researcher → writer | Pipeline de curado de newsletters |
| `twitter-fetch` | researcher | Fetch tweets via Nitter RSS |
| `twitter-format` | writer | Formateo de digest de Twitter |
| `twitter-educativo` | mixed | Digest 12h de cuentas configuradas |
| `searxng-search` | researcher | Web search via SearXNG local |
| `excalidraw-diagram` | builder | Generación de diagramas hand-drawn |
| `brokia-plan` | chief | Planificación stage-based |
| `secure-token` | ops | Manejo seguro de credenciales |

### 2.4 Capa de Integraciones

| Servicio | Canal | Propósito |
|----------|-------|-----------|
| Slack | `#qubika-ai-radar` (C0AFD6WE00K) | Radar semanal Qubika |
| Slack | `#brokia-ai-alerts` (C0AFK08BFR8) | Alertas de Brokia |
| Slack | `#brokia-ai-briefing` (C0AFCCNP0MR) | Briefings automatizados |
| Slack | `#twitter-daily` (C0AFTFS7ZPC) | Digest diario de Twitter |
| Telegram | @manu (ID: 2017549847) | Mensajes directos |
| Gmail | tachipachi9797@gmail.com | Pipeline de newsletters |
| Google Workspace | Qubika/Bancard context | RAG interno |

## 3. Flujo de Orquestación

### 3.1 Patrón: Plan-Stage-Checkpoint

```
┌─────────────────────────────────────────────────────────────────┐
│  1. CHIEF crea plan                                             │
│     → plans/PLAN-YYYYMMDD-XX.md                                 │
│     → plans/checkpoints/PLAN-ID-stage-1.json                    │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. BUILDER implementa Stage N                                  │
│     → Lee checkpoint actual                                     │
│     → Ejecuta trabajo                                           │
│     → Actualiza checkpoint con estado + outputs                 │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. OPS revisa (opcional)                                       │
│     → Aprueba o solicita cambios                                │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. WRITER documenta                                            │
│     → Actualiza MEMORY.md                                       │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Patrón: Research-Curate-Deliver

```
┌─────────────────────────────────────────────────────────────────┐
│  RESEARCHER                                                     │
│  - Fetch: Gmail API / RSS / Web                                │
│  - Filter: Keywords, relevancia                                 │
│  - Output: Raw analysis JSON/MD                                │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  WRITER                                                         │
│  - Formato: Markdown estructurado                              │
│  - Entrega: Slack-ready / Telegram-ready                        │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  DELIVERY                                                       │
│  - Canal: Según configuración                                  │
│  - Checkpoint: `stage: delivered`, messageId                   │
└─────────────────────────────────────────────────────────────────┘
```

## 4. Principios de Diseño

### 4.1 Separación de Roles

| Agente | Focus | Evitar |
|--------|-------|--------|
| **researcher** | Facts, comparaciones, web intel | Escribir contenido final |
| **writer** | Claridad, estructura, pulido | Arquitectura técnica |
| **builder** | Diseño e implementación | Estrategia de negocio |
| **chief** | Priorización, roadmap | Código detallado |
| **ops** | Seguridad, infraestructura | Decisiones de producto |
| **brokia** | Thesis Brokia | Contextos no relacionados |

### 4.2 Estado Distribuido

```
┌─────────────────────────────────────────────────────────────────┐
│  ARCHIVOS DE ESTADO                                             │
├─────────────────────────────────────────────────────────────────┤
│  • checkpoints/newsletter/YYYY-MM-DD.json                      │
│  • checkpoints/last-state.json (Twitter)                       │
│  • plans/checkpoints/{ID}-stage-{N}.json                       │
│  • workspace/.openclaw/workspace-state.json                    │
│  • memory/YYYY-MM-DD.md                                        │
│  • MEMORY.md                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Reglas:**
- Cada skill/documenta su checkpoint file
- Formato JSON para parsers; markdown para humanos
- Timestamps en ISO 8601 UTC
- Estado de error incluido para debugging

### 4.3 Safe Patterns

| Pattern | Uso |
|---------|-----|
| **Temporary files** | Credenciales one-time (`/tmp/token.txt`) |
| **Environment variables** | Credenciales repetidas (`export GITHUB_TOKEN=...`) |
| **Git credential helper** | Tokens Git (`~/.git-credentials`) |
| ** nunca** | Paste de tokens en chat, log de tokens |

## 5. Model Selection Guidelines

| Tarea | Modelo | Razón |
|-------|--------|-------|
| Code generation | `openai-codex/gpt-5.3-codex` | Correctness, testing |
| Planning | `deepseek-v3.2` | Reasoning, structure |
| Research/Writing | `minimax-m2.1` | Throughput, cost-efficiency |
| Complex debugging | `openai-codex/gpt-5.3-codex` | Step-by-step analysis |

## 6. Archivos Clave de Referencia

| Archivo | Propósito |
|---------|-----------|
| `SOUL.md` | Identidad del orquestador |
| `USER.md` | Perfil del usuario (Manu) |
| `MEMORY.md` | Memorias curadas de largo plazo |
| `AGENTS.md` | Registry de agentes y patrones |
| `TOOLS.md` | Notas locales de infraestructura |
| `HEARTBEAT.md` | Checklist de verificaciones periódicas |

---

**Última actualización:** 2026-02-18
**Próxima revisión:** 2026-03-18