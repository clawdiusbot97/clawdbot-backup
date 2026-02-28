# Skills Registry

> Listado vivo de todas las skills del sistema. Cada skill es autocontenida con su propia documentación, configuración y scripts.

---

## 1. Skills por Frecuencia de Uso

### 1.1 Alta Frecuencia (uso diario/semanal)

| Skill | Agente | Propósito | Uso estimado |
|-------|--------|-----------|--------------|
| `newsletter-digest` | researcher→writer | Pipeline diario de newsletters | Diario (9 AM UTC) |
| `twitter-fetch` | researcher | Fetch tweets RSS | Diario |
| `twitter-format` | writer | Formateo de digest Twitter | Diario |
| `twitter-educativo` | mixed | Digest 12h cuentas configuradas | 2x diario |

### 1.2 Media Frecuencia (uso semanal/mensual)

| Skill | Agente | Propósito | Uso estimado |
|-------|--------|-----------|--------------|
| `brokia-plan` | chief | Planificación stage-based | Semanal |
| `searxng-search` | researcher | Web search privado | Semanal |
| `excalidraw-diagram` | builder | Diagramas visuales | Mensual |
| `secure-token` | ops | Manejo de credenciales | Por necesidad |

### 1.3 Baja Frecuencia (uso ad-hoc)

| Skill | Agente | Propósito |
|-------|--------|-----------|
| `crear-sheet-procesos` | brokia | Creación de sheets de procesos |

---

## 2. Detalle de Skills

### 2.1 newsletter-digest

```
Directorio: /home/manpac/.openclaw/workspace/skills/newsletter-digest/
Inputs:  Gmail API (8 remitentes configurados)
Outputs: Markdown digest + Slack delivery
Checkpoint: checkpoints/newsletter/YYYY-MM-DD.json
```

**Pipeline stages:**
1. Researcher → Fetch emails (Gmail API)
2. Writer → Filter by relevance (Tech > History > Art > News)
3. Delivery → Slack `#newsletter-digest`

**Configuración de remitentes:**
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

**Posibles optimizaciones:**
- [ ] Añadir más filtros por keywords personalizados
- [ ] Implementar deduplicación de contenido entre remitentes
- [ ] Support para otros proveedores de email (IMAP)

**Nuevas skills relacionadas sugeridas:**
- `rss-feed-digest` (genérico para cualquier RSS)
- `email-summary` (Gmail + Outlook + IMAP unificado)

---

### 2.2 twitter-fetch

```
Directorio: /home/manpac/.openclaw/workspace/skills/twitter-fetch/
Inputs:  Configuración de cuentas (config/accounts.json)
Outputs: JSON raw tweets + actualizado checkpoint
Checkpoint: checkpoints/last-state.json
```

**Cuentas configuradas (parcial):**
| Username | Categoría |
|----------|-----------|
| iamfakhrealam | Tech |
| digitalix | Tech |
| quasarmarkets | Finance |
| mikekhristo | Marketing |

**Posibles optimizaciones:**
- [ ] Parallel fetch para múltiples cuentas
- [ ] Retry logic con exponential backoff
- [ ] Rate limiting adaptativo

---

### 2.3 twitter-format

```
Directorio: /home/manpac/.openclaw/workspace/skills/twitter-format/
Inputs:  JSON raw de twitter-fetch
Outputs: Markdown digest formateado
Dependencias: twitter-fetch
```

**Keywords de filtrado:**
```json
{
  "tech": ["ai", "software", "engineering", "architecture", "devops", ...],
  "finance": ["investing", "stocks", "crypto", "trading", ...],
  "marketing": ["marketing", "growth", "brand", "social media", ...]
}
```

**Posibles optimizaciones:**
- [ ] Score de relevancia más sofisticado (TF-IDF)
- [ ] Detección de threads automáticamente
- [ ] Formatos diferentes por canal (Slack vs Telegram)

---

### 2.4 twitter-educativo

```
Directorio: /home/manpac/.openclaw/workspace/skills/twitter-educativo/
Inputs:  12 cuentas configuradas (config/accounts.json)
Outputs: Digest + delivery Slack + Telegram
Checkpoint: checkpoints/last-state.json
```

**Cuentas configuradas:**
- 4 tech, 3 finance, 5 marketing + OpenClaw

**Diferencias con twitter-fetch/format:**
- Incluye delivery a Telegram
- Formato de digest ligeramente diferente
- Checkpoint por cuenta más granular

**Posibles optimizaciones:**
- [ ] Unificar con twitter-fetch/format en skill unificada
- [ ] Añadir more categorias (news, productivity)

---

### 2.5 searxng-search

```
Directorio: /home/manpac/.openclaw/workspace/skills/searxng-search/
Inputs:  Query string
Outputs: JSON con resultados (title, url, snippet)
Dependencias: Instancia local SearXNG (puerto 8088)
```

**Usage:**
```bash
SEARXNG_BASE_URL="http://127.0.0.1:8088" \
/home/manpac/.openclaw/workspace/skills/searxng-search/scripts/searxng_search.sh "<query>" 5
```

**Posibles optimizaciones:**
- [ ] Integración con cache local (Redis)
- [ ] Proxy through para evitar rate limits
- [ ] Support para múltiples instancias

**Nuevas skills sugeridas:**
- `web-fetch` → Fetch y parse de URLs específicos
- `rss-aggregator` → Agregación de múltiples feeds RSS

---

### 2.6 excalidraw-diagram

```
Directorio: /home/manpac/.openclaw/workspace/skills/excalidraw-diagram/
Inputs:  Mermaid code o Excalidraw JSON
Outputs: PNG, SVG, o JSON
Dependencias: npm install -g @excalidraw/mermaid-to-excalidraw
```

**Templates incluidos:**
- `microservice-architecture.excalidraw.json`
- `roadmap-timeline.excalidraw.json`
- `insurance-workflow.excalidraw.json`

**Posibles optimizaciones:**
- [ ] API wrapper para uso programático
- [ ] Más templates por dominio (fintech, e-commerce)
- [ ] Integración con Mermaid live editor

---

### 2.7 brokia-plan

```
Directorio: /home/manpac/.openclaw/workspace/skills/brokia-plan/
Inputs:  Goal description
Outputs: PLAN-YYYYMMDD-XX.md + checkpoints
```

**Estructura del plan:**
```markdown
# PLAN-{ID}: {Title}
## Context
## Stages
### Stage 1: {title}
### Stage 2: {title}
## Notes & Risks
## Change log
```

**Posibles optimizaciones:**
- [ ] Templates por tipo de proyecto (MVP, migration, feature)
- [ ] Estimación automática de effort
- [ ] Integración con git para tracking de progreso

---

### 2.8 secure-token

```
Directorio: /home/manpac/.openclaw/workspace/skills/secure-token/
Inputs:  N/A (patterns documentation)
Outputs: Documentación + ejemplos
```

**Patterns documentados:**
1. Temporary files (one-time)
2. Environment variables (repeated)
3. Git credential helper (Git-specific)
4. gh CLI with token (GitHub)

**Posibles optimizaciones:**
- [ ] Implementar tool wrapper `secure_token`
- [ ] Audit de tokens expuestos en logs
- [ ] Rotación automática de secrets

---

### 2.9 crear-sheet-procesos (script)

```
Directorio: /home/manpac/.openclaw/workspace/skills/crear-sheet-procesos.sh
Inputs:  CSV de procesos (agents/brokia/process_matrix.csv)
Outputs: Google Sheet con procesos formateados
Dependencias: Google Apps Script (setup_sheet.gs)
```

**Uso:**
```bash
./crear-sheet-procesos.sh
```

**Posibles optimizaciones:**
- [ ] Convertir a skill con checkpoints
- [ ] Support para múltiples formatos de entrada
- [ ] Validación de datos antes de upload

---

## 3. Matriz de Dependencias

```
                    ┌─────────────────┐
                    │  newsletter-digest │
                    └────────┬────────┘
                             │ Gmail API
                             ▼
                    ┌─────────────────┐
                    │  twitter-fetch  │
                    └────────┬────────┘
                             │ Raw JSON
                             ▼
                    ┌─────────────────┐
                    │  twitter-format │
                    └────────┬────────┘
                             │ Formatted digest
                             ▼
              ┌──────────────┴──────────────┐
              ▼                              ▼
    ┌─────────────────┐            ┌─────────────────┐
    │  twitter-educativo  │            │  newsletter-digest │
    └────────┬──────────┘            └────────┬──────────┘
             │ Delivery (Slack/Telegram)       │ Delivery (Slack)
             └─────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   slack-message │
                    └─────────────────┘
```

---

## 4. Skills Recomendadas para Desarrollo

### Alta Prioridad (alto impacto, baja complejidad)

| Skill | Impacto | Complejidad | Justificación |
|-------|---------|-------------|---------------|
| `rss-aggregator` | Media | Baja | Unifica RSS fetching |
| `email-unified` | Alta | Media | Gmail + IMAP + Outlook |
| `cache-manager` | Alta | Baja | Cache para fetch results |

### Media Prioridad (alto impacto, media complejidad)

| Skill | Impacto | Complejidad | Justificación |
|-------|---------|-------------|---------------|
| `slack-workflow` | Alta | Media | Workflows en Slack |
| `git-worktree` | Media | Media | Automated branching |
| `monitoring-dashboard` | Alta | Alta | Prometheus/Grafana |

### Baja Prioridad (experimentos)

| Skill | Impacto | Complejidad | Justificación |
|-------|---------|-------------|---------------|
| `voice-dictation` | Baja | Alta | Speech-to-text |
| `image-generator` | Media | Alta | Stable Diffusion API |

---

## 5. Métricas de Uso (estimadas)

| Skill | Invocaciones/día | Tokens consumidos | Latencia avg |
|-------|------------------|-------------------|--------------|
| newsletter-digest | 1 | ~15K | ~45s |
| twitter-fetch | 1 | ~8K | ~20s |
| twitter-format | 1 | ~5K | ~15s |
| twitter-educativo | 2 | ~12K | ~30s |
| searxng-search | 2-5 | ~2K/query | ~500ms |
| brokia-plan | 0.5 | ~10K/plan | ~60s |

---

**Última actualización:** 2026-02-18
**Próxima revisión:** 2026-03-18