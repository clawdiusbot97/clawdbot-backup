# Brokia Process Prioritization Matrix

## Overview
This Google Sheet is used to track and prioritize insurance broker processes for automation.

**Spreadsheet URL:** https://docs.google.com/spreadsheets/d/11ZU42g9_W45rcvQySc4O1A5uufKmFH8nGMjEWPzsx5Y/edit

**Sharing Link:** https://docs.google.com/spreadsheets/d/11ZU42g9_W45rcvQySc4O1A5uufKmFH8nGMjEWPzsx5Y/edit?usp=drivesdk

## Sheet Structure

### Process Matrix Tab
Contains all broker processes with the following columns:
- **Process ID** - Unique identifier (PR001, PR002, etc.)
- **Process Name/Description** - Name and description of the process
- **Category** - Quoting, Underwriting, Claims, Customer Service, Renewals, or Administrative
- **Estimated Current Duration** - Time to complete the process
- **Frequency** - How often the process occurs (Daily, Weekly, Monthly, Yearly)
- **Importance (1-10)** - Criticality of the process (10 = critical)
- **Pain Points** - What makes this process slow or error-prone
- **Automation Potential** - High, Medium, or Low
- **Dependencies** - Systems, people, or data sources involved
- **Risk of Automation** - High, Medium, or Low risk if automated
- **Estimated Time Saved** - Time saved if process is automated
- **Priority Rank** - Calculated: Importance × Frequency ÷ Duration
- **Status** - Not Started, In Analysis, Ready to Automate, or Automated

### Summary Tab
Dashboard with key metrics:
- Total Processes Analyzed
- Estimated Total Weekly Hours Spent
- Top 3 Automation Opportunities
- Estimated Weekly Time Savings (Top 3)

## Setting Up Data Validation (Dropdowns)

To enable dropdown menus for categorical columns:

1. **Category Column (C):**
   - Select cells C2:C100
   - Go to Data → Data validation
   - Criteria: List from a range → `='Dropdown Lists'!$A$2:$A$7`
   - Or manually enter: `Quoting,Underwriting,Claims,Customer Service,Renewals,Administrative`

2. **Frequency Column (E):**
   - Select cells E2:E100
   - Data → Data validation
   - Criteria: List from a range or enter: `Daily,Weekly,Monthly,Yearly`

3. **Automation Potential Column (H):**
   - Select cells H2:H100
   - Data → Data validation
   - Criteria: `High,Medium,Low`

4. **Risk of Automation Column (J):**
   - Select cells J2:J100
   - Data → Data validation
   - Criteria: `High,Medium,Low`

5. **Status Column (M):**
   - Select cells M2:M100
   - Data → Data validation
   - Criteria: `Not Started,In Analysis,Ready to Automate,Automated`

## Setting Up Conditional Formatting

To add priority-based color coding (Red=High, Yellow=Medium, Green=Low):

1. Select the Priority Rank column (L2:L100)
2. Go to Format → Conditional formatting
3. **High Priority (Red):**
   - Format cells if: Custom formula is → `=L2>=LARGE($L$2:$L$100,3)`
   - Fill color: Light red (#FFCDD2)
   - Text color: Dark red (#B71C1C)

4. **Medium Priority (Yellow):**
   - Add another rule
   - Format cells if: Custom formula is → `=AND(L2<LARGE($L$2:$L$100,3),L2>=LARGE($L$2:$L$100,6))`
   - Fill color: Light yellow (#FFF9C4)
   - Text color: Dark yellow (#F57F17)

5. **Low Priority (Green):**
   - Add another rule
   - Format cells if: Custom formula is → `=L2<LARGE($L$2:$L$100,6)`
   - Fill color: Light green (#C8E6C9)
   - Text color: Dark green (#1B5E20)

## Adding New Processes

1. Add a new row at the bottom of the Process Matrix
2. Assign a new Process ID (PR008, PR009, etc.)
3. Fill in all columns with appropriate values
4. The Priority Rank will calculate automatically based on the formula

## Updating the Sheet

### To Add More Processes
Simply add new rows below the existing data. The formulas in the Summary tab will automatically include them.

### To Modify Priority Calculations
The Priority Rank uses the formula: `Importance × Frequency Weight ÷ Duration (in hours)`

Frequency weights: Daily=7, Weekly=4, Monthly=2, Yearly=1

### To Refresh Summary Data
The Summary tab formulas update automatically. If formulas show errors:
1. Check that Process Matrix sheet exists with correct name
2. Ensure column letters match (A=ID, B=Name, C=Category, etc.)

## Maintenance Tips

1. **Weekly Review:** Check the Priority Rank column to identify high-priority processes
2. **Status Updates:** Update status as processes move through automation lifecycle
3. **Time Tracking:** Update "Estimated Time Saved" based on actual automation results
4. **New Processes:** Add new broker processes as they're identified
5. **Dependencies:** Keep dependency list updated as systems change

## Troubleshooting

- **Formulas not calculating:** Check that cells are formatted as numbers
- **Dropdown not working:** Ensure no extra spaces in validation criteria
- **Conditional formatting not applying:** Check that Priority Rank values are valid numbers
- **Summary not updating:** Verify sheet names match exactly (case-sensitive)

## Support

For questions about this matrix, contact the Brokia automation team.
