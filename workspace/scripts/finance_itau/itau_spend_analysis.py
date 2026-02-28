#!/usr/bin/env python3
"""
Itaú Spend Analysis Pipeline
Fetch new emails, parse transactions, update SQLite, generate reports.
"""

import os
import sys
import json
import sqlite3
import subprocess
import tempfile
import re
from datetime import datetime, timedelta
from email import policy
from email.parser import BytesParser
from email.message import EmailMessage
import base64
import pdfplumber
import bs4
import dateutil.parser
from pathlib import Path

# Paths
WORKSPACE = Path(os.environ.get('OPENCLAW_WORKSPACE', '/home/manpac/.openclaw/workspace'))
DATA_DIR = WORKSPACE / 'data' / 'finance' / 'itau'
CHECKPOINT_FILE = DATA_DIR / 'checkpoint.json'
DB_FILE = DATA_DIR / 'transactions.sqlite'
REPORTS_DAILY_DIR = WORKSPACE / 'reports' / 'finance' / 'itau' / 'daily'
REPORTS_WEEKLY_DIR = WORKSPACE / 'reports' / 'finance' / 'itau' / 'weekly'
REPORTS_MONTHLY_DIR = WORKSPACE / 'reports' / 'finance' / 'itau' / 'monthly'

# Gmail account and labels
GMAIL_ACCOUNT = 'tachipachi9797@gmail.com'
LABELS = ['ITAU/EstadoDeCuenta', 'ITAU/AvisosConsumo']

# Ensure directories exist
for d in [DATA_DIR, REPORTS_DAILY_DIR, REPORTS_WEEKLY_DIR, REPORTS_MONTHLY_DIR]:
    d.mkdir(parents=True, exist_ok=True)

def load_checkpoint():
    """Load checkpoint JSON, return dict with defaults."""
    if CHECKPOINT_FILE.exists():
        with open(CHECKPOINT_FILE) as f:
            return json.load(f)
    return {
        'last_run': '1970-01-01T00:00:00Z',
        'last_message_count': 0,
        'labels_processed': LABELS
    }

def save_checkpoint(checkpoint):
    """Save checkpoint JSON."""
    with open(CHECKPOINT_FILE, 'w') as f:
        json.dump(checkpoint, f, indent=2)

def run_gog(query, limit=50):
    """Run gog gmail list and return parsed JSON."""
    cmd = [
        'gog', 'gmail', 'list',
        '--account', GMAIL_ACCOUNT,
        '--query', query,
        '--limit', str(limit),
        '--json'
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"ERROR: gog list failed: {result.stderr}")
        return []
    try:
        data = json.loads(result.stdout)
        return data.get('messages', [])
    except json.JSONDecodeError as e:
        print(f"ERROR: Failed to parse gog output: {e}")
        return []

def fetch_emails(since_date):
    """Fetch emails from Gmail with given labels after since_date."""
    # Format: after:YYYY/MM/DD
    after_str = since_date.strftime('%Y/%m/%d')
    query = f'(label:ITAU/EstadoDeCuenta OR label:ITAU/AvisosConsumo) after:{after_str}'
    messages = run_gog(query)
    print(f"Found {len(messages)} emails")
    return messages

def get_full_message(message_id):
    """Get full email with attachments."""
    cmd = [
        'gog', 'gmail', 'get',
        '--account', GMAIL_ACCOUNT,
        '--id', message_id,
        '--json'
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"ERROR: gog get failed: {result.stderr}")
        return None
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError as e:
        print(f"ERROR: Failed to parse gog get output: {e}")
        return None

def download_attachment(message_id, attachment_id, filename):
    """Download attachment to temporary file."""
    cmd = [
        'gog', 'gmail', 'attachments', 'get',
        '--account', GMAIL_ACCOUNT,
        '--message-id', message_id,
        '--attachment-id', attachment_id,
        '--output', filename
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    return result.returncode == 0

def parse_email_body(email_data):
    """Extract plain text and HTML from email."""
    # email_data is dict from gog get
    # body may be in payload parts
    # For simplicity, assume there is a 'body' field
    body = email_data.get('body', '')
    return body

def extract_transactions_from_email(email_data):
    """Determine email type and parse transactions."""
    subject = email_data.get('subject', '').lower()
    if 'estado de cuenta' in subject:
        return parse_statement(email_data)
    elif 'aviso de consumo' in subject or 'consumo' in subject:
        return parse_approval(email_data)
    else:
        print(f"WARNING: Unknown email subject: {subject}")
        return []

def parse_statement(email_data):
    """Parse monthly statement PDF/HTML."""
    # TODO: implement PDF parsing
    # For now, placeholder
    print("Parsing statement (not yet implemented)")
    return []

def parse_approval(email_data):
    """Parse purchase approval email."""
    # Extract merchant, amount, date from body
    body = email_data.get('body', '')
    # Simple regex patterns
    # Example: "En SUPERMERCADO DISCO por $ 1.250,50"
    # Example: "Consumo por UYU 1.250,50 en SUPERMERCADO DISCO"
    # We'll implement a basic regex
    pattern = r'(?:en|por|en\s+)\s*([A-Za-zÁÉÍÓÚáéíóúÑñ\s\.\-]+)\s+(?:por|\$|UYU)\s*([\d\.,]+)'
    matches = re.finditer(pattern, body, re.IGNORECASE)
    transactions = []
    for match in matches:
        merchant = match.group(1).strip()
        amount_str = match.group(2).replace('.', '').replace(',', '.')
        try:
            amount = float(amount_str)
        except ValueError:
            continue
        # Use email date as transaction date
        date_str = email_data.get('date', '')
        # Try to parse date
        try:
            date = dateutil.parser.parse(date_str).date().isoformat()
        except:
            date = datetime.now().date().isoformat()
        transactions.append({
            'date': date,
            'merchant': merchant,
            'amount': amount,
            'currency': 'UYU',
            'installments': {'current': 1, 'total': 1},
            'category': None,
            'source': 'approval',
            'status': 'pending',
            'raw_ref': f"msg:{email_data.get('id', '')}"
        })
    return transactions

def deduplicate_transactions(transactions, conn):
    """Remove duplicates based on (date, merchant, amount, currency)."""
    cur = conn.cursor()
    unique = []
    for tx in transactions:
        key = (tx['date'], tx['merchant'], tx['amount'], tx['currency'])
        cur.execute("""
            SELECT COUNT(*) FROM transactions
            WHERE date=? AND merchant=? AND amount=? AND currency=?
        """, key)
        if cur.fetchone()[0] == 0:
            unique.append(tx)
    return unique

def insert_transactions(transactions, conn):
    """Insert transactions into SQLite."""
    cur = conn.cursor()
    for tx in transactions:
        cur.execute("""
            INSERT INTO transactions (date, merchant, amount, currency, category, source, status, raw_ref)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            tx['date'], tx['merchant'], tx['amount'], tx['currency'],
            tx.get('category'), tx['source'], tx['status'], tx['raw_ref']
        ))
    conn.commit()
    print(f"Inserted {len(transactions)} transactions")

def categorize_transactions(transactions):
    """Categorize transactions using local_llm if available, else keyword fallback."""
    # TODO: integrate local_llm skill
    # For now, keyword mapping
    keyword_map = {
        'food': ['supermercado', 'disco', 'ta', 'restaurant', 'cafeteria', 'delivery'],
        'transport': ['uber', 'taxi', 'cabify', 'petrobras', 'shell', 'copetrol'],
        'shopping': ['amazon', 'mercado libre', 'falabella', 'samsung'],
        'entertainment': ['netflix', 'spotify', 'cinema', 'teatro'],
        'health': ['farmacia', 'hospital', 'doctor', 'medico'],
        'services': ['antel', 'ute', 'ose', 'internet', 'luz', 'agua'],
        'other': []
    }
    for tx in transactions:
        merchant = tx['merchant'].lower()
        category = 'other'
        for cat, keywords in keyword_map.items():
            if any(kw in merchant for kw in keywords):
                category = cat
                break
        tx['category'] = category
    return transactions

def generate_daily_report(conn, date):
    """Generate daily markdown report."""
    cur = conn.cursor()
    cur.execute("""
        SELECT SUM(amount) FROM transactions
        WHERE date = ? AND currency = 'UYU'
    """, (date,))
    daily_total = cur.fetchone()[0] or 0
    # TODO: implement full report
    report = f"""# Itaú Spend Analysis – {date}

## 📊 Summary
- Daily total: {daily_total:.2f} UYU

## 🏷️ Top Categories (today)
TODO

## 🔄 Recurring Charges
TODO

## ⚠️ Unusual Activity
TODO
"""
    report_path = REPORTS_DAILY_DIR / f"{date}.md"
    with open(report_path, 'w') as f:
        f.write(report)
    print(f"Daily report written to {report_path}")

def update_weekly_report(conn):
    """Update weekly rolling summary."""
    # TODO: implement
    pass

def update_monthly_report(conn):
    """Update monthly summary."""
    # TODO: implement
    pass

def check_alerts(conn):
    """Check alert conditions and return alert message if any."""
    # TODO: implement
    return None

def main():
    print("Starting Itaú spend analysis pipeline")
    
    # Load checkpoint
    checkpoint = load_checkpoint()
    last_run_str = checkpoint.get('last_run', '1970-01-01T00:00:00Z')
    last_run = dateutil.parser.parse(last_run_str)
    print(f"Last run: {last_run}")
    
    # Fetch emails since last run
    emails = fetch_emails(last_run)
    if not emails:
        print("No new emails")
        # Still update checkpoint
        checkpoint['last_run'] = datetime.utcnow().isoformat() + 'Z'
        checkpoint['last_message_count'] = 0
        save_checkpoint(checkpoint)
        print("Checkpoint updated")
        return
    
    # Connect to SQLite
    conn = sqlite3.connect(DB_FILE)
    
    all_transactions = []
    for msg in emails:
        msg_id = msg.get('id')
        print(f"Processing message {msg_id}")
        full = get_full_message(msg_id)
        if not full:
            continue
        txs = extract_transactions_from_email(full)
        print(f"  Found {len(txs)} transactions")
        all_transactions.extend(txs)
    
    # Deduplicate and insert
    new_txs = deduplicate_transactions(all_transactions, conn)
    if new_txs:
        # Categorize
        new_txs = categorize_transactions(new_txs)
        insert_transactions(new_txs, conn)
    else:
        print("No new transactions")
    
    # Generate reports
    today = datetime.now().date().isoformat()
    generate_daily_report(conn, today)
    update_weekly_report(conn)
    update_monthly_report(conn)
    
    # Check alerts
    alert = check_alerts(conn)
    if alert:
        print(f"ALERT: {alert}")
        # TODO: send alert via Slack or other channel
        # For now, just print
        pass
    
    # Update checkpoint
    checkpoint['last_run'] = datetime.utcnow().isoformat() + 'Z'
    checkpoint['last_message_count'] = len(emails)
    save_checkpoint(checkpoint)
    conn.close()
    print("Pipeline completed")

if __name__ == '__main__':
    main()