# Automations Map

> Mapa completo de automatizaciones del sistema: cron jobs, hooks, workflows automáticos y dependencias entre agentes.

---

## 1. Cron Jobs Activos

### 1.1 Newsletter Digest Pipeline

| Campo | Valor |
|-------|-------|
| **Nombre** | Daily Newsletter Digest |
| **Schedule (UTC)** | `0 9 * * *` (9:00 AM UTC) |
| **Schedule (Montevideo)** | 6:00 AM (UTC-3) |
| **Propósito** | Fetch newsletters → Filter → Format → Deliver to Slack |
| **Estado** | Operativo |
| **Canal de salida** | `#newsletter-digest` (Slack) |

**Pipeline:**
```
┌─────────────────────────────────────────────────────────────┐
│ Cron trigger (9:00 AM UTC)                                  │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Spawn researcher agent                                      │
│ - Fetch emails from 8 senders (Gmail API)                   │
│ - Filter by relevance (Tech > History > Art > News)         │
│ - Output: newsletter-analysis-{YYYY-MM-DD}.md               │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Spawn writer agent                                          │
│ - Format digest (5-7 items, ~500 words)                     │
│ - Output: newsletter-digest-{YYYY-MM-DD}.md                 │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Deliver to Slack                                            │
│ - Channel: newsletter-digest                                │
│ - Update checkpoint: delivered                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 1.2 Twitter RSS Pipeline

| Campo | Valor |
|-------|-------|
| **Nombre** | Twitter RSS Daily |
| **Schedule (UTC)** | `0 */12 * * *` (cada 12 horas) |
| **Schedule (Montevideo)** | 9:00 AM y 9:00 PM (UTC-3) |
| **Propósito** | Fetch → Format → Deliver tweets |
| **Estado** | Operativo |
| **Canales de salida** | `#twitter-daily` (Slack) + Telegram |

**Pipeline:**
```
┌─────────────────────────────────────────────────────────────┐
│ Cron trigger (cada 12h)                                     │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ twitter-fetch (researcher)                                  │
│ - Fetch RSS from configured accounts                        │
│ - Stop at last processed tweet ID                           │
│ - Output: data/tweets-raw-{timestamp}.json                  │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ twitter-format (writer)                                     │
│ - Filter by keywords (tech/finance/marketing)               │
│ - Group by category                                         │
│ - Output: digest-{timestamp}.md                             │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Deliver                                                     │
│ - Slack: #twitter-daily                                     │
│ - Telegram: twitter-news group                              │
│ - Update checkpoint: last-state.json                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Hooks y Patterns de Integración

### 2.1 Checkpoint Pattern

**Propósito:** Resumir pipelines largos sin perder estado.

**Estructura de checkpoint:**
```json
{
  "skill": "skill-name",
  "date": "2026-02-18",
  "stage": "analysis|processing|done|error",
  "timestamps": {
    "start": "2026-02-18T11:45:00Z",
    "end": "2026-02-18T11:50:00Z"
  },
  "data": { /* skill-specific */ },
  "error": { "message": "...", "stage": "..." }
}
```

**Ubicaciones de checkpoints:**
| Skill | Ubicación |
|-------|-----------|
| newsletter-digest | `checkpoints/newsletter/YYYY-MM-DD.json` |
| twitter-fetch | `checkpoints/last-state.json` |
| twitter-educativo | `checkpoints/last-state.json` |
| brokia-plan | `plans/checkpoints/{ID}-stage-{N}.json` |

---

### 2.2 RAG Integration Hook

**Propósito:** Inyectar contexto en búsquedas RAG.

**Flow:**
```
User query → Embed (local sentence-transformers) → 
Search vector DB → Top-K chunks → 
Inject as quoted context → LLM response
```

**Configuración actual:**
| Parámetro | Valor |
|-----------|-------|
| MAX_RAG_CHARS_TOTAL | 1200 |
| MAX_CHUNK_CHARS | 400 |
| TOP_K | 3 |
| Embedding model | paraphrase-multilingual-MiniLM-L12-v2 |
| Generation LLM | OpenRouter (cloud) |

**Sanitization aplicada:**
- API keys maskeados
- IPs privadas ocultas
- URLs internas filtradas
- Credenciales removidas

---

### 2.3 Message Delivery Hook

**Propósito:** Unificar delivery a Slack/Telegram.

**Pattern:**
```json
{
  "action": "send",
  "channel": "slack|telegram",
  "target": "channel-id-or-name",
  "message": "formatted content",
  "threadId": "optional"
}
```

**Canales configurados:**
| Canal | ID | Propósito |
|-------|-----|-----------|
| Slack #qubika-ai-radar | C0AFD6WE00K | Radar semanal Qubika |
| Slack #brokia-ai-alerts | C0AFK08BFR8 | Alertas Brokia |
| Slack #brokia-ai-briefing | C0AFCCNP0MR | Briefings automatizados |
| Slack #twitter-daily | C0AFTFS7ZPC | Digest Twitter |
| Telegram @manu | 2017549847 | Mensajes directos |

---

## 3. Workflows Automáticos

### 3.1 Plan-Stage-Checkpoint Workflow

**Trigger:** Manual (chief agent) o como parte de plan mayor.

**Stages:**
```
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 1: Planning                                             │
│  - chief agent genera plan estructurado                        │
│  - Guarda en plans/PLAN-{ID}-{slug}.md                         │
│  - Crea checkpoint inicial                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 2: Execution (por cada etapa)                           │
│  - builder/ops/other agent ejecuta                             │
│  - Lee checkpoint anterior                                     │
│  - Actualiza checkpoint con resultados                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 3: Review (opcional)                                    │
│  - Validación de outputs                                       │
│  - Si falla: rollback o retry                                  │
│  - Si pasa: siguiente etapa                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 4: Documentation                                        │
│  - writer agent actualiza MEMORY.md                            │
│  - Guarda aprendizajes                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3.2 Research-Curate-Deliver Workflow

**Trigger:** Cron (newsletter, twitter) o manual (research requests).

**Stages:**
```
┌─────────────────────────────────────────────────────────────────┐
│  RESEARCH                                                      │
│  - Fetch: Gmail/RSS/Web                                        │
│  - Filter: Keywords, relevancia                                │
│  - Parse: Estructurar datos                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  CURATE                                                        │
│  - Rank: Por score de relevancia                               │
│  - Select: Top N items                                         │
│  - Summarize: Abstracts cortos                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  FORMAT                                                        │
│  - Markdown: Estructura para el canal                          │
│  - Adaptar: Slack vs Telegram vs Email                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  DELIVER                                                       │
│  - Send: Al canal configurado                                  │
│  - Log: checkpoint + messageId                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3.3 Qubika Radar Workflow

**Trigger:** Email de radar recibido (manual trigger).

**Stages:**
```
┌─────────────────────────────────────────────────────────────────┐
│  1. Parse Email                                                │
│  - Extraer prioridades (VS-X, deadlines)                       │
│  - Identificar blockers                                        │
│  - Categorizar por dominio                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. Generate Summary                                           │
│  - Top 3 priorities                                            │
│  - Blockers alerts                                             │
│  - Suggested next actions                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. Deliver                                                    │
│  - Slack: #qubika-ai-radar                                     │
│  - Formato: Markdown estructurado                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Dependencias entre Agentes (Graph)

```
                              ┌─────────────┐
                              │    main     │
                              │ (orquesta)  │
                              └──────┬──────┘
                                     │
           ┌─────────┬─────────┬─────┴─────┬─────────┬─────────┐
           ▼         ▼         ▼           ▼         ▼         ▼
      ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
      │resear- │ │ writer │ │ builder│ │ chief  │ │  ops   │ │ brokia │
      │cher    │ │        │ │        │ │        │ │        │ │        │
      └────┬───┘ └────┬───┘ └────┬───┘ └────┬───┘ └────┬───┘ └────┬───┘
           │          │          │          │          │          │
           └──────────┴─────┬────┴──────────┴──────────┴──────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │  shared/        │
                   │  - checkpoints  │
                   │  - plans        │
                   │  - memory       │
                   └─────────────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │  integrations/  │
                   │  - Slack        │
                   │  - Telegram     │
                   │  - Gmail        │
                   │  - RAG          │
                   └─────────────────┘
```

**Flujos comunes:**
| Flujo | Agentes | Propósito |
|-------|---------|-----------|
| Research→Write→Deliver | researcher → writer → main | Curated content |
| Plan→Build→Review | chief → builder → ops | Feature development |
| Audit→Harden→Document | ops → builder → writer | Security hardening |
| Research→Plan→Execute | researcher → chief → builder | Complex projects |

---

## 5. Integraciones Externas

### 5.1 Slack

| Canal | ID | Uso | Frecuencia |
|-------|-----|-----|------------|
| #qubika-ai-radar | C0AFD6WE00K | Radar semanal | Semanal |
| #brokia-ai-alerts | C0AFK08BFR8 | Alertas | Por evento |
| #brokia-ai-briefing | C0AFCCNP0MR | Briefings | Semanal |
| #twitter-daily | C0AFTFS7ZPC | Digest Twitter | 2x diario |

### 5.2 Telegram

| Target | ID | Uso |
|--------|-----|-----|
| @manu | 2017549847 | Mensajes directos |

### 5.3 Gmail

| Cuenta | Uso | Acceso |
|--------|-----|--------|
| tachipachi9797@gmail.com | Pipeline newsletters | OAuth (gog CLI) |

### 5.4 Google Workspace (Qubika)

| Servicio | Uso |
|----------|-----|
| Confluence (export) | RAG interno |
| Google Sheets | Procesos Brokia |
| Google Apps Script | Automatizaciones |

---

## 6. Gaps y Mejoras Identificadas

| Gap | Prioridad | Solución propuesta |
|-----|-----------|-------------------|
| No hay cron para heartbeat | Media | Añadir cron que verifique inbox/calendar |
| Fallback manual si falla cron | Baja | Script de retry automático |
| No hay monitoreo de salud | Alta | Dashboard Prometheus/Grafana |
| Delivery solo a Slack/Telegram | Baja | Añadir email/Discord |

---

**Última actualización:** 2026-02-18
**Próxima revisión:** 2026-03-18