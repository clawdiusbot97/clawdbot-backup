#!/usr/bin/env python3
import json, glob, datetime
from pathlib import Path

WORKSPACE = Path('/home/manpac/.openclaw/workspace')
STATE_PATH = WORKSPACE / 'budget-state.json'
AGENTS_BASE = Path('/home/manpac/.openclaw/agents')
TODAY_UTC = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d')

init = {
    'openrouter_alert_sent': False,
    'openrouter_hardstop_sent': False,
    'codex_alert_sent': False,
    'codex_hardstop_sent': False,
    'paused': False,
    'last_report': ''
}

try:
    state = json.loads(STATE_PATH.read_text()) if STATE_PATH.exists() else {}
except Exception:
    state = {}
for k, v in init.items():
    state.setdefault(k, v)

def collect_totals(date_utc: str):
    totals = {'openai-codex': 0.0, 'openrouter': 0.0}
    # NOTE: do NOT read *.jsonl.reset.* snapshots; they duplicate historical events
    # and would overcount costs.
    files = sorted(set(
        glob.glob(str(AGENTS_BASE / '*' / 'sessions' / '*.jsonl'))
    ))
    for fp in files:
        try:
            with open(fp, 'r', encoding='utf-8', errors='ignore') as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        obj = json.loads(line)
                    except Exception:
                        continue
                    msg = obj.get('message')
                    if not isinstance(msg, dict):
                        continue
                    ts = obj.get('timestamp')
                    if not (isinstance(ts, str) and ts.startswith(date_utc)):
                        continue
                    provider = msg.get('provider')
                    if provider not in totals:
                        continue
                    total = ((msg.get('usage') or {}).get('cost') or {}).get('total')
                    if isinstance(total, (int, float)):
                        totals[provider] += float(total)
        except Exception:
            pass
    return totals

# Config writes are intentionally disabled here to avoid silent model resets.

totals = collect_totals(TODAY_UTC)
codex = round(totals['openai-codex'], 6)
openrouter = round(totals['openrouter'], 6)

state['codex_total_today'] = codex
state['openrouter_total_today'] = openrouter
state['totals'] = {
    'date_utc': TODAY_UTC,
    'openai-codex': codex,
    'openrouter': openrouter
}

status = {
    'date_utc': TODAY_UTC,
    'codex': codex,
    'openrouter': openrouter,
    'codex_alert': codex >= 15.0,
    'openrouter_alert': openrouter >= 10.0,
    'codex_hardstop': codex >= 15.0,
    'openrouter_hardstop': openrouter >= 10.0,
    'paused': bool(state.get('paused', False))
}

state['last_report'] = f"{TODAY_UTC} codex=${codex:.4f} openrouter=${openrouter:.4f} paused={status['paused']}"
STATE_PATH.write_text(json.dumps(state, ensure_ascii=False, indent=2) + '\n')

print(json.dumps(status, ensure_ascii=False))