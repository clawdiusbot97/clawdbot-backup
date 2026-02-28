:#!/bin/bash
# wi-watch.sh - Trigger automático para work-items (polling mode)
# RESTRICCIÓN: Solo ejecuta research/validate/report/index. NUNCA building.
# NUEVO: Verifica clarificación antes de ejecutar cualquier acción.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKITEMS_DIR="$(dirname "$SCRIPT_DIR")"

# Config defaults
INTERVAL_SECONDS=30
ONLY_TYPE=""
ONLY_STATUS="NEW,RESEARCHING"
ACTION="research"
ONE_SHOT=false

# Types que se pueden procesar automáticamente
AUTO_TYPES="idea requirement research blocker risk"

while [[ $# -gt 0 ]]; do
  case $1 in
    --interval-seconds)
      INTERVAL_SECONDS="$2"
      shift 2
      ;;
    --only-type)
      ONLY_TYPE="$2"
      shift 2
      ;;
    --only-status)
      ONLY_STATUS="$2"
      shift 2
      ;;
    --action)
      ACTION="$2"
      shift 2
      ;;
    --one-shot)
      ONE_SHOT=true
      shift
      ;;
    --help|-h)
      echo "wi-watch.sh - Trigger automático para work-items"
      echo ""
      echo "Uso: wi-watch.sh [options]"
      echo ""
      echo "Options:"
      echo "  --interval-seconds N    Intervalo entre polls (default: 30)"
      echo "  --only-type TYPE        Filtrar por type (default: all)"
      echo "  --only-status LIST      Estados a monitorear (default: NEW,RESEARCHING)"
      echo "  --action ACTION         Acción: research|validate|report|index"
      echo "  --one-shot              Ejecutar una vez y salir"
      echo ""
      echo "Restricciones:"
      echo "  - NUNCA ejecuta transiciones a BUILDING"
      echo "  - Solo procesa: $AUTO_TYPES"
      echo "  - SOLO ejecuta si clarification_status=CONFIRMED"
      exit 0
      ;;
    *)
      echo "❌ Opción desconocida: $1"
      exit 1
      ;;
  esac
done

# Validar acción permitida
case $ACTION in
  research|validate|report|index)
    ;;
  build|building|implement)
    echo "🛑 SEGURIDAD: Acción '$ACTION' PROHIBIDA en triggers"
    exit 1
    ;;
  *)
    echo "❌ Acción desconocida: $ACTION"
    exit 1
    ;;
esac

# Archivo para trackear items procesados
PROCESSED_LOG="$WORKITEMS_DIR/.wi-watch-processed"
touch "$PROCESSED_LOG"

is_processed() {
  local item_id="$1"
  local action="$2"
  grep -q "^${item_id}:${action}$" "$PROCESSED_LOG" 2>/dev/null
}

mark_processed() {
  local item_id="$1"
  local action="$2"
  echo "${item_id}:${action}" >> "$PROCESSED_LOG"
}

# NUEVO: Función para verificar clarificación
check_clarification() {
  local file="$1"
  local id="$2"
  
  # Extraer valores de clarificación
  local needs_clarification
  local clarification_status
  needs_clarification=$(grep -m1 "^needs_clarification:" "$file" | sed 's/^needs_clarification:[[:space:]]*//' | tr -d ' ')
  clarification_status=$(grep -m1 "^clarification_status:" "$file" | sed 's/^clarification_status:[[:space:]]*//' | tr -d ' ')
  
  # Si no está confirmado, generar clarification.md
  if [[ "$needs_clarification" != "false" && "$clarification_status" != "CONFIRMED" ]]; then
    return 1  # No confirmado
  fi
  return 0  # Confirmado o no requiere clarificación
}

process_item() {
  local file="$1"
  local action="$2"
  
  local id type status title
  id=$(grep -m1 "^id:" "$file" | sed 's/^id:[[:space:]]*//' | tr -d ' ')
  type=$(grep -m1 "^type:" "$file" | sed 's/^type:[[:space:]]*//' | tr -d ' ')
  status=$(grep -m1 "^status:" "$file" | sed 's/^status:[[:space:]]*//' | tr -d ' ')
  title=$(grep -m1 "^title:" "$file" | sed 's/^title:[[:space:]]*//' | tr -d '"')
  
  echo "$(date '+%H:%M:%S') | Procesando: $id ($type)"
  
  # NUEVO: Verificar clarificación antes de ejecutar cualquier pipeline real
  if ! check_clarification "$file" "$id"; then
    echo "  ⛔ SKIP: awaiting clarification (needs_clarification=true, status!=CONFIRMED)"
    
    # Generar clarification.md si no existe
    if [[ ! -f "$WORKITEMS_DIR/reports/$id/clarification.md" ]]; then
      echo "  📝 Generando Clarification Report..."
      "$SCRIPT_DIR/wi-clarify.sh" --id "$id" 2>&1 | sed 's/^/    /'
    else
      echo "  ⏳ Clarification Report ya existe: reports/$id/clarification.md"
    fi
    
    return 0  # No marcar como procesado, se reintentará
  fi
  
  case $action in
    research)
      if [[ "$type" == "idea" || "$type" == "research" || "$type" == "requirement" ]]; then
        if ! is_processed "$id" "research"; then
          echo "  → wi-pipeline.sh --id $id --step research"
          "$SCRIPT_DIR/wi-pipeline.sh" --id "$id" --step research 2>&1 | sed 's/^/    /'
          mark_processed "$id" "research"
          echo "  ✅ Research iniciado"
        else
          echo "  ⏭️  Ya procesado"
        fi
      fi
      ;;
    validate)
      if [[ "$status" == "RESEARCHED" ]]; then
        if ! is_processed "$id" "validate"; then
          echo "  → wi-pipeline.sh --id $id --step validate"
          "$SCRIPT_DIR/wi-pipeline.sh" --id "$id" --step validate 2>&1 | sed 's/^/    /'
          mark_processed "$id" "validate"
          echo "  ✅ Validación iniciada"
        fi
      fi
      ;;
    report)
      echo "  → wi-report.sh --id $id"
      "$SCRIPT_DIR/wi-report.sh" --id "$id" 2>&1 | sed 's/^/    /'
      ;;
    index)
      ;;
  esac
}

scan_and_process() {
  local action="$1"
  local processed_count=0
  local skipped_count=0
  
  echo "🔍 Scanning... (action: $action)"
  
  IFS=',' read -ra STATUS_ARRAY <<< "$ONLY_STATUS"
  
  local candidates=()
  for dir in "$WORKITEMS_DIR"/inbox "$WORKITEMS_DIR"/active/*/; do
    [[ -d "$dir" ]] || continue
    for file in "$dir"/*.md; do
      [[ -f "$file" ]] || continue
      
      if [[ -n "$ONLY_TYPE" ]]; then
        file_type=$(grep -m1 "^type:" "$file" | sed 's/^type:[[:space:]]*//' | tr -d ' ')
        [[ "$file_type" == "$ONLY_TYPE" ]] || continue
      fi
      
      file_status=$(grep -m1 "^status:" "$file" | sed 's/^status:[[:space:]]*//' | tr -d ' ')
      local status_match=false
      for s in "${STATUS_ARRAY[@]}"; do
        [[ "$file_status" == "$s" ]] && status_match=true && break
      done
      [[ "$status_match" == true ]] || continue
      
      candidates+=("$file")
    done
  done
  
  echo "$(date '+%H:%M:%S') | Encontrados: ${#candidates[@]} items"
  
  for file in "${candidates[@]}"; do
    local id_before
    id_before=$(grep -m1 "^id:" "$file" | sed 's/^id:[[:space:]]*//' | tr -d ' ')
    
    if ! check_clarification "$file" "$id_before"; then
      ((skipped_count++))
    fi
    
    process_item "$file" "$action"
    ((processed_count++))
  done
  
  if [[ "$action" == "index" ]]; then
    "$SCRIPT_DIR/wi-index.sh" --format dashboard 2>&1 | sed 's/^/  /'
  fi
  
  echo "$(date '+%H:%M:%S') | Completado: $processed_count items"
  [[ $skipped_count -gt 0 ]] && echo "                | Skipped (awaiting clarification): $skipped_count items"
}

echo "═══════════════════════════════════════════════════"
echo "  wi-watch.sh - Work-Items Auto-Trigger"
echo "═══════════════════════════════════════════════════"
echo "  Action: $ACTION | Status: $ONLY_STATUS"
[[ "$ONE_SHOT" != true ]] && echo "  Intervalo: ${INTERVAL_SECONDS}s"
echo "═══════════════════════════════════════════════════"
echo ""
echo "⚠️  REGLA: Solo procesa items con clarification_status=CONFIRMED"
echo "   Items sin confirmar generarán clarification.md"
echo ""

if [[ "$ONE_SHOT" == true ]]; then
  scan_and_process "$ACTION"
  echo "✅ One-shot completado"
else
  while true; do
    scan_and_process "$ACTION"
    echo "💤 Durmiendo ${INTERVAL_SECONDS}s..."
    sleep "$INTERVAL_SECONDS"
  done
fi
