// Setup Brokia Process Prioritization Matrix
function setupSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Get the Process Matrix sheet
  var processSheet = ss.getSheetByName('Process Matrix');
  var summarySheet = ss.getSheetByName('Summary');
  
  // === SETUP PROCESS MATRIX SHEET ===
  
  // Headers
  var headers = [
    'Process ID',
    'Process Name/Description',
    'Category',
    'Estimated Current Duration',
    'Frequency',
    'Importance (1-10)',
    'Pain Points',
    'Automation Potential',
    'Dependencies',
    'Risk of Automation',
    'Estimated Time Saved',
    'Priority Rank',
    'Status'
  ];
  
  // Set headers
  processSheet.getRange('A1:M1').setValues([headers]);
  
  // Format headers
  processSheet.getRange('A1:M1').setFontWeight('bold').setBackground('#4285F4').setFontColor('white');
  processSheet.setFrozenRows(1);
  
  // Example data
  var exampleData = [
    ['PR001', 'Collect client info & docs', 'Customer Service', '30 min', 'Daily', '9', 'Manual data entry, scattered sources, follow-up needed', 'High', 'Email, CRM, Client portals', 'Low', '20 min', '=IFERROR(I2*VLOOKUP(E2,{"Daily",7;"Weekly",4;"Monthly",2;"Yearly",1},2,FALSE)/G2,0)', 'Not Started'],
    ['PR002', 'Get quotes from multiple insurers', 'Quoting', '2 hours', 'Daily', '9', 'Different portals per insurer, format variations, comparison needed', 'High', 'Insurer portals, Rating systems', 'Medium', '90 min', '=IFERROR(I2*VLOOKUP(E2,{"Daily",7;"Weekly",4;"Monthly",2;"Yearly",1},2,FALSE)/G2,0)', 'Not Started'],
    ['PR003', 'Fill underwriting forms', 'Underwriting', '45 min', 'Daily', '8', 'Complex questions, validation errors, multiple versions', 'Medium', ' insurer systems, Policy admin', 'Medium', '25 min', '=IFERROR(I2*VLOOKUP(E2,{"Daily",7;"Weekly",4;"Monthly",2;"Yearly",1},2,FALSE)/G2,0)', 'Not Started'],
    ['PR004', 'Submit claims documentation', 'Claims', '1 hour', 'Weekly', '9', 'Missing documents, format requirements, submission tracking', 'High', 'Claims systems, Email, Client docs', 'Low', '40 min', '=IFERROR(I2*VLOOKUP(E2,{"Daily",7;"Weekly",4;"Monthly",2;"Yearly",1},2,FALSE)/G2,0)', 'Not Started'],
    ['PR005', 'Follow up on pending claims', 'Claims', '30 min', 'Daily', '7', 'Manual tracking, no centralized dashboard, phone tag', 'Medium', 'Claims system, Phone, Email', 'Low', '15 min', '=IFERROR(I2*VLOOKUP(E2,{"Daily",7;"Weekly",4;"Monthly",2;"Yearly",1},2,FALSE)/G2,0)', 'Not Started'],
    ['PR006', 'Renewal reminders and processing', 'Renewals', '1 hour', 'Monthly', '8', 'Calendar reminders, custom letters, approval workflows', 'Medium', 'Policy system, Email, Calendar', 'Low', '45 min', '=IFERROR(I2*VLOOKUP(E2,{"Daily",7;"Weekly",4;"Monthly",2;"Yearly",1},2,FALSE)/G2,0)', 'Not Started'],
    ['PR007', 'Commission calculation & reporting', 'Administrative', '4 hours', 'Monthly', '6', 'Complex spreadsheets, reconciliation issues, manual adjustments', 'High', 'Accounting system, Carrier reports', 'Medium', '180 min', '=IFERROR(I2*VLOOKUP(E2,{"Daily",7;"Weekly",4;"Monthly",2;"Yearly",1},2,FALSE)/G2,0)', 'Not Started']
  ];
  
  processSheet.getRange('A2:M8').setValues(exampleData);
  
  // Set number format for Priority Rank column
  processSheet.getRange('M2:M8').setNumberFormat('#,##0.00');
  
  // === DATA VALIDATION ===
  
  // Category dropdown (column C)
  var categoryRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Quoting', 'Underwriting', 'Claims', 'Customer Service', 'Renewals', 'Administrative'])
    .setAllowInvalid(false)
    .build();
  processSheet.getRange('C2:C100').setDataValidation(categoryRule);
  
  // Frequency dropdown (column E)
  var frequencyRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Daily', 'Weekly', 'Monthly', 'Yearly'])
    .setAllowInvalid(false)
    .build();
  processSheet.getRange('E2:E100').setDataValidation(frequencyRule);
  
  // Automation Potential dropdown (column H)
  var automationRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['High', 'Medium', 'Low'])
    .setAllowInvalid(false)
    .build();
  processSheet.getRange('H2:H100').setDataValidation(automationRule);
  
  // Risk of Automation dropdown (column J)
  var riskRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['High', 'Medium', 'Low'])
    .setAllowInvalid(false)
    .build();
  processSheet.getRange('J2:J100').setDataValidation(riskRule);
  
  // Status dropdown (column M)
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Not Started', 'In Analysis', 'Ready to Automate', 'Automated'])
    .setAllowInvalid(false)
    .build();
  processSheet.getRange('M2:M100').setDataValidation(statusRule);
  
  // === CONDITIONAL FORMATTING FOR PRIORITY RANK ===
  
  // Clear existing rules
  processSheet.clearConditionalFormatRules();
  
  // High priority (red) - top 3 values or > 50
  var highPriorityRule = SpreadsheetApp.newConditionalFormatRule()
    .setRanges([processSheet.getRange('M2:M100')])
    .whenFormulaSatisfied('=M2>=LARGE($M$2:$M$100,3)')
    .setBackground('#FFCDD2')
    .setFontColor('#B71C1C')
    .build();
  
  // Medium priority (yellow) - 4th-6th or 20-50
  var mediumPriorityRule = SpreadsheetApp.newConditionalFormatRule()
    .setRanges([processSheet.getRange('M2:M100')])
    .whenFormulaSatisfied('=AND(M2<LARGE($M$2:$M$100,3),M2>=LARGE($M$2:$M$100,6))')
    .setBackground('#FFF9C4')
    .setFontColor('#F57F17')
    .build();
  
  // Low priority (green) - rest
  var lowPriorityRule = SpreadsheetApp.newConditionalFormatRule()
    .setRanges([processSheet.getRange('M2:M100')])
    .whenFormulaSatisfied('=M2<LARGE($M$2:$M$100,6)')
    .setBackground('#C8E6C9')
    .setFontColor('#1B5E20')
    .build();
  
  processSheet.setConditionalFormatRules([highPriorityRule, mediumPriorityRule, lowPriorityRule]);
  
  // Auto-resize columns
  processSheet.autoResizeColumns(1, 13);
  
  // === SETUP SUMMARY SHEET ===
  
  // Summary headers
  summarySheet.getRange('A1:B1').setValues([['Metric', 'Value']]);
  summarySheet.getRange('A1:B1').setFontWeight('bold').setBackground('#4285F4').setFontColor('white');
  
  // Summary metrics
  var summaryData = [
    ['Total Processes Analyzed', '=COUNTA(Process Matrix!A2:A)'],
    ['Estimated Total Weekly Hours', '=SUMPRODUCT(Process Matrix!G2:G/60*VLOOKUP(Process Matrix!E2:E,{"Daily",1;"Weekly",0.25;"Monthly",0.0625;"Yearly",0.0208},2,FALSE))'],
    ['Top 3 Automation Opportunities', '=TEXTJOIN(", ",TRUE,INDEX(Process Matrix!B2:B,MATCH(LARGE(Process Matrix!H2:H,ROW(INDIRECT("1:3"))),Process Matrix!H2:H,0)))'],
    ['Estimated Weekly Time Savings (Top 3)', '=SUMPRODUCT(LARGE(Process Matrix!L2:L,ROW(INDIRECT("1:3"))))']
  ];
  
  summarySheet.getRange('A2:B5').setValues(summaryData);
  
  // Format the weekly hours cell
  summarySheet.getRange('B2').setNumberFormat('#,##0.00');
  summarySheet.getRange('B4').setWrap(true);
  
  // Auto-resize columns
  summarySheet.autoResizeColumns(1, 2);
  
  // Add instructions
  summarySheet.getRange('A7').setValue('Instructions:');
  summarySheet.getRange('A7').setFontWeight('bold');
  summarySheet.getRange('A8').setValue('1. Use the Process Matrix tab to add/edit processes');
  summarySheet.getRange('A9').setValue('2. Select values from dropdowns in Category, Frequency, Automation Potential, Risk, and Status columns');
  summarySheet.getRange('A10').setValue('3. Priority Rank is automatically calculated based on Importance × Frequency ÷ Duration');
  summarySheet.getRange('A11').setValue('4. High priority processes are highlighted in red, medium in yellow, low in green');
  summarySheet.getRange('A12').setValue('5. The Summary tab updates automatically as you add processes');
  
  summarySheet.getRange('A8:A12').setFontSize(10);
  
  Logger.log('Spreadsheet setup complete!');
}