#!/bin/bash
# wi-report.sh - Generar reporte final/consolidado (spec-compliant)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKITEMS_DIR="$(dirname "$SCRIPT_DIR")"
REPORTS_DIR="$WORKITEMS_DIR/reports"

ID=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --id)
      ID="$2"
      shift 2
      ;;
    --help|-h)
      echo "Uso: wi-report.sh --id <TYPE-YYYYMMDD-NNN>"
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
IMPL_APPROVED=$(grep -m1 "^implementation_approved:" "$FILE" | sed 's/^implementation_approved:[[:space:]]*//' | tr -d ' ')

echo "# Final Report: $ID"
echo ""
echo "**Title:** $TITLE"
echo "**Type:** $TYPE"
echo "**Status:** $STATUS"
echo "**Implementation Approved:** $IMPL_APPROVED"
echo "**Generated:** $(date -u +"%Y-%m-%d %H:%M UTC")"
echo ""
echo "---"
echo ""
echo "## Work-Item Frontmatter"
echo ""
echo "\`\`\`yaml"
head -15 "$FILE"
echo "\`\`\`"
echo ""

# Include reports if they exist
echo "## Pipeline Reports"
echo ""

for step in research validation plan build review; do
  REPORT="$REPORTS_DIR/$ID/$step.md"
  if [[ -f "$REPORT" ]]; then
    echo "### $step"
    echo ""
    cat "$REPORT"
    echo ""
    echo "---"
    echo ""
  fi
done

echo "## Summary"
echo ""
echo "- **ID:** $ID"
echo "- **Type:** $TYPE"
echo "- **Status:** $STATUS"
echo "- **Implementation Approved:** $IMPL_APPROVED"
echo "- **Total Reports:** $(ls -1 "$REPORTS_DIR/$ID/" 2>/dev/null | wc -l)"
echo "- **Location:** $FILE"
echo "- **Reports Dir:** $REPORTS_DIR/$ID/"
