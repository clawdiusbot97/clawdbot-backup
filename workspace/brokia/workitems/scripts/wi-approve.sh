#!/bin/bash
# wi-approve.sh - Aprobar implementación de work-item (spec-compliant)
# Uso: Se ejecuta cuando el usuario escribe "APROBAR IMPLEMENTACIÓN" o "HACER MVP"

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKITEMS_DIR="$(dirname "$SCRIPT_DIR")"

ID=""
CONFIRM=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --id)
      ID="$2"
      shift 2
      ;;
    --confirm)
      CONFIRM=true
      shift
      ;;
    --help|-h)
      echo "Uso: wi-approve.sh --id <TYPE-YYYYMMDD-NNN> [--confirm]"
      echo ""
      echo "⚠️  Este script debe ejecutarse SOLO cuando el usuario escriba:"
      echo "    → 'APROBAR IMPLEMENTACIÓN'"
      echo "    → 'HACER MVP'"
      echo ""
      echo "Opciones:"
      echo "  --confirm  Saltar confirmación interactiva"
      exit 0
      ;;
    *)
      echo "❌ Opción desconocida: $1"
      exit 1
      ;;
  esac
done

if [[ -z "$ID" ]]; then
  echo "❌ Error: --id es requerido"
  exit 1
fi

# Find the file
FILE=$(find "$WORKITEMS_DIR" -name "$ID.md" -type f 2>/dev/null | head -1)

if [[ -z "$FILE" ]]; then
  echo "❌ Error: No se encontró $ID.md"
  exit 1
fi

# Get metadata
TYPE=$(grep -m1 "^type:" "$FILE" | sed 's/^type:[[:space:]]*//' | tr -d ' ')
TITLE=$(grep -m1 "^title:" "$FILE" | sed 's/^title:[[:space:]]*//' | tr -d '"')
STATUS=$(grep -m1 "^status:" "$FILE" | sed 's/^status:[[:space:]]*//' | tr -d ' ')

echo "📝 APROBACIÓN DE IMPLEMENTACIÓN"
echo ""
echo "Item: $ID"
echo "Title: $TITLE"
echo "Type: $TYPE"
echo "Status: $STATUS"
echo ""

# Solo types específicos pueden ser aprobados para implementación
case $TYPE in
  idea|research)
    echo "✅ Type '$TYPE' puede ser aprobado para implementación"
    ;;
  requirement|feature|blocker|decision|risk|solution)
    echo "ℹ️  Type '$TYPE' ya tiene implementation_approved=true por defecto"
    echo "    No requiere aprobación explícita."
    exit 0
    ;;
  *)
    echo "❌ Type desconocido: $TYPE"
    exit 1
    ;;
esac

# Confirmación
if [[ "$CONFIRM" != true ]]; then
  echo "⚠️  ATENCIÓN: Esto habilitará la implementación de este item."
  echo ""
  read -p "¿Confirmar aprobación? (escribe 'APROBAR' para confirmar): " CONFIRM_TEXT
  
  if [[ "$CONFIRM_TEXT" != "APROBAR" ]]; then
    echo "❌ Cancelado."
    exit 1
  fi
fi

# Actualizar el archivo
sed -i 's/^implementation_approved: false/implementation_approved: true/' "$FILE"

# Update timestamp
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
sed -i "s/^updated_at: .*/updated_at: $TIMESTAMP/" "$FILE"

# Agregar nota al archivo
if ! grep -q "## Aprobación de Implementación" "$FILE"; then
  cat >> "$FILE" << EOF

## Aprobación de Implementación

- **Fecha:** $TIMESTAMP
- **Aprobado por:** $(whoami)
- **Trigger:** Usuario escribió 'APROBAR IMPLEMENTACIÓN' o 'HACER MVP'

Este item ha sido aprobado para implementación.
Ahora puede pasar a status PLANNED → BUILDING.
EOF
fi

echo ""
echo "✅ IMPLEMENTACIÓN APROBADA"
echo ""
echo "Item $ID ahora puede:"
echo "  - Pasar a status PLANNED"
echo "  - Pasar a status BUILDING"
echo ""
echo "Próximo paso sugerido:"
echo "  wi-pipeline.sh --id $ID --step plan"
