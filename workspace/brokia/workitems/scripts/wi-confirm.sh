#!/bin/bash
# wi-confirm.sh - Confirmar plan de acción para un work-item
# Este script se ejecuta cuando el jefe aprueba un plan

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKITEMS_DIR="$(dirname "$SCRIPT_DIR")"
REPORTS_DIR="$WORKITEMS_DIR/reports"

ID=""
PLAN=""
CHIEF_NOTE=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --id)
      ID="$2"
      shift 2
      ;;
    --plan)
      PLAN="$2"
      shift 2
      ;;
    --note)
      CHIEF_NOTE="$2"
      shift 2
      ;;
    --help|-h)
      echo "wi-confirm.sh - Confirmar plan de acción"
      echo ""
      echo "Uso: wi-confirm.sh --id <TYPE-YYYYMMDD-NNN> --plan <A|B|C> [--note \"nota opcional\"]"
      echo ""
      echo "Planes:"
      echo "  A  → Research (investigación completa)"
      echo "  B  → Brainstorm (alternativas rápidas)"
      echo "  C  → Convertir a requirements (ejecución directa)"
      echo ""
      echo "Efectos:"
      echo "  - needs_clarification: false"
      echo "  - clarification_status: CONFIRMED"
      echo "  - proposed_actions: [plan elegido]"
      echo "  - Agrega chief_note al work-item"
      exit 0
      ;;
    *)
      echo "❌ Opción desconocida: $1"
      exit 1
      ;;
  esac
done

# Validaciones
if [[ -z "$ID" ]]; then
  echo "❌ Error: --id es requerido"
  exit 1
fi

if [[ -z "$PLAN" ]]; then
  echo "❌ Error: --plan es requerido (A|B|C)"
  exit 1
fi

if [[ "$PLAN" != "A" && "$PLAN" != "B" && "$PLAN" != "C" ]]; then
  echo "❌ Error: --plan debe ser A, B o C"
  exit 1
fi

# Find the file
FILE=$(find "$WORKITEMS_DIR" -name "$ID.md" -type f 2>/dev/null | head -1)

if [[ -z "$FILE" ]]; then
  echo "❌ Error: No se encontró $ID.md"
  exit 1
fi

# Get current metadata
TYPE=$(grep -m1 "^type:" "$FILE" | sed 's/^type:[[:space:]]*//' | tr -d ' ')
TITLE=$(grep -m1 "^title:" "$FILE" | sed 's/^title:[[:space:]]*//' | tr -d '"')

echo "✅ CONFIRMACIÓN DE PLAN"
echo ""
echo "Item: $ID"
echo "Title: $TITLE"
echo "Type: $TYPE"
echo "Plan seleccionado: $PLAN"
[[ -n "$CHIEF_NOTE" ]] && echo "Nota: $CHIEF_NOTE"
echo ""

# Update frontmatter
sed -i 's/needs_clarification: true/needs_clarification: false/' "$FILE"
sed -i 's/clarification_status: PENDING/clarification_status: CONFIRMED/' "$FILE"
sed -i 's/clarification_status: ASKED/clarification_status: CONFIRMED/' "$FILE"

# Update proposed_actions
PLAN_DESC=""
case $PLAN in
  A) PLAN_DESC="Research: investigación completa con análisis de opciones" ;;
  B) PLAN_DESC="Brainstorm: generación de alternativas y trade-offs" ;;
  C) PLAN_DESC="Requirements: conversión directa a requerimientos ejecutables" ;;
esac

sed -i "s/proposed_actions: \[\]/proposed_actions: [$PLAN] # $PLAN_DESC/" "$FILE"

# Update timestamp
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
sed -i "s/^updated_at: .*/updated_at: $TIMESTAMP/" "$FILE"

# Append chief note if provided
if [[ -n "$CHIEF_NOTE" ]]; then
  cat >> "$FILE" << EOF

---

## Chief Notes

**Plan confirmado:** $PLAN ($PLAN_DESC)  
**Fecha:** $TIMESTAMP  
**Nota:** $CHIEF_NOTE
EOF
fi

echo "✅ Item actualizado:"
echo "   needs_clarification: false"
echo "   clarification_status: CONFIRMED"
echo "   proposed_actions: [$PLAN]"
echo ""

case $PLAN in
  A)
    echo "🎯 Plan A (Research) confirmado"
    echo ""
    echo "Próximo paso:"
    echo "   ./scripts/wi-pipeline.sh --id $ID --step research"
    ;;
  B)
    echo "🎯 Plan B (Brainstorm) confirmado"
    echo ""
    echo "El item está listo para análisis rápido de alternativas."
    echo "Nota: Para ejecutar, usar research con foco en trade-offs."
    ;;
  C)
    echo "🎯 Plan C (Requirements) confirmado"
    echo ""
    echo "Próximo paso:"
    echo "   ./scripts/wi-pipeline.sh --id $ID --step plan"
    echo ""
    echo "O directamente crear requerimientos formales."
    ;;
esac

echo ""
echo "📋 Ahora wi-watch.sh puede procesar este item automáticamente."
