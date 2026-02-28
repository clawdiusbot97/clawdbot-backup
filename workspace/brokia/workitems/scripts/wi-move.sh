#!/bin/bash
# wi-move.sh - Mover work-item entre carpetas (spec-compliant)
# Estados oficiales: NEW RESEARCHING RESEARCHED DECIDED PLANNED BUILDING DONE DROPPED

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKITEMS_DIR="$(dirname "$SCRIPT_DIR")"

# Estados oficiales
VALID_STATUSES="NEW RESEARCHING RESEARCHED DECIDED PLANNED BUILDING DONE DROPPED"

ID=""
TO_STATUS=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --id)
      ID="$2"
      shift 2
      ;;
    --to)
      TO_STATUS="$2"
      shift 2
      ;;
    --help|-h)
      echo "Uso: wi-move.sh --id <TYPE-YYYYMMDD-NNN> --to <status>"
      echo ""
      echo "Estados válidos:"
      echo "  NEW         → inbox/"
      echo "  RESEARCHING → active/researching/"
      echo "  RESEARCHED  → active/researched/"
      echo "  DECIDED     → active/decided/"
      echo "  PLANNED     → active/planned/"
      echo "  BUILDING    → active/building/"
      echo "  DONE        → archive/done/"
      echo "  DROPPED     → archive/dropped/"
      exit 0
      ;;
    *)
      echo "❌ Opción desconocida: $1"
      exit 1
      ;;
  esac
done

if [[ -z "$ID" || -z "$TO_STATUS" ]]; then
  echo "❌ Error: --id y --to son requeridos"
  exit 1
fi

# Validar estado
if [[ ! " $VALID_STATUSES " =~ " $TO_STATUS " ]]; then
  echo "❌ Error: Estado inválido '$TO_STATUS'"
  echo "   Estados válidos: $VALID_STATUSES"
  exit 1
fi

# Find the file
FILE=$(find "$WORKITEMS_DIR" -name "$ID.md" -type f 2>/dev/null | head -1)

if [[ -z "$FILE" ]]; then
  echo "❌ Error: No se encontró $ID.md"
  exit 1
fi

# Get current metadata para validaciones
CURRENT_TYPE=$(grep -m1 "^type:" "$FILE" | sed 's/^type:[[:space:]]*//' | tr -d ' ')
CURRENT_STATUS=$(grep -m1 "^status:" "$FILE" | sed 's/^status:[[:space:]]*//' | tr -d ' ')
IMPL_APPROVED=$(grep -m1 "^implementation_approved:" "$FILE" | sed 's/^implementation_approved:[[:space:]]*//' | tr -d ' ')

# 🛡️ GUARDRAIL: Verificar implementation_approved para BUILDING
case $TO_STATUS in
  BUILDING)
    # Types que requieren aprobación explícita
    if [[ "$CURRENT_TYPE" == "idea" || "$CURRENT_TYPE" == "research" ]]; then
      if [[ "$IMPL_APPROVED" != "true" ]]; then
        echo "🛑 GUARDRAIL ACTIVADO"
        echo ""
        echo "Type '$CURRENT_TYPE' NO puede pasar a BUILDING sin aprobación."
        echo ""
        echo "Para habilitar implementación, el usuario debe escribir:"
        echo "  → 'APROBAR IMPLEMENTACIÓN'"
        echo "  → 'HACER MVP'"
        echo ""
        echo "O ejecutar: wi-approve.sh --id $ID"
        exit 1
      fi
    fi
    ;;
esac

# Determine target directory según estado oficial
case $TO_STATUS in
  NEW)
    TARGET_DIR="$WORKITEMS_DIR/inbox"
    ;;
  RESEARCHING)
    TARGET_DIR="$WORKITEMS_DIR/active/researching"
    mkdir -p "$TARGET_DIR"
    ;;
  RESEARCHED)
    TARGET_DIR="$WORKITEMS_DIR/active/researched"
    mkdir -p "$TARGET_DIR"
    ;;
  DECIDED)
    TARGET_DIR="$WORKITEMS_DIR/active/decided"
    mkdir -p "$TARGET_DIR"
    ;;
  PLANNED)
    TARGET_DIR="$WORKITEMS_DIR/active/planned"
    mkdir -p "$TARGET_DIR"
    ;;
  BUILDING)
    TARGET_DIR="$WORKITEMS_DIR/active/building"
    mkdir -p "$TARGET_DIR"
    ;;
  DONE)
    TARGET_DIR="$WORKITEMS_DIR/archive/done"
    mkdir -p "$TARGET_DIR"
    ;;
  DROPPED)
    TARGET_DIR="$WORKITEMS_DIR/archive/dropped"
    mkdir -p "$TARGET_DIR"
    ;;
  *)
    echo "❌ Error: Estado no implementado: $TO_STATUS"
    exit 1
    ;;
esac

# Update status en el archivo
sed -i "s/^status: .*/status: $TO_STATUS/" "$FILE"

# Update timestamp
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
sed -i "s/^updated_at: .*/updated_at: $TIMESTAMP/" "$FILE"

# Move file
TARGET_FILE="$TARGET_DIR/$ID.md"
if [[ "$FILE" != "$TARGET_FILE" ]]; then
  mv "$FILE" "$TARGET_FILE"
  echo "✅ Movido: $ID"
  echo "   Status: $CURRENT_STATUS → $TO_STATUS"
  echo "   Folder: $TARGET_DIR"
else
  echo "✅ Actualizado: $ID"
  echo "   Status: $CURRENT_STATUS → $TO_STATUS"
fi
