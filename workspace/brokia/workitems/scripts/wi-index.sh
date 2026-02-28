#!/bin/bash
# wi-index.sh - Listar e indexar work-items (spec-compliant)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKITEMS_DIR="$(dirname "$SCRIPT_DIR")"

# Estados oficiales (8)
VALID_STATUSES="NEW RESEARCHING RESEARCHED DECIDED PLANNED BUILDING DONE DROPPED"
VALID_TYPES="idea requirement feature blocker decision risk research solution"

# Defaults
STATUS=""
TYPE=""
OWNER=""
TAG=""
FORMAT="list"

while [[ $# -gt 0 ]]; do
  case $1 in
    --status)
      STATUS="$2"
      if [[ ! " $VALID_STATUSES " =~ " $STATUS " ]]; then
        echo "⚠️  Advertencia: Status '$STATUS' no está en la lista oficial"
        echo "   Estados válidos: $VALID_STATUSES"
      fi
      shift 2
      ;;
    --type)
      TYPE="$2"
      shift 2
      ;;
    --owner)
      OWNER="$2"
      shift 2
      ;;
    --tag)
      TAG="$2"
      shift 2
      ;;
    --format)
      FORMAT="$2"
      shift 2
      ;;
    --help|-h)
      echo "Uso: wi-index.sh [options]"
      echo ""
      echo "Filters:"
      echo "  --status <status>  ($VALID_STATUSES)"
      echo "  --type <type>      ($VALID_TYPES)"
      echo "  --owner <owner>    (brokia|researcher|builder|chief)"
      echo "  --tag <tag>        Filtrar por tag"
      echo ""
      echo "Formats:"
      echo "  --format list      Lista simple (default)"
      echo "  --format table     Tabla markdown"
      echo "  --format dashboard Mission Control Center"
      exit 0
      ;;
    *)
      echo "❌ Opción desconocida: $1"
      exit 1
      ;;
  esac
done

# Collect all work-items de carpetas válidas
ITEMS=()
for dir in "$WORKITEMS_DIR"/inbox \
         "$WORKITEMS_DIR"/active/researching \
         "$WORKITEMS_DIR"/active/researched \
         "$WORKITEMS_DIR"/active/decided \
         "$WORKITEMS_DIR"/active/planned \
         "$WORKITEMS_DIR"/active/building \
         "$WORKITEMS_DIR"/archive/done \
         "$WORKITEMS_DIR"/archive/dropped; do
  [[ -d "$dir" ]] || continue
  for file in "$dir"/*.md; do
    [[ -f "$file" ]] || continue
    ITEMS+=("$file")
  done
done

# Filter function
filter_item() {
  local file="$1"
  
  [[ -n "$STATUS" ]] && ! grep -q "status:[[:space:]]*$STATUS" "$file" && return 1
  [[ -n "$TYPE" ]] && ! grep -q "type:[[:space:]]*$TYPE" "$file" && return 1
  [[ -n "$OWNER" ]] && ! grep -q "owner:[[:space:]]*$OWNER" "$file" && return 1
  [[ -n "$TAG" ]] && ! grep -q "- $TAG" "$file" && return 1
  
  return 0
}

# Output based on format
case $FORMAT in
  list)
    echo "=== Work-Items ==="
    for file in "${ITEMS[@]}"; do
      filter_item "$file" || continue
      id=$(grep -m1 "^id:" "$file" | sed 's/^id:[[:space:]]*//' | tr -d ' ')
      type=$(grep -m1 "^type:" "$file" | sed 's/^type:[[:space:]]*//' | tr -d ' ')
      title=$(grep -m1 "^title:" "$file" | sed 's/^title:[[:space:]]*//' | tr -d '"')
      status=$(grep -m1 "^status:" "$file" | sed 's/^status:[[:space:]]*//' | tr -d ' ')
      printf "%-20s %-12s %-12s %s\n" "$id" "$type" "$status" "$title"
    done
    ;;
  table)
    printf "| %-20s | %-12s | %-12s | %-10s | %-8s | %-25s |\n" "ID" "Type" "Status" "Owner" "Priority" "Title"
    echo "|----------------------|--------------|--------------|----------|----------|---------------------------|"
    for file in "${ITEMS[@]}"; do
      filter_item "$file" || continue
      id=$(grep -m1 "^id:" "$file" | sed 's/^id:[[:space:]]*//' | tr -d ' ')
      type=$(grep -m1 "^type:" "$file" | sed 's/^type:[[:space:]]*//' | tr -d ' ')
      title=$(grep -m1 "^title:" "$file" | sed 's/^title:[[:space:]]*//' | tr -d '"')
      status=$(grep -m1 "^status:" "$file" | sed 's/^status:[[:space:]]*//' | tr -d ' ')
      owner=$(grep -m1 "^owner:" "$file" | sed 's/^owner:[[:space:]]*//' | tr -d ' ')
      priority=$(grep -m1 "^priority:" "$file" | sed 's/^priority:[[:space:]]*//' | tr -d ' ')
      printf "| %-20s | %-12s | %-12s | %-8s | %-8s | %-25s |\n" "$id" "$type" "$status" "$owner" "$priority" "$(echo "$title" | cut -c1-25)"
    done
    ;;
  dashboard)
    echo "╔════════════════════════════════════════════════╗"
    echo "║    🎯 BROkIA MISSION CONTROL CENTER           ║"
    echo "╚════════════════════════════════════════════════╝"
    echo ""
    echo "📊 RESUMEN POR STATUS"
    echo "---------------------"
    for s in NEW RESEARCHING RESEARCHED DECIDED PLANNED BUILDING DONE DROPPED; do
      count=0
      for f in "${ITEMS[@]}"; do
        if grep -q "status:[[:space:]]*$s" "$f" 2>/dev/null; then
          count=$((count + 1))
        fi
      done
      printf "  %-15s: %3d\n" "$s" "$count"
    done
    echo ""
    echo "📊 RESUMEN POR TYPE"
    echo "-------------------"
    for t in idea requirement feature blocker decision risk research solution; do
      count=0
      for f in "${ITEMS[@]}"; do
        if grep -q "type:[[:space:]]*$t" "$f" 2>/dev/null; then
          count=$((count + 1))
        fi
      done
      printf "  %-12s: %3d\n" "$t" "$count"
    done
    echo ""
    echo "📊 ITEMS ACTIVOS (no DONE/DROPPED)"
    echo "-----------------------------------"
    for file in "${ITEMS[@]}"; do
      if grep -q "status:[[:space:]]*DONE\|status:[[:space:]]*DROPPED" "$file"; then
        continue
      fi
      id=$(grep -m1 "^id:" "$file" | sed 's/^id:[[:space:]]*//' | tr -d ' ')
      type=$(grep -m1 "^type:" "$file" | sed 's/^type:[[:space:]]*//' | tr -d ' ')
      title=$(grep -m1 "^title:" "$file" | sed 's/^title:[[:space:]]*//' | tr -d '"')
      status=$(grep -m1 "^status:" "$file" | sed 's/^status:[[:space:]]*//' | tr -d ' ')
      printf "  %-20s | %-10s | %-12s | %s\n" "$id" "$type" "$status" "$(echo "$title" | cut -c1-30)"
    done
    ;;
  *)
    echo "❌ Formato desconocido: $FORMAT"
    exit 1
    ;;
esac
