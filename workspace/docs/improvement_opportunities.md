# Improvement Opportunities

> Sección estratégica de oportunidades de evolución del sistema. Cada entrada incluye análisis de impacto, complejidad y priorización.

---

## 1. Nuevos Agentes Recomendados

### 1.1 Integrations Agent

| Campo | Valor |
|-------|-------|
| **Impacto** | Alto |
| **Complejidad** | Media |
| **Prioridad** | 🔴 Alta |

**Propósito:** Manejar todas las integraciones externas (APIs, webhooks, autenticación) de forma unificada.

**Responsabilidades:**
- Gestión de tokens y credenciales
- Retry logic y exponential backoff
- Rate limiting adaptativo
- Webhook handling

**Inputs/Outputs:**
```
Input: { service: "slack", action: "send", target: "...", message: "..." }
Output: { success: true, messageId: "...", timestamp: "..." }
```

**Dependencias:** Ninguna nueva (usa skills existentes)

**Implementación sugerida:**
```
skills/
  └── integrations/
      ├── slack.js
      ├── telegram.js
      ├── gmail.js
      └── webhook-handler.js
```

---

### 1.2 QA/Test Agent

| Campo | Valor |
|-------|-------|
| **Impacto** | Alto |
| **Complejidad** | Media |
| **Prioridad** | 🟡 Media |

**Propósito:** Validación automática de outputs de otros agentes.

**Responsabilidades:**
- Linting de código generado
- Verificación de formato (markdown, JSON)
- Tests unitarios para código generado
- Revisión de consistencia

**Inputs/Outputs:**
```
Input: { artifact: code|markdown|json, content: "...", rules: [...] }
Output: { valid: true|false, issues: [...], score: 0-100 }
```

**Dependencias:** Linting tools, test frameworks

---

### 1.3 Scheduler Agent

| Campo | Valor |
|-------|-------|
| **Impacto** | Medio |
| **Complejidad** | Baja |
| **Prioridad** | 🟡 Media |

**Propósito:** Gestión centralizada de cron jobs y scheduling.

**Responsabilidades:**
- Definición de schedules en YAML/JSON
- Monitoring de ejecución
- Alertas si un job falla
- Retry automático configurável

**Configuración propuesta:**
```yaml
schedules:
  - name: newsletter-digest
    cron: "0 9 * * *"
    timeout: 300s
    retry:
      max_attempts: 3
      backoff: exponential
    on_failure: alert
```

---

### 1.4 Memory Agent

| Campo | Valor |
|-------|-------|
| **Impacto** | Alto |
| **Complejidad** | Alta |
| **Prioridad** | 🟢 Baja |

**Propósito:** Gestión inteligente de memoria a largo plazo.

**Responsabilidades:**
- Limpieza automática de memoria antigua
- Consolidación de learnings
- Búsqueda semántica en MEMORY.md
- Detección de información desactualizada

**Features:**
- TTL configurable por tipo de memoria
- Versionado de entries
- Tags y categorías
- Search semántico

---

## 2. Nuevas Skills de Alto Impacto

### 2.1 RSS Aggregator (Genérico)

| Campo | Valor |
|-------|-------|
| **Impacto** | Alto |
| **Complejidad** | Baja |
| **Prioridad** | 🔴 Alta |

**Propósito:** Unificar fetch de cualquier fuente RSS.

**Diferencia con existente:** `twitter-educativo` y `twitter-fetch` son específicos de Twitter. Esta skill sería genérica.

**Configuración:**
```json
{
  "feeds": [
    { "url": "https://hnrss.org/frontpage", "category": "tech" },
    { "url": "https://news.ycombinator.com/rss", "category": "tech" }
  ],
  "filter": {
    "keywords": ["ai", "software"],
    "min_score": 1
  }
}
```

**Reemplaza:** Funcionalidad duplicada en twitter-fetch

---

### 2.2 Email Unified

| Campo | Valor |
|-------|-------|
| **Impacto** | Alto |
| **Complejidad** | Media |
| **Prioridad** | 🔴 Alta |

**Propósito:** Unificar acceso a Gmail, Outlook, IMAP genérico.

**Proveedores soportados:**
- Gmail (OAuth existente)
- Outlook (MS Graph API)
- IMAP genérico (configurable)

**Features:**
- Query unificado
- Attachments download
- Labels/Folders
- Sent/Drafts support

---

### 2.3 Cache Manager

| Campo | Valor |
|-------|-------|
| **Impacto** | Alto |
| **Complejidad** | Baja |
| **Prioridad** | 🔴 Alta |

**Propósito:** Cache centralizado para evitar re-fetch.

**Stores soportados:**
- Redis (si disponible)
- Filesystem (fallback)
- Memory (ephemeral)

**TTL configurable:**
```json
{
  "newsletter-fetch": 3600,
  "twitter-fetch": 43200,
  "web-search": 86400
}
```

---

### 2.4 Git Workflow

| Campo | Valor |
|-------|-------|
| **Impacto** | Medio |
| **Complejidad** | Media |
| **Prioridad** | 🟡 Media |

**Propósito:** Integración profunda con Git.

**Features:**
- Worktree automático por etapa
- Commit automático con Conventional Commits
- PR description generation
- Changelog generation

**Integración con brokia-plan:**
```
Stage 1 → worktree feature/stage-1
Stage 2 → worktree feature/stage-2
...
Merge → Squash + conventional commit
```

---

### 2.5 Monitoring Dashboard

| Campo | Valor |
|-------|-------|
| **Impacto** | Alto |
| **Complejidad** | Alta |
| **Prioridad** | 🟡 Media |

**Propósito:** Métricas y observabilidad del sistema.

**Métricas:**
- Latencia por skill
- Success rate por agente
- Tokens consumidos
- Errores y retries

**Stack sugerido:**
- Prometheus (métricas)
- Grafana (dashboard)
- Alertmanager (alerts)

---

## 3. Hooks Inteligentes Sugeridos

### 3.1 Memory → Trigger → Action

| Trigger | Condición | Acción |
|---------|-----------|--------|
| Nuevo archivo en `plans/` | Stage 1 creado | Enviar resumen a Slack |
| Error en checkpoint | stage=error | Alert + retry suggestion |
| Nuevo archivo en `memory/` | Content contains "important" | Archivar en MEMORY.md |

**Implementación:**
```javascript
// hooks/memory-trigger.js
watch('plans/*.md', (file) => {
  if (file.stage === 1) {
    slack.send('#brokia-ai-alerts', {
      text: `Nuevo plan creado: ${file.title}`
    });
  }
});
```

---

### 3.2 Event → Context Update

| Evento | Actualización de contexto |
|--------|---------------------------|
| Nuevo email de radar | Refrescar contexto Qubika |
| Commit en repo Brokia | Actualizar índice de cambios |
| Nuevo checkpoint | Sincronizar estado global |

---

### 3.3 Scheduled → Health Check

| Schedule | Check | Alert si |
|----------|-------|----------|
| Cada 6h | Gmail API connectivity | Token expired |
| Cada 1h | Slack message delivery | Rate limit |
| Cada 30m | RAG service | Latency > 5s |
| Diario | Cron job success rate | Any failed |

---

## 4. Automatizaciones (Cron) Faltantes

### 4.1 Heartbeat Cron

| Campo | Valor |
|-------|-------|
| **Schedule** | `*/30 * * * *` (cada 30 min) |
| **Propósito** | Verificaciones periódicas proactivas |

**Checks:**
- [ ] Emails importantes no leídos
- [ ] Calendar events próximos (24h)
- [ ] Mentions en Twitter/social
- [ ] Weather relevante para planes

**Output:** Si hay algo accionable → notify via Slack/Telegram

---

### 4.2 Cleanup Cron

| Campo | Valor |
|-------|-------|
| **Schedule** | `0 2 * * 0` (domingo 2 AM) |
| **Propósito** | Mantenimiento del sistema |

**Tareas:**
- [ ] Archivar newsletters antiguos (>30 días)
- [ ] Limpiar checkpoints de pipelines completados
- [ ] Verificar espacio en disco
- [ ] Rotar logs

---

### 4.3 Sync Cron

| Campo | Valor |
|-------|-------|
| **Schedule** | `0 */4 * * *` (cada 4 horas) |
| **Propósito** | Sincronización de estado |

**Tareas:**
- [ ] Sincronizar MEMORY.md con daily notes
- [ ] Actualizar índice de planes activos
- [ ] Refrescar cache de RSS feeds

---

## 5. Workflows Autónomos Recomendados

### 5.1 Newsletter Auto-Curated

```
┌─────────────────────────────────────────────────────────────────┐
│  TRIGGER: Cron diario (9 AM)                                    │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: Fetch                                                 │
│  - Gmail: 8 newsletters                                        │
│  - RSS: Tech blogs configurados                                │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: Score                                                 │
│  - NLP-based relevance scoring                                 │
│  - Remove duplicates across sources                            │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: Curate                                                │
│  - Top 10 items por categoría                                  │
│  - Generate summaries                                          │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: Format                                                │
│  - Markdown para múltiples canales                             │
│  - Variantes: Full / TL;DR / Highlights                        │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 5: Deliver                                               │
│  - Slack: #newsletter-digest                                   │
│  - Telegram: @manu                                             │
│  - Email: Para lectura posterior                               │
└─────────────────────────────────────────────────────────────────┘
```

**Complejidad:** Alta | **Impacto:** Alto | **Prioridad:** 🟡 Media

---

### 5.2 Weekly Qubika Radar Review

```
┌─────────────────────────────────────────────────────────────────┐
│  TRIGGER: Email de radar recibido                              │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: Parse                                                 │
│  - Extraer prioridades                                         │
│  - Identificar deadlines                                       │
│  - Categorizar blockers                                        │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: Enrich                                               │
│  - Buscar contexto en Confluence RAG                          │
│  - Añadir links relacionados                                   │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: Suggest                                               │
│  - Próximas acciones sugeridas                                 │
│  - Dependencias identificadas                                  │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: Deliver                                               │
│  - Slack: #qubika-ai-radar                                     │
│  - Formato: Estructurado + actionable                          │
└─────────────────────────────────────────────────────────────────┘
```

**Complejidad:** Media | **Impacto:** Alto | **Prioridad:** 🔴 Alta

---

### 5.3 Brokia MVP Progress Tracker

```
┌─────────────────────────────────────────────────────────────────┐
│  TRIGGER: Manual o Stage completada                            │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: Review                                                │
│  - Leer checkpoint de stage actual                             │
│  - Comparar con plan original                                  │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: Metrics                                               │
│  - Tasks completadas vs planificadas                           │
│  - Tiempo real vs estimado                                     │
│  - Blockers actuales                                           │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: Update                                                │
│  - Actualizar plan (si hay cambios)                            │
│  - Generar next steps                                          │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: Notify                                               │
│  - Slack: #brokia-ai-briefing                                  │
│  - Resumen: Progress + blockers + next                         │
└─────────────────────────────────────────────────────────────────┘
```

**Complejidad:** Baja | **Impacto:** Medio | **Prioridad:** 🟡 Media

---

### 5.4 Security Audit (Auto)

```
┌─────────────────────────────────────────────────────────────────┐
│  TRIGGER: Semanal (domingo 3 AM)                               │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: Scan                                                  │
│  - Revisar credenciales en código                              │
│  - Verificar .gitignore                                        │
│  - Checkear permisos de archivos                               │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: Validate                                              │
│  - Tokens en logs                                              │
│  - Exposed secrets                                             │
│  - Dependencias con vulnerabilidades                           │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: Report                                                │
│  - Hallazgos por severidad                                     │
│  - Recomendaciones de remediación                              │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: Alert                                                 │
│  - Slack: #brokia-ai-alerts                                    │
│  - Si hay hallazgos críticos: Notificación inmediata           │
└─────────────────────────────────────────────────────────────────┘
```

**Complejidad:** Media | **Impacto:** Alto | **Prioridad:** 🔴 Alta

---

## 6. Matriz de Priorización

| Oportunidad | Impacto | Complejidad | ROI | Prioridad |
|-------------|---------|-------------|-----|-----------|
| RSS Aggregator | Alto | Baja | Alto | 🔴 P1 |
| Email Unified | Alto | Media | Alto | 🔴 P1 |
| Cache Manager | Alto | Baja | Alto | 🔴 P1 |
| Weekly Qubika Radar | Alto | Media | Alto | 🔴 P1 |
| Security Audit Auto | Alto | Media | Alto | 🔴 P1 |
| Integrations Agent | Alto | Media | Medio | 🟡 P2 |
| QA/Test Agent | Alto | Media | Medio | 🟡 P2 |
| Heartbeat Cron | Medio | Baja | Medio | 🟡 P2 |
| Newsletter Auto-Curated | Alto | Alta | Medio | 🟡 P2 |
| Scheduler Agent | Medio | Baja | Bajo | 🟢 P3 |
| Git Workflow | Medio | Media | Bajo | 🟢 P3 |
| Memory Agent | Alto | Alta | Bajo | 🟢 P3 |
| Brokia Progress Tracker | Medio | Baja | Bajo | 🟢 P3 |

---

## 7. Roadmap Sugerido (Próximos 90 días)

### Mes 1: Foundation
- [ ] RSS Aggregator (reemplaza duplicación)
- [ ] Cache Manager
- [ ] Heartbeat Cron

### Mes 2: Automation
- [ ] Security Audit Auto
- [ ] Weekly Qubika Radar Workflow
- [ ] Email Unified

### Mes 3: Advanced
- [ ] Integrations Agent
- [ ] QA/Test Agent
- [ ] Newsletter Auto-Curated

---

**Última actualización:** 2026-02-18
**Próxima revisión:** 2026-03-18