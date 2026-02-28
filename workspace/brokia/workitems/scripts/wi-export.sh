#!/bin/bash
# wi-export.sh - Generar workitems.json canónico para UI/Mission Control
# Incluye agregados: counts por status/type + suma cost_estimate_usd_month
# Flags: --out <path> | --stdout

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKITEMS_DIR="$(dirname "$SCRIPT_DIR")"
INDEX_DIR="$WORKITEMS_DIR/index"
REPORTS_DIR="$WORKITEMS_DIR/reports"

DEFAULT_OUTPUT="$INDEX_DIR/workitems.json"
OUTPUT=""
USE_STDOUT=false

# Estados y types oficiales
VALID_STATUSES="NEW RESEARCHING RESEARCHED DECIDED PLANNED BUILDING DONE DROPPED"
VALID_TYPES="idea requirement feature blocker decision risk research solution"

# Parsear argumentos
while [[ $# -gt 0 ]]; do
  case $1 in
    --out)
      OUTPUT="$2"
      shift 2
      ;;
    --stdout)
      USE_STDOUT=true
      shift
      ;;
    --help|-h)
      echo "Uso: wi-export.sh [opciones]"
      echo ""
      echo "Opciones:"
      echo "  --out <path>     Escribir JSON a <path> (default: index/workitems.json)"
      echo "  --stdout         Escribir JSON a stdout"
      echo "  --help           Mostrar esta ayuda"
      echo ""
      echo "Ejemplos:"
      echo "  wi-export.sh                    # Escribe a index/workitems.json"
      echo "  wi-export.sh --stdout           # Escribe a stdout"
      echo "  wi-export.sh --out /tmp/wi.json # Escribe a /tmp/wi.json"
      exit 0
      ;;
    *)
      echo "❌ Opción desconocida: $1"
      exit 1
      ;;
  esac
done

# Determinar output
if [[ "$USE_STDOUT" == true ]]; then
  OUTPUT="/dev/stdout"
elif [[ -z "$OUTPUT" ]]; then
  OUTPUT="$DEFAULT_OUTPUT"
fi

# Crear directorio si es necesario
if [[ "$OUTPUT" != "/dev/stdout" ]]; then
  mkdir -p "$(dirname "$OUTPUT")"
fi

# Función para extraer valor YAML del frontmatter
extract_yaml() {
  local file="$1"
  local key="$2"
  grep -m1 "^$key:" "$file" 2>/dev/null | sed 's/^[^:]*:[[:space:]]*//' | tr -d '"' | sed 's/[[:space:]]*$//'
}

# Función para extraer array YAML (tags) - normalizado sin #
extract_yaml_array() {
  local file="$1"
  local key="$2"
  # Extrae tags y normaliza (sin #)
  awk "/^$key:/{flag=1; next} /^[a-z]/ && flag{flag=0} flag && /^  - /{print substr(\$0, 5)}" "$file" 2>/dev/null | sed 's/^#//' | tr '\n' ',' | sed 's/,$//' | sed 's/,/", "/g' | sed 's/^/"/;s/$/"/' | sed 's/""//g'
}

# Función para escapar JSON
json_escape() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g; s/\t/\\t/g; s/\n/\\n/g'
}

# Función para calcular allowed_actions basado en estado y guardrails
calculate_allowed_actions() {
  local type="$1"
  local status="$2"
  local needs_clarification="$3"
  local clarification_status="$4"
  local impl_approved="$5"
  
  local actions='"view","export"'
  
  # Si necesita clarificación y no está confirmada, solo clarify y confirm
  if [[ "$needs_clarification" == "true" && "$clarification_status" != "CONFIRMED" ]]; then
    echo '["clarify","confirm"]'
    return
  fi
  
  # Actions según estado
  case "$status" in
    NEW)
      actions="$actions,\"clarify\",\"move\""
      ;;
    RESEARCHING)
      actions="$actions,\"research\",\"validate\",\"move\",\"update\""
      ;;
    RESEARCHED)
      actions="$actions,\"validate\",\"plan\",\"move\",\"update\""
      ;;
    DECIDED)
      actions="$actions,\"plan\",\"move\",\"update\""
      ;;
    PLANNED)
      actions="$actions,\"build\",\"move\",\"update\""
      ;;
    BUILDING)
      actions="$actions,\"review\",\"move\",\"update\""
      ;;
    DONE|DROPPED)
      actions="$actions,\"reopen\""
      ;;
  esac
  
  # Guardrail: idea/research sin implementation_approved NO pueden build
  if [[ ("$type" == "idea" || "$type" == "research") && "$impl_approved" != "true" ]]; then
    # Remover build de actions
    actions=$(echo "$actions" | sed 's/,\"build\"//g')
  fi
  
  # Siempre permitir update (tags, metadata)
  if [[ "$actions" != *"update"* ]]; then
    actions="$actions,\"update\""
  fi
  
  echo "[$actions]"
}

# Collect all work-items
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

# Inicializar contadores
declare -A count_by_status
declare -A count_by_type
for s in $VALID_STATUSES; do count_by_status[$s]=0; done
for t in $VALID_TYPES; do count_by_type[$t]=0; done

TOTAL_COST=0

# Generar JSON
{
echo "{"
echo "  \"generated_at\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\","
echo "  \"version\": \"1.0\","
echo "  \"total_items\": ${#ITEMS[@]},"
echo "  \"items\": ["

FIRST_ITEM=true
for file in "${ITEMS[@]}"; do
  [[ -f "$file" ]] || continue
  
  ID=$(extract_yaml "$file" "id")
  TYPE=$(extract_yaml "$file" "type")
  TITLE=$(extract_yaml "$file" "title")
  STATUS=$(extract_yaml "$file" "status")
  OWNER=$(extract_yaml "$file" "owner")
  PRIORITY=$(extract_yaml "$file" "priority")
  COST=$(extract_yaml "$file" "cost_estimate_usd_month")
  IMPACT=$(extract_yaml "$file" "impact")
  EFFORT=$(extract_yaml "$file" "effort")
  CREATED=$(extract_yaml "$file" "created_at")
  UPDATED=$(extract_yaml "$file" "updated_at")
  DESCRIPTION=$(extract_yaml "$file" "description")
  
  # Campos de guardrails
  NEEDS_CLARIFICATION=$(extract_yaml "$file" "needs_clarification")
  CLARIFICATION_STATUS=$(extract_yaml "$file" "clarification_status")
  IMPL_APPROVED=$(extract_yaml "$file" "implementation_approved")
  
  # Extraer tags como array (normalizado sin #)
  TAGS=$(extract_yaml_array "$file" "tags")
  [[ -z "$TAGS" ]] && TAGS='[]' || TAGS="[$TAGS]"
  
  # Contar para agregados
  [[ -n "$STATUS" ]] && count_by_status[$STATUS]=$((${count_by_status[$STATUS]:-0} + 1))
  [[ -n "$TYPE" ]] && count_by_type[$TYPE]=$((${count_by_type[$TYPE]:-0} + 1))
  
  # Sumar costo
  if [[ -n "$COST" && "$COST" =~ ^[0-9]+(\.[0-9]+)?$ ]]; then
    TOTAL_COST=$(echo "$TOTAL_COST + $COST" | bc -l 2>/dev/null || echo "$TOTAL_COST")
  fi
  
  # Path relativo
  REL_PATH=$(realpath --relative-to="$WORKITEMS_DIR" "$file" 2>/dev/null || echo "$file")
  
  # Verificar reportes existentes
  HAS_TECH_REPORT=false
  HAS_COST_REPORT=false
  HAS_PRODUCT_REPORT=false
  HAS_ARCH_REPORT=false
  HAS_CLARIFICATION_REPORT=false
  [[ -f "$REPORTS_DIR/$ID/tech.md" ]] && HAS_TECH_REPORT=true
  [[ -f "$REPORTS_DIR/$ID/cost.md" ]] && HAS_COST_REPORT=true
  [[ -f "$REPORTS_DIR/$ID/product.md" ]] && HAS_PRODUCT_REPORT=true
  [[ -f "$REPORTS_DIR/$ID/arch.md" ]] && HAS_ARCH_REPORT=true
  [[ -f "$REPORTS_DIR/$ID/clarification.md" ]] && HAS_CLARIFICATION_REPORT=true
  
  # Calcular allowed_actions
  ALLOWED_ACTIONS=$(calculate_allowed_actions "$TYPE" "$STATUS" "$NEEDS_CLARIFICATION" "$CLARIFICATION_STATUS" "$IMPL_APPROVED")
  
  # Output item
  if [[ "$FIRST_ITEM" == true ]]; then
    FIRST_ITEM=false
  else
    echo ","
  fi
  
  # Generar item JSON completo
  COST_VAL=$(echo "$COST" | grep -E '^[0-9]+(\.[0-9]+)?$' || echo "null")
  
  echo "  {"
  echo "    \"id\": \"$(json_escape "$ID")\","
  echo "    \"type\": \"$(json_escape "$TYPE")\","
  echo "    \"title\": \"$(json_escape "$TITLE")\","
  echo "    \"description\": \"$(json_escape "$DESCRIPTION")\","
  echo "    \"status\": \"$(json_escape "$STATUS")\","
  echo "    \"owner\": \"$(json_escape "$OWNER")\","
  echo "    \"priority\": \"$(json_escape "$PRIORITY")\","
  echo "    \"tags\": $TAGS,"
  echo "    \"cost_estimate_usd_month\": $COST_VAL,"
  echo "    \"impact\": \"$(json_escape "$IMPACT")\","
  echo "    \"effort\": \"$(json_escape "$EFFORT")\","
  echo "    \"needs_clarification\": ${NEEDS_CLARIFICATION:-false},"
  echo "    \"clarification_status\": \"$(json_escape "${CLARIFICATION_STATUS:-N/A}")\","
  echo "    \"implementation_approved\": ${IMPL_APPROVED:-false},"
  echo "    \"created_at\": \"$(json_escape "$CREATED")\","
  echo "    \"updated_at\": \"$(json_escape "$UPDATED")\","
  echo "    \"path\": \"$(json_escape "$REL_PATH")\","
  echo "    \"allowed_actions\": $ALLOWED_ACTIONS,"
  echo "    \"reports\": {"
  echo "      \"clarification\": $HAS_CLARIFICATION_REPORT,"
  echo "      \"tech\": $HAS_TECH_REPORT,"
  echo "      \"cost\": $HAS_COST_REPORT,"
  echo "      \"product\": $HAS_PRODUCT_REPORT,"
  echo "      \"arch\": $HAS_ARCH_REPORT"
  echo -n "    }"
  echo "  }"
done

echo ""
echo "  ],"

# Agregados por status
echo "  \"counts_by_status\": {"
FIRST=true
for s in $VALID_STATUSES; do
  [[ "$FIRST" == true ]] && FIRST=false || echo ","
  echo -n "    \"$s\": ${count_by_status[$s]:-0}"
done
echo ""
echo "  },"

# Agregados por type
echo "  \"counts_by_type\": {"
FIRST=true
for t in $VALID_TYPES; do
  [[ "$FIRST" == true ]] && FIRST=false || echo ","
  echo -n "    \"$t\": ${count_by_type[$t]:-0}"
done
echo ""
echo "  },"

# Total cost
echo "  \"total_cost_estimate_usd_month\": ${TOTAL_COST:-0}"
echo "}"
} > "$OUTPUT"

if [[ "$OUTPUT" != "/dev/stdout" ]]; then
  echo "✅ Export completado: $OUTPUT"
  echo "   Items: ${#ITEMS[@]}"
  echo "   Total cost: \$${TOTAL_COST:-0} USD/mes"
fi
