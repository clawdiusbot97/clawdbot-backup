// Setup Brokia Process Prioritization Matrix
function setupSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Get the Process Matrix sheet
  var processSheet = ss.getSheetByName('Process Matrix');
  var summarySheet = ss.getSheetByName('Summary');
  
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
  processSheet.getRange('A1:M1').setFontWeight('bold').setBackground('#4285F4').setFontColor('white');
  processSheet.setFrozenRows(1);
  
  // Example data
  var exampleData = [
    ['PR001', 'Collect client info & docs', 'Customer Service', '30 min', 'Daily', 9, 'Manual data entry, scattered sources', 'High', 'Email, CRM', 'Low', '20 min', '', 'Not Started'],
    ['PR002', 'Get quotes from multiple insurers', 'Quoting', '2 hours', 'Daily', 9, 'Different portals, format variations', 'High', 'Insurer portals', 'Medium', '90 min', '', 'Not Started'],
    ['PR003', 'Fill underwriting forms', 'Underwriting', '45 min', 'Daily', 8, 'Complex questions, validation errors', 'Medium', 'Insurer systems', 'Medium', '25 min', '', 'Not Started'],
    ['PR004', 'Submit claims documentation', 'Claims', '1 hour', 'Weekly', 9, 'Missing documents, format requirements', 'High', 'Claims system', 'Low', '40 min', '', 'Not Started'],
    ['PR005', 'Follow up on pending claims', 'Claims', '30 min', 'Daily', 7, 'Manual tracking, no dashboard', 'Medium', 'Claims system', 'Low', '15 min', '', 'Not Started'],
    ['PR006', 'Renewal reminders and processing', 'Renewals', '1 hour', 'Monthly', 8, 'Calendar reminders, custom letters', 'Medium', 'Policy system', 'Low', '45 min', '', 'Not Started'],
    ['PR007', 'Commission calculation & reporting', 'Administrative', '4 hours', 'Monthly', 6, 'Complex spreadsheets, reconciliation', 'High', 'Accounting system', 'Medium', '180 min', '', 'Not Started']
  ];
  
  processSheet.getRange('A2:M8').setValues(exampleData);
  
  // Data Validation - Category
  var categoryRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Quoting', 'Underwriting', 'Claims', 'Customer Service', 'Renewals', 'Administrative'])
    .setAllowInvalid(false)
    .build();
  processSheet.getRange('C2:C100').setDataValidation(categoryRule);
  
  // Data Validation - Frequency
  var frequencyRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Daily', 'Weekly', 'Monthly', 'Yearly'])
    .setAllowInvalid(false)
    .build();
  processSheet.getRange('E2:E100').setDataValidation(frequencyRule);
  
  // Data Validation - Automation Potential
  var automationRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['High', 'Medium', 'Low'])
    .setAllowInvalid(false)
    .build();
  processSheet.getRange('H2:H100').setDataValidation(automationRule);
  
  // Data Validation - Risk of Automation
  var riskRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['High', 'Medium', 'Low'])
    .setAllowInvalid(false)
    .build();
  processSheet.getRange('J2:J100').setDataValidation(riskRule);
  
  // Data Validation - Status
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Not Started', 'In Analysis', 'Ready to Automate', 'Automated'])
    .setAllowInvalid(false)
    .build();
  processSheet.getRange('M2:M100').setDataValidation(statusRule);
  
  // Summary Sheet
  summarySheet.getRange('A1:B1').setValues([['Metric', 'Value']]);
  summarySheet.getRange('A1:B1').setFontWeight('bold').setBackground('#4285F4').setFontColor('white');
  
  var summaryData = [
    ['Total Processes Analyzed', '=COUNTA(Process Matrix!A2:A)'],
    ['Estimated Total Weekly Hours', '=SUM(Process Matrix!G2:G/60)'],
    ['Top 3 Automation Opportunities', '=JOIN(", ", FILTER(Process Matrix!B2:B, Process Matrix!H2:H="High"))'],
    ['Estimated Weekly Time Savings', '=SUM(Process Matrix!L2:L)']
  ];
  
  summarySheet.getRange('A2:B5').setValues(summaryData);
  summarySheet.autoResizeColumns(1, 2);
}
