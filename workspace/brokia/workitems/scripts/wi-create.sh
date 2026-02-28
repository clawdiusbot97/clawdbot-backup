#!/bin/bash
# wi-create.sh - Crear nuevo work-item (spec-compliant)
# IDs: <TYPE>-<YYYYMMDD>-<NNN> incremental por type

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKITEMS_DIR="$(dirname "$SCRIPT_DIR")"
TEMPLATE_DIR="$WORKITEMS_DIR/templates"
INBOX_DIR="$WORKITEMS_DIR/inbox"

# Types oficiales (8)
VALID_TYPES="idea requirement feature blocker decision risk research solution"

# Default values
TYPE="idea"
TITLE=""
DESCRIPTION=""
PRIORITY="p2"
OWNER="brokia"
LEGACY_ID=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --type)
      TYPE="$2"
      shift 2
      ;;
    --title)
      TITLE="$2"
      shift 2
      ;;
    --description)
      DESCRIPTION="$2"
      shift 2
      ;;
    --priority)
      PRIORITY="$2"
      shift 2
      ;;
    --owner)
      OWNER="$2"
      shift 2
      ;;
    --legacy-id)
      LEGACY_ID="$2"
      shift 2
      ;;
    --help|-h)
      echo "Uso: wi-create.sh --type <type> --title <title> [options]"
      echo ""
      echo "Types válidos: $VALID_TYPES"
      echo ""
      echo "Options:"
      echo "  --description <text>  Descripción del item"
      echo "  --priority <p0|p1|p2|p3>  Prioridad (default: p2)"
      echo "  --owner <owner>       Owner (default: brokia)"
      echo "  --legacy-id <id>      ID anterior para trazabilidad"
      exit 0
      ;;
    *)
      echo "❌ Opción desconocida: $1"
      exit 1
      ;;
  esac
done

# Validate type
if [[ ! " $VALID_TYPES " =~ " $TYPE " ]]; then
  echo "❌ Error: Type inválido '$TYPE'"
  echo "   Types válidos: $VALID_TYPES"
  exit 1
fi

# Validate title
if [[ -z "$TITLE" ]]; then
  echo "❌ Error: --title es requerido"
  exit 1
fi

# Validate template exists
if [[ ! -f "$TEMPLATE_DIR/$TYPE.md" ]]; then
  echo "❌ Error: Template no existe para type='$TYPE'"
  exit 1
fi

# Generate ID: <TYPE>-<YYYYMMDD>-<NNN> (incremental por type)
DATE_PART=$(date +%Y%m%d)
TYPE_PREFIX=$(echo "$TYPE" | tr '[:lower:]' '[:upper:]')

# Buscar el último número para este type específico
EXISTING=$(ls -1 "$INBOX_DIR"/${TYPE_PREFIX}-*.md 2>/dev/null | grep -oP "${TYPE_PREFIX}-\d{8}-\d{3}" | sort -V | tail -1)

if [[ -z "$EXISTING" ]]; then
  NEXT_NUM="001"
else
  LAST_NUM=$(echo "$EXISTING" | grep -oP '\d{3}$')
  NEXT_NUM=$(printf "%03d" $((10#$LAST_NUM + 1)))
fi

ID="${TYPE_PREFIX}-${DATE_PART}-${NEXT_NUM}"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Create file
OUTPUT_FILE="$INBOX_DIR/$ID.md"

# Substitute variables en template
sed -e "s/{{ID}}/$ID/g" \
    -e "s/{{TITLE}}/$TITLE/g" \
    -e "s/{{DESCRIPTION}}/$DESCRIPTION/g" \
    -e "s/{{OWNER}}/$OWNER/g" \
    -e "s/{{PRIORITY}}/$PRIORITY/g" \
    -e "s/{{LEGACY_ID}}/$LEGACY_ID/g" \
    -e "s/{{TIMESTAMP}}/$TIMESTAMP/g" \
    "$TEMPLATE_DIR/$TYPE.md" > "$OUTPUT_FILE"

echo "✅ Creado: $OUTPUT_FILE"
echo "   ID: $ID"
echo "   Type: $TYPE"
echo "   Title: $TITLE"
echo "   Status: NEW"
echo "   implementation_approved: $(grep "implementation_approved:" "$OUTPUT_FILE" | sed 's/.*implementation_approved:[[:space:]]*//' | tr -d ' ')"
