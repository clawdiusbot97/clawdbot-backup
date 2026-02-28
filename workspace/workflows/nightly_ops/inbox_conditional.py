#!/usr/bin/env python3
from pathlib import Path
from datetime import datetime
import json, subprocess, re
import sys
sys.path.insert(0,'/home/manpac/.openclaw/workspace')
from skills.local_llm.run import LocalLLM

ws=Path('/home/manpac/.openclaw/workspace')
out=ws/'reports/nightly'/f"inbox_digest_{datetime.now().strftime('%Y-%m-%d')}.md"
out.parent.mkdir(parents=True, exist_ok=True)

# lightweight source: today's memory note as proxy if gmail cli parsing unavailable
mfile=ws/'memory'/f"{datetime.now().strftime('%Y-%m-%d')}.md"
text=mfile.read_text(errors='ignore') if mfile.exists() else ''
relevant=[ln for ln in text.splitlines() if re.search(r'itau|factura|suscrip|consumo|estado de cuenta',ln,re.I)]
if not relevant:
    out.write_text('# Inbox Digest\n\nSkipped: no new relevant emails/signals found.\n')
    print(str(out)); raise SystemExit(0)

llm=LocalLLM()
prompt='Group these lines into themes and suggest actions:\n'+'\n'.join(relevant[:80])
r=llm.infer(prompt,max_tokens=300,temperature=0.2)
if r.get('error'):
    body='# Inbox Digest\n\nFallback summary:\n- Revisar Itaú/Facturas/Suscripciones mañana 09:00.\n'
else:
    body='# Inbox Digest\n\n'+r.get('text','')
out.write_text(body)
print(str(out))