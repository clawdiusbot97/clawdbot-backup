#!/usr/bin/env python3
from pathlib import Path
from datetime import datetime
import re, json

ws = Path('/home/manpac/.openclaw/workspace')
logs = [ws/'logs/local_llm.log', ws/'logs/trends_digest.log', ws/'logs/nightly_ops.log']
out = ws/'reports/nightly'/f"cost_guard_{datetime.now().strftime('%Y-%m-%d')}.md"
out.parent.mkdir(parents=True, exist_ok=True)

errors=0
slow=0
for p in logs:
    if not p.exists():
        continue
    txt = p.read_text(errors='ignore')[-200000:]
    errors += len(re.findall(r'ERROR|CRITICAL|failed', txt, re.I))
    slow += len(re.findall(r'\b(\d+\.\d+)s\b', txt))

spike = errors > 20

msg = [f"# Cost Guard — {datetime.now().date()}", "", f"- Error-like events: **{errors}**", f"- Timed entries observed: **{slow}**", ""]
msg += ["## Suggested actions", "- Increase cache TTL for local_llm if repeated prompts.", "- Reduce max_tokens for nightly prompts (128-192).", "- Skip heavy jobs when thresholds not met."]
if spike:
    msg += ["", "## ⚠️ Spike detected", "SPIKE: true", "- Error volume above threshold."]

out.write_text('\n'.join(msg))
print(str(out))
if spike:
    raise SystemExit(2)
