# Formato de Matriz de Procesos Brokia

## 📊 Sheet actualizado
- **URL:** https://docs.google.com/spreadsheets/d/11ZU42g9_W45rcvQySc4O1A5uufKmFH8nGMjEWPzsx5Y/edit
- **Encabezados:** Ya están en español (actualizados vía API)

## 🎨 Aplicar formato manualmente

### 1. Colores en encabezados
1. Selecciona fila 1 (A1:M1)
2. Menú **Formato → Formato condicional**
3. **Regla simple** → Color de fondo → Ej: `#4a86e8` (azul corporativo)
4. **Texto en negrita, color blanco**

### 2. Validaciones por lista (dropdowns)
- **Columna C (Categoría):**
  - Seleccionar columna C (C2:C100)
  - **Formato → Validación de datos**
  - **Criterio:** Lista de elementos
  - **Elementos:** `Registro de Cliente, Cotización, Underwriting, Siniestros, Renovaciones, Administrativo`
  - Mostrar ayuda: "Selecciona categoría"

- **Columna E (Frecuencia):**
  - Lista: `Diario, Semanal, Mensual, Trimestral, Anual`

- **Columna H (Potencial de Automatización):**
  - Lista: `Alto, Medio, Bajo`

- **Columna J (Riesgo de Automatización):**
  - Lista: `Alto, Medio, Bajo`

- **Columna M (Estado):**
  - Lista: `No Iniciado, En Análisis, Listo para Automatizar, Automatizado`

### 3. Formato condicional por prioridad
- **Columna L (Prioridad Rank):**
  - Seleccionar columna L (L2:L100)
  - **Formato → Formato condicional**
  - **Rango de colores** (escala de verde a rojo):
    - Verde: `=L2>=8` (Alta prioridad)
    - Amarillo: `=L2>=5` (Media prioridad)
    - Rojo: `=L2<5` (Baja prioridad)

### 4. Fórmula de Prioridad Rank (columna L)
- **Fórmula en L2:** `=(F2*IF(E2="Diario",7,IF(E2="Semanal",4,IF(E2="Mensual",2,IF(E2="Trimestral",1,IF(E2="Anual",0.5,1)))))/D2)`
- Copiar hacia abajo
- **Explicación:** `Importancia × factor_frecuencia ÷ duración`

### 5. Pestaña de Resumen
1. Crear nueva pestaña llamada **"Resumen"**
2. Insertar:

```
Total Procesos Analizados: =COUNTA('Process Matrix'!A2:A)
Horas Semanales Estimadas: =SUM('Process Matrix'!D2:D)/60
Top 3 Automatizables:
=INDEX(SORT(FILTER('Process Matrix'!B2:B,'Process Matrix'!H2:H="Alto"),'Process Matrix'!L2:L, FALSE),1)
=INDEX(SORT(FILTER('Process Matrix'!B2:B,'Process Matrix'!H2:H="Alto"),'Process Matrix'!L2:L, FALSE),2)
=INDEX(SORT(FILTER('Process Matrix'!B2:B,'Process Matrix'!H2:H="Alto"),'Process Matrix'!L2:L, FALSE),3)
Ahorro Semanal Estimado (horas): =SUMIF('Process Matrix'!H2:H,"Alto",'Process Matrix'!K2:K)/60
```

## 🤖 Script de Apps Script (automático)
Copia este código en **Extensiones → Apps Script**, guarda y ejecuta `applyFormatting`:

```javascript
function applyFormatting() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Matriz procesos');
  
  // Color encabezados
  const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  headerRange.setBackground('#4a86e8')
    .setFontColor('white')
    .setFontWeight('bold');
  
  // Validaciones
  const categories = ['Registro de Cliente', 'Cotización', 'Underwriting', 'Siniestros', 'Renovaciones', 'Administrativo'];
  const frequencies = ['Diario', 'Semanal', 'Mensual', 'Trimestral', 'Anual'];
  const automationPot = ['Alto', 'Medio', 'Bajo'];
  const automationRisk = ['Alto', 'Medio', 'Bajo'];
  const statuses = ['No Iniciado', 'En Análisis', 'Listo para Automatizar', 'Automatizado'];
  
  applyDataValidation(sheet, 3, categories); // Columna C
  applyDataValidation(sheet, 5, frequencies); // Columna E
  applyDataValidation(sheet, 8, automationPot); // Columna H
  applyDataValidation(sheet, 10, automationRisk); // Columna J
  applyDataValidation(sheet, 13, statuses); // Columna M
  
  // Formato condicional prioridad
  const priorityRange = sheet.getRange(2, 12, sheet.getLastRow()-1, 1);
  const greenRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThanOrEqualTo(8)
    .setBackground('#d9ead3')
    .setRanges([priorityRange])
    .build();
  const yellowRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberBetween(5, 7.999)
    .setBackground('#fff2cc')
    .setRanges([priorityRange])
    .build();
  const redRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(5)
    .setBackground('#f4cccc')
    .setRanges([priorityRange])
    .build();
  
  sheet.setConditionalFormatRules([greenRule, yellowRule, redRule]);
  
  // Fórmula de prioridad
  const formula = '=IFERROR(F2*IF(E2="Diario";7;IF(E2="Semanal";4;IF(E2="Mensual";2;IF(E2="Trimestral";1;IF(E2="Anual";0,5;1)))))/D2;"")';

  const formulaRange = sheet.getRange(2, 12, sheet.getLastRow()-1, 1);
  formulaRange.setFormula(formula);
  
  // Crear pestaña Resumen
  createSummaryTab(ss);
  
  SpreadsheetApp.flush();
  Logger.log('Formato aplicado correctamente');
}

function applyDataValidation(sheet, colIndex, items) {
  const range = sheet.getRange(2, colIndex, sheet.getLastRow()-1, 1);
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(items, true)
    .setAllowInvalid(false)
    .setHelpText('Selecciona una opción de la lista')
    .build();
  range.setDataValidation(rule);
}

function createSummaryTab(ss) {
  const matrixName = 'Matriz procesos';
  let summarySheet = ss.getSheetByName('Resumen');
  if (!summarySheet) summarySheet = ss.insertSheet('Resumen');

  summarySheet.clear();

  // Top 3 usando QUERY (funcionó en tu caso)
  const top1 = `=SI.ERROR(INDICE(QUERY('${matrixName}'!B2:L;"select B where H = 'Alto' order by L desc limit 1";0);1;1);"error"`;
  const top2 = `=SI.ERROR(INDICE(QUERY('${matrixName}'!B2:L;"select B where H = 'Alto' order by L desc limit 1 offset 1";0);1;1);"error"`;
  const top3 = `=SI.ERROR(INDICE(QUERY('${matrixName}'!B2:L;"select B where H = 'Alto' order by L desc limit 1 offset 2";0);1;1);"error"`;

  const data = [
    ['Métrica', 'Valor'],
    ['Total Procesos Analizados', `=COUNTA('${matrixName}'!A2:A)`],
    ['Horas Semanales Estimadas', `=SUM('${matrixName}'!D2:D)/60`],
    ['', ''],
    ['Top 3 Automatizables', ''],
    ['1º', top1],
    ['2º', top2],
    ['3º', top3],
    ['', ''],
    ['Ahorro Semanal Estimado (horas)', `=SUMIF('${matrixName}'!H2:H;"Alto";'${matrixName}'!K2:K)/60`]
  ];

  summarySheet.getRange(1, 1, data.length, 2).setValues(data);
  summarySheet.getRange(1, 1, 1, 2)
    .setBackground('#4a86e8')
    .setFontColor('white')
    .setFontWeight('bold');

  summarySheet.autoResizeColumns(1, 2);
}
```

## 📥 Datos de ejemplo en español
Archivo CSV disponible en: `/home/manpac/.openclaw/workspace/procesos_brokia_ejemplo.csv`

## 🔄 Actualización futura
Usar script `update_matrix.py` incluido en workspace para añadir procesos desde CSV/API.

---
*Última actualización: 2026‑02‑18*