import os
import json
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

# Spreadsheet ID
SPREADSHEET_ID = '11ZU42g9_W45rcvQySc4O1A5uufKmFH8nGMjEWPzsx5Y'

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

def get_credentials():
    creds = None
    if os.path.exists('/home/manpac/.config/gogcli/token.json'):
        # Use gog's token
        with open('/home/manpac/.config/gogcli/token.json', 'r') as token:
            creds_data = json.load(token)
            creds = Credentials(
                creds_data.get('refresh_token'),
                client_id=creds_data.get('client_id'),
                client_secret=creds_data.get('client_secret'),
                token=creds_data.get('access_token'),
                token_uri=creds_data.get('token_uri', 'https://oauth2.googleapis.com/token')
            )
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            print("No valid credentials found")
            return None
    return creds

def setup_spreadsheet():
    creds = get_credentials()
    if not creds:
        return
    
    service = build('sheets', 'v4', credentials=creds)
    spreadsheet = service.spreadsheets()
    
    # Headers for Process Matrix sheet
    headers = [
        ['Process ID', 'Process Name/Description', 'Category', 'Estimated Current Duration', 
         'Frequency', 'Importance (1-10)', 'Pain Points', 'Automation Potential', 
         'Dependencies', 'Risk of Automation', 'Estimated Time Saved', 'Priority Rank', 'Status']
    ]
    
    # Example data
    example_data = [
        ['PR001', 'Collect client info & docs', 'Customer Service', '30 min', 'Daily', 9, 
         'Manual data entry, scattered sources', 'High', 'Email, CRM, Client portals', 'Low', '20 min', '=IFERROR(I2*VLOOKUP(E2,{"Daily",7;"Weekly",4;"Monthly",2;"Yearly",1},2,FALSE)/(G2/60),0)', 'Not Started'],
        ['PR002', 'Get quotes from multiple insurers', 'Quoting', '2 hours', 'Daily', 9, 
         'Different portals per insurer, format variations', 'High', 'Insurer portals, Rating systems', 'Medium', '90 min', '=IFERROR(I2*VLOOKUP(E2,{"Daily",7;"Weekly",4;"Monthly",2;"Yearly",1},2,FALSE)/(G2/60),0)', 'Not Started'],
        ['PR003', 'Fill underwriting forms', 'Underwriting', '45 min', 'Daily', 8, 
         'Complex questions, validation errors', 'Medium', 'Insurer systems, Policy admin', 'Medium', '25 min', '=IFERROR(I2*VLOOKUP(E2,{"Daily",7;"Weekly",4;"Monthly",2;"Yearly",1},2,FALSE)/(G2/60),0)', 'Not Started'],
        ['PR004', 'Submit claims documentation', 'Claims', '1 hour', 'Weekly', 9, 
         'Missing documents, format requirements', 'High', 'Claims system, Email, Client docs', 'Low', '40 min', '=IFERROR(I2*VLOOKUP(E2,{"Daily",7;"Weekly",4;"Monthly",2;"Yearly",1},2,FALSE)/(G2/60),0)', 'Not Started'],
        ['PR005', 'Follow up on pending claims', 'Claims', '30 min', 'Daily', 7, 
         'Manual tracking, no centralized dashboard', 'Medium', 'Claims system, Phone, Email', 'Low', '15 min', '=IFERROR(I2*VLOOKUP(E2,{"Daily",7;"Weekly",4;"Monthly",2;"Yearly",1},2,FALSE)/(G2/60),0)', 'Not Started'],
        ['PR006', 'Renewal reminders and processing', 'Renewals', '1 hour', 'Monthly', 8, 
         'Calendar reminders, custom letters', 'Medium', 'Policy system, Email, Calendar', 'Low', '45 min', '=IFERROR(I2*VLOOKUP(E2,{"Daily",7;"Weekly",4;"Monthly",2;"Yearly",1},2,FALSE)/(G2/60),0)', 'Not Started'],
        ['PR007', 'Commission calculation & reporting', 'Administrative', '4 hours', 'Monthly', 6, 
         'Complex spreadsheets, reconciliation', 'High', 'Accounting system, Carrier reports', 'Medium', '180 min', '=IFERROR(I2*VLOOKUP(E2,{"Daily",7;"Weekly",4;"Monthly",2;"Yearly",1},2,FALSE)/(G2/60),0)', 'Not Started']
    ]
    
    # Update headers
    result = spreadsheet.values().update(
        spreadsheetId=SPREADSHEET_ID,
        range='Process Matrix!A1:M1',
        valueInputOption='RAW',
        body={'values': headers}
    ).execute()
    print(f"Headers updated: {result.get('updatedCells')} cells")
    
    # Update example data
    result = spreadsheet.values().update(
        spreadsheetId=SPREADSHEET_ID,
        range='Process Matrix!A2:M8',
        valueInputOption='RAW',
        body={'values': example_data}
    ).execute()
    print(f"Data updated: {result.get('updatedCells')} cells")
    
    # Add data validation and formatting via batchUpdate
    requests = []
    
    # Data Validation - Category dropdown
    requests.append({
        'setDataValidation': {
            'range': {'sheetId': 0, 'startRowIndex': 1, 'endRowIndex': 100, 'startColumnIndex': 2, 'endColumnIndex': 3},
            'rule': {
                'condition': {'type': 'ONE_OF_LIST', 'values': [{'userEnteredValue': 'Quoting'}, {'userEnteredValue': 'Underwriting'}, {'userEnteredValue': 'Claims'}, {'userEnteredValue': 'Customer Service'}, {'userEnteredValue': 'Renewals'}, {'userEnteredValue': 'Administrative'}]},
                'strict': True,
                'showCustomUi': True
            }
        }
    })
    
    # Data Validation - Frequency dropdown
    requests.append({
        'setDataValidation': {
            'range': {'sheetId': 0, 'startRowIndex': 1, 'endRowIndex': 100, 'startColumnIndex': 4, 'endColumnIndex': 5},
            'rule': {
                'condition': {'type': 'ONE_OF_LIST', 'values': [{'userEnteredValue': 'Daily'}, {'userEnteredValue': 'Weekly'}, {'userEnteredValue': 'Monthly'}, {'userEnteredValue': 'Yearly'}]},
                'strict': True,
                'showCustomUi': True
            }
        }
    })
    
    # Data Validation - Automation Potential dropdown
    requests.append({
        'setDataValidation': {
            'range': {'sheetId': 0, 'startRowIndex': 1, 'endRowIndex': 100, 'startColumnIndex': 7, 'endColumnIndex': 8},
            'rule': {
                'condition': {'type': 'ONE_OF_LIST', 'values': [{'userEnteredValue': 'High'}, {'userEnteredValue': 'Medium'}, {'userEnteredValue': 'Low'}]},
                'strict': True,
                'showCustomUi': True
            }
        }
    })
    
    # Data Validation - Risk of Automation dropdown
    requests.append({
        'setDataValidation': {
            'range': {'sheetId': 0, 'startRowIndex': 1, 'endRowIndex': 100, 'startColumnIndex': 9, 'endColumnIndex': 10},
            'rule': {
                'condition': {'type': 'ONE_OF_LIST', 'values': [{'userEnteredValue': 'High'}, {'userEnteredValue': 'Medium'}, {'userEnteredValue': 'Low'}]},
                'strict': True,
                'showCustomUi': True
            }
        }
    })
    
    # Data Validation - Status dropdown
    requests.append({
        'setDataValidation': {
            'range': {'sheetId': 0, 'startRowIndex': 1, 'endRowIndex': 100, 'startColumnIndex': 12, 'endColumnIndex': 13},
            'rule': {
                'condition': {'type': 'ONE_OF_LIST', 'values': [{'userEnteredValue': 'Not Started'}, {'userEnteredValue': 'In Analysis'}, {'userEnteredValue': 'Ready to Automate'}, {'userEnteredValue': 'Automated'}]},
                'strict': True,
                'showCustomUi': True
            }
        }
    })
    
    # Format headers
    requests.append({
        'repeatCell': {
            'range': {'sheetId': 0, 'startRowIndex': 0, 'endRowIndex': 1, 'startColumnIndex': 0, 'endColumnIndex': 13},
            'cell': {
                'userEnteredFormat': {
                    'textFormat': {'bold': True},
                    'backgroundColor': {'red': 0.26, 'green': 0.52, 'blue': 0.96}
                }
            },
            'fields': 'userEnteredFormat.textFormat.bold,userEnteredFormat.backgroundColor'
        }
    })
    
    # Freeze first row
    requests.append({
        'updateSheetProperties': {
            'properties': {'sheetId': 0, 'gridProperties': {'frozenRowCount': 1}},
            'fields': 'gridProperties.frozenRowCount'
        }
    })
    
    # Conditional formatting - High priority (red)
    requests.append({
        'addConditionalFormatRule': {
            'rule': {
                'ranges': [{'sheetId': 0, 'startRowIndex': 1, 'endRowIndex': 100, 'startColumnIndex': 11, 'endColumnIndex': 12}],
                'booleanRule': {
                    'condition': {'type': 'CUSTOM_FORMULA', 'values': [{'userEnteredValue': '=M2>=LARGE($M$2:$M$100,3)'}]},
                    'format': {'backgroundColor': {'red': 1, 'green': 0.8, 'blue': 0.8}, 'textFormat': {'foregroundColor': {'red': 0.7, 'green': 0.11, 'blue': 0.11}}}
                }
            },
            'index': 0
        }
    })
    
    # Conditional formatting - Medium priority (yellow)
    requests.append({
        'addConditionalFormatRule': {
            'rule': {
                'ranges': [{'sheetId': 0, 'startRowIndex': 1, 'endRowIndex': 100, 'startColumnIndex': 11, 'endColumnIndex': 12}],
                'booleanRule': {
                    'condition': {'type': 'CUSTOM_FORMULA', 'values': [{'userEnteredValue': '=AND(M2<LARGE($M$2:$M$100,3),M2>=LARGE($M$2:$M$100,6))'}]},
                    'format': {'backgroundColor': {'red': 1, 'green': 0.98, 'blue': 0.77}, 'textFormat': {'foregroundColor': {'red': 0.96, 'green': 0.5, 'blue': 0.09}}}
                }
            },
            'index': 1
        }
    })
    
    # Conditional formatting - Low priority (green)
    requests.append({
        'addConditionalFormatRule': {
            'rule': {
                'ranges': [{'sheetId': 0, 'startRowIndex': 1, 'endRowIndex': 100, 'startColumnIndex': 11, 'endColumnIndex': 12}],
                'booleanRule': {
                    'condition': {'type': 'CUSTOM_FORMULA', 'values': [{'userEnteredValue': '=M2<LARGE($M$2:$M$100,6)'}]},
                    'format': {'backgroundColor': {'red': 0.78, 'green': 0.9, 'blue': 0.79}, 'textFormat': {'foregroundColor': {'red': 0.11, 'green': 0.37, 'blue': 0.13}}}
                }
            },
            'index': 2
        }
    })
    
    # Summary Sheet data
    summary_data = [
        ['Metric', 'Value'],
        ['Total Processes Analyzed', '=COUNTA(Process Matrix!A2:A)'],
        ['Estimated Total Weekly Hours', '=SUMPRODUCT(Process Matrix!G2:G/60*VLOOKUP(Process Matrix!E2:E,{"Daily",1;"Weekly",0.25;"Monthly",0.0625;"Yearly",0.0208},2,FALSE))'],
        ['Top 3 Automation Opportunities', '=TEXTJOIN(", ",TRUE,INDEX(Process Matrix!B2:B,N(LARGE(IF(Process Matrix!H2:H="High",ROW(Process Matrix!H2:H)-1),{1,2,3}))))'],
        ['Estimated Weekly Time Savings (Top 3)', '=SUM(LARGE(Process Matrix!L2:L,{1,2,3}))']
    ]
    
    result = spreadsheet.values().update(
        spreadsheetId=SPREADSHEET_ID,
        range='Summary!A1:B5',
        valueInputOption='RAW',
        body={'values': summary_data}
    ).execute()
    print(f"Summary updated: {result.get('updatedCells')} cells")
    
    # Format Summary headers
    requests.append({
        'repeatCell': {
            'range': {'sheetId': 1, 'startRowIndex': 0, 'endRowIndex': 1, 'startColumnIndex': 0, 'endColumnIndex': 2},
            'cell': {
                'userEnteredFormat': {
                    'textFormat': {'bold': True},
                    'backgroundColor': {'red': 0.26, 'green': 0.52, 'blue': 0.96}
                }
            },
            'fields': 'userEnteredFormat.textFormat.bold,userEnteredFormat.backgroundColor'
        }
    })
    
    # Execute batch update
    body = {'requests': requests}
    result = spreadsheet.batchUpdate(spreadsheetId=SPREADSHEET_ID, body=body).execute()
    print(f"Batch update completed: {len(result.get('replies', []))} operations")
    
    print("\nSpreadsheet setup complete!")
    print(f"Spreadsheet URL: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit")

if __name__ == '__main__':
    setup_spreadsheet()
