#!/usr/bin/env python3
from pathlib import Path
from datetime import datetime
import sys
import os
os.environ['LOCAL_LLM_TIMEOUT'] = '120'  # increase timeout to 2 minutes
os.environ['LOCAL_LLM_CONTEXT'] = '4096'  # use full model context
sys.path.insert(0,'/home/manpac/.openclaw/workspace')
from skills.local_llm.run import LocalLLM

ws=Path('/home/manpac/.openclaw/workspace')
files=[ws/'docs/improvement_opportunities.md', ws/'docs/agents_registry.md', ws/'docs/skills_registry.md']
text=[]
for f in files:
    if f.exists():
        # Limit to 4000 characters to avoid exceeding context window
        text.append(f"## {f.name}\n"+f.read_text(errors='ignore')[:4000])

prompt=("Pick top 3 small wins (<=2h each) with high impact and low risk. "
"Return markdown bullets: what to change, files touched, risk, impact.\n\n"+"\n\n".join(text))
llm=LocalLLM()
r=llm.infer(prompt,max_tokens=500,temperature=0.2)
out=ws/'reports/nightly'/f"backlog_top3_{datetime.now().strftime('%Y-%m-%d')}.md"
out.parent.mkdir(parents=True, exist_ok=True)
if r.get('error'):
    body="# Backlog Top 3\n\nFallback (no LLM):\n- Consolidar cron duplicados morning briefing.\n- Migrar Slack deliveries a channel IDs en todos los jobs.\n- Añadir tests smoke para nightly ops.\n"
else:
    body="# Backlog Top 3\n\n"+r.get('text','')
out.write_text(body)
print(str(out))