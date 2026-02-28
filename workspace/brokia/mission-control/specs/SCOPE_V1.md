# Mission Control V1 — Scope Freeze (2026-02-25)

**Estado:** CONGELADO (pre-Step4)  
**Congelado mientras corre:** codex_builder (Step 4: Actions + Observability + UI minimal)  
**Última actualización:** 2026-02-25 15:23 UTC

---

## ✅ IN SCOPE (Step 4)

### Backend Actions
| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/actions/refresh` | POST | Ejecuta wi-export.sh, retorna export actualizado |
| `/api/actions/create` | POST | Crea workitem via wi-create.sh, exporta, retorna data |
| `/api/actions/update` | POST | Patch parcial via wi-update.sh, exporta, retorna data |
| `/api/actions/move` | POST | Mueve estado via wi-move.sh, exporta, retorna data |
| `/api/actions/drop` | POST | Mueve a DROPPED + reason auditado via wi-update.sh |
| `/api/actions/clarify` | POST | Dispara pipeline step clarify via wi-pipeline.sh |
| `/api/actions/confirm` | POST | Confirma plan A/B/C via wi-confirm.sh |

### Observability
| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/logs` | GET | `?id=<ID>` → logs del item + running flag |
| `/api/logs/recent` | GET | `?limit=50` → logs recientes across all IDs |

### UI (Operative Board)
- Board existente: 8 columnas se mantienen
- Click en card → Drawer con:
  - Detalles completos del item
  - `allowed_actions` (lista de acciones permitidas)
  - Activity timeline (GET /api/logs?id=...)
  - Botones condicionales (solo si en allowed_actions):
    - Clarify, Confirm (A/B/C), Move (dropdown), Drop, Update
- Create button → modal minimal (type, title, priority)
- Edit modal → owner, priority, tags add/remove, cost_estimate_usd_month
- Post-action: refresh automático del board

---

## ❌ OUT OF SCOPE (v1)

| Feature | Razón | Nota |
|---------|-------|------|
| **Drag & Drop** | Complejidad UI → v2 | Usar Move dropdown en v1 |
| **Auth / Multi-user** | Local only by design | No sesiones, no permisos |
| **DB / ORM** | Motor es source of truth | JSON files only |
| **Polling automático** | Simplificación v1 | Refresh manual + post-action refresh |
| **Delete físico** | Audit trail required | Solo DROPPED (soft delete) |
| **Validate desde UI** | Pipeline step no UI-ready | Dejar para v2 |
| **Plan desde UI** | Pipeline step no UI-ready | Dejar para v2 |
| **Build desde UI** | Pipeline step no UI-ready | Dejar para v2 |
| **Notificaciones realtime** | Sin WebSocket/SSE | Polling manual si se necesita |

---

## Action Vocabulary (v1)

**Regla:** Estos strings son el vocabulario cerrado. Usar exactamente así en:
- Campo `action` de respuestas API
- Nombres de archivos de log (`<timestamp>_<action>.json`)
- Campo `action` dentro de logs

```
workitems_get
workitems_refresh
workitem_create
workitem_update
workitem_move
workitem_drop
workitem_clarify
workitem_confirm
logs_get
logs_recent_get
```

**No agregar otros sin:**
1. Actualizar este archivo (SCOPE_V1.md)
2. Agregar a QA_ACCEPTANCE_STEP4.md
3. Notificar en PROGRESS.md

---

## Contrato de Respuesta Estándar

Todas las respuestas API deben seguir este shape:

```typescript
interface ApiResponse {
  success: boolean;              // true si la acción completó (incluso si guardrail bloqueó)
  action: string;                // uno del Action Vocabulary v1
  id: string;                    // workitem ID o "N/A" para operaciones globales
  message: string;               // mensaje legible para humanos
  stdout: string;                // stdout del script ejecutado
  stderr: string;                // stderr del script ejecutado
  blocked_by_guardrail: boolean; // true si el motor rechazó la acción
  data?: unknown;                // payload adicional (export JSON, logs, etc.)
}
```

**Nota sobre guardrails:** `blocked_by_guardrail: true` → HTTP 200 (no 500). El request se procesó correctamente; el motor decidió no ejecutar.

---

## Decisiones de Arquitectura (Congeladas)

1. **Source of Truth:** Motor en `brokia/workitems/` — Mission Control nunca modifica scripts ni motor
2. **Logging:** `logs/<ID>/` con archivos JSON por acción + RUNNING.json flag
3. **Export Post-Action:** Toda mutación debe ejecutar export y retornar data actualizada
4. **Local Only:** No external services, no auth, no multi-tenancy
5. **Thin UI:** La UI es capa delgada; la lógica de negocio vive en el motor

---

## Extensiones v1.1 (Documentadas, No Implementadas)

### Header `x-brokia-agent` (Audit Trail)

**Decisión:** Todos los endpoints POST deben aceptar header opcional:
```
x-brokia-agent: <string>
```

**Comportamiento:**
- Si presente: se persiste en logs como campo `agent`
- Si ausente: default = `"mission-control"`

**Aplicación en logs:**
```json
{
  "action": "workitem_create",
  "id": "WI-042",
  "agent": "mission-control",      // ← de x-brokia-agent o default
  "started_at": "2026-02-25T15:30:00Z",
  ...
}
```

**RUNNING.json también incluye `agent`:**
```json
{
  "action": "workitem_clarify",
  "started_at": "2026-02-25T15:30:00Z",
  "script": "wi-pipeline.sh",
  "args": ["--step", "clarify", "--id", "WI-042"],
  "agent": "ci-pipeline"           // ← si header presente
}
```

**Uso previsto:**
- `"mission-control"` — UI web (default)
- `"ci-pipeline"` — Automaciones desde GitHub Actions
- `"cli-local"` — Scripts manuales del desarrollador
- `"cron-daily"` — Tareas programadas

**Nota:** Implementar en v1.1. No modificar codex_builder en curso.

---

## Referencias

- Motor location: `brokia/workitems/scripts/wi-*.sh`
- Export canónico: `brokia/workitems/index/workitems.json`
- Specs relacionados:
  - `QA_ACCEPTANCE_STEP4.md` — Checklist de validación
  - `SMOKE_TESTS_STEP4.md` — Tests manuales listos para copiar/pegar
