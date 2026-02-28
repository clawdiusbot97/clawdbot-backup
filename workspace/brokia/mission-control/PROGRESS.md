# Mission Control v1 - Progress

---

## ✅ Paso 1: Scaffolding (COMPLETADO)
**Fecha/Hora:** 2026-02-25 07:13 UTC

### Qué se hizo
- Creada estructura de directorios `brokia/mission-control/`
- Inicializado proyecto Next.js con TypeScript + Tailwind CSS
- Configuración con App Router y alias `@/*`
- Archivo `.env.example` con variables de entorno requeridas
- Helper server-only: `src/server/runScript.ts`
  - Ejecución de comandos whitelisted
  - cwd = BROKIA_ROOT
  - Timeout configurable (default 30s)
  - Captura stdout/stderr
  - Retorna contrato estándar
- Estructura de logs en `logs/.gitkeep`
- Documentación en README.md

### Archivos creados
```
brokia/mission-control/
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── logs/
│   └── .gitkeep
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── server/
│       └── runScript.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## ✅ Paso 2: Data Contract + Hotfixes (COMPLETADO)
**Fecha/Hora:** 2026-02-25 07:30 UTC

### Correcciones Críticas de Paths

**Engine Location Clarificado:**
- Motor REAL vive en: `brokia/workitems/` (fuera de mission-control/)
- Scripts: `brokia/workitems/scripts/wi-*.sh`
- JSON canónico: `brokia/workitems/index/workitems.json`
- Mission Control NUNCA debe duplicar/redifinir el motor

### Archivos Creados/Actualizados

| Archivo | Propósito |
|---------|-----------|
| `src/app/api/workitems/route.ts` | GET /api/workitems - usa motor real |
| `src/app/workitems/page.tsx` | UI temporal con tabla de workitems |
| `src/server/runScript.ts` | Fixed: usa path `brokia/workitems/scripts/` |
| `.env.example` | Agregado `USE_FIXTURES=false` |
| `README.md` | Documentado engine location + fixture mode |

### Respuesta API (Ejemplo Recortado)

```json
{
  "success": true,
  "action": "workitems_get",
  "id": "N/A",
  "message": "Workitems exported and loaded successfully",
  "stdout": "Export completed: 6 items written to brokia/workitems/index/workitems.json",
  "stderr": "",
  "blocked_by_guardrail": false,
  "data": {
    "total_items": 6,
    "counts_by_status": {
      "NEW": 2,
      "RESEARCHING": 2,
      "RESEARCHED": 1,
      "DROPPED": 1
    },
    "counts_by_type": {
      "idea": 4,
      "requirement": 1,
      "research": 1
    },
    "items": [...]
  }
}
```

### Fixture Mode
- `USE_FIXTURES=true` → lee `fixtures/workitems.json` (desarrollo)
- `USE_FIXTURES=false` → ejecuta motor real (default)

---

## 📋 Checklist: Listo para Paso 3

- [x] API endpoint GET /api/workitems funcional
- [x] UI /workitems con tabla y métricas
- [x] Paths corregidos a motor real (brokia/workitems/)
- [x] Fixture mode implementado
- [x] runScript.ts whitelist usa `scripts/` subdirectorio
- [x] Documentación actualizada con engine location

**Estado:** ✅ Listo para Paso 3: Kanban Board

---

## ✅ Paso 2: Cerrado - Fixes Finales (COMPLETADO)
**Fecha/Hora:** 2026-02-25 13:35 UTC

### Fixes Aplicados

**1. Stack Version:**
- Next.js: 16.1.6 (alineado con package.json)
- README actualizado

**2. Canonical Export Path:**
- Confirmado: `brokia/workitems/index/workitems.json`
- `EXPORT_PATH` default apunta a ese path exacto
- Documentado como único archivo canónico

**3. Logs Format:**
- Extensión real: `.json` (no .log)
- Estructura: `logs/<ID>/<timestamp>_<action>.json`
- System logs: `logs/SYSTEM/<timestamp>_<action>.json`

**4. API Contract:**
- Agregado campo `data` (opcional)
- Documentado en README

---

## ✅ Paso 3: Kanban Board v1 (COMPLETADO)
**Fecha/Hora:** 2026-02-25 13:45 UTC

**Scope:**
- Board con 8 columnas (NEW, RESEARCHING, RESEARCHED, DECIDED, PLANNED, BUILDING, DONE, DROPPED)
- Cards con badges, prioridad, owner, tags, indicators
- Filters bar (search, type, owner, tag, needs_clarification)
- Loading y error states
- Sin drag & drop, sin mutaciones (solo visualización)

**Checklist:**
- [x] /board renderiza 8 columnas
- [x] Items reales visibles (6 items)
- [x] Filtros funcionan
- [x] Loading y error states visibles
- [x] No rompe build
- [x] PROGRESS.md actualizado
- [x] README actualizado con /board

### Archivos Creados
```
src/
├── types/
│   └── workitem.ts          # Types + KANBAN_COLUMNS constant
├── components/
│   ├── WorkItemCard.tsx     # Card component con badges/indicators
│   └── FilterBar.tsx        # Filters UI
└── app/
    └── board/
        └── page.tsx         # Kanban board page
```

### Features Implementadas
- 8 columnas hardcoded según spec
- Cards muestran: id, title, type badge, priority, owner, tags (max 6 + "+N")
- Updated_at en formato relativo (m/h/d ago)
- Indicadores: needs_clarification (amarillo), implementation_approved (verde)
- Report icons: C T $ P A (clarification, tech, cost, product, arch)
- Filters: search (id/title), type, owner, tag, needs_clarification toggle
- Loading spinner solo en board area
- Error state con retry button
- Refresh button en filters

### Build Output
```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /api/workitems
├ ○ /board
└ ○ /workitems
```

---

## ⏸️ Estado: Esperando aprobación para Paso 4

**Nota:** No avanzar a Paso 4 sin aprobación explícita.

---

## 🔄 Pre-Step4 Freeze (En progreso — mientras corre codex_builder)
**Fecha/Hora:** 2026-02-25 15:23 UTC  
**Asignado a:** Clawdius (orchestrator) — NO codex_builder  
**Tarea:** Congelar scope, vocabulario de acciones, y preparar QA + smoke tests

### Specs Creados (Scope Congelado)

| Archivo | Descripción |
|---------|-------------|
| [`specs/SCOPE_V1.md`](specs/SCOPE_V1.md) | Scope IN/OUT congelado + Action Vocabulary v1 |
| [`specs/QA_ACCEPTANCE_STEP4.md`](specs/QA_ACCEPTANCE_STEP4.md) | Checklist completo de aceptación para Step 4 |
| [`specs/SMOKE_TESTS_STEP4.md`](specs/SMOKE_TESTS_STEP4.md) | Tests manuales listos para copiar/pegar |

### Scope IN (Congelado)
- ✅ Actions: refresh, create, update, move, drop, clarify, confirm
- ✅ Observability: timeline logs por item + running flag
- ✅ Logs endpoints: GET /api/logs, GET /api/logs/recent
- ✅ UI: Drawer + modales create/edit + botones condicionales

### Scope OUT (Congelado para v2)
- ❌ Drag & drop → usar Move dropdown
- ❌ Auth / multi-user
- ❌ DB / ORM
- ❌ Polling automático → refresh manual + post-action refresh
- ❌ Delete físico → solo DROPPED (soft delete)
- ❌ Validate / Plan / Build desde UI (dejar para v2)

### Action Vocabulary v1 (Congelado)
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
**Regla:** No agregar otros sin actualizar estos 3 specs.

### Estado
- [x] SCOPE_V1.md creado
- [x] QA_ACCEPTANCE_STEP4.md creado
- [x] SMOKE_TESTS_STEP4.md creado
- [x] PROGRESS.md actualizado (esta sección)
- [ ] Esperando: codex_builder complete Step 4
- [ ] Luego: Ejecutar smoke tests + QA acceptance

### Nota para QA
Una vez codex_builder termine, usar `specs/SMOKE_TESTS_STEP4.md` para validar. Todos los tests deben pasar antes de marcar Step 4 como completado.

---

## ✅ Update: v1.1 UX polish + v1.2 dragdrop
**Fecha/Hora:** 2026-02-25 16:03 UTC

- Timeline entries are now clickable and open a full detail modal (action timing, provider/model, status, file, stdout/stderr, copy stdout button).
- Clarify and other action buttons now show inline spinner indicators while executing.
- Clarify success now refreshes board data and drawer data (logs + reports).
- Drawer now includes a **View Reports** section powered by `/api/reports` and modal report viewer via `/api/reports/view`.
- If `reports.clarification` is available, drawer shows **Open Clarification Report** quick-action button.
- Implemented HTML5 drag-and-drop across columns with rules:
  - only draggable when `allowed_actions` includes `move`
  - no-op on same-column drop
  - POST to `/api/actions/move` with `{ id, to }`
  - optimistic placement + rollback on failure
  - toast feedback for success/failure and guardrail blocks

---

## ✅ Checkpoint: v1.1 UX Polish + v1.2 Drag & Drop (@dnd-kit)
**Fecha/Hora:** 2026-02-25 16:58 UTC

### v1.1 UX Polish
- Report modal now renders Markdown using `react-markdown` + `remark-gfm`.
- HTML parsing is disabled via `skipHtml`.
- Styled markdown output with prose/table/code treatments, with fallback `<pre>` via error boundary.
- Confirm UX in drawer updated to guided flow:
  - Plan select (`Select plan...`, `Plan A/B/C`)
  - helper text
  - single `Confirm selected plan` button, disabled until plan is selected.
- Timeline details modal now includes **Copy stdout** and **Copy stderr** actions.
- Timeline list preserves inline metadata and RUNNING badge behavior.

### v1.2 Drag & Drop Migration
- Added `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` dependencies.
- Created `src/components/board/DndKitBoard.tsx` wrapper with `DndContext`.
- `WorkItemCard` migrated from native `draggable` to `useDraggable` with `{ id, data: { item }, disabled: !canMove }`.
- `KanbanColumnView` migrated to `useDroppable` with active ring highlight on `isOver`.
- `/board` now uses `DndKitBoard` while preserving optimistic move/rollback and move-guardrails.

---

## ✅ Checkpoint: v1.3 Agent Ownership + Automatic State Progression
**Fecha/Hora:** 2026-02-25 17:08 UTC

### Backend
- Nuevo módulo `src/server/runs.ts` para lifecycle RUNNING:
  - `startRun()` crea/actualiza `logs/<ID>/RUNNING.json` (incluye `agent`, `status_target`, `pid`, `heartbeat_at`).
  - `finishRun()` elimina `RUNNING.json` y escribe log estructurado `logs/<ID>/<timestamp>_<action>.json`.
  - `getRunState()` e `isRunning()` para guardrails y UI metadata.
- Nuevo endpoint `POST /api/actions/research`:
  - Respeta `USE_FIXTURES` (`fixtureMutationBlocked`).
  - Valida `{ id }`.
  - Bloquea si ya hay run activo (`blocked_by_guardrail=true`).
  - Verifica `allowed_actions` contiene `research`.
  - Ejecuta `wi-pipeline.sh --id <ID> --step research` con `spawn`.
  - Persiste ownership con header `x-brokia-agent` (default `codex_builder`).
  - Al terminar, cierra run con `finishRun()` y refresca export con `runExportAndRead`.
- `src/server/logs.ts` + `GET /api/logs` ahora incluyen `runState` completo además de `running`.

### UI/UX
- Tipos extendidos (`RunningState`, `ItemLogsData.runState`).
- Board mantiene `runningById` y lo usa para:
  - Badge **Running** con agente en cards.
  - Deshabilitar drag de items en ejecución.
  - Toast guardrail: `Cannot move: item is being processed by <agent>`.
  - Bloqueo adicional en move handler para rollback/guardrail consistente.
- Drawer:
  - Muestra **Taken by <agent>**, start time y duración viva.
  - Deshabilita botones mutantes mientras corre.
  - Agrega botón **Start Research** cuando corresponde (`allowed_actions` + no running + status NEW/RESEARCHING).
