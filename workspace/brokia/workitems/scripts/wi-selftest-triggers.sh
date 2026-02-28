#!/bin/bash
# wi-selftest-triggers.sh - Test completo de triggers Fase 4
# Este script valida que todos los componentes de Fase 4 funcionen correctamente
# y que las reglas de seguridad se respeten.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKITEMS_DIR="$(dirname "$SCRIPT_DIR")"
REPORTS_DIR="$WORKITEMS_DIR/reports"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores
TESTS_PASSED=0
TESTS_FAILED=0

# Función de test
run_test() {
  local test_name="$1"
  local test_cmd="$2"
  
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "TEST: $test_name"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  if eval "$test_cmd"; then
    echo -e "${GREEN}✅ PASSED${NC}: $test_name"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}❌ FAILED${NC}: $test_name"
    ((TESTS_FAILED++))
  fi
}

# Header
echo "═══════════════════════════════════════════════════"
echo "  wi-selftest-triggers.sh - Fase 4 Tests"
echo "═══════════════════════════════════════════════════"
echo ""
echo "Validando:"
echo "  ✅ wi-watch.sh (polling, one-shot, idempotencia)"
echo "  ✅ wi-notify.sh (stale, blocked, priority)"
echo "  ✅ Reglas de seguridad (NO BUILDING en triggers)"
echo "  ✅ Integración con scripts existentes"
echo ""

# ============================================
# TEST 1: Verificar scripts existen y son ejecutables
# ============================================
run_test "Scripts Fase 4 existen y son ejecutables" \
  "[[ -x \"$SCRIPT_DIR/wi-watch.sh\" ]] && [[ -x \"$SCRIPT_DIR/wi-notify.sh\" ]] && [[ -f \"$WORKITEMS_DIR/cron/README.md\" ]]"

# ============================================
# TEST 2: Crear item de prueba (idea NEW)
# ============================================
TEST_ITEM_ID=""

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "SETUP: Creando item de prueba"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Crear item de prueba
"$SCRIPT_DIR/wi-create.sh" --type idea \
  --title "Self-Test Auto-Trigger Item" \
  --description "Item creado para testear triggers" \
  --priority p1 \
  --legacy-id "TEST-LEGACY-001"

# Obtener el ID generado (último archivo en inbox)
TEST_FILE=$(ls -t "$WORKITEMS_DIR"/inbox/IDEA-*.md 2>/dev/null | head -1)
if [[ -z "$TEST_FILE" ]]; then
  echo -e "${RED}❌ FAILED${NC}: No se pudo crear item de prueba"
  exit 1
fi

TEST_ITEM_ID=$(grep -m1 "^id:" "$TEST_FILE" | sed 's/^id:[[:space:]]*//' | tr -d ' ')
echo "✅ Item creado: $TEST_ITEM_ID"
echo "   Archivo: $TEST_FILE"

# Verificar estado inicial
TEST_STATUS=$(grep -m1 "^status:" "$TEST_FILE" | sed 's/^status:[[:space:]]*//' | tr -d ' ')
if [[ "$TEST_STATUS" != "NEW" ]]; then
  echo -e "${RED}❌ FAILED${NC}: Estado inicial debería ser NEW, es: $TEST_STATUS"
  exit 1
fi
echo "   Status: $TEST_STATUS"

((TESTS_PASSED++))

# ============================================
# TEST 3: wi-watch one-shot con action research
# ============================================
run_test "wi-watch one-shot procesa item NEW" \
  "cd \"$WORKITEMS_DIR\" && ./scripts/wi-watch.sh --action research --one-shot --only-type idea 2>&1 | grep -q \"$TEST_ITEM_ID\""

# ============================================
# TEST 4: Verificar que item pasó a RESEARCHING
# ============================================
run_test "Item pasó de NEW a RESEARCHING" \
  "[[ -f \"$WORKITEMS_DIR/active/researching/$TEST_ITEM_ID.md\" ]]"

# ============================================
# TEST 5: Verificar que se generó reporte
# ============================================
run_test "Reporte de research fue generado" \
  "[[ -f \"$REPORTS_DIR/$TEST_ITEM_ID/research.md\" ]]"

# ============================================
# TEST 6: Idempotencia - no reprocesar item ya procesado
# ============================================
run_test "wi-watch es idempotente (no reprocesa item ya procesado)" \
  "cd \"$WORKITEMS_DIR\" && ./scripts/wi-watch.sh --action research --one-shot --only-type idea 2>&1 | grep -q \"⏭️  Ya procesado\""

# ============================================
# TEST 7: Guardrail - wi-watch debe bloquear action build
# ============================================
run_test "wi-watch RECHAZA action 'build' (seguridad)" \
  "cd \"$WORKITEMS_DIR\" && ./scripts/wi-watch.sh --action build --one-shot 2>&1 | grep -qi \"PROHIBIDA\""

# ============================================
# TEST 8: wi-notify genera output markdown
# ============================================
NOTIFY_OUTPUT=""
run_test "wi-notify genera output markdown válido" \
  "NOTIFY_OUTPUT=\"\$($SCRIPT_DIR/wi-notify.sh --stale-days 1)\" && echo \"\$NOTIFY_OUTPUT\" | grep -q \"Work-Items Report\""

# ============================================
# TEST 9: wi-notify detecta items activos
# ============================================
run_test "wi-notify detecta items en reporte" \
  "echo \"\$NOTIFY_OUTPUT\" | grep -q \"IDEA-20260225\""

# ============================================
# TEST 10: wi-notify formato text también funciona
# ============================================
run_test "wi-notify formato text funciona" \
  "cd \"$WORKITEMS_DIR\" && ./scripts/wi-notify.sh --format text | grep -q \"WORK-ITEMS REPORT\""

# ============================================
# TEST 11: Verificar implementation_approved en item creado
# ============================================
run_test "Item tiene implementation_approved: false por default" \
  "grep -q \"implementation_approved: false\" \"$WORKITEMS_DIR/active/researching/$TEST_ITEM_ID.md\""

# ============================================
# TEST 12: Intentar mover a BUILDING sin approved debe fallar
# ============================================
run_test "Guardrail bloquea BUILDING sin implementation_approved" \
  "cd \"$WORKITEMS_DIR\" && ./scripts/wi-move.sh --id \"$TEST_ITEM_ID\" --to BUILDING 2>&1 | grep -qi \"BLOQUEADO\"; [[ \$? -eq 0 ]]"

# ============================================
# TEST 13: Aprobar item y luego sí permitir BUILDING
# ============================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST: Flujo completo de aprobación"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Aprobar item
echo "Aprobando item..."
"$SCRIPT_DIR/wi-approve.sh" --id "$TEST_ITEM_ID" --confirm 2>&1 | tail -3

# Verificar aprobación
if grep -q "implementation_approved: true" "$WORKITEMS_DIR/active/researching/$TEST_ITEM_ID.md"; then
  echo -e "${GREEN}✅ PASSED${NC}: Item aprobado correctamente"
  ((TESTS_PASSED++))
else
  echo -e "${RED}❌ FAILED${NC}: Item no se aprobó"
  ((TESTS_FAILED++))
fi

# Ahora mover a PLANNED primero (transición válida)
echo "Moviendo a PLANNED..."
"$SCRIPT_DIR/wi-move.sh" --id "$TEST_ITEM_ID" --to PLANNED 2>&1 | tail -1

# Ahora sí debería poder ir a BUILDING
run_test "BUILDING permitido después de aprobación" \
  "cd \"$WORKITEMS_DIR\" && ./scripts/wi-move.sh --id \"$TEST_ITEM_ID\" --to BUILDING 2>&1 | grep -q \"BUILDING\""

# ============================================
# TEST 14: Cron README existe y tiene contenido válido
# ============================================
run_test "Cron README existe y documenta ejemplos" \
  "[[ -s \"$WORKITEMS_DIR/cron/README.md\" ]] && grep -q \"crontab\" \"$WORKITEMS_DIR/cron/README.md\""

# ============================================
# TEST 15: Clarification Layer - Research bloqueado sin clarificación
# ============================================
run_test "Research bloqueado cuando needs_clarification=true" \
  "cd \"$WORKITEMS_DIR\" && ./scripts/wi-pipeline.sh --id \"$TEST_ITEM_ID\" --step research 2>&1 | grep -q \"BLOCKED\""

# ============================================
# TEST 16: Clarification Layer - Clarify permitido
# ============================================
run_test "Clarify permitido con needs_clarification=true" \
  "cd \"$WORKITEMS_DIR\" && ./scripts/wi-pipeline.sh --id \"$TEST_ITEM_ID\" --step clarify 2>&1 | grep -q \"wi-clarify.sh\""

# ============================================
# TEST 17: Clarification Layer - Reporte clarification.md generado
# ============================================
run_test "Reporte clarification.md fue generado" \
  "[[ -f \"$REPORTS_DIR/$TEST_ITEM_ID/clarification.md\" ]]"

# ============================================
# TEST 18: Clarification Layer - Status cambió a ASKED
# ============================================
run_test "clarification_status cambió de PENDING a ASKED" \
  "grep -q \"clarification_status: ASKED\" \"$WORKITEMS_DIR/active/researching/$TEST_ITEM_ID.md\""

# ============================================
# TEST 19: Clarification Layer - Research aún bloqueado (sin confirmar)
# ============================================
run_test "Research sigue bloqueado post-clarify (sin confirm)" \
  "cd \"$WORKITEMS_DIR\" && ./scripts/wi-pipeline.sh --id \"$TEST_ITEM_ID\" --step research 2>&1 | grep -q \"BLOCKED\""

# ============================================
# TEST 20: Clarification Layer - Confirm y luego research permitido
# ============================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST: Flujo completo de clarificación"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Confirmar plan
echo "Confirmando plan..."
"$SCRIPT_DIR/wi-confirm.sh" --id "$TEST_ITEM_ID" --plan A 2>&1 | tail -3

# Verificar confirmación
if grep -q "clarification_status: CONFIRMED" "$WORKITEMS_DIR/active/researching/$TEST_ITEM_ID.md"; then
  echo -e "${GREEN}✅ PASSED${NC}: Item confirmado correctamente"
  ((TESTS_PASSED++))
else
  echo -e "${RED}❌ FAILED${NC}: Item no se confirmó"
  ((TESTS_FAILED++))
fi

# Ahora research debería funcionar
run_test "Research permitido post-confirmación" \
  "cd \"$WORKITEMS_DIR\" && ./scripts/wi-pipeline.sh --id \"$TEST_ITEM_ID\" --step research 2>&1 | grep -q \"Reporte creado\""

# ============================================
# TEST 21: Verificar que item de prueba original sigue existiendo
# ============================================
run_test "Items originales no fueron afectados" \
  "[[ -f \"$WORKITEMS_DIR/active/researching/IDEA-20260225-001.md\" ]]"

# ============================================
# Cleanup
# ============================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "CLEANUP: Eliminando item de prueba"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Mover a dropped para limpiar (no borrar para mantener trazabilidad)
if [[ -f "$WORKITEMS_DIR/active/building/$TEST_ITEM_ID.md" ]]; then
  # Actualizar status primero
  sed -i 's/^status: .*/status: DROPPED/' "$WORKITEMS_DIR/active/building/$TEST_ITEM_ID.md"
  # Mover a archive
  mv "$WORKITEMS_DIR/active/building/$TEST_ITEM_ID.md" "$WORKITEMS_DIR/archive/dropped/"
  echo "✅ Item de prueba movido a archive/dropped/"
fi

# Limpiar processed log (opcional - dejar para tests futuros)
# rm -f "$WORKITEMS_DIR/.wi-watch-processed"

echo ""

# ============================================
# Resumen Final
# ============================================
echo "═══════════════════════════════════════════════════"
echo "  RESUMEN DE TESTS"
echo "═══════════════════════════════════════════════════"
echo ""
echo -e "  ${GREEN}PASSED: $TESTS_PASSED${NC}"
echo -e "  ${RED}FAILED: $TESTS_FAILED${NC}"
echo ""

if [[ $TESTS_FAILED -eq 0 ]]; then
  echo -e "${GREEN}✅ TODOS LOS TESTS PASARON${NC}"
  echo ""
  echo "Fase 4 (Triggers Automáticos) está lista."
  echo ""
  echo "Próximos pasos:"
  echo "  1. Revisar ejemplos de cron: cat cron/README.md"
  echo "  2. Probar wi-watch en modo continuo:"
  echo "     ./scripts/wi-watch.sh --interval-seconds 30"
  echo "  3. Configurar cron según necesidad"
  exit 0
else
  echo -e "${RED}❌ ALGUNOS TESTS FALLARON${NC}"
  echo ""
  echo "Revisar logs arriba para detalles."
  exit 1
fi
