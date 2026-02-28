#!/bin/bash
# wi-notify.sh - Generar resumen de notificaciones para work-items
# Output: Markdown (para pegar en Telegram/Slack luego)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKITEMS_DIR="$(dirname "$SCRIPT_DIR")"

# Defaults
STALE_DAYS=7
OUTPUT_FORMAT="markdown"

while [[ $# -gt 0 ]]; do
  case $1 in
    --stale-days)
      STALE_DAYS="$2"
      shift 2
      ;;
    --format)
      OUTPUT_FORMAT="$2"
      shift 2
      ;;
    --help|-h)
      echo "wi-notify.sh - Generar resumen de notificaciones"
      echo ""
      echo "Uso: wi-notify.sh [options]"
      echo ""
      echo "Options:"
      echo "  --stale-days N     Items sin update en N días (default: 7)"
      echo "  --format FORMAT    markdown|text (default: markdown)"
      exit 0
      ;;
    *)
      echo "❌ Opción desconocida: $1"
      exit 1
      ;;
  esac
done

# Recolectar todos los items
ITEMS=()
for dir in "$WORKITEMS_DIR"/inbox "$WORKITEMS_DIR"/active/* "$WORKITEMS_DIR"/archive/*; do
  [[ -d "$dir" ]] || continue
  for file in "$dir"/*.md; do
    [[ -f "$file" ]] || continue
    ITEMS+=("$file")
  done
done

# Función: calcular días desde updated_at
days_since_update() {
  local file="$1"
  local updated_str
  updated_str=$(grep -m1 "^updated_at:" "$file" | sed 's/^updated_at:[[:space:]]*//' | tr -d ' ')
  
  if [[ -z "$updated_str" ]]; then
    echo "999"  # Sin fecha = muy viejo
    return
  fi
  
  # Parsear timestamp (formato: 2026-02-25T05:15:00Z)
  local updated_ts
  updated_ts=$(date -d "$updated_str" +%s 2>/dev/null || echo "0")
  local now_ts
  now_ts=$(date +%s)
  
  if [[ "$updated_ts" == "0" ]]; then
    echo "999"
    return
  fi
  
  local diff_days=$(( (now_ts - updated_ts) / 86400 ))
  echo "$diff_days"
}

# Arrays para categorizar
declare -a STALE_ITEMS
declare -a BLOCKED_ITEMS
declare -a TOP_PRIORITY
declare -a SUMMARY

# Analizar cada item
for file in "${ITEMS[@]}"; do
  id=$(grep -m1 "^id:" "$file" | sed 's/^id:[[:space:]]*//' | tr -d ' ')
  type=$(grep -m1 "^type:" "$file" | sed 's/^type:[[:space:]]*//' | tr -d ' ')
  title=$(grep -m1 "^title:" "$file" | sed 's/^title:[[:space:]]*//' | tr -d '"')
  status=$(grep -m1 "^status:" "$file" | sed 's/^status:[[:space:]]*//' | tr -d ' ')
  priority=$(grep -m1 "^priority:" "$file" | sed 's/^priority:[[:space:]]*//' | tr -d ' ')
  impl_approved=$(grep -m1 "^implementation_approved:" "$file" | sed 's/^implementation_approved:[[:space:]]*//' | tr -d ' ')
  
  # Calcular días stale
  days=$(days_since_update "$file")
  
  # Stale items
  if [[ $days -ge $STALE_DAYS && "$status" != "DONE" && "$status" != "DROPPED" ]]; then
    STALE_ITEMS+=("$days|$id|$type|$status|$title")
  fi
  
  # Bloqueados intentando BUILDING sin approved
  if [[ "$type" == "idea" && "$impl_approved" != "true" && "$status" == "PLANNED" ]]; then
    BLOCKED_ITEMS+=("$id|$type|$status|$title")
  fi
  
  # Top priority (p0/p1) activos
  if [[ ("$priority" == "p0" || "$priority" == "p1") && "$status" != "DONE" && "$status" != "DROPPED" ]]; then
    TOP_PRIORITY+=("$priority|$id|$type|$status|$title")
  fi
done

# Sort top priority
IFS=$'\n' sorted_priority=($(sort -t'|' -k1,1 <<<"${TOP_PRIORITY[*]}"))
unset IFS

# Output según formato
case $OUTPUT_FORMAT in
  markdown)
    echo "# 📊 Work-Items Report"
    echo ""
    echo "*Generado: $(date '+%Y-%m-%d %H:%M UTC')*"
    echo ""
    
    # Sección: Stale Items
    echo "## 🐌 Items Stale (> ${STALE_DAYS} días sin update)"
    echo ""
    if [[ ${#STALE_ITEMS[@]} -eq 0 ]]; then
      echo "✅ No hay items stale"
    else
      echo "| Días | ID | Type | Status | Title |"
      echo "|------|------|------|--------|-------|"
      for item in "${STALE_ITEMS[@]}"; do
        IFS='|' read -r d i t s tt <<< "$item"
        echo "| $d | $i | $t | $s | ${tt:0:40} |"
      done
    fi
    echo ""
    
    # Sección: Blocked
    echo "## 🚫 Items Bloqueados (sin implementation_approved)"
    echo ""
    if [[ ${#BLOCKED_ITEMS[@]} -eq 0 ]]; then
      echo "✅ No hay items bloqueados"
    else
      echo "| ID | Type | Status | Title |"
      echo "|------|------|--------|-------|"
      for item in "${BLOCKED_ITEMS[@]}"; do
        IFS='|' read -r i t s tt <<< "$item"
        echo "| $i | $t | $s | ${tt:0:40} |"
      done
      echo ""
      echo "💡 Para aprobar: escribir 'APROBAR IMPLEMENTACIÓN' o 'HACER MVP'"
    fi
    echo ""
    
    # Sección: Top Priority
    echo "## 🔥 Top Priority (p0/p1)"
    echo ""
    if [[ ${#sorted_priority[@]} -eq 0 ]]; then
      echo "ℹ️  No hay items p0/p1 activos"
    else
      echo "| Priority | ID | Type | Status | Title |"
      echo "|----------|------|------|--------|-------|"
      count=0
      for item in "${sorted_priority[@]}"; do
        [[ $count -ge 10 ]] && break
        IFS='|' read -r p i t s tt <<< "$item"
        echo "| $p | $i | $t | $s | ${tt:0:35} |"
        ((count++))
      done
    fi
    echo ""
    
    # Resumen
    total_active=0
    for file in "${ITEMS[@]}"; do
      s=$(grep -m1 "^status:" "$file" | sed 's/^status:[[:space:]]*//' | tr -d ' ')
      [[ "$s" != "DONE" && "$s" != "DROPPED" ]] && ((total_active++))
    done
    
    echo "## 📈 Resumen"
    echo ""
    echo "- **Total items:** ${#ITEMS[@]}"
    echo "- **Activos:** $total_active"
    echo "- **Stale:** ${#STALE_ITEMS[@]}"
    echo "- **Bloqueados:** ${#BLOCKED_ITEMS[@]}"
    echo "- **Top p0/p1:** ${#sorted_priority[@]}"
    ;;
    
  text)
    echo "WORK-ITEMS REPORT - $(date '+%Y-%m-%d %H:%M UTC')"
    echo "================================================"
    echo ""
    echo "STALE ITEMS (> ${STALE_DAYS} días):"
    if [[ ${#STALE_ITEMS[@]} -eq 0 ]]; then
      echo "  No hay items stale"
    else
      for item in "${STALE_ITEMS[@]}"; do
        IFS='|' read -r d i t s tt <<< "$item"
        printf "  [%3d días] %s | %s | %s | %.40s\n" "$d" "$i" "$t" "$s" "$tt"
      done
    fi
    echo ""
    echo "BLOCKED (sin approved):"
    if [[ ${#BLOCKED_ITEMS[@]} -eq 0 ]]; then
      echo "  No hay items bloqueados"
    else
      for item in "${BLOCKED_ITEMS[@]}"; do
        IFS='|' read -r i t s tt <<< "$item"
        printf "  %s | %s | %s | %.40s\n" "$i" "$t" "$s" "$tt"
      done
    fi
    echo ""
    echo "TOP PRIORITY (p0/p1):"
    if [[ ${#sorted_priority[@]} -eq 0 ]]; then
      echo "  No hay items p0/p1"
    else
      count=0
      for item in "${sorted_priority[@]}"; do
        [[ $count -ge 10 ]] && break
        IFS='|' read -r p i t s tt <<< "$item"
        printf "  [%s] %s | %s | %s | %.35s\n" "$p" "$i" "$t" "$s" "$tt"
        ((count++))
      done
    fi
    ;;
esac

echo ""
echo "---"
echo "Para reportes completos: ./scripts/wi-index.sh --format dashboard"
