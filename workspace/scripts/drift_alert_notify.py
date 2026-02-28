#!/usr/bin/env python3
"""
Drift Alert with Telegram notification
"""
import json
import subprocess
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
DRIFT_SCRIPT = SCRIPT_DIR / 'drift_alert_check.py'
ALERT_FILE = Path('/tmp/openclaw_drift_alert.json')
TELEGRAM_CHAT = '2017549847'  # Manu's DM

def send_telegram(message: str):
    """Send alert via telegram bot if available"""
    try:
        # Try using openclaw message tool via gateway
        result = subprocess.run(
            ['curl', '-s', '-X', 'POST',
             'http://127.0.0.1:18789/api/v1/message',
             '-H', 'Content-Type: application/json',
             '-d', json.dumps({
                 'channel': 'telegram',
                 'to': TELEGRAM_CHAT,
                 'message': message
             })],
            capture_output=True,
            text=True,
            timeout=10
        )
        return result.returncode == 0
    except Exception as e:
        print(f'Telegram send failed: {e}')
        return False

def main():
    # Run drift check
    result = subprocess.run(
        [sys.executable, str(DRIFT_SCRIPT)],
        capture_output=True,
        text=True
    )
    
    if result.returncode == 0:
        print('✓ No drift detected')
        return 0
    
    # Drift detected - load details
    if ALERT_FILE.exists():
        with open(ALERT_FILE, 'r') as f:
            alert = json.load(f)
        
        changes = '\n'.join([f'• {c}' for c in alert.get('changes', [])])
        message = f"""🚨 **OpenClaw Config Drift Detected**

Changes detected:
{changes}

Last touched: {alert.get('timestamp', 'unknown')}

Action: Review changes or update expected snapshot at:
`config-lock-expected.json`
"""
        send_telegram(message)
        print('Drift alert sent to Telegram')
    else:
        print('Drift detected but alert file missing')
    
    return 1

if __name__ == '__main__':
    sys.exit(main())
