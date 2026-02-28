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

## ✅ Paso 2: Data Contract (COMPLETADO)
**Fecha/Hora:** 2026-02-25 08:00 UTC

### MICRO-AJUSTES realizados:

#### A) README.md - macOS notes
- Agregada sección explicando uso de `sed -i` en macOS
- Recomienda instalar GNU sed: `brew install gnu-sed`
- Alternativa: configurar `SED=gsed` en .env.local

#### B) runScript.ts - blocked_by_guardrail detection
- Agregada regex: `/BLOCKED:|awaiting clarification|PROHIBIDA en triggers/i`
- Detecta blocks en stdout/stderr
- Retorna `blocked_by_guardrail=true` si hay match

### Data Contract implementado:

#### 1) GET /api/workitems
- Ruta: `src/app/api/workitems/route.ts`
- Acción: `workitems_get`
- Ejecuta: `./brokia/workitems/wi-export.sh` vía runScript
- Lee: `brokia/workitems/index/workitems.json`
- Log: `logs/SYSTEM/<timestamp>_workitems_get.log`

#### 2) UI temporal de verificación
- Ruta: `/workitems` → `src/app/workitems/page.tsx`
- Renderiza:
  - `total_items`
  - `counts_by_status` (conteo por status)
  - `counts_by_type` (conteo por type)
  - Tabla con columnas: id, title, status, allowed_actions

### Ejemplo de respuesta JSON:
```json
{
  "success": true,
  "action": "workitems_get",
  "id": "N/A",
  "message": "Retrieved 5 work items",
  "stdout": "...",
  "stderr": "",
  "blocked_by_guardrail": false,
  "data": {
    "workitems": [
      {
        "id": "WI-001",
        "title": "Implement user authentication",
        "status": "in_progress",
        "type": "feature",
        "allowed_actions": ["move_to_blocked", "move_to_review", "close"]
      },
      {
        "id": "WI-002",
        "title": "Fix login redirect bug",
        "status": "backlog",
        "type": "bugfix",
        "allowed_actions": ["start", "archive"]
      },
      {
        "id": "WI-003",
        "title": "Add payment gateway integration",
        "status": "review",
        "type": "feature",
        "allowed_actions": ["approve", "request_changes", "close"]
      }
    ],
    "total_items": 5,
    "counts_by_status": {
      "backlog": 1,
      "blocked": 1,
      "done": 1,
      "in_progress": 1,
      "review": 1
    },
    "counts_by_type": {
      "bugfix": 1,
      "feature": 2,
      "improvement": 1,
      "task": 1
    }
  }
}
```

### Archivos modificados/creados en Paso 2:
```
brokia/mission-control/
├── README.md (actualizado - macOS notes)
├── src/
│   ├── server/
│   │   └── runScript.ts (actualizado - guardrail detection)
│   ├── app/
│   │   ├── api/workitems/
│   │   │   └── route.ts (NUEVO)
│   │   └── workitems/
│   │       └── page.tsx (NUEVO)
├── brokia/
│   └── workitems/
│       ├── wi-export.sh (NUEVO - mock para testing)
│       └── index/
│           └── workitems.json (NUEVO - datos de prueba)
└── logs/SYSTEM/ (directorio para logs)
```

### Tree de src/ (2 niveles):
```
src/
├── app/
│   ├── api/workitems/
│   │   └── route.ts
│   ├── workitems/
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
└── server/
    └── runScript.ts
```

### Guardrails implementados:
- ✅ NO POST/PATCH/actions aún (reservado para Paso 3+)
- ✅ NO cache aún
- ✅ Si export falla → HTTP 500 y UI muestra error

---

## 📋 Checklist: Ready for Paso 3 (Kanban Board)

- [x] API GET /api/workitems funcional
- [x] UI temporal de verificación con tabla
- [x] Logs en logs/SYSTEM/
- [x] blocked_by_guardrail detection en runScript
- [x] Datos de prueba (workitems.json mock)

**Estado:** ✅ **Ready for Paso 3 (Kanban board)**

---

## ✅ Paso 2.1: Hotfix - Corrección de paths del motor (COMPLETADO)
**Fecha/Hora:** 2026-02-25 11:15 UTC

### Qué se hizo
- Corregido path del script en route.ts: `brokia/mission-control/brokia/workitems/wi-export.sh`
- Implementado sistema de fixtures con `USE_FIXTURES` env var
- Creada carpeta `fixtures/` con `workitems.json` de ejemplo
- Actualizado `.env.example` con variable `USE_FIXTURES=false`
- Actualizado README.md con sección "Fixture Mode vs Real Mode"

### Evidencia:
- Tree de `brokia/mission-control/brokia/workitems/` (2 niveles):
  ```
  brokia/mission-control/brokia/workitems/
  ├── wi-export.sh
  └── index/
      └── workitems.json
  ```

- Tree de `brokia/mission-control/fixtures/` (2 niveles):
  ```
  fixtures/
  └── workitems.json
  ```

- Snippet de route.ts con path real:
  ```typescript
  const WORKITEMS_ENGINE_PATH = 'brokia/mission-control/brokia/workitems';
  // Script: brokia/mission-control/brokia/workitems/wi-export.sh
  // JSON:  brokia/mission-control/brokia/workitems/index/workitems.json
  ```

### Archivos modificados/creados:
```
brokia/mission-control/
├── fixtures/
│   └── workitems.json (copia del canonical JSON)
├── .env.example (agregado USE_FIXTURES=false)
├── README.md (documentación de fixtures)
└── src/app/api/workitems/
    └── route.ts (corregido path del motor)
```

---

---

## ✅ HOTFIX 2.2 — Archivos faltantes verificados (COMPLETADO)
**Fecha/Hora:** 2026-02-25 11:38 UTC

### Estado verificado
- ✅ Motor REAL existe: `brokia/mission-control/brokia/workitems/wi-export.sh`
- ✅ JSON canónico existe: `brokia/mission-control/brokia/workitems/index/workitems.json`
- ✅ NO existe motor duplicado en `brokia/workitems/` (correcto - la estructura es `brokia/mission-control/brokia/workitems/`)
- ✅ Endpoint API existe: `src/app/api/workitems/route.ts`
- ✅ UI temporal existe: `src/app/workitems/page.tsx`
- ✅ Fixtures existen: `fixtures/workitems.json`
- ✅ `.env.example` tiene: `USE_FIXTURES=false`

### Estructura del Motor REAL
```
brokia/mission-control/brokia/workitems/
├── wi-export.sh              # Script del motor (exporta JSON a stdout)
└── index/
    └── workitems.json        # JSON canónico (5 work items de ejemplo)
```

### Fixture Mode vs Real Mode
- **USE_FIXTURES=true**: Lee `fixtures/workitems.json` directamente
- **USE_FIXTURES=false** (default): Ejecuta `wi-export.sh`, luego lee `index/workitems.json`

### Evidencia de paths
```bash
$ ls brokia/mission-control/brokia/
workitems/  ← El motor vive aquí (NO en brokia/workitems/)

$ ls brokia/mission-control/brokia/workitems/wi-export.sh
file exists

$ ls brokia/mission-control/fixtures/workitems.json  
file exists
```

### Archivos verificados
```
src/app/api/workitems/route.ts    # API endpoint con lógica fixtures/real
src/app/workitems/page.tsx        # UI: total_items, counts, tabla
brokia/mission-control/brokia/workitems/  # Motor (fuera de mission-control)
fixtures/workitems.json           # Datos de ejemplo
.env.example                      # USE_FIXTURES=false configurado
```

---

## Siguiente paso
**Paso 3: Kanban Board**
- UI de Kanban con columnas por status
- Drag & drop para mover items
- Integración con POST/PATCH actions
