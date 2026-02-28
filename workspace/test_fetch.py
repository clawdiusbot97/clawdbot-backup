import subprocess
import json
from datetime import datetime, timedelta

GMAIL_ACCOUNT = 'tachipachi9797@gmail.com'
since = (datetime.now() - timedelta(days=1)).strftime('%Y/%m/%d')
query = f'(label:ITAU/EstadoDeCuenta OR label:ITAU/AvisosConsumo) after:{since}'
cmd = ['gog', 'gmail', 'search', '--account', GMAIL_ACCOUNT, '--limit', '5', '--json', query]
print('Running:', ' '.join(cmd))
result = subprocess.run(cmd, capture_output=True, text=True)
if result.returncode != 0:
    print('Error:', result.stderr)
else:
    try:
        data = json.loads(result.stdout)
        messages = data.get('messages', [])
        print(f'Found {len(messages)} emails')
        for msg in messages:
            print(f"ID: {msg.get('id')}, Subject: {msg.get('subject')}, Date: {msg.get('date')}")
    except Exception as e:
        print('Parse error:', e)
        print('Output:', result.stdout[:200])