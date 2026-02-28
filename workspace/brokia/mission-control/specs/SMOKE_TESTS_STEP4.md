# Smoke Tests — Step 4 (Mission Control v1)

**Fecha:** 2026-02-25  
**Referencia:** `SCOPE_V1.md`, `QA_ACCEPTANCE_STEP4.md`  
**Pre-requisito:** Mission Control corriendo (`npm run dev`)

---

## Setup

```bash
# 1. Ir al directorio
cd /home/manpac/.openclaw/workspace/brokia/mission-control

# 2. Verificar que está corriendo
npm run dev
# Debe estar en http://localhost:3000

# 3. Setear variable para tests (opcional)
BASE_URL="http://localhost:3000"
```

---

## Test 1: GET /api/workitems (Sanity Check)

**Comando:**
```bash
curl -s "$BASE_URL/api/workitems" | jq
```

**Expected Response Shape:**
```json
{
  "success": true,
  "action": "workitems_get",
  "id": "N/A",
  "message": "Workitems exported and loaded successfully",
  "stdout": "...",
  "stderr": "",
  "blocked_by_guardrail": false,
  "data": {
    "total_items": 6,
    "counts_by_status": { "NEW": 2, ... },
    "items": [...]
  }
}
```

**Validar:**
- `success === true`
- `data.total_items` es número ≥ 0
- `data.items` es array

---

## Test 2: POST /api/actions/create

**Comando:**
```bash
curl -s -X POST "$BASE_URL/api/actions/create" \
  -H "Content-Type: application/json" \
  -d '{"type":"idea","title":"Test Smoke Item","priority":"high"}' | jq
```

**Expected Response Shape:**
```json
{
  "success": true,
  "action": "workitem_create",
  "id": "WI-XXX",           // ID del item creado
  "message": "Workitem created successfully",
  "stdout": "...",
  "stderr": "",
  "blocked_by_guardrail": false,
  "data": {
    "total_items": 7,       // incrementado
    "counts_by_status": { "NEW": 3, ... },
    "items": [...]          // incluye el nuevo item
  }
}
```

**Validar:**
- `success === true`
- `id` está presente (formato WI-XXX)
- `data.total_items` incrementó en 1
- Nuevo item aparece en `data.items` con title "Test Smoke Item"

---

## Test 3: POST /api/actions/move

**Pre-requisito:** Tener un ID de workitem (del test anterior o existente)

**Comando:**
```bash
# Reemplazar WI-XXX con ID real
ITEM_ID="WI-XXX"

curl -s -X POST "$BASE_URL/api/actions/move" \
  -H "Content-Type: application/json" \
  -d "{\"id\":\"$ITEM_ID\",\"to\":\"RESEARCHING\"}" | jq
```

**Expected Response Shape:**
```json
{
  "success": true,
  "action": "workitem_move",
  "id": "WI-XXX",
  "message": "Workitem moved to RESEARCHING",
  "stdout": "...",
  "stderr": "",
  "blocked_by_guardrail": false,
  "data": {
    "total_items": 7,
    "counts_by_status": { "NEW": 2, "RESEARCHING": 3, ... },
    "items": [...]
  }
}
```

**Validar:**
- `success === true`
- `id` coincide con el enviado
- En `data.items`, el item tiene `status: "RESEARCHING"`
- `counts_by_status.RESEARCHING` incrementó

---

## Test 4: GET /api/logs?id=<ID>

**Comando:**
```bash
# Usar mismo ID del item movido
ITEM_ID="WI-XXX"

curl -s "$BASE_URL/api/logs?id=$ITEM_ID" | jq
```

**Expected Response Shape:**
```json
{
  "success": true,
  "action": "logs_get",
  "id": "WI-XXX",
  "message": "Logs retrieved successfully",
  "stdout": "",
  "stderr": "",
  "blocked_by_guardrail": false,
  "data": {
    "running": false,
    "logs": [
      {
        "action": "workitem_move",
        "id": "WI-XXX",
        "success": true,
        "blocked_by_guardrail": false,
        "stdout": "...",
        "stderr": "",
        "duration_ms": 1234,
        "provider": "openai-codex",
        "model": "openai-codex/gpt-5.3-codex",
        "started_at": "2026-02-25T15:30:00Z",
        "finished_at": "2026-02-25T15:30:01Z"
      }
    ]
  }
}
```

**Validar:**
- `success === true`
- `data.running` es boolean
- `data.logs` es array
- Último log tiene `action: "workitem_move"`
- Log contiene todos los campos requeridos

---

## Test 5: POST /api/actions/drop (con reason)

**Comando:**
```bash
ITEM_ID="WI-XXX"

curl -s -X POST "$BASE_URL/api/actions/drop" \
  -H "Content-Type: application/json" \
  -d "{\"id\":\"$ITEM_ID\",\"reason\":\"Smoke test drop - out of scope\"}" | jq
```

**Expected Response Shape:**
```json
{
  "success": true,
  "action": "workitem_drop",
  "id": "WI-XXX",
  "message": "Workitem dropped successfully",
  "stdout": "...",
  "stderr": "",
  "blocked_by_guardrail": false,
  "data": {
    "total_items": 7,
    "counts_by_status": { "DROPPED": 2, ... },
    "items": [...]
  }
}
```

**Validar:**
- `success === true`
- Item en `data.items` tiene `status: "DROPPED"`
- Item tiene `links` o `notes` con el reason auditado

---

## Test 6: GET /api/logs/recent

**Comando:**
```bash
curl -s "$BASE_URL/api/logs/recent?limit=10" | jq
```

**Expected Response Shape:**
```json
{
  "success": true,
  "action": "logs_recent_get",
  "id": "N/A",
  "message": "Recent logs retrieved",
  "stdout": "",
  "stderr": "",
  "blocked_by_guardrail": false,
  "data": {
    "logs": [
      {
        "id": "WI-XXX",
        "action": "workitem_drop",
        "success": true,
        "finished_at": "2026-02-25T15:35:00Z"
      },
      {
        "id": "WI-XXX",
        "action": "workitem_move",
        "success": true,
        "finished_at": "2026-02-25T15:30:00Z"
      }
    ]
  }
}
```

**Validar:**
- `success === true`
- `data.logs` es array con ≤ limit items
- Logs ordenados descendente (más reciente primero)
- Cada entry tiene `id` y `action`

---

## Test 7: POST /api/actions/refresh

**Comando:**
```bash
curl -s -X POST "$BASE_URL/api/actions/refresh" | jq
```

**Expected Response Shape:**
```json
{
  "success": true,
  "action": "workitems_refresh",
  "id": "N/A",
  "message": "Workitems refreshed successfully",
  "stdout": "Export completed: 7 items...",
  "stderr": "",
  "blocked_by_guardrail": false,
  "data": {
    "total_items": 7,
    "counts_by_status": { ... },
    "items": [...]
  }
}
```

**Validar:**
- `success === true`
- `action === "workitems_refresh"`
- `data` contiene export actualizado

---

## Quick Validation Script (bash)

```bash
#!/bin/bash
BASE_URL="http://localhost:3000"

echo "=== Test 1: GET workitems ==="
curl -s "$BASE_URL/api/workitems" | jq '.success'

echo -e "\n=== Test 2: CREATE workitem ==="
CREATE_RESP=$(curl -s -X POST "$BASE_URL/api/actions/create" \
  -H "Content-Type: application/json" \
  -d '{"type":"idea","title":"Quick Test","priority":"low"}')
echo "$CREATE_RESP" | jq '.success, .id'
NEW_ID=$(echo "$CREATE_RESP" | jq -r '.id')

echo -e "\n=== Test 3: MOVE workitem ==="
curl -s -X POST "$BASE_URL/api/actions/move" \
  -H "Content-Type: application/json" \
  -d "{\"id\":\"$NEW_ID\",\"to\":\"RESEARCHING\"}" | jq '.success, .data.items[] | select(.id == "'"$NEW_ID"'") | .status'

echo -e "\n=== Test 4: GET logs ==="
curl -s "$BASE_URL/api/logs?id=$NEW_ID" | jq '.success, (.data.logs | length)'

echo -e "\n=== Test 5: DROP workitem ==="
curl -s -X POST "$BASE_URL/api/actions/drop" \
  -H "Content-Type: application/json" \
  -d "{\"id\":\"$NEW_ID\",\"reason\":\"Test cleanup\"}" | jq '.success'

echo -e "\n=== Test 6: GET recent logs ==="
curl -s "$BASE_URL/api/logs/recent?limit=5" | jq '.success, (.data.logs | length)'

echo -e "\n=== Test 7: REFRESH ==="
curl -s -X POST "$BASE_URL/api/actions/refresh" | jq '.success, .action'

echo -e "\n=== Smoke tests complete ==="
```

---

## Troubleshooting

| Síntoma | Causa probable | Fix |
|---------|----------------|-----|
| `ECONNREFUSED` | Server no corre | Verificar `npm run dev` |
| `404 Not Found` | Ruta incorrecta | Verificar paths en SCOPE_V1.md |
| `500 Internal Error` | Motor no responde | Verificar `brokia/workitems/scripts/` existen y son ejecutables |
| `blocked_by_guardrail: true` | Motor rechazó acción | Verificar que el item está en estado válido para la acción |
| `data: null` | Export falló | Verificar paths de EXPORT_PATH y permisos |
| Empty logs array | Log directory no existe | Verificar que `logs/` existe y es escribible |

---

## Notas

- Estos tests son **destructivos** — crean y modifican workitems reales.
- Correr en ambiente de desarrollo o con fixtures habilitados.
- Para CI/CD, considerar usar `USE_FIXTURES=true`.
