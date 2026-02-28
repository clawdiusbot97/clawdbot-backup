#!/bin/bash
# wi-guard.sh - Validar reglas de guarda (spec-compliant)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKITEMS_DIR="$(dirname "$SCRIPT_DIR")"

VALID_TYPES="idea requirement feature blocker decision risk research solution"
VALID_STATUSES="NEW RESEARCHING RESEARCHED DECIDED PLANNED BUILDING DONE DROPPED"

ID=""
ACTION=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --id)
      ID="$2"
      shift 2
      ;;
    --action)
      ACTION="$2"
      shift 2
      ;;
    --help|-h)
      echo "Uso: wi-guard.sh --id <TYPE-YYYYMMDD-NNN> --action <action>"
      echo ""
      echo "Actions:"
      echo "  check          → Validar compliance con spec"
      echo "  can-build      → Verificar si puede pasar a BUILDING"
      echo "  can-approve    → Verificar si puede aprobarse para implementación"
      echo "  delete         → Chequeo pre-eliminación"
      exit 0
      ;;
    *)
      echo "❌ Opción desconocida: $1"
      exit 1
      ;;
  esac
done

if [[ -z "$ID" || -z "$ACTION" ]]; then
  echo "❌ Error: --id y --action requeridos"
  exit 1
fi

FILE=$(find "$WORKITEMS_DIR" -name "$ID.md" -type f 2>/dev/null | head -1)
[[ -z "$FILE" ]] && { echo "❌ No encontrado: $ID"; exit 1; }

# Extraer metadata
TYPE=$(grep -m1 "^type:" "$FILE" | sed 's/^type:[[:space:]]*//' | tr -d ' ')
STATUS=$(grep -m1 "^status:" "$FILE" | sed 's/^status:[[:space:]]*//' | tr -d ' ')
IMPL_APPROVED=$(grep -m1 "^implementation_approved:" "$FILE" | sed 's/^implementation_approved:[[:space:]]*//' | tr -d ' ')
ITEM_ID=$(grep -m1 "^id:" "$FILE" | sed 's/^id:[[:space:]]*//' | tr -d ' ')

echo "🔒 GUARDRAIL CHECK: $ID"
echo "   ID: $ITEM_ID"
echo "   Type: $TYPE"
echo "   Status: $STATUS"
echo "   Implementation Approved: $IMPL_APPROVED"
echo ""

case $ACTION in
  check)
    ERRORS=0
    
    # Check 1: Type válido
    if [[ ! " $VALID_TYPES " =~ " $TYPE " ]]; then
      echo "❌ Type inválido: '$TYPE'"
      echo "   Válidos: $VALID_TYPES"
      ((ERRORS++))
    else
      echo "✅ Type válido: $TYPE"
    fi
    
    # Check 2: Status válido
    if [[ ! " $VALID_STATUSES " =~ " $STATUS " ]]; then
      echo "❌ Status inválido: '$STATUS'"
      echo "   Válidos: $VALID_STATUSES"
      ((ERRORS++))
    else
      echo "✅ Status válido: $STATUS"
    fi
    
    # Check 3: ID format correcto
    if [[ ! "$ITEM_ID" =~ ^[A-Z]+-[0-9]{8}-[0-9]{3}$ ]]; then
      echo "⚠️  ID format no estándar: '$ITEM_ID'"
      echo "   Esperado: TYPE-YYYYMMDD-NNN"
    else
      echo "✅ ID format válido: $ITEM_ID"
    fi
    
    # Check 4: implementation_approved existe
    if [[ -z "$IMPL_APPROVED" ]]; then
      echo "❌ Falta campo: implementation_approved"
      ((ERRORS++))
    else
      echo "✅ implementation_approved: $IMPL_APPROVED"
    fi
    
    echo ""
    if [[ $ERRORS -eq 0 ]]; then
      echo "✅ TODOS LOS CHECKS PASARON"
    else
      echo "❌ $ERRORS errores encontrados"
      exit 1
    fi
    ;;
    
  can-build)
    echo "Verificando si puede pasar a BUILDING..."
    echo ""
    
    # Regla CRÍTICA: idea/research requieren implementation_approved
    if [[ "$TYPE" == "idea" || "$TYPE" == "research" ]]; then
      if [[ "$IMPL_APPROVED" != "true" ]]; then
        echo "🛑 BLOQUEADO"
        echo ""
        echo "Type '$TYPE' requiere aprobación explícita para BUILDING."
        echo ""
        echo "Para habilitar:"
        echo "  1. Usuario escribe: 'APROBAR IMPLEMENTACIÓN' o 'HACER MVP'"
        echo "  2. Ejecutar: wi-approve.sh --id $ID"
        echo ""
        exit 1
      fi
    fi
    
    echo "✅ PUEDE PASAR A BUILDING"
    ;;
    
  can-approve)
    echo "Verificando si puede aprobarse para implementación..."
    echo ""
    
    # Debe tener validation report
    if [[ ! -f "$WORKITEMS_DIR/reports/$ID/validation.md" ]]; then
      echo "⚠️  No existe validation.md"
      echo "   Se recomienda ejecutar: wi-pipeline.sh --id $ID --step validate"
    else
      echo "✅ Existe validation.md"
    fi
    
    # Debe estar en estado RESEARCHED o similar
    if [[ "$STATUS" != "RESEARCHED" && "$STATUS" != "DECIDED" ]]; then
      echo "⚠️  Status actual '$STATUS' no es ideal para aprobación"
      echo "   Recomendado: RESEARCHED o DECIDED"
    else
      echo "✅ Status apropiado: $STATUS"
    fi
    
    echo ""
    echo "✅ Listo para aprobación (si usuario lo solicita)"
    ;;
    
  delete)
    echo "🛑 ACCIÓN DESTRUCTIVA: Eliminación de work-item"
    echo ""
    echo "Alternativas recomendadas:"
    echo "  1. Mover a DROPPED: wi-move.sh --id $ID --to DROPPED"
    echo "  2. Archivar con nota de cierre"
    echo ""
    echo "Si REALMENTE necesitas eliminar:"
    echo "  rm $FILE"
    exit 2
    ;;
    
  *)
    echo "❌ Action desconocida: $ACTION"
    echo "   Válidas: check, can-build, can-approve, delete"
    exit 1
    ;;
esac
