# QA Acceptance Checklist — Step 4 (Mission Control v1 Operative)

**Fecha:** 2026-02-25  
**Scope:** Actions + Observability + UI minimal operativo  
**Referencia:** `SCOPE_V1.md`

---

## Pre-requisitos para correr QA

- [ ] Motor en `brokia/workitems/` funcional (scripts wi-*.sh ejecutables)
- [ ] Mission Control corriendo (`npm run dev` en puerto 3000)
- [ ] Env vars configuradas (`.env.local` o defaults funcionales)
- [ ] Al menos un workitem existente para tests (puede ser nuevo)

---

## Backend Actions — Checklist

### POST /api/actions/refresh
- [ ] Retorna contrato estándar (success, action, id, message, stdout, stderr, blocked_by_guardrail)
- [ ] Campo `data` presente con export completo (total_items, counts_by_status, items)
- [ ] `action` === `"workitems_refresh"`
- [ ] No hay error 500 si motor responde con guardrail (debe ser 200 + blocked_by_guardrail=true)

### POST /api/actions/create
- [ ] Acepta body: `{ type, title, priority }`
- [ ] Ejecuta wi-create.sh con parámetros correctos
- [ ] Post-creación: ejecuta export automáticamente
- [ ] Retorna `data` con workitems actualizado (incluye item creado)
- [ ] Log escrito en `logs/<NEW_ID>/<timestamp>_workitem_create.json`

### POST /api/actions/update
- [ ] Acepta body: `{ id, patch: { owner?, priority?, impact?, effort?, cost_estimate_usd_month?, add_tag?, remove_tag?, append_link? } }`
- [ ] Mapea correctamente a flags de wi-update.sh
- [ ] Post-update: ejecuta export automáticamente
- [ ] Retorna `data` actualizado
- [ ] Log escrito correctamente

### POST /api/actions/move
- [ ] Acepta body: `{ id, to }`
- [ ] Ejecuta wi-move.sh --to <STATE>
- [ ] Estados válidos: NEW, RESEARCHING, RESEARCHED, DECIDED, PLANNED, BUILDING, DONE, DROPPED
- [ ] Post-move: ejecuta export automáticamente
- [ ] Retorna `data` actualizado
- [ ] Log escrito correctamente

### POST /api/actions/drop
- [ ] Acepta body: `{ id, reason? }`
- [ ] Implementado como move a DROPPED + append note/link si hay reason
- [ ] Item resultante tiene estado DROPPED
- [ ] Audit trail presente (reason en links o notes)
- [ ] Post-drop: ejecuta export automáticamente

### POST /api/actions/clarify
- [ ] Acepta body: `{ id }`
- [ ] Ejecuta wi-pipeline.sh --step clarify
- [ ] Maneja caso de guardrail (item no en estado válido para clarify)
- [ ] Post-clarify: ejecuta export automáticamente
- [ ] Log escrito correctamente

### POST /api/actions/confirm
- [ ] Acepta body: `{ id, plan: "A"|"B"|"C" }`
- [ ] Ejecuta wi-confirm.sh --plan <A|B|C>
- [ ] Valida que plan sea A, B o C (400 si no)
- [ ] Post-confirm: ejecuta export automáticamente
- [ ] Log escrito correctamente

---

## Observability — Checklist

### runScript.ts — Logging
- [ ] Antes de exec: escribe `logs/<ID>/RUNNING.json` con `{ action, started_at, script, args, agent:"mission-control" }`
- [ ] Durante exec: RUNNING.json existe y es JSON válido
- [ ] After exec (success o fail): RUNNING.json se elimina
- [ ] After exec: log file escrito en `logs/<ID>/<timestamp>_<action>.json`
- [ ] Log file contiene: action, id, success, blocked_by_guardrail, stdout, stderr, duration_ms, provider, model, started_at, finished_at

### GET /api/logs?id=<ID>
- [ ] Retorna objeto con: `{ running: boolean, logs: LogEntry[] }`
- [ ] `running` === true si RUNNING.json existe para ese ID
- [ ] Logs ordenados descendente (más reciente primero)
- [ ] Límite por defecto: últimos 20 logs (configurable?)
- [ ] Formato LogEntry coincide con schema de archivos de log

### GET /api/logs/recent?limit=50
- [ ] Retorna logs across all IDs
- [ ] Responde a query param `limit` (default 50, max 100)
- [ ] Ordenado descendente por timestamp
- [ ] Cada entry incluye `id` del workitem
- [ ] No incluye RUNNING.json (solo logs completados)

---

## UI — Checklist

### Board Page (existente)
- [ ] Renderiza 8 columnas sin errores
- [ ] Cards muestran data actualizada post-action
- [ ] Refresh manual funciona (botón en filters)

### Card Click → Drawer
- [ ] Click en card abre drawer lateral (o modal)
- [ ] Drawer muestra:
  - [ ] Detalles completos del item (all fields)
  - [ ] Lista `allowed_actions` del motor
  - [ ] Activity timeline (llamada a GET /api/logs?id=...)
- [ ] Botones condicionales (solo renderizar si en allowed_actions):
  - [ ] Clarify
  - [ ] Confirm (A/B/C) — renderizar como dropdown o 3 botones
  - [ ] Move — dropdown con estados posibles
  - [ ] Drop
  - [ ] Update

### Create Modal
- [ ] Botón "Create" visible en board
- [ ] Modal abre con campos: type (dropdown), title (text), priority (dropdown)
- [ ] Submit ejecuta POST /api/actions/create
- [ ] On success: cierra modal + refresh board (data nueva visible)
- [ ] On error: muestra mensaje (stderr o message)

### Edit Modal
- [ ] Botón "Edit" en drawer (solo si allowed_actions contiene update)
- [ ] Modal con campos: owner, priority, cost_estimate_usd_month
- [ ] Tag management: add_tag y remove_tag (UI minimal — lista + input)
- [ ] Submit ejecuta POST /api/actions/update
- [ ] On success: cierra modal + refresh board + refresh drawer

### Drop Flow
- [ ] Botón Drop en drawer (solo si allowed_actions lo permite)
- [ ] Confirmación previa ("¿Estás seguro?")
- [ ] Opcional: input para reason
- [ ] Ejecuta POST /api/actions/drop
- [ ] Item desaparece de columna origen → aparece en DROPPED
- [ ] Reason queda auditado (visible en item.links o item.notes)

---

## Guardrails & Edge Cases

- [ ] blocked_by_guardrail=true → HTTP 200 (no 500)
- [ ] Mensaje legible explica por qué fue bloqueado
- [ ] Item no se modifica si guardrail activo
- [ ] Log igual se escribe (para audit trail de intentos)
- [ ] Estado inconsistente (archivos corruptos) → error 500 con mensaje claro

---

## Performance & UX

- [ ] Acciones completan en < 3 segundos (motor + export)
- [ ] Loading states visibles durante mutaciones
- [ ] Error states muestran stderr completo para debugging
- [ ] No hay doble-submit (botón deshabilitado mientras carga)

---

## Sign-off

| Rol | Nombre | Fecha | Estado |
|-----|--------|-------|--------|
| QA | _pending_ | | |
| Dev | _pending_ | | |
| Product | _pending_ | | |

**Notas de QA:**
_espacio para anotar issues encontrados_
