# Agents Registry

> Registry vivo de todos los agentes del sistema OpenClaw. Cada entrada incluye rol, responsabilidades, I/O típicos y oportunidades de mejora.

---

## 1. Agentes Principales

### 1.1 main (Orquestador)

| Campo | Valor |
|-------|-------|
| **Rol** | Orquestador central |
| **Responsabilidades** | Routing de tareas, síntesis de resultados, coordinación multi-agente, gestión de contexto |
| **Inputs típicos** | Request del usuario, contexto de sesión, archivos relevantes |
| **Outputs típicos** | Respuesta final, spawn de subagentes, actualizaciones de memoria |
| **Skills asociadas** | N/A (skillless by design) |

**Posibles mejoras:**
- [ ] Implementar router inteligente basado en keywords del request
- [ ] Añadir fallback automático cuando un subagente falla
- [ ] Integrar métricas de latency por tipo de tarea

**Redundancias:** Ninguna

---

### 1.2 researcher

| Campo | Valor |
|-------|-------|
| **Rol** | Especialista en investigación |
| **Responsabilidades** | Web search, comparaciones, análisis de facts, gathering de datos |
| **Inputs típicos** | Query de investigación, contexto, fuentes a consultar |
| **Outputs típicos** | Bullet points, pros/cons, matrices de comparación, links citados |

**Skills asociadas:**
- `searxng-search` (SearXNG local)
- `twitter-fetch` (RSS Twitter)
- `newsletter-digest` (research stage)

**Posibles mejoras:**
- [ ] Unificar interfaces de fetch (Gmail, RSS, web) bajo una skill genérica
- [ ] Añadir caching de resultados por query para evitar re-fetch
- [ ] Implementar deduplicación automática de fuentes

**Redundancias:** `twitter-fetch` y `twitter-educativo` comparten lógica de fetch RSS → considerar unificación

---

### 1.3 writer

| Campo | Valor |
|-------|-------|
| **Rol** | Especialista en comunicación |
| **Responsabilidades** | Drafting, editing, reformateo, pulido de contenido |
| **Inputs típicos** | Notas rough, datos crudos, estructura requerida |
| **Outputs típicos** | Markdown paste-ready, emails, documentación, resúmenes |

**Skills asociadas:**
- `twitter-format` (formateo de tweets)
- `newsletter-digest` (writer stage)

**Posibles mejoras:**
- [ ] Templates por tipo de output (email, Slack, documentación)
- [ ] Configuración de tono/length por defecto
- [ ] Multi-language support (EN/ES) con detección automática

**Redundancias:** `twitter-format` y stage de writer en newsletter-digest son muy similares

---

### 1.4 builder

| Campo | Valor |
|-------|-------|
| **Rol** | Especialista técnico |
| **Responsabilidades** | Arquitectura, código, debugging, automatización, diseño de APIs |
| **Inputs típicos** | Requisitos técnicos, contexto de sistema, constraints |
| **Outputs típicos** | Specs técnicas, código, planes de implementación, análisis de riesgos |

**Skills asociadas:**
- `excalidraw-diagram` (generación de diagrams)
- `secure-token` (patrones de seguridad)

**Posibles mejoras:**
- [ ] Integración con git para worktrees automáticos
- [ ] Templates de código por stack (Rails, Node, Python)
- [ ] Linter/validator pre-commit integrado

**Redundancias:** Ninguna significativa

---

### 1.5 chief

| Campo | Valor |
|-------|-------|
| **Rol** | Especialista en planificación |
| **Responsabilidades** | Roadmapping, priorización, backlog grooming, milestone tracking |
| **Inputs típicos** | Goal/objective, constraints (tiempo, recursos), dependencias |
| **Outputs típicos** | Backlogs, sprint plans, checklists, definitions of done |

**Skills asociadas:**
- `brokia-plan` (planificación stage-based)

**Posibles mejoras:**
- [ ] Integración con sistema de checkpoints existente
- [ ] Templates de priorización (RICE, MoSCoW)
- [ ] Estimación automática basada en histórico

**Redundancias:** Ninguna

---

### 1.6 ops

| Campo | Valor |
|-------|-------|
| **Rol** | Especialista en reliability/security |
| **Responsabilidades** | VPS hardening, secrets, backups, monitoring, runbooks, auditorías |
| **Inputs típicos** | Estado actual del sistema, findings de auditoría, políticas de seguridad |
| **Outputs típicos** | Hardening checklists, runbooks, alert plans, incident notes |

**Skills asociadas:**
- `secure-token` (manejo de credenciales)

**Posibles mejoras:**
- [ ] Plantillas de runbook por tipo de servicio
- [ ] Integración con monitoring (Prometheus/Grafana)
- [ ] Auditoría automática de compliance

**Redundancias:** Ninguna

---

## 2. Agentes de Dominio

### 2.1 brokia

| Campo | Valor |
|-------|-------|
| **Rol** | Especialista en Brokia (tesis/producto) |
| **Responsabilidades** | MVP scoping, validación, thesis framing, diseño de workflows |
| **Inputs típicos** | Goals de producto, feedback de usuarios, contexto de seguros |
| **Outputs típicos** | MVP scopes, validation plans, KPI designs, documentación de producto |

**Skills asociadas:**
- `brokia-plan`
- `excalidraw-diagram` (workflow diagrams)

**Posibles mejoras:**
- [ ] Integración con Google Apps Script para workflows de broker
- [ ] Templates de procesos de seguros (auto, home, life)
- [ ] Sistema de tracking de KPIs por etapa de validación

**Redundancias:** Ninguna

---

### 2.2 qubika

| Campo | Valor |
|-------|-------|
| **Rol** | Contexto corporativo Qubika |
| **Responsabilidades** | Ingesta de Confluence, radar semanal, contexto de Bancard |
| **Inputs típicos** | Exports de Confluence, emails de radar, documentación técnica |
| **Outputs típicos** | Context packs, actionables summaries, índices temáticos |

**Skills asociadas:**
- RAG interno (embeddings locales)
- Pipeline de radar

**Posibles mejoras:**
- [ ] Sincronización incremental de Confluence (vs full export)
- [ ] Clasificación automática de prioridad (L0-L3)
- [ ] Integración con Slack para alertas automáticas

**Redundancias:** Ninguna

---

## 3. Matriz de Agentes vs Capacidades

| Agente | Research | Writing | Code | Planning | Ops | Domain |
|--------|----------|---------|------|----------|-----|--------|
| main | ⭐ | ⭐ | - | ⭐ | - | - |
| researcher | ✅ | - | - | - | - | - |
| writer | - | ✅ | - | - | - | - |
| builder | - | - | ✅ | ⭐ | ⭐ | - |
| chief | - | ⭐ | ⭐ | ✅ | - | - |
| ops | - | - | ⭐ | ⭐ | ✅ | - |
| brokia | ⭐ | ⭐ | ⭐ | ⭐ | - | ✅ (Brokia) |
| qubika | ✅ | ✅ | ⭐ | ⭐ | ⭐ | ✅ (Qubika) |

**Leyenda:** ✅ primary, ⭐ secondary

---

## 4. Mejoras Cross-Agent Identificadas

### 4.1 Unificación de Fetching

**Problema:** `twitter-fetch`, `twitter-educativo`, y `newsletter-digest` comparten lógica de fetch.

**Solución propuesta:**
```
skills/
  └── unified-fetch/
      ├── gmail.js      # De newsletter-digest
      ├── rss.js        # De twitter-*
      └── web.js        # Nuevo, para searxng
```

### 4.2 Sistema de Templates Compartidos

**Problema:** Cada writer/agent tiene sus propios templates.

**Solución propuesta:**
```
shared/
  └── templates/
      ├── email.md
      ├── slack-message.md
      ├── documentation.md
      └── digest.md
```

### 4.3 Checkpoint Estándar

**Problema:** Formatos de checkpoint varían entre skills.

**Propuesta de estándar:**
```json
{
  "skill": "skill-name",
  "version": "1.0",
  "timestamp": "2026-02-18T12:00:00Z",
  "stage": "processing|done|error",
  "data": { /* skill-specific */ },
  "error": { /* only on error */ }
}
```

---

## 5. Cambios Recientes

| Fecha | Cambio | Afectados |
|-------|--------|-----------|
| 2026-02-18 | Agregado `twitter-educativo` con 12 cuentas | researcher, writer |
| 2026-02-18 | Migración a checkpoint pattern | newsletter-digest, twitter-* |
| 2026-02-17 | Agregado `secure-token` skill | ops, builder |
| 2026-02-17 | RAG interno para Qubika | qubika, researcher |

---

**Última actualización:** 2026-02-18
**Próxima revisión:** 2026-03-18