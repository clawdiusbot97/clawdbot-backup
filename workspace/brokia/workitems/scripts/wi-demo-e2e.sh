#!/bin/bash
# wi-demo-e2e.sh - Demo end-to-end del sistema work-items
# Flujo: IDEA voice clone → clarify → confirm plan A → research (4 reportes) → export json → dashboard

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKITEMS_DIR="$(dirname "$SCRIPT_DIR")"

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
  echo ""
  echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
  echo -e "${CYAN}  $1${NC}"
  echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
  echo ""
}

print_step() {
  echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

# ============================================
# DEMO START
# ============================================

clear
print_header "🎯 BROkIA WORK-ITEMS SYSTEM - DEMO E2E"
echo "Este demo muestra el flujo completo:"
echo "  1. Crear IDEA (voice clone con tags)"
echo "  2. Clarify → Confirm Plan A"
echo "  3. Research (4 reportes por rol)"
echo "  4. Export JSON + Dashboard"
echo ""
read -p "Presiona ENTER para comenzar..."

# ============================================
# STEP 1: Create IDEA
# ============================================
print_header "PASO 1: Crear Work-Item IDEA"
print_step "Creando item tipo 'idea' con tags: voice, ai, whatsapp..."

"$SCRIPT_DIR/wi-create.sh" \
  --type idea \
  --title "Voice Clone para Asistente de Cotización" \
  --description "Implementar un asistente de voz que pueda cotizar seguros por WhatsApp usando un voice clone del broker. El cliente habla, el AI responde con la voz del broker real." \
  --priority p1 \
  --legacy-id "DEMO-VOICE-001"

# Obtener el ID del item creado
TEST_FILE=$(ls -t "$WORKITEMS_DIR"/inbox/IDEA-*.md | head -1)
TEST_ID=$(grep -m1 "^id:" "$TEST_FILE" | sed 's/^id:[[:space:]]*//')

print_success "Item creado: $TEST_ID"
echo ""
echo "📄 Primeras líneas del archivo:"
head -15 "$TEST_FILE"
echo ""
read -p "Presiona ENTER para continuar..."

# Agregar tags adicionales
print_step "Agregando tags específicos..."
"$SCRIPT_DIR/wi-update.sh" --id "$TEST_ID" --add-tag ai
"$SCRIPT_DIR/wi-update.sh" --id "$TEST_ID" --add-tag whatsapp
"$SCRIPT_DIR/wi-update.sh" --id "$TEST_ID" --add-tag voice
"$SCRIPT_DIR/wi-update.sh" --id "$TEST_ID" --set-cost 850
"$SCRIPT_DIR/wi-update.sh" --id "$TEST_ID" --set-impact high
"$SCRIPT_DIR/wi-update.sh" --id "$TEST_ID" --set-effort m

print_success "Tags y metadata actualizados"
echo ""
read -p "Presiona ENTER para continuar..."

# Mover a RESEARCHING
print_step "Moviendo a RESEARCHING..."
"$SCRIPT_DIR/wi-move.sh" --id "$TEST_ID" --to RESEARCHING

print_success "Item en estado RESEARCHING"
echo ""
echo "🔍 Verificación: needs_clarification=true, clarification_status=PENDING"
grep -E "(needs_clarification|clarification_status)" "$WORKITEMS_DIR/active/researching/$TEST_ID.md"
echo ""
read -p "Presiona ENTER para continuar..."

# ============================================
# STEP 2: Try Research (BLOCKED)
# ============================================
print_header "PASO 2: Intentar Research (Debe estar BLOQUEADO)"
print_step "Ejecutando: wi-pipeline.sh --id $TEST_ID --step research"

if ! "$SCRIPT_DIR/wi-pipeline.sh" --id "$TEST_ID" --step research 2>&1; then
  print_success "Research correctamente bloqueado (necesita clarificación)"
fi
echo ""
read -p "Presiona ENTER para continuar..."

# ============================================
# STEP 3: Clarify
# ============================================
print_header "PASO 3: Ejecutar Clarify"
print_step "Generando clarification report..."

"$SCRIPT_DIR/wi-pipeline.sh" --id "$TEST_ID" --step clarify 2>&1 | head -25

echo ""
print_success "Clarification completado"
echo ""
echo "📄 Estado actual:"
grep "clarification_status" "$WORKITEMS_DIR/active/researching/$TEST_ID.md"
echo ""
read -p "Presiona ENTER para continuar..."

# ============================================
# STEP 4: Confirm Plan A
# ============================================
print_header "PASO 4: Confirmar Plan (Chief Approval)"
print_step "El jefe confirma Plan A (Research)..."

"$SCRIPT_DIR/wi-confirm.sh" --id "$TEST_ID" --plan A --note "Demo E2E - Aprobado para research completo"

echo ""
print_success "Plan confirmado"
echo ""
echo "📄 Estado actual:"
grep -E "(needs_clarification|clarification_status|proposed_actions)" "$WORKITEMS_DIR/active/researching/$TEST_ID.md"
echo ""
read -p "Presiona ENTER para continuar..."

# ============================================
# STEP 5: Research (4 Reports)
# ============================================
print_header "PASO 5: Ejecutar Research (Genera 4 Reportes por Rol)"
print_step "Generando reportes: tech, cost, product, arch..."

echo ""
"$SCRIPT_DIR/wi-pipeline.sh" --id "$TEST_ID" --step research 2>&1

echo ""
print_success "Research completado - 4 reportes generados"
echo ""
echo "📁 Reportes creados:"
ls -la "$WORKITEMS_DIR/reports/$TEST_ID/"
echo ""
read -p "Presiona ENTER para continuar..."

# ============================================
# STEP 6: Show Report Excerpts
# ============================================
print_header "PASO 6: Excerpt de Reportes"

for report in tech cost product arch; do
  echo -e "${YELLOW}─── $report.md ───${NC}"
  head -20 "$WORKITEMS_DIR/reports/$TEST_ID/$report.md"
  echo ""
  read -p "Presiona ENTER para siguiente reporte..."
  echo ""
done

# ============================================
# STEP 7: Export JSON
# ============================================
print_header "PASO 7: Exportar a JSON (workitems.json)"
print_step "Generando JSON canónico..."

"$SCRIPT_DIR/wi-export.sh" > "$WORKITEMS_DIR/index/workitems.json"

print_success "Export completado"
echo ""
echo "📄 Ubicación: workitems/index/workitems.json"
echo "📊 Tamaño: $(du -h "$WORKITEMS_DIR/index/workitems.json" | cut -f1)"
echo ""
read -p "Presiona ENTER para ver excerpt..."

echo ""
echo -e "${YELLOW}─── Excerpt del JSON (item demo) ───${NC}"
cat "$WORKITEMS_DIR/index/workitems.json" | python3 -m json.tool 2>/dev/null | grep -A 30 "\"id\": \"$TEST_ID\"" | head -35 || cat "$WORKITEMS_DIR/index/workitems.json" | grep -A 30 "$TEST_ID" | head -35
echo ""
read -p "Presiona ENTER para continuar..."

# ============================================
# STEP 8: Dashboard
# ============================================
print_header "PASO 8: Dashboard (Mission Control)"
print_step "Mostrando dashboard de work-items..."

echo ""
"$SCRIPT_DIR/wi-index.sh" --format dashboard

echo ""
read -p "Presiona ENTER para continuar..."

# ============================================
# STEP 9: Summary
# ============================================
print_header "🎉 DEMO COMPLETADO"

echo "Resumen del flujo:"
echo ""
echo -e "  ${GREEN}✓${NC} Work-Item creado: ${CYAN}$TEST_ID${NC}"
echo -e "  ${GREEN}✓${NC} Tags: voice, ai, whatsapp"
echo -e "  ${GREEN}✓${NC} Clarification Layer: PASSED"
echo -e "  ${GREEN}✓${NC} Chief Confirmation: Plan A"
echo -e "  ${GREEN}✓${NC} Research Reports: 4 generados"
echo -e "  ${GREEN}✓${NC} Tag Triggers: Ejecutados"
echo -e "  ${GREEN}✓${NC} JSON Export: workitems.json"
echo ""
echo "Archivos generados:"
echo "  📄 $WORKITEMS_DIR/active/researching/$TEST_ID.md"
echo "  📄 $WORKITEMS_DIR/reports/$TEST_ID/clarification.md"
echo "  📄 $WORKITEMS_DIR/reports/$TEST_ID/tech.md"
echo "  📄 $WORKITEMS_DIR/reports/$TEST_ID/cost.md"
echo "  📄 $WORKITEMS_DIR/reports/$TEST_ID/product.md"
echo "  📄 $WORKITEMS_DIR/reports/$TEST_ID/arch.md"
echo "  📄 $WORKITEMS_DIR/index/workitems.json"
echo ""

# Cleanup opcional
echo "¿Deseas limpiar el item de demo? (s/N)"
read -r cleanup
if [[ "$cleanup" =~ ^[Ss]$ ]]; then
  print_step "Limpiando item de demo..."
  if [[ -f "$WORKITEMS_DIR/active/researching/$TEST_ID.md" ]]; then
    sed -i 's/^status: .*/status: DROPPED/' "$WORKITEMS_DIR/active/researching/$TEST_ID.md"
    mv "$WORKITEMS_DIR/active/researching/$TEST_ID.md" "$WORKITEMS_DIR/archive/dropped/"
  fi
  print_success "Item movido a archive/dropped/"
fi

print_header "Gracias por usar Brokia Work-Items System 🚀"
