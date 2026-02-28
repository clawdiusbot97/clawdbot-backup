#!/usr/bin/env python3
"""
Brokia Process Matrix Updater

This script can be used to programmatically update the Brokia Process Prioritization Matrix.
Requires Google Sheets API credentials.

Usage:
    python update_matrix.py --add "Process Name" "Category" "30 min" "Daily" 9 "Pain points" "High" "Dependencies" "Low" "20 min"
    python update_matrix.py --list
    python update_matrix.py --summary
"""

import argparse
import sys
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import os
import json

SPREADSHEET_ID = '11ZU42g9_W45rcvQySc4O1A5uufKmFH8nGMjEWPzsx5Y'
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

def get_credentials():
    """Load credentials from gog's token store or standard locations."""
    creds = None
    
    # Try gog's token location
    gog_token_path = os.path.expanduser('~/.config/gogcli/token.json')
    if os.path.exists(gog_token_path):
        try:
            with open(gog_token_path, 'r') as f:
                creds_data = json.load(f)
                if 'refresh_token' in creds_data:
                    creds = Credentials(
                        creds_data['refresh_token'],
                        client_id=creds_data.get('client_id'),
                        client_secret=creds_data.get('client_secret'),
                        token_uri=creds_data.get('token_uri', 'https://oauth2.googleapis.com/token')
                    )
        except Exception as e:
            print(f"Could not load gog credentials: {e}")
    
    # Fall back to standard token.json
    if not creds or not creds.valid:
        if os.path.exists('token.json'):
            creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            print("No valid credentials. Run 'python quickstart.py' first.")
            return None
    
    return creds

def get_next_id(service):
    """Get the next available Process ID."""
    result = service.spreadsheets().values().get(
        spreadsheetId=SPREADSHEET_ID,
        range='Process Matrix!A2:A100'
    ).execute()
    values = result.get('values', [])
    if not values:
        return 'PR001'
    
    max_id = 0
    for row in values:
        if row and row[0].startswith('PR'):
            try:
                num = int(row[0][2:])
                max_id = max(max_id, num)
            except:
                pass
    
    return f'PR{max_id + 1:03d}'

def add_process(service, name, category, duration, frequency, importance, pain_points, automation_potential, dependencies, risk, time_saved):
    """Add a new process to the matrix."""
    next_id = get_next_id(service)
    
    # Find next empty row
    result = service.spreadsheets().values().get(
        spreadsheetId=SPREADSHEET_ID,
        range='Process Matrix!A2:M100'
    ).execute()
    values = result.get('values', [])
    next_row = len(values) + 2  # +2 because we started at row 2 and list is 0-indexed
    
    new_row = [
        next_id,
        name,
        category,
        duration,
        frequency,
        importance,
        pain_points,
        automation_potential,
        dependencies,
        risk,
        time_saved,
        '=IFERROR(F' + str(next_row) + '*VLOOKUP(E' + str(next_row) + ',{"Daily",7;"Weekly",4;"Monthly",2;"Yearly",1},2,FALSE)/(G' + str(next_row) + '/60),0)',
        'Not Started'
    ]
    
    service.spreadsheets().values().update(
        spreadsheetId=SPREADSHEET_ID,
        range=f'Process Matrix!A{next_row}',
        valueInputOption='RAW',
        body={'values': [new_row]}
    ).execute()
    
    print(f"Added process {next_id}: {name}")

def list_processes(service):
    """List all processes."""
    result = service.spreadsheets().values().get(
        spreadsheetId=SPREADSHEET_ID,
        range='Process Matrix!A2:M100'
    ).execute()
    values = result.get('values', [])
    
    if not values:
        print("No processes found.")
        return
    
    print("\n{:<8} {:<40} {:<15} {:<12} {:<8} {:<10}".format(
        'ID', 'Process', 'Category', 'Duration', 'Importance', 'Status'))
    print("-" * 100)
    
    for row in values:
        if len(row) >= 13:
            print("{:<8} {:<40} {:<15} {:<12} {:<8} {:<10}".format(
                row[0][:8] if row[0] else '',
                row[1][:40] if row[1] else '',
                row[2][:15] if row[2] else '',
                row[3][:12] if row[3] else '',
                row[5][:8] if row[5] else '',
                row[12][:10] if row[12] else ''
            ))

def show_summary(service):
    """Display summary metrics."""
    result = service.spreadsheets().values().get(
        spreadsheetId=SPREADSHEET_ID,
        range='Summary!A2:B5'
    ).execute()
    values = result.get('values', [])
    
    print("\n=== Summary ===")
    for row in values:
        if len(row) >= 2:
            print(f"{row[0]}: {row[1]}")

def main():
    parser = argparse.ArgumentParser(description='Update Brokia Process Matrix')
    parser.add_argument('--add', nargs=10, metavar=('NAME', 'CATEGORY', 'DURATION', 'FREQUENCY', 'IMPORTANCE', 'PAIN_POINTS', 'AUTO_POTENTIAL', 'DEPENDENCIES', 'RISK', 'TIME_SAVED'),
                        help='Add a new process')
    parser.add_argument('--list', action='store_true', help='List all processes')
    parser.add_argument('--summary', action='store_true', help='Show summary')
    
    args = parser.parse_args()
    
    creds = get_credentials()
    if not creds:
        sys.exit(1)
    
    service = build('sheets', 'v4', credentials=creds)
    
    if args.list:
        list_processes(service)
    elif args.summary:
        show_summary(service)
    elif args.add:
        add_process(service, *args.add)
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
