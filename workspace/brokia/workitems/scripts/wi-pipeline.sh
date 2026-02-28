#!/bin/bash
# wi-pipeline.sh - Ejecutar pipeline step (spec-compliant)
# Steps permitidos: research, validation, planning, building, review

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKITEMS_DIR="$(dirname "$SCRIPT_DIR")"
REPORTS_DIR="$WORKITEMS_DIR/reports"

# Estados oficiales para validación
VALID_STATUSES="NEW RESEARCHING RESEARCHED DECIDED PLANNED BUILDING DONE DROPPED"
VALID_TYPES="idea requirement feature blocker decision risk research solution"

ID=""
STEP=""
AGENT=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --id)
      ID="$2"
      shift 2
      ;;
    --step)
      STEP="$2"
      shift 2
      ;;
    --agent)
      AGENT="$2"
      shift 2
      ;;
    --help|-h)
      echo "Uso: wi-pipeline.sh --id <TYPE-YYYYMMDD-NNN> --step <step> [--agent <agent>]"
      echo ""
      echo "Steps disponibles:"
      echo "  clarify    → Solicitar clarificación al jefe (→ ASKED)"
      echo "  research   → Investigar/analizar (→ RESEARCHING/RESEARCHED)"
      echo "  validate   → Validar con stakeholders (→ RESEARCHED/DECIDED)"
      echo "  plan       → Planificar implementación (→ PLANNED)"
      echo "  build      → Implementar (→ BUILDING)"
      echo "  review     → Revisar/QA (→ DONE/DROPPED)"
      echo ""
      echo "Nota: El step 'clarify' es obligatorio primero si needs_clarification=true"
      exit 0
      ;;
    *)
      echo "❌ Opción desconocida: $1"
      exit 1
      ;;
  esac
done

if [[ -z "$ID" || -z "$STEP" ]]; then
  echo "❌ Error: --id y --step son requeridos"
  exit 1
fi

# Find the file
FILE=$(find "$WORKITEMS_DIR" -name "$ID.md" -type f 2>/dev/null | head -1)

if [[ -z "$FILE" ]]; then
  echo "❌ Error: No se encontró $ID.md"
  exit 1
fi

# Get current metadata
TYPE=$(grep -m1 "^type:" "$FILE" | sed 's/^type:[[:space:]]*//' | tr -d ' ')
TITLE=$(grep -m1 "^title:" "$FILE" | sed 's/^title:[[:space:]]*//' | tr -d '"')
STATUS=$(grep -m1 "^status:" "$FILE" | sed 's/^status:[[:space:]]*//' | tr -d ' ')
IMPL_APPROVED=$(grep -m1 "^implementation_approved:" "$FILE" | sed 's/^implementation_approved:[[:space:]]*//' | tr -d ' ')

# Leer campos de clarificación
NEEDS_CLARIFICATION=$(grep -m1 "^needs_clarification:" "$FILE" | sed 's/^needs_clarification:[[:space:]]*//' | tr -d ' ')
CLARIFICATION_STATUS=$(grep -m1 "^clarification_status:" "$FILE" | sed 's/^clarification_status:[[:space:]]*//' | tr -d ' ')

echo "🔧 Pipeline Step: $STEP"
echo "   Item: $ID ($TYPE)"
echo "   Title: $TITLE"
echo "   Current Status: $STATUS"
echo "   implementation_approved: ${IMPL_APPROVED:-false}"
echo "   needs_clarification: ${NEEDS_CLARIFICATION:-false}"
echo "   clarification_status: ${CLARIFICATION_STATUS:-N/A}"
[[ -n "$AGENT" ]] && echo "   Agent: $AGENT"
echo ""

# Create report directory
mkdir -p "$REPORTS_DIR/$ID"

# 🛡️ GUARDRAIL: Clarification Layer
# Si necesita clarificación y no está confirmada, solo "clarify" está permitido

if [[ "$NEEDS_CLARIFICATION" == "true" && "$CLARIFICATION_STATUS" != "CONFIRMED" ]]; then
  if [[ "$STEP" != "clarify" ]]; then
    echo "🛑 BLOCKED: awaiting clarification confirmation"
    echo ""
    echo "Este item requiere clarificación antes de proceder con '$STEP'."
    echo "Estado actual: needs_clarification=true, clarification_status=$CLARIFICATION_STATUS"
    echo ""
    echo "Para desbloquear:"
    echo "   ./scripts/wi-pipeline.sh --id $ID --step clarify"
    echo ""
    exit 1
  fi
fi

# Execute pipeline step
case $STEP in
  research)
    # 🏷️ TAG TRIGGERS: Detectar tags relevantes para triggers (normalizado sin #)
    TAGS=$(grep "^- " "$FILE" 2>/dev/null | sed 's/^- //' | sed 's/^#//' | tr '\n' ' ')
    
    echo "🏷️  Tags detectados: $TAGS"
    echo ""
    
    # Generar 4 reportes por rol usando templates
    TEMPLATES_DIR="$WORKITEMS_DIR/templates/reports"
    TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M UTC")
    
    for ROLE in tech cost product arch; do
      REPORT_FILE="$REPORTS_DIR/$ID/$ROLE.md"
      TEMPLATE="$TEMPLATES_DIR/$ROLE.md"
      
      if [[ -f "$TEMPLATE" ]]; then
        # Copiar template y reemplazar variables
        sed -e "s/{{ID}}/$ID/g" \
            -e "s/{{TYPE}}/$TYPE/g" \
            -e "s/{{TITLE}}/$TITLE/g" \
            -e "s/{{TIMESTAMP}}/$TIMESTAMP/g" \
            -e "s|{{FILE}}|$FILE|g" \
            "$TEMPLATE" > "$REPORT_FILE"
        echo "✅ Reporte $ROLE creado: $REPORT_FILE"
      else
        echo "⚠️  Template no encontrado: $TEMPLATE"
      fi
    done
    
    # 🏷️ TAG TRIGGERS: Ejecutar acciones basadas en tags
    echo ""
    echo "🏷️  Evaluando Tag Triggers..."
    
    # Trigger: voice → Notificar sobre consideraciones de voz
    if echo "$TAGS" | grep -qw "voice"; then
      echo "   🔊 TRIGGER: Tag 'voice' detectado"
      echo "      → Considerar: Integración con WhatsApp Business API"
      echo "      → Considerar: Text-to-Speech para respuestas"
      echo "      → Revisar compliance de grabaciones"
    fi
    
    # Trigger: whatsapp → Alertar sobre integración
    if echo "$TAGS" | grep -qw "whatsapp"; then
      echo "   💬 TRIGGER: Tag 'whatsapp' detectado"
      echo "      → Requerir: Meta Business Verification"
      echo "      → Considerar: plantillas de mensajes aprobadas"
      echo "      → Evaluar: costo por conversación"
    fi
    
    # Trigger: security → Activar revisión de seguridad
    if echo "$TAGS" | grep -qw "security"; then
      echo "   🔒 TRIGGER: Tag 'security' detectado"
      echo "      → Requerir: Security Review antes de BUILDING"
      echo "      → Generar: Threat Model"
      echo "      → Verificar: Compliance (PCI/SOX/etc)"
    fi
    
    # Trigger: cost → Agregar análisis de costo obligatorio
    if echo "$TAGS" | grep -qw "cost"; then
      echo "   💰 TRIGGER: Tag 'cost' detectado"
      echo "      → Requerir: cost_estimate_usd_month en frontmatter"
      echo "      → Validar: ROI positivo antes de aprobación"
    fi
    
    # Trigger: ai → Consideraciones de ML/AI
    if echo "$TAGS" | grep -qw "ai"; then
      echo "   🤖 TRIGGER: Tag 'ai' detectado"
      echo "      → Evaluar: Costo de API (OpenAI/etc)"
      echo "      → Considerar: Data privacy y retención"
      echo "      → Planear: Fallback si AI no responde"
    fi
    
    # Trigger: urgent → Escalar prioridad
    if echo "$TAGS" | grep -qw "urgent"; then
      echo "   🚨 TRIGGER: Tag 'urgent' detectado"
      echo "      → Notificar: Owner y stakeholders"
      echo "      → Considerar: Daily standup dedicado"
    fi
    
    echo ""
    
    # Mover a RESEARCHED si estaba en RESEARCHING
    if [[ "$STATUS" == "RESEARCHING" ]]; then
      "$SCRIPT_DIR/wi-move.sh" --id "$ID" --to RESEARCHED
    fi
    ;;
    
  validate)
    REPORT_FILE="$REPORTS_DIR/$ID/validation.md"
    
    # 🛡️ GUARDRAIL: Solo validar si hay research
    if [[ ! -f "$REPORTS_DIR/$ID/research.md" ]]; then
      echo "⚠️  No existe research.md. Se recomienda hacer research primero."
    fi
    
    cat > "$REPORT_FILE" << EOF
# Validation Report: $ID

**Item:** [$TITLE](\$FILE)  
**Type:** $TYPE  
**Step:** Validation  
**Generated:** $(date -u +"%Y-%m-%d %H:%M UTC")  

## Preguntas de Validación

<!-- Preguntas para stakeholders (Juan Manuel, Rodrigo) -->

## Feedback Recibido

| Stakeholder | Respuesta | Acción |
|-------------|-----------|--------|
| | | |

## Validación de Hipótesis

| Hipótesis | Resultado | Evidencia |
|-----------|-----------|-----------|
| | | |

## Decisión

- [ ] **VALIDADO** → Procede a implementación
- [ ] **PARCIAL** → Necesita iteración
- [ ] **RECHAZADO** → Descartar

## Notas

---
EOF
    
    echo "✅ Reporte creado: $REPORT_FILE"
    
    # Mover a RESEARCHED (si estaba en RESEARCHING)
    if [[ "$STATUS" == "RESEARCHING" ]]; then
      "$SCRIPT_DIR/wi-move.sh" --id "$ID" --to RESEARCHED
    fi
    ;;
    
  plan)
    REPORT_FILE="$REPORTS_DIR/$ID/plan.md"
    
    cat > "$REPORT_FILE" << EOF
# Implementation Plan: $ID

**Item:** [$TITLE](\$FILE)  
**Type:** $TYPE  
**Step:** Planning  
**Generated:** $(date -u +"%Y-%m-%d %H:%M UTC")  

## Alcance

<!-- Qué incluye y qué NO -->

## Tasks

- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

## Estimación

- Esfuerzo total:
- Fecha objetivo:

## Dependencias

<!-- Qué necesitamos primero -->

## Riesgos

<!-- Qué puede salir mal -->

---
EOF
    
    echo "✅ Reporte creado: $REPORT_FILE"
    
    # Mover a PLANNED (si estaba en DECIDED o RESEARCHED)
    if [[ "$STATUS" == "DECIDED" || "$STATUS" == "RESEARCHED" ]]; then
      "$SCRIPT_DIR/wi-move.sh" --id "$ID" --to PLANNED
    fi
    ;;
    
  build)
    # 🛡️ GUARDRAIL CRÍTICO: Verificar implementation_approved
    if [[ "$TYPE" == "idea" || "$TYPE" == "research" ]]; then
      if [[ "$IMPL_APPROVED" != "true" ]]; then
        echo "🛑 GUARDRAIL: Type '$TYPE' NO puede pasar a BUILDING sin aprobación explícita."
        echo ""
        echo "El usuario debe escribir:"
        echo "  → 'APROBAR IMPLEMENTACIÓN'"
        echo "  → 'HACER MVP'"
        echo ""
        exit 1
      fi
    fi
    
    REPORT_FILE="$REPORTS_DIR/$ID/build.md"
    
    cat > "$REPORT_FILE" << EOF
# Build Report: $ID

**Item:** [$TITLE](\$FILE)  
**Type:** $TYPE  
**Step:** Building  
**Started:** $(date -u +"%Y-%m-%d %H:%M UTC")  

## Plan de Implementación

- [ ] Task 1
- [ ] Task 2

## Progreso

| Fecha | Avance | Blockers |
|-------|--------|----------|
| | | |

## Notas Técnicas

---
EOF
    
    echo "✅ Reporte creado: $REPORT_FILE"
    
    # Mover a BUILDING
    "$SCRIPT_DIR/wi-move.sh" --id "$ID" --to BUILDING
    ;;
    
  review)
    REPORT_FILE="$REPORTS_DIR/$ID/review.md"
    
    cat > "$REPORT_FILE" << EOF
# Review Report: $ID

**Item:** [$TITLE](\$FILE)  
**Type:** $TYPE  
**Step:** Review  
**Generated:** $(date -u +"%Y-%m-%d %H:%M UTC")  

## Checklist de QA

- [ ] Funcionalidad implementada según criterios
- [ ] Tests pasan
- [ ] Documentación actualizada
- [ ] Validación con usuario (si aplica)

## Resultado

- [ ] **APROBADO** → Mover a DONE
- [ ] **CAMBIOS REQUERIDOS** → Volver a PLANNED/BUILDING
- [ ] **RECHAZADO** → Mover a DROPPED

## Notas del Reviewer

---
EOF
    
    echo "✅ Reporte creado: $REPORT_FILE"
    
    # Mover a BUILDING si venía de otro lado (el review pasa por BUILDING)
    if [[ "$STATUS" != "BUILDING" ]]; then
      "$SCRIPT_DIR/wi-move.sh" --id "$ID" --to BUILDING
    fi
    ;;
    
  clarify)
    # Delegar generación del report a wi-clarify.sh
    echo "🧠 Delegando a wi-clarify.sh..."
    "$SCRIPT_DIR/wi-clarify.sh" --id "$ID"
    
    # Asegurar PENDING → ASKED con sed robusto (regex que reemplaza toda la línea)
    if [[ "$CLARIFICATION_STATUS" == "PENDING" ]]; then
      sed -i '/^clarification_status:/c\clarification_status: ASKED' "$FILE"
      TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
      sed -i "s/^updated_at: .*/updated_at: $TIMESTAMP/" "$FILE"
      echo ""
      echo "📝 clarification_status: PENDING → ASKED"
    fi
    
    echo ""
    echo "📋 Estado principal se mantiene: $STATUS"
    echo ""
    echo "⏳ Esperando confirmación del jefe:"
    echo "   ./scripts/wi-confirm.sh --id $ID --plan <A|B|C>"
    ;;
    
  *)
    echo "❌ Error: Step desconocido: $STEP"
    echo "   Steps válidos: clarify, research, validate, plan, build, review"
    exit 1
    ;;
esac

echo ""
echo "🎯 Pipeline step '$STEP' completado para $ID"
