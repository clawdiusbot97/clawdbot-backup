#!/bin/bash
set -e
STATE="/home/manpac/.openclaw/workspace/budget-state.json"
python3 - <<'PY'
import json
p='/home/manpac/.openclaw/workspace/budget-state.json'
try:
  s=json.load(open(p))
except Exception:
  s={}
s['paused']=False
open(p,'w').write(json.dumps(s,indent=2))
print('budget-state paused=false')
PY
systemctl --user start openclaw-gateway
echo 'gateway started'