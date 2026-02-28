#!/usr/bin/env python3
from pathlib import Path
from datetime import datetime
import json, subprocess

ws=Path('/home/manpac/.openclaw/workspace')
chk=ws/'data/nightly/checkpoint.json'
chk.parent.mkdir(parents=True, exist_ok=True)
state={}
if chk.exists():
    state=json.loads(chk.read_text())
last=state.get('trends_last_count',0)

count=0
for p in [ws/'reports/twitter/daily/latest.json', ws/'reports/newsletter/daily/latest.json']:
    if p.exists():
        try:
            data=json.loads(p.read_text())
            count += len(data.get('items',[])) + len(data.get('tweets',[])) + len(data.get('articles',[]))
        except: pass

note=ws/'reports/nightly'/f"trends_gate_{datetime.now().strftime('%Y-%m-%d')}.md"
note.parent.mkdir(parents=True, exist_ok=True)
new=max(0,count-last)
if new>=30:
    subprocess.run(['python3','-m','workflows.trends_digest.run'],cwd=str(ws),check=False)
    note.write_text(f"# Trends gate\n\nRan trends_digest. New items: {new}\n")
else:
    note.write_text(f"# Trends gate\n\nSkipped trends_digest. New items: {new} (<30)\n")
state['trends_last_count']=count
chk.write_text(json.dumps(state,indent=2))
print(str(note))