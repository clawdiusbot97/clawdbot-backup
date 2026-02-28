#!/bin/bash
# wi-clarify.sh - Generar Clarification Report para un work-item
# Este script analiza el item y genera el reporte de clarificación

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
      echo "wi-clarify.sh - Generar Clarification Report"
      echo ""
      echo "Uso: wi-clarify.sh --id <TYPE-YYYYMMDD-NNN>"
      echo ""
      echo "Genera: reports/<ID>/clarification.md"
      echo ""
      echo "El reporte incluye:"
      echo "  1. Resumen del item"
      echo "  2. Re-categorización sugerida"
      echo "  3. Información faltante"
      echo "  4. Preguntas para el Chief"
      echo "  5. 3 planes sugeridos (A/B/C)"
      echo "  6. Recomendación final"
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

# Get current metadata
TYPE=$(grep -m1 "^type:" "$FILE" | sed 's/^type:[[:space:]]*//' | tr -d ' ')
TITLE=$(grep -m1 "^title:" "$FILE" | sed 's/^title:[[:space:]]*//' | tr -d '"')
DESCRIPTION=$(grep -A 100 "^description:" "$FILE" | sed -n '2,/^[^ ]/p' | head -5 | sed 's/^  //')
STATUS=$(grep -m1 "^status:" "$FILE" | sed 's/^status:[[:space:]]*//' | tr -d ' ')
PRIORITY=$(grep -m1 "^priority:" "$FILE" | sed 's/^priority:[[:space:]]*//' | tr -d ' ')

echo "🧠 Generando Clarification Report..."
echo "   ID: $ID"
echo "   Type: $TYPE"
echo "   Title: $TITLE"

# Create reports directory
mkdir -p "$REPORTS_DIR/$ID"
REPORT_FILE="$REPORTS_DIR/$ID/clarification.md"

# Generate timestamp
TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M UTC")

# Determine suggested categorization based on content
SUGGESTED_TYPE="$TYPE"
SUGGESTED_TAGS="$TYPE"
SUGGESTED_STATUS="NEW"

case $TYPE in
  idea)
    SUGGESTED_AGENTS="tech-researcher, product-strategist, cost-analyst"
    TIER="balanced"
    BUDGET="medium"
    ;;
  requirement)
    SUGGESTED_AGENTS="tech-researcher, product-strategist"
    TIER="balanced"
    BUDGET="medium"
    ;;
  feature)
    SUGGESTED_AGENTS="architecture-lead, tech-researcher"
    TIER="balanced"
    BUDGET="medium"
    ;;
  blocker)
    SUGGESTED_AGENTS="tech-researcher, architecture-lead"
    TIER="reasoning"
    BUDGET="high"
    ;;
  decision)
    SUGGESTED_AGENTS="architecture-lead, product-strategist"
    TIER="reasoning"
    BUDGET="medium"
    ;;
  risk)
    SUGGESTED_AGENTS="product-strategist, tech-researcher"
    TIER="balanced"
    BUDGET="low"
    ;;
  research)
    SUGGESTED_AGENTS="tech-researcher"
    TIER="balanced"
    BUDGET="high"
    ;;
  solution)
    SUGGESTED_AGENTS="architecture-lead, tech-researcher"
    TIER="reasoning"
    BUDGET="medium"
    ;;
esac

# Generate the report
cat > "$REPORT_FILE" << EOF
# Clarification Report: $ID

**Item:** [$TITLE]($FILE)  
**Type:** $TYPE  
**Status:** $STATUS  
**Priority:** $PRIORITY  
**Generated:** $TIMESTAMP  

---

## 1. Resumen del Item (5-10 líneas)

**Título:** $TITLE

**Descripción:**  
${DESCRIPTION:-*(No hay descripción detallada)*}

**Tipo detectado:** \`$TYPE\`

**Estado actual:** \`$STATUS\`

---

## 2. Re-categorización Sugerida

| Campo | Actual | Sugerido | Justificación |
|-------|--------|----------|---------------|
| Type | $TYPE | $SUGGESTED_TYPE | Basado en contenido y keywords |
| Tags | - | $SUGGESTED_TAGS | Type-tag obligatorio + dominio |
| Status | $STATUS | $SUGGESTED_STATUS | Por defecto para items nuevos |

**Nota:** El type \`$TYPE\` parece apropiado. No se recomienda cambiar sin análisis adicional.

---

## 3. Información Faltante

Antes de proceder, sería útil contar con:

- [ ] **Contexto de negocio:** ¿Por qué es importante esto? ¿Qué problema resuelve?
- [ ] **Stakeholders:** ¿Quiénes deben ser consultados? (Juan Manuel, Rodrigo, etc.)
- [ ] **Restricciones:** ¿Hay deadlines, presupuestos o dependencias críticas?
- [ ] **Alternativas consideradas:** ¿Se evaluaron otras opciones?
- [ ] **Éxito/fracaso:** ¿Cómo se medirá si esto funcionó?
- [ ] **Riesgos:** ¿Qué podría salir mal?

---

## 4. Preguntas para el Chief (5-10)

Para avanzar con este item, necesito que me confirmes:

1. **Prioridad real:** ¿Es esto un p0/p1 urgente, o puede esperar?

2. **Alcance:** ¿Qué incluye explícitamente y qué queda FUERA del alcance?

3. **Recursos:** ¿Tiene presupuesto asignado o necesita aprobación adicional?

4. **Dependencias:** ¿Qué otros proyectos/teams necesitan estar alineados?

5. **Entregable:** ¿Prefieres un documento de análisis o un prototipo funcional?

6. **Timeline:** ¿Hay una fecha objetivo? ¿Es hard deadline o flexible?

7. **Aprobadores:** ¿Además de vos, quién más debe aprobar este item?

8. **Contexto adicional:** ¿Hay historial, documentos previos o decisiones relacionadas que deba conocer?

9. **Riesgos aceptables:** ¿Qué nivel de riesgo es aceptable? (intento seguro vs. "move fast and break things")

10. **Criterios de éxito:** ¿Qué debe pasar para considerar esto "listo"?

---

## 5. Planes Sugeridos (A/B/C)

### Plan A: Research (Recomendado como default)

**Objetivo:** Investigar a fondo antes de comprometerse a un curso de acción.

**Outputs esperados:**
- Documento de análisis de opciones
- Pros/cons de cada alternativa
- Estimación de esfuerzo/tiempo/costo por opción
- Recomendación fundamentada

**Costo/Tiempo:** MEDIO (2-5 días de research)

**Cuándo elegir:** Cuando no hay claridad sobre la mejor solución o hay muchas alternativas.

---

### Plan B: Brainstorm (Alternativas + Trade-offs)

**Objetivo:** Generar posibles soluciones sin comprometerse a implementar ninguna todavía.

**Outputs esperados:**
- Lista de 3-5 soluciones posibles
- Trade-offs de cada una
- Matriz de decisión simple
- Recomendación con justificación

**Costo/Tiempo:** BAJO (1-2 días de análisis rápido)

**Cuándo elegir:** Cuando se necesitan ideas creativas rápidas o el problema es bien definido pero las solución no.

---

### Plan C: Convertir a Requirements

**Objetivo:** Si el item ya está suficientemente claro, convertirlo directamente en requerimientos ejecutables.

**Outputs esperados:**
- Requerimientos formales con criterios de aceptación
- Breakdown en tareas técnicas
- Estimaciones detalladas
- Plan de implementación

**Costo/Tiempo:** ALTO (requiere certeza; si se hace mal => retrabajo)

**Cuándo elegir:** Cuando el problema y la solución son conocidos, y lo que falta es "solo" ejecutar.

---

## 6. Recomendación Final

**Plan recomendado:** **A (Research)**

**Justificación:**  
El item \`$ID\` del tipo \`$TYPE\` beneficiaría de un análisis preliminar antes de comprometer recursos. El research permitirá:

1. Validar supuestos sobre el problema
2. Identificar alternativas no consideradas
3. Estimar con mayor precisión esfuerzo y riesgos
4. Tomar una decisión informada sobre continuar, pivotar o descartar

**Siguiente paso:**  
Confirmar este plan ejecutando:  
\`\`\`bash
./scripts/wi-confirm.sh --id $ID --plan A
\`\`\`

O, si preferís otro plan:  
\`\`\`bash
./scripts/wi-confirm.sh --id $ID --plan B  # o C
\`\`\`

---

## 7. Delegación Sugerida (Preparatorio)

**Nota:** Esto es metadata para futura implementación. No ejecutar todavía.

| Subagente | Rol | Tier Recomendado | Entregable |
|-----------|-----|------------------|------------|
| tech-researcher | Investigación técnica | $TIER | Análisis de viabilidad |
| product-strategist | Validación de negocio | balanced | Análisis de valor |
| cost-analyst | Estimación de recursos | cheap | Cost/benefit |
| architecture-lead | Diseño técnico | reasoning | Arquitectura propuesta |

**Tier de modelo sugerido:** \`$TIER\`
**Presupuesto estimado:** \`$BUDGET\`

---

## Notas del Agente (Opcional)

*[Espacio para que el agente agregue insights adicionales]*

---

*Clarification Report generado automáticamente por wi-clarify.sh*  
*Para regenerar: ./scripts/wi-clarify.sh --id $ID*
EOF

# Update the work-item frontmatter
sed -i 's/needs_clarification: true/needs_clarification: true/' "$FILE"
sed -i 's/clarification_status: PENDING/clarification_status: ASKED/' "$FILE"

# Update timestamp
NEW_TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
sed -i "s/^updated_at: .*/updated_at: $NEW_TIMESTAMP/" "$FILE"

echo ""
echo "✅ Clarification Report generado: $REPORT_FILE"
echo ""
echo "📋 Estado actualizado:"
echo "   clarification_status: ASKED"
echo ""
echo "🎯 Próximo paso:"
echo "   1. Review el reporte: cat $REPORT_FILE"
echo "   2. Confirmar plan: ./scripts/wi-confirm.sh --id $ID --plan A|B|C"
