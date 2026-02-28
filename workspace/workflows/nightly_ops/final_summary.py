#!/usr/bin/env python3
from pathlib import Path
from datetime import datetime
import re

ws=Path('/home/manpac/.openclaw/workspace')
d=datetime.now().strftime('%Y-%m-%d')
parts={
 'health': ws/'reports/nightly'/f'health_{d}.md',
 'cost': ws/'reports/nightly'/f'cost_guard_{d}.md',
 'backlog': ws/'reports/nightly'/f'backlog_top3_{d}.md',
 'trends': ws/'reports/trends/daily'/f'{d}.md',
 'inbox': ws/'reports/nightly'/f'inbox_digest_{d}.md'
}
out=ws/'reports/nightly'/f'summary_{d}.md'
out.parent.mkdir(parents=True, exist_ok=True)

lines=[f'# Nightly Summary — {d}','']
critical=False
highimpact=False
costspike=False
for k,p in parts.items():
    if p.exists():
        txt=p.read_text(errors='ignore')
        lines += [f'## {k.title()}', txt[:1500], '']
        if re.search(r'critical|gateway down|disk usage critical',txt,re.I): critical=True
        if re.search(r'spike detected|error volume above threshold',txt,re.I): costspike=True
        if re.search(r'high impact|impact:\s*high',txt,re.I): highimpact=True
    else:
        lines += [f'## {k.title()}', '_No output_', '']
out.write_text('\n'.join(lines))
print(str(out))
# exit code hints for alert policy
if critical or costspike or highimpact:
    raise SystemExit(3)
