# Context State

> Resumen del estado actual del sistema: integraciones, memoria, canales, issues conocidos y limitaciones técnicas.

---

## 1. Integraciones Activas

### 1.1 Slack

| Canal | Channel ID | Propósito | Estado |
|-------|------------|-----------|--------|
| #qubika-ai-radar | C0AFD6WE00K | Radar semanal Qubika | ✅ Activo |
| #brokia-ai-alerts | C0AFK08BFR8 | Alertas y notificaciones | ✅ Activo |
| #brokia-ai-briefing | C0AFCCNP0MR | Briefings automatizados | ✅ Activo |
| #twitter-daily | C0AFTFS7ZPC | Digest de Twitter | ✅ Activo |
| #newsletter-digest | — | Newsletter diario | ✅ Activo |

**Credenciales:** Gestionado por OpenClaw gateway

---

### 1.2 Telegram

| Target | User/Chat ID | Propósito | Estado |
|--------|--------------|-----------|--------|
| @manu | 2017549847 | Mensajes directos | ✅ Activo |

**Credenciales:** Configurado en USER.md

---

### 1.3 Gmail / Google Workspace

| Cuenta | Servicio | Propósito | Estado |
|--------|----------|-----------|--------|
| tachipachi9797@gmail.com | Gmail API | Pipeline newsletters | ✅ Activo (OAuth) |
| manuel.pacheco@qubika.com | Google Workspace | Contexto Qubika | ✅ Activo (RAG) |

**Acceso:**
- Gmail: `gog` CLI con OAuth
- Workspace: Google Apps Script + Sheets API

---

### 1.4 Google Apps Script (Brokia)

| Script | Propósito | Estado |
|--------|-----------|--------|
| `setup_sheet.gs` | Creación de Google Sheets | ✅ Desplegado |
| `Code.gs` | Automatizaciones Brokia | ✅ Desplegado |

**Proyecto:** Bound to `setup_sheet.gs`/appsscript.json

---

### 1.5 SearXNG (Local)

| Configuración | Valor |
|---------------|-------|
| URL | `http://127.0.0.1:8088` |
| Puerto host | 8088 |
| Puerto container | 8080 |
| Estado | ✅ Operativo |

**Archivos:**
- `searxng/docker-compose.yml`
- `searxng/settings.yml`

---

## 2. Memoria Backend

### 2.1 Estructura de Memoria

| Tipo | Ubicación | Formato | TTL |
|------|-----------|---------|-----|
| Sesión | RAM del LLM | Contexto vivo | Fin de sesión |
| Daily notes | `memory/YYYY-MM-DD.md` | Markdown | Indefinido |
| Long-term | `MEMORY.md` | Markdown | Indefinido |
| Checkpoints | `checkpoints/` | JSON | Indefinido |
| Planes | `plans/` | Markdown + JSON | Indefinido |

### 2.2 Configuración QMD

| Componente | Valor |
|------------|-------|
| Embedding model | paraphrase-multilingual-MiniLM-L12-v2 |
| Vector DB | Local (sentence-transformers) |
| MAX_RAG_CHARS_TOTAL | 1200 |
| MAX_CHUNK_CHARS | 400 |
| TOP_K | 3 |

**Agents con QMD:**
- `agents/qubika/qmd/xdg-config`
- `agents/brokia/qmd/xdg-config`
- `agents/researcher/qmd/xdg-config`
- `agents/writer/qmd/xdg-config`
- `agents/builder/qmd/xdg-config`
- `agents/chief/qmd/xdg-config`
- `agents/ops/qmd/xdg-config`
- `agents/main/qmd/xdg-config`

---

## 3. Canales Configurados

### 3.1 Slack

```json
{
  "qubika-ai-radar": "C0AFD6WE00K",
  "brokia-ai-alerts": "C0AFK08BFR8",
  "brokia-ai-briefing": "C0AFCCNP0MR",
  "twitter-daily": "C0AFTFS7ZPC"
}
```

### 3.2 Newsletter Senders (8)

| Remitente | Categoría |
|-----------|-----------|
| nytdirect@nytimes.com | News |
| news@thehustle.co | Business |
| dan@tldrnewsletter.com | Tech |
| hello@historyfacts.com | History |
| newsletter@aisecret.us | Tech |
| newsletter@themarginalian.org | Art |
| rw@peterc.org | Ruby |
| node@cooperpress.com | Node |

### 3.3 Twitter Accounts (12)

| Username | Categoría |
|----------|-----------|
| iamfakhrealam | Tech |
| digitalix | Tech |
| quasarmarkets | Finance |
| mikekhristo | Marketing |
| theonenicka | Marketing |
| siboptionpro | Finance |
| johnmventura | Marketing |
| shubh_dholakiya | Marketing |
| hashgraphonline | Tech |
| arceyul | Tech |
| marco_exito | Marketing |
| openclaw | Tech |

---

## 4. Issues Conocidos

### 4.1 Criticidad: Alta

| Issue | Descripción | Workaround |
|-------|-------------|------------|
| Channel lookup por ID vs nombre | `message` tool puede fallar si se usa ID en lugar de nombre | Usar nombres de canal cuando sea posible, IDs como fallback |
| Cron stderr capture | Cron jobs pueden fallar silenciosamente si solo hay stderr | Verificar logs manualmente |

### 4.2 Criticidad: Media

| Issue | Descripción | Workaround |
|-------|-------------|------------|
| Formato condicional manual | Newsletter-digest requiere ajuste manual de formato | Mejorar templates |
| Rate limiting Gmail | Límites de API pueden afectar newsletter pipeline | Implementar backoff |
| Duplicación de skills | twitter-fetch y twitter-educativo comparten lógica | Unificar en RSS Aggregator |

### 4.3 Criticidad: Baja

| Issue | Descripción | Workaround |
|-------|-------------|------------|
| Checkpoint naming | Formato varía entre skills | Estandarizar a skillname/date.json |
| Estado分散 | Información de estado en múltiples archivos | Consolidar en estado global |

---

## 5. Limitaciones Técnicas Actuales

### 5.1 Rate Limits

| Servicio | Límite | Ventana | Impacto |
|----------|--------|---------|---------|
| Gmail API | 250 emails/día | 24h | Newsletter pipeline |
| Twitter RSS | ~20 tweets/fetch | Por cuenta | Twitter pipeline |
| OpenRouter | Variable | Por modelo | Todas las requests |
| Slack | 1 msg/segundo | App | Delivery |

### 5.2 Dependencias Externas

| Componente | Dependencia | Riesgo |
|------------|-------------|--------|
| Nitter RSS | nitter.net (público) | Downtime ocasional |
| Gmail API | Google OAuth | Token expiry |
| SearXNG | Docker local | Container restart |
| OpenRouter | API cloud | Rate limits |

### 5.3 Constraints de Contexto

| Componente | Límite | Notas |
|------------|--------|-------|
| RAG total chars | 1200 | Por query |
| Chunk size | 400 | Por chunk |
| Top K | 3 | Chunks recuperados |
| Memoria sesión | Variable | Depende del LLM |

---

## 6. Links a Archivos Clave

### 6.1 Configuración

| Archivo | Propósito |
|---------|-----------|
| `/home/manpac/.openclaw/workspace/skills/newsletter-digest/SKILL.md` | Newsletter pipeline |
| `/home/manpac/.openclaw/workspace/skills/twitter-fetch/SKILL.md` | Twitter fetch |
| `/home/manpac/.openclaw/workspace/skills/twitter-format/SKILL.md` | Twitter format |
| `/home/manpac/.openclaw/workspace/skills/twitter-educativo/SKILL.md` | Twitter educativo |
| `/home/manpac/.openclaw/workspace/skills/searxng-search/SKILL.md` | SearXNG search |

### 6.2 Contexto de Sistema

| Archivo | Propósito |
|---------|-----------|
| `/home/manpac/.openclaw/workspace/SOUL.md` | Identidad del orquestador |
| `/home/manpac/.openclaw/workspace/USER.md` | Perfil del usuario |
| `/home/manpac/.openclaw/workspace/MEMORY.md` | Memorias curadas |
| `/home/manpac/.openclaw/workspace/AGENTS.md` | Registry de agentes |

### 6.3 Contextos de Dominio

| Archivo | Propósito |
|---------|-----------|
| `/home/manpac/.openclaw/workspace/agents/qubika/QUBIKA_CONTEXT_PACK_V2.md` | Contexto Qubika |
| `/home/manpac/.openclaw/workspace/agents/brokia/BROKIA_PROCESS_MATRIX_README.md` | Procesos Brokia |
| `/home/manpac/.openclaw/workspace/brokia/buenos_aires_trip_research.md` | Research para viaje |

### 6.4 Logs y Estado

| Archivo | Propósito |
|---------|-----------|
| `/home/manpac/.openclaw/workspace/logs/config-audit.jsonl` | Audit de configuración |
| `/home/manpac/.openclaw/workspace/checkpoints/newsletter/` | Checkpoints newsletter |
| `/home/manpac/.openclaw/workspace/plans/` | Planes activos |
| `/home/manpac/.openclaw/workspace/memory/2026-02-18.md` | Memoria diaria |

### 6.5 Scripts y Herramientas

| Archivo | Propósito |
|---------|-----------|
| `/home/manpac/.openclaw/workspace/skills/crear-sheet-procesos.sh` | Crear sheet de procesos |
| `/home/manpac/.openclaw/workspace/skills/twitter-educativo/scripts/twitter_rss.py` | Fetch RSS Twitter |
| `/home/manpac/.openclaw/workspace/skills/searxng-search/scripts/searxng_search.sh` | Search script |

---

## 7. Estado de Health del Sistema

### 7.1 Componentes Críticos

| Componente | Status | Last Check | Notes |
|------------|--------|------------|-------|
| OpenClaw gateway | ✅ OK | 2026-02-18 23:00 | Operativo |
| Gmail pipeline | ✅ OK | 2026-02-18 09:00 | Último éxito |
| Twitter pipeline | ✅ OK | 2026-02-18 12:00 | Último éxito |
| SearXNG | ✅ OK | 2026-02-18 23:00 | Local instance up |
| RAG system | ✅ OK | 2026-02-18 20:00 | Embeddings working |
| Slack integration | ✅ OK | 2026-02-18 23:00 | Mensajes delivering |

### 7.2 Métricas (Últimas 24h)

| Métrica | Valor |
|---------|-------|
| Cron jobs ejecutados | 4 |
| Errores | 0 |
| Avg latency (newsletter) | 45s |
| Avg latency (twitter) | 25s |
| Tokens consumidos (est.) | ~150K |

---

## 8. Variables de Entorno Clave

| Variable | Valor/Propósito | Seguridad |
|----------|-----------------|-----------|
| `OPENROUTER_API_KEY` | LLM cloud provider | ⚠️ Sensible |
| `GOG_KEYRING_PASSWORD` | Google OAuth | ⚠️ Sensible |
| `OPENCLAW_GATEWAY_TOKEN` | Gateway auth | ⚠️ Sensible |
| `SEARXNG_BASE_URL` | Local instance | ✅ Safe |
| `GITHUB_TOKEN` | Git operations | ⚠️ Sensible |

---

**Última actualización:** 2026-02-18 23:23 UTC
**Próxima revisión:** 2026-03-18
**、健康チェック:** 2026-02-18 23:00 UTC