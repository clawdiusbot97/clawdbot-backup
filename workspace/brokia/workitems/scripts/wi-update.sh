#!/bin/bash
# wi-update.sh - Actualizar campos de un work-item
# Permite: add/remove tags, set cost_estimate_usd_month, set impact, set effort, append link, set owner

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKITEMS_DIR="$(dirname "$SCRIPT_DIR")"

# Estados y types oficiales
VALID_STATUSES="NEW RESEARCHING RESEARCHED DECIDED PLANNED BUILDING DONE DROPPED"
VALID_TYPES="idea requirement feature blocker decision risk research solution"
VALID_IMPACT="low medium high critical"
VALID_EFFORT="xs s m l xl"
VALID_PRIORITY="p0 p1 p2 p3"

ID=""
ADD_TAG=""
REMOVE_TAG=""
SET_COST=""
SET_IMPACT=""
SET_EFFORT=""
APPEND_LINK=""
SET_OWNER=""
SET_PRIORITY=""

usage() {
  echo "Uso: wi-update.sh --id <ID> [opciones]"
  echo ""
  echo "Opciones:"
  echo "  --add-tag <tag>              Agregar tag al work-item"
  echo "  --remove-tag <tag>           Eliminar tag del work-item"
  echo "  --set-cost <n>               Setear cost_estimate_usd_month (número)"
  echo "  --set-impact <low|medium|high|critical>  Setear impacto"
  echo "  --set-effort <xs|s|m|l|xl>   Setear esfuerzo estimado"
  echo "  --set-owner <owner>          Setear owner"
  echo "  --set-priority <p0|p1|p2|p3> Setear prioridad"
  echo "  --append-link <url>          Agregar link a la sección Links"
  echo ""
  echo "Ejemplo:"
  echo "  wi-update.sh --id IDEA-20260225-001 --add-tag voice --set-cost 500"
  exit 0
}

while [[ $# -gt 0 ]]; do
  case $1 in
    --id)
      ID="$2"
      shift 2
      ;;
    --add-tag)
      ADD_TAG="$2"
      shift 2
      ;;
    --remove-tag)
      REMOVE_TAG="$2"
      shift 2
      ;;
    --set-cost)
      SET_COST="$2"
      shift 2
      ;;
    --set-impact)
      SET_IMPACT="$2"
      shift 2
      ;;
    --set-effort)
      SET_EFFORT="$2"
      shift 2
      ;;
    --set-owner)
      SET_OWNER="$2"
      shift 2
      ;;
    --set-priority)
      SET_PRIORITY="$2"
      shift 2
      ;;
    --append-link)
      APPEND_LINK="$2"
      shift 2
      ;;
    --help|-h)
      usage
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

# Buscar el archivo
FILE=$(find "$WORKITEMS_DIR" -name "$ID.md" -type f 2>/dev/null | head -1)

if [[ -z "$FILE" ]]; then
  echo "❌ Error: No se encontró $ID.md"
  exit 1
fi

echo "📝 Actualizando: $ID"
echo "   Archivo: $FILE"
echo ""

# Función para actualizar timestamp
update_timestamp() {
  local ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  sed -i "/^updated_at:/c\\updated_at: $ts" "$FILE"
}

# Validaciones
if [[ -n "$SET_IMPACT" && ! " $VALID_IMPACT " =~ " $SET_IMPACT " ]]; then
  echo "❌ Error: impacto inválido. Opciones: $VALID_IMPACT"
  exit 1
fi

if [[ -n "$SET_EFFORT" && ! " $VALID_EFFORT " =~ " $SET_EFFORT " ]]; then
  echo "❌ Error: esfuerzo inválido. Opciones: $VALID_EFFORT"
  exit 1
fi

if [[ -n "$SET_PRIORITY" && ! " $VALID_PRIORITY " =~ " $SET_PRIORITY " ]]; then
  echo "❌ Error: prioridad inválida. Opciones: $VALID_PRIORITY"
  exit 1
fi

if [[ -n "$SET_COST" && ! "$SET_COST" =~ ^[0-9]+(\.[0-9]+)?$ ]]; then
  echo "❌ Error: costo debe ser un número positivo"
  exit 1
fi

# Aplicar cambios
CHANGES=0

# Normalizar tags (quitar # si existe)
ADD_TAG=$(echo "$ADD_TAG" | sed 's/^#//')
REMOVE_TAG=$(echo "$REMOVE_TAG" | sed 's/^#//')

# Agregar tag
if [[ -n "$ADD_TAG" ]]; then
  # Verificar si el tag ya existe (con o sin #)
  if grep -qE "^- #?$ADD_TAG$" "$FILE"; then
    echo "⚠️  Tag '$ADD_TAG' ya existe"
  else
    # Encontrar la línea después de "tags:" y agregar el nuevo tag (sin #)
    sed -i "/^tags:/a\\  - $ADD_TAG" "$FILE"
    echo "✅ Tag agregado: $ADD_TAG"
    CHANGES=$((CHANGES + 1))
  fi
fi

# Eliminar tag
if [[ -n "$REMOVE_TAG" ]]; then
  if grep -qE "^- #?$REMOVE_TAG$" "$FILE"; then
    sed -i "/^- #\?$REMOVE_TAG$/d" "$FILE"
    echo "✅ Tag eliminado: $REMOVE_TAG"
    CHANGES=$((CHANGES + 1))
  else
    echo "⚠️  Tag '$REMOVE_TAG' no encontrado"
  fi
fi

# Setear costo
if [[ -n "$SET_COST" ]]; then
  if grep -q "^cost_estimate_usd_month:" "$FILE"; then
    sed -i "/^cost_estimate_usd_month:/c\\cost_estimate_usd_month: $SET_COST" "$FILE"
  else
    # Insertar después de priority
    sed -i "/^priority:/a\\cost_estimate_usd_month: $SET_COST" "$FILE"
  fi
  echo "✅ Costo actualizado: \$${SET_COST} USD/mes"
  CHANGES=$((CHANGES + 1))
fi

# Setear impact
if [[ -n "$SET_IMPACT" ]]; then
  if grep -q "^impact:" "$FILE"; then
    sed -i "/^impact:/c\\impact: $SET_IMPACT" "$FILE"
  else
    sed -i "/^priority:/a\\impact: $SET_IMPACT" "$FILE"
  fi
  echo "✅ Impacto actualizado: $SET_IMPACT"
  CHANGES=$((CHANGES + 1))
fi

# Setear effort
if [[ -n "$SET_EFFORT" ]]; then
  if grep -q "^effort:" "$FILE"; then
    sed -i "/^effort:/c\\effort: $SET_EFFORT" "$FILE"
  else
    sed -i "/^priority:/a\\effort: $SET_EFFORT" "$FILE"
  fi
  echo "✅ Esfuerzo actualizado: $SET_EFFORT"
  CHANGES=$((CHANGES + 1))
fi

# Setear owner
if [[ -n "$SET_OWNER" ]]; then
  sed -i "/^owner:/c\\owner: $SET_OWNER" "$FILE"
  echo "✅ Owner actualizado: $SET_OWNER"
  CHANGES=$((CHANGES + 1))
fi

# Setear priority
if [[ -n "$SET_PRIORITY" ]]; then
  sed -i "/^priority:/c\\priority: $SET_PRIORITY" "$FILE"
  echo "✅ Prioridad actualizada: $SET_PRIORITY"
  CHANGES=$((CHANGES + 1))
fi

# Agregar link
if [[ -n "$APPEND_LINK" ]]; then
  # Verificar si existe sección ## Links
  if ! grep -q "^## Links" "$FILE"; then
    # Crear sección al final del frontmatter (después de la línea con ---)
    sed -i '/^---$/a\\n## Links\n' "$FILE"
  fi
  
  # Agregar el link
  sed -i "/^## Links$/a\\- $APPEND_LINK" "$FILE"
  echo "✅ Link agregado: $APPEND_LINK"
  CHANGES=$((CHANGES + 1))
fi

# Actualizar timestamp si hubo cambios
if [[ $CHANGES -gt 0 ]]; then
  update_timestamp
  echo ""
  echo "🕐 Timestamp actualizado"
fi

echo ""
echo "📊 Resumen: $CHANGES cambio(s) aplicado(s)"
