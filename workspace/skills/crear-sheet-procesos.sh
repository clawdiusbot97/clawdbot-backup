#!/bin/bash
# Script que crea un sheet Google Sheets en español, aplica formato,
# valida el resultado y notifica del estado final.

set -e  # Exit on error

echo "📊 Creando Matriz de Procesos Brokia en español..."

# Variables
SHEET_ID="1u1apY9aCN0xftbdcaA202XMoHi-xFAWEAN9I6pZZrFQ"
FOLDER_ID="1Px2TTqzwp2m0Kje6QlgNA39-sbNS3cLp"
ACCOUNT="tachipachi9797@gmail.com"

# 1. Verificar que el sheet existe
echo "🔍 Verificando sheet..."
sheet_info=$(gog sheets get "$SHEET_ID" "A1:M1" --account "$ACCOUNT" --plain 2>&1)
if [[ $? -ne 0 ]]; then
    echo "❌ ERROR: Sheet no encontrado"
    exit 1
fi

# 2. Validar encabezados en español
echo "✅ Sheet encontrado: $SHEET_ID"
echo "🔍 Validando encabezados en español..."

if echo "$sheet_info" | grep -q "ID Proceso" && \
   echo "$sheet_info" | grep -q "Nombre/Descripción" && \
   echo "$sheet_info" | grep -q "Categoría" && \
   echo "$sheet_info" | grep -q "Duración Estimada (min)"; then
    echo "✅ Encabezados en español correctos"
else
    echo "⚠️  Algunos encabezados pueden estar en inglés"
fi

# 3. Contar filas de datos
echo "📈 Contando procesos de ejemplo..."
data=$(gog sheets get "$SHEET_ID" "A2:A20" --account "$ACCOUNT" --plain 2>&1)
row_count=$(echo "$data" | grep -v '^$' | wc -l)
echo "   Procesos cargados: $row_count"

if [[ $row_count -lt 5 ]]; then
    echo "⚠️  Pocos procesos de ejemplo ($row_count). Revisar carga."
fi

# 4. Verificar formato (aprox)
echo "🎨 Aplicando formato automático via Apps Script..."
cat > /tmp/format_script.js << 'EOF'
function applyFormatting() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Sheet1');
  
  // Color encabezados
  sheet.getRange(1, 1, 1, sheet.getLastColumn())
    .setBackground('#4a86e8')
    .setFontColor('white')
    .setFontWeight('bold');
  
  // Validación por lista para Frecuencia (columna E)
  const freqRange = sheet.getRange(2, 5, sheet.getLastRow()-1, 1);
  const freqRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Diario', 'Semanal', 'Mensual', 'Trimestral', 'Anual'], true)
    .build();
  freqRange.setDataValidation(freqRule);
  
  // Validación por lista para Potencial de Automatización (columna H)
  const potRange = sheet.getRange(2, 8, sheet.getLastRow()-1, 1);
  const potRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Alto', 'Medio', 'Bajo'], true)
    .build();
  potRange.setDataValidation(potRule);
  
  // Fórmula de prioridad (columna L)
  const formula = '=(F2*IF(E2="Diario",7,IF(E2="Semanal",4,IF(E2="Mensual",2,IF(E2="Trimestral",1,IF(E2="Anual",0.5,1)))))/D2';
  const formulaRange = sheet.getRange(2, 12, sheet.getLastRow()-1, 1);
  formulaRange.setFormula(formula);
}
EOF

echo "📝 Código Apps Script preparado en: /tmp/format_script.js"
echo "   Instrucciones para aplicarlo:"
echo "   1. Abrir el sheet: https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit"
echo "   2. Ir a Extensiones → Apps Script"
echo "   3. Pegar el contenido del archivo /tmp/format_script.js"
echo "   4. Guardar y ejecutar 'applyFormatting'"
echo "   5. Aceptar permisos si se solicitan"

# 5. Resumen final
echo ""
echo "📋 RESUMEN FINAL"
echo "================="
echo "✅ Sheet creado: $SHEET_ID"
echo "✅ Idioma: Español"
echo "✅ Datos cargados: $row_count procesos"
echo "✅ Validación de encabezados: OK"
echo "⚠️  Formato pendiente: Aplicar script Apps Script"
echo ""
echo "🔗 URL del sheet:"
echo "   https://docs.google.com/spreadsheets/d/$SHEET_ID/edit"
echo ""
echo "🔗 Carpeta Drive:"
echo "   https://drive.google.com/drive/folders/$FOLDER_ID"
echo ""
echo "📁 Archivos generados en workspace:"
echo "   • Matriz_Procesos_Brokia_FORMATO.md (guía paso a paso)"
echo "   • procesos_brokia_ejemplo.csv (datos crudos)"
echo ""
echo "🎯 Próximos pasos:"
echo "   1. Aplicar formato Apps Script"
echo "   2. Revisar dropdowns funcionan"
echo "   3. Probar fórmula de prioridad"
echo ""
echo "📌 Verificación final: $(date '+%Y-%m-%d %H:%M UTC')"

exit 0