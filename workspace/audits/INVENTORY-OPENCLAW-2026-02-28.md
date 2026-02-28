# GLOBAL INVENTORY — OpenClaw

- Date (UTC): 2026-02-28
- Mode: read-only (no changes applied)
- Output file: /home/manpac/.openclaw/workspace/audits/INVENTORY-OPENCLAW-2026-02-28.md

## Commands used (verbatim)

```bash
ls -la ~/.openclaw/cron
ls -la ~/.openclaw/cron/runs
cat ~/.openclaw/cron/jobs.json
ls -1 ~/.openclaw/cron/runs/*.jsonl
for f in ~/.openclaw/cron/runs/*.jsonl; do tail -n 1 "$f" | jq -r '...'; done
ls -la /home/manpac/.openclaw/workspace/memory/cron
jq -e . /home/manpac/.openclaw/workspace/memory/cron/*.json
ls -1 /home/manpac/.openclaw/workspace/memory/cron/*.corrupted
systemctl --user status openclaw-gateway.service --no-pager
systemctl --user status openclaw-rotate.service --no-pager
systemctl --user status openclaw-rotate.timer --no-pager
journalctl --user -u openclaw-gateway.service -p err..alert -n 50 --no-pager
journalctl --user -u openclaw-rotate.service -p err..alert -n 50 --no-pager
journalctl --user -u openclaw-rotate.timer -p err..alert -n 50 --no-pager
find /home/manpac/.openclaw/workspace/skills -mindepth 1 -maxdepth 1 -type d -printf '%f\n' | sort
```

---

## 1) Cron registry

Source: `~/.openclaw/cron/jobs.json`

- id: d4755542-b64c-4067-90b1-4e1076b31990
  name: morning-intelligence
  enabled: true
  schedule: cron 0 8 * * *
  tz: America/Montevideo
  sessionTarget: isolated
  wakeMode: now
  payload: kind=agentTurn thinking=low timeoutSeconds=600
  payload.message.firstLine: Execute Morning Intelligence Workflow (minimal payload).
  delivery: mode=announce channel=discord to=1475961144416931931
  state: lastRunAtMs=1772306800893 lastRunStatus=ok lastDeliveryStatus=delivered nextRunAtMs=1772362800000

---

## 2) Cron history (runs/*.jsonl)

Source directory: `~/.openclaw/cron/runs/`

Format: `jobId\taction\tstatus\tdelivered\tdeliveryStatus\tts`

```
02789295-9d14-479c-a9ef-d3c93bef2d4c	finished	error	false	unknown	1771834500093
075106a5-eb3c-40dd-875f-fd2229927ddd	finished	ok	true	delivered	1771841446765
09c8db11-a8c2-4091-b6c2-b0a8c68fc4a9	finished	ok	false		1771769419262
1179b115-83d0-47d6-830f-0687d53d343a	finished	ok	false		1771824200111
2888925e-a492-481e-bedb-db9fd615e403	finished	error	false		1771587624197
2f57ee48-16b1-4a33-9ba1-d3728fa59fcc	finished	ok	false		1771629406371
59355241-f710-4002-b044-c6a5ac7d3351	finished	error	false		1771363700506
5ee30706-284b-4406-9512-91782b68672b	finished	ok	false		1771823417019
62497b07-d021-4655-9340-1cd82badcc45	finished	ok	true	delivered	1771878645625
6ed083c2-ac56-42dc-a18d-7ecf4d41ae7f	finished	error	false		1771828257867
74e0f30c-8f1e-4866-894c-fcaf6cb0ca93	finished	error	false		1771804854217
7c6a920b-ed3f-4701-ba09-65202d3c6026	finished	ok	false	not-requested	1771867843566
7e76d0c9-97e3-4d00-aa4d-c24064519f9e	finished	ok	false	not-delivered	1771843889296
80625409-f748-4bb7-89e7-f8952123c3af	finished	ok	false		1771825208566
83ef00f3-6414-490b-87c9-88bfcf12d3b9	finished	error	false		1771594814915
8c7f2ba1-a3a0-48c0-b788-407aa4286763	finished	ok	false		1771808761174
91385195-348a-4006-9352-3c52f743c8d7	finished	ok	false		1771606820372
92783453-921f-4847-a288-c9fc430cba45	finished	ok	false		1771806804907
b625c33f-a9e5-46c2-92b6-946b5ccc8dc2	finished	error	false		1771671698328
b8ea6237-5df6-41cf-af52-988abd5dd906	finished	error	false		1771761203901
c8dfb239-ed97-4d74-80f5-0a403561fdd1	finished	ok	false		1771827011855
c93c5864-931c-4f16-b4ac-907702222853	finished	ok	false		1771822810851
d4755542-b64c-4067-90b1-4e1076b31990	finished	ok	true	delivered	1772306972851
d7e1795d-77b5-4555-88e1-d3098c6ac643	finished	error	false		1771621200375
db0fe015-9d14-4522-acf2-8775a2b4b97e	finished	error	false		1771690204762
dedba884-eb8d-42de-b637-fc345356a632	finished	ok	true	delivered	1771831841866
efa06a4f-bfc8-449f-995a-c5cac0f56ba7	finished	ok	false	not-delivered	1771883138331
f7ba2a8c-6339-4041-bac9-7e29f3f92383	finished	ok	false		1771668828314
fac822a3-7c2b-4b09-8181-acf586903840	finished	ok	true	delivered	1771846246352
fbd34d15-bde6-4f63-8bc6-6023e2be46c4	finished	ok	false		1771598868291
fd9aeac4-275f-4b27-b051-39f10ea849cd	finished	ok	false	not-delivered	1771837201325
```

---

## 3) Workspace mirrors (memory/cron/*.json)

Source directory: `/home/manpac/.openclaw/workspace/memory/cron/`

- VALID: /home/manpac/.openclaw/workspace/memory/cron/brokia-deadline-alerts.json
- VALID: /home/manpac/.openclaw/workspace/memory/cron/brokia-heartbeat.json
- VALID: /home/manpac/.openclaw/workspace/memory/cron/morning-intelligence.json
- CORRUPTED_FILE: /home/manpac/.openclaw/workspace/memory/cron/brokia-deadline-alerts.json.corrupted
- CORRUPTED_FILE: /home/manpac/.openclaw/workspace/memory/cron/brokia-heartbeat.json.corrupted

---

## 4) systemd user units

### 4.1 Status

```
● openclaw-gateway.service - OpenClaw Gateway (v2026.2.22-2)
     Loaded: loaded (/home/manpac/.config/systemd/user/openclaw-gateway.service; enabled; preset: enabled)
    Drop-In: /home/manpac/.config/systemd/user/openclaw-gateway.service.d
             └─override.conf
     Active: active (running) since Sat 2026-02-28 19:41:50 UTC; 13min ago
 Invocation: 54c0e4cdfc80400baec4ae255c0c21d0
   Main PID: 2393968 (openclaw)
      Tasks: 22 (limit: 9484)
     Memory: 508M (peak: 1G)
        CPU: 1min 27.462s
     CGroup: /user.slice/user-1001.slice/user@1001.service/app.slice/openclaw-gateway.service
             ├─2393968 openclaw
             ├─2393976 openclaw-gateway
             ├─2399180 /bin/bash -c "set -euo pipefail\nOUT=/home/manpac/.openclaw/workspace/audits/INVENTORY-OPENCLAW-2026-02-28.md\nmkdir -p \"\$(dirname \"\$OUT\")\"\n\nCRON_SUMMARY=\$(jq -r '\n  .jobs[] |\n  [\n    \"- id: \\(.id)\",\n    \"  name: \\(.name)\",\n    \"  enabled: \\(.enabled)\",\n    \"  schedule: \\(.schedule.kind) \\(.schedule.expr)\",\n    \"  tz: \\(.schedule.tz)\",\n    \"  sessionTarget: \\(.sessionTarget)\",\n    \"  wakeMode: \\(.wakeMode)\",\n    \"  payload: kind=\\(.payload.kind) thinking=\\(.payload.thinking) timeoutSeconds=\\(.payload.timeoutSeconds)\",\n    \"  payload.message.firstLine: \\(.payload.message|split(\"\\n\")[0])\",\n    \"  delivery: mode=\\(.delivery.mode) channel=\\(.delivery.channel) to=\\(.delivery.to)\",\n    \"  state: lastRunAtMs=\\(.state.lastRunAtMs) lastRunStatus=\\(.state.lastRunStatus) lastDeliveryStatus=\\(.state.lastDeliveryStatus) nextRunAtMs=\\(.state.nextRunAtMs)\"\n  ] | join(\"\\n\")\n' ~/.openclaw/cron/jobs.json)\n\nCRON_HISTORY=\$(for ff in ~/.openclaw/cron/runs/*.jsonl; do\n  jobId=\$(basename \"\$ff\" .jsonl)\n  last=\$(tail -n 1 \"\$ff\" || true)\n  if [ -z \"\$last\" ]; then\n    printf '%s\\t%s\\t%s\\t%s\\t%s\\t%s\\n' \"\$jobId\" \"EMPTY\" \"\" \"\" \"\" \"\"\n    continue\n  fi\n  echo \"\$last\" | jq -r --arg jobId \"\$jobId\" '[ \$jobId, (.action//\"?\"), (.status//\"?\"), (.delivered//false|tostring), (.deliveryStatus//\"\"), (.ts//0|tostring) ] | @tsv' 2>/dev/null \\\n    || printf '%s\\tINVALID_JSON\\t\\t\\t\\t\\n' \"\$jobId\"\ndone | sort)\n\nMIRROR_STATUS=\$(shopt -s nullglob\nfor ff in /home/manpac/.openclaw/workspace/memory/cron/*.json; do\n  if jq -e . \"\$ff\" >/dev/null 2>&1; then\n    echo \"- VALID: \$ff\"\n  else\n    echo \"- INVALID: \$ff\"\n  fi\ndone\nls -1 /home/manpac/.openclaw/workspace/memory/cron/*.corrupted 2>/dev/null | sed 's/^/- CORRUPTED_FILE: /' || true)\n\nSYSTEMD_STATUS=\$( (systemctl --user status openclaw-gateway.service --no-pager || true; echo; systemctl --user status openclaw-rotate.service --no-pager || true; echo; systemctl --user status openclaw-rotate.timer --no-pager || true) )\n\nJ_GATEWAY_ERR=\$(journalctl --user -u openclaw-gateway.service -p err..alert -n 50 --no-pager || true)\nJ_ROTATE_ERR=\$(journalctl --user -u openclaw-rotate.service -p err..alert -n 50 --no-pager || true)\nJ_TIMER_ERR=\$(journalctl --user -u openclaw-rotate.timer -p err..alert -n 50 --no-pager || true)\n\nSKILLS_DIRS=\$(find /home/manpac/.openclaw/workspace/skills -mindepth 1 -maxdepth 1 -type d -printf '%f\\n' 2>/dev/null | sort)\nPIPELINES=\$(printf \"%s\\n\" \"\$SKILLS_DIRS\" | grep -Ei 'newsletter|twitter|brokia|daily|morning|cron' || true)\n\ncat >\"\$OUT\" <<EOF\n# GLOBAL INVENTORY — OpenClaw\n\n- Date (UTC): 2026-02-28\n- Mode: read-only (no changes applied)\n- Output file: \$OUT\n\n## Commands used (verbatim)\n\n\\\`\\\`\\\`bash\nls -la ~/.openclaw/cron\nls -la ~/.openclaw/cron/runs\ncat ~/.openclaw/cron/jobs.json\nls -1 ~/.openclaw/cron/runs/*.jsonl\nfor f in ~/.openclaw/cron/runs/*.jsonl; do tail -n 1 \"\\\$f\" | jq -r '...'; done\nls -la /home/manpac/.openclaw/workspace/memory/cron\njq -e . /home/manpac/.openclaw/workspace/memory/cron/*.json\nls -1 /home/manpac/.openclaw/workspace/memory/cron/*.corrupted\nsystemctl --user status openclaw-gateway.service --no-pager\nsystemctl --user status openclaw-rotate.service --no-pager\nsystemctl --user status openclaw-rotate.timer --no-pager\njournalctl --user -u openclaw-gateway.service -p err..alert -n 50 --no-pager\njournalctl --user -u openclaw-rotate.service -p err..alert -n 50 --no-pager\njournalctl --user -u openclaw-rotate.timer -p err..alert -n 50 --no-pager\nfind /home/manpac/.openclaw/workspace/skills -mindepth 1 -maxdepth 1 -type d -printf '%f\\\\n' | sort\n\\\`\\\`\\\`\n\n---\n\n## 1) Cron registry\n\nSource: \\\`~/.openclaw/cron/jobs.json\\\`\n\n\$CRON_SUMMARY\n\n---\n\n## 2) Cron history (runs/*.jsonl)\n\nSource directory: \\\`~/.openclaw/cron/runs/\\\`\n\nFormat: \\\`jobId\\taction\\tstatus\\tdelivered\\tdeliveryStatus\\tts\\\`\n\n\\\`\\\`\\\`\n\$CRON_HISTORY\n\\\`\\\`\\\`\n\n---\n\n## 3) Workspace mirrors (memory/cron/*.json)\n\nSource directory: \\\`/home/manpac/.openclaw/workspace/memory/cron/\\\`\n\n\$MIRROR_STATUS\n\n---\n\n## 4) systemd user units\n\n### 4.1 Status\n\n\\\`\\\`\\\`\n\$SYSTEMD_STATUS\n\\\`\\\`\\\`\n\n### 4.2 Last 50 failure-level log lines (err..alert)\n\n#### openclaw-gateway.service\n\n\\\`\\\`\\\`\n\$J_GATEWAY_ERR\n\\\`\\\`\\\`\n\n#### openclaw-rotate.service\n\n\\\`\\\`\\\`\n\$J_ROTATE_ERR\n\\\`\\\`\\\`\n\n#### openclaw-rotate.timer\n\n\\\`\\\`\\\`\n\$J_TIMER_ERR\n\\\`\\\`\\\`\n\n---\n\n## 5) Skills inventory\n\nSource directory: \\\`/home/manpac/.openclaw/workspace/skills/\\\`\n\n### 5.1 Top-level skill directories\n\n\\\`\\\`\\\`\n\$SKILLS_DIRS\n\\\`\\\`\\\`\n\n### 5.2 Skills that look like pipelines (name match only)\n\n\\\`\\\`\\\`\n\$PIPELINES\n\\\`\\\`\\\`\nEOF\n\nprintf 'WROTE %s\\n' \"\$OUT\"\n"
             ├─2399348 /bin/bash -c "set -euo pipefail\nOUT=/home/manpac/.openclaw/workspace/audits/INVENTORY-OPENCLAW-2026-02-28.md\nmkdir -p \"\$(dirname \"\$OUT\")\"\n\nCRON_SUMMARY=\$(jq -r '\n  .jobs[] |\n  [\n    \"- id: \\(.id)\",\n    \"  name: \\(.name)\",\n    \"  enabled: \\(.enabled)\",\n    \"  schedule: \\(.schedule.kind) \\(.schedule.expr)\",\n    \"  tz: \\(.schedule.tz)\",\n    \"  sessionTarget: \\(.sessionTarget)\",\n    \"  wakeMode: \\(.wakeMode)\",\n    \"  payload: kind=\\(.payload.kind) thinking=\\(.payload.thinking) timeoutSeconds=\\(.payload.timeoutSeconds)\",\n    \"  payload.message.firstLine: \\(.payload.message|split(\"\\n\")[0])\",\n    \"  delivery: mode=\\(.delivery.mode) channel=\\(.delivery.channel) to=\\(.delivery.to)\",\n    \"  state: lastRunAtMs=\\(.state.lastRunAtMs) lastRunStatus=\\(.state.lastRunStatus) lastDeliveryStatus=\\(.state.lastDeliveryStatus) nextRunAtMs=\\(.state.nextRunAtMs)\"\n  ] | join(\"\\n\")\n' ~/.openclaw/cron/jobs.json)\n\nCRON_HISTORY=\$(for ff in ~/.openclaw/cron/runs/*.jsonl; do\n  jobId=\$(basename \"\$ff\" .jsonl)\n  last=\$(tail -n 1 \"\$ff\" || true)\n  if [ -z \"\$last\" ]; then\n    printf '%s\\t%s\\t%s\\t%s\\t%s\\t%s\\n' \"\$jobId\" \"EMPTY\" \"\" \"\" \"\" \"\"\n    continue\n  fi\n  echo \"\$last\" | jq -r --arg jobId \"\$jobId\" '[ \$jobId, (.action//\"?\"), (.status//\"?\"), (.delivered//false|tostring), (.deliveryStatus//\"\"), (.ts//0|tostring) ] | @tsv' 2>/dev/null \\\n    || printf '%s\\tINVALID_JSON\\t\\t\\t\\t\\n' \"\$jobId\"\ndone | sort)\n\nMIRROR_STATUS=\$(shopt -s nullglob\nfor ff in /home/manpac/.openclaw/workspace/memory/cron/*.json; do\n  if jq -e . \"\$ff\" >/dev/null 2>&1; then\n    echo \"- VALID: \$ff\"\n  else\n    echo \"- INVALID: \$ff\"\n  fi\ndone\nls -1 /home/manpac/.openclaw/workspace/memory/cron/*.corrupted 2>/dev/null | sed 's/^/- CORRUPTED_FILE: /' || true)\n\nSYSTEMD_STATUS=\$( (systemctl --user status openclaw-gateway.service --no-pager || true; echo; systemctl --user status openclaw-rotate.service --no-pager || true; echo; systemctl --user status openclaw-rotate.timer --no-pager || true) )\n\nJ_GATEWAY_ERR=\$(journalctl --user -u openclaw-gateway.service -p err..alert -n 50 --no-pager || true)\nJ_ROTATE_ERR=\$(journalctl --user -u openclaw-rotate.service -p err..alert -n 50 --no-pager || true)\nJ_TIMER_ERR=\$(journalctl --user -u openclaw-rotate.timer -p err..alert -n 50 --no-pager || true)\n\nSKILLS_DIRS=\$(find /home/manpac/.openclaw/workspace/skills -mindepth 1 -maxdepth 1 -type d -printf '%f\\n' 2>/dev/null | sort)\nPIPELINES=\$(printf \"%s\\n\" \"\$SKILLS_DIRS\" | grep -Ei 'newsletter|twitter|brokia|daily|morning|cron' || true)\n\ncat >\"\$OUT\" <<EOF\n# GLOBAL INVENTORY — OpenClaw\n\n- Date (UTC): 2026-02-28\n- Mode: read-only (no changes applied)\n- Output file: \$OUT\n\n## Commands used (verbatim)\n\n\\\`\\\`\\\`bash\nls -la ~/.openclaw/cron\nls -la ~/.openclaw/cron/runs\ncat ~/.openclaw/cron/jobs.json\nls -1 ~/.openclaw/cron/runs/*.jsonl\nfor f in ~/.openclaw/cron/runs/*.jsonl; do tail -n 1 \"\\\$f\" | jq -r '...'; done\nls -la /home/manpac/.openclaw/workspace/memory/cron\njq -e . /home/manpac/.openclaw/workspace/memory/cron/*.json\nls -1 /home/manpac/.openclaw/workspace/memory/cron/*.corrupted\nsystemctl --user status openclaw-gateway.service --no-pager\nsystemctl --user status openclaw-rotate.service --no-pager\nsystemctl --user status openclaw-rotate.timer --no-pager\njournalctl --user -u openclaw-gateway.service -p err..alert -n 50 --no-pager\njournalctl --user -u openclaw-rotate.service -p err..alert -n 50 --no-pager\njournalctl --user -u openclaw-rotate.timer -p err..alert -n 50 --no-pager\nfind /home/manpac/.openclaw/workspace/skills -mindepth 1 -maxdepth 1 -type d -printf '%f\\\\n' | sort\n\\\`\\\`\\\`\n\n---\n\n## 1) Cron registry\n\nSource: \\\`~/.openclaw/cron/jobs.json\\\`\n\n\$CRON_SUMMARY\n\n---\n\n## 2) Cron history (runs/*.jsonl)\n\nSource directory: \\\`~/.openclaw/cron/runs/\\\`\n\nFormat: \\\`jobId\\taction\\tstatus\\tdelivered\\tdeliveryStatus\\tts\\\`\n\n\\\`\\\`\\\`\n\$CRON_HISTORY\n\\\`\\\`\\\`\n\n---\n\n## 3) Workspace mirrors (memory/cron/*.json)\n\nSource directory: \\\`/home/manpac/.openclaw/workspace/memory/cron/\\\`\n\n\$MIRROR_STATUS\n\n---\n\n## 4) systemd user units\n\n### 4.1 Status\n\n\\\`\\\`\\\`\n\$SYSTEMD_STATUS\n\\\`\\\`\\\`\n\n### 4.2 Last 50 failure-level log lines (err..alert)\n\n#### openclaw-gateway.service\n\n\\\`\\\`\\\`\n\$J_GATEWAY_ERR\n\\\`\\\`\\\`\n\n#### openclaw-rotate.service\n\n\\\`\\\`\\\`\n\$J_ROTATE_ERR\n\\\`\\\`\\\`\n\n#### openclaw-rotate.timer\n\n\\\`\\\`\\\`\n\$J_TIMER_ERR\n\\\`\\\`\\\`\n\n---\n\n## 5) Skills inventory\n\nSource directory: \\\`/home/manpac/.openclaw/workspace/skills/\\\`\n\n### 5.1 Top-level skill directories\n\n\\\`\\\`\\\`\n\$SKILLS_DIRS\n\\\`\\\`\\\`\n\n### 5.2 Skills that look like pipelines (name match only)\n\n\\\`\\\`\\\`\n\$PIPELINES\n\\\`\\\`\\\`\nEOF\n\nprintf 'WROTE %s\\n' \"\$OUT\"\n"
             ├─2399349 /bin/bash -c "set -euo pipefail\nOUT=/home/manpac/.openclaw/workspace/audits/INVENTORY-OPENCLAW-2026-02-28.md\nmkdir -p \"\$(dirname \"\$OUT\")\"\n\nCRON_SUMMARY=\$(jq -r '\n  .jobs[] |\n  [\n    \"- id: \\(.id)\",\n    \"  name: \\(.name)\",\n    \"  enabled: \\(.enabled)\",\n    \"  schedule: \\(.schedule.kind) \\(.schedule.expr)\",\n    \"  tz: \\(.schedule.tz)\",\n    \"  sessionTarget: \\(.sessionTarget)\",\n    \"  wakeMode: \\(.wakeMode)\",\n    \"  payload: kind=\\(.payload.kind) thinking=\\(.payload.thinking) timeoutSeconds=\\(.payload.timeoutSeconds)\",\n    \"  payload.message.firstLine: \\(.payload.message|split(\"\\n\")[0])\",\n    \"  delivery: mode=\\(.delivery.mode) channel=\\(.delivery.channel) to=\\(.delivery.to)\",\n    \"  state: lastRunAtMs=\\(.state.lastRunAtMs) lastRunStatus=\\(.state.lastRunStatus) lastDeliveryStatus=\\(.state.lastDeliveryStatus) nextRunAtMs=\\(.state.nextRunAtMs)\"\n  ] | join(\"\\n\")\n' ~/.openclaw/cron/jobs.json)\n\nCRON_HISTORY=\$(for ff in ~/.openclaw/cron/runs/*.jsonl; do\n  jobId=\$(basename \"\$ff\" .jsonl)\n  last=\$(tail -n 1 \"\$ff\" || true)\n  if [ -z \"\$last\" ]; then\n    printf '%s\\t%s\\t%s\\t%s\\t%s\\t%s\\n' \"\$jobId\" \"EMPTY\" \"\" \"\" \"\" \"\"\n    continue\n  fi\n  echo \"\$last\" | jq -r --arg jobId \"\$jobId\" '[ \$jobId, (.action//\"?\"), (.status//\"?\"), (.delivered//false|tostring), (.deliveryStatus//\"\"), (.ts//0|tostring) ] | @tsv' 2>/dev/null \\\n    || printf '%s\\tINVALID_JSON\\t\\t\\t\\t\\n' \"\$jobId\"\ndone | sort)\n\nMIRROR_STATUS=\$(shopt -s nullglob\nfor ff in /home/manpac/.openclaw/workspace/memory/cron/*.json; do\n  if jq -e . \"\$ff\" >/dev/null 2>&1; then\n    echo \"- VALID: \$ff\"\n  else\n    echo \"- INVALID: \$ff\"\n  fi\ndone\nls -1 /home/manpac/.openclaw/workspace/memory/cron/*.corrupted 2>/dev/null | sed 's/^/- CORRUPTED_FILE: /' || true)\n\nSYSTEMD_STATUS=\$( (systemctl --user status openclaw-gateway.service --no-pager || true; echo; systemctl --user status openclaw-rotate.service --no-pager || true; echo; systemctl --user status openclaw-rotate.timer --no-pager || true) )\n\nJ_GATEWAY_ERR=\$(journalctl --user -u openclaw-gateway.service -p err..alert -n 50 --no-pager || true)\nJ_ROTATE_ERR=\$(journalctl --user -u openclaw-rotate.service -p err..alert -n 50 --no-pager || true)\nJ_TIMER_ERR=\$(journalctl --user -u openclaw-rotate.timer -p err..alert -n 50 --no-pager || true)\n\nSKILLS_DIRS=\$(find /home/manpac/.openclaw/workspace/skills -mindepth 1 -maxdepth 1 -type d -printf '%f\\n' 2>/dev/null | sort)\nPIPELINES=\$(printf \"%s\\n\" \"\$SKILLS_DIRS\" | grep -Ei 'newsletter|twitter|brokia|daily|morning|cron' || true)\n\ncat >\"\$OUT\" <<EOF\n# GLOBAL INVENTORY — OpenClaw\n\n- Date (UTC): 2026-02-28\n- Mode: read-only (no changes applied)\n- Output file: \$OUT\n\n## Commands used (verbatim)\n\n\\\`\\\`\\\`bash\nls -la ~/.openclaw/cron\nls -la ~/.openclaw/cron/runs\ncat ~/.openclaw/cron/jobs.json\nls -1 ~/.openclaw/cron/runs/*.jsonl\nfor f in ~/.openclaw/cron/runs/*.jsonl; do tail -n 1 \"\\\$f\" | jq -r '...'; done\nls -la /home/manpac/.openclaw/workspace/memory/cron\njq -e . /home/manpac/.openclaw/workspace/memory/cron/*.json\nls -1 /home/manpac/.openclaw/workspace/memory/cron/*.corrupted\nsystemctl --user status openclaw-gateway.service --no-pager\nsystemctl --user status openclaw-rotate.service --no-pager\nsystemctl --user status openclaw-rotate.timer --no-pager\njournalctl --user -u openclaw-gateway.service -p err..alert -n 50 --no-pager\njournalctl --user -u openclaw-rotate.service -p err..alert -n 50 --no-pager\njournalctl --user -u openclaw-rotate.timer -p err..alert -n 50 --no-pager\nfind /home/manpac/.openclaw/workspace/skills -mindepth 1 -maxdepth 1 -type d -printf '%f\\\\n' | sort\n\\\`\\\`\\\`\n\n---\n\n## 1) Cron registry\n\nSource: \\\`~/.openclaw/cron/jobs.json\\\`\n\n\$CRON_SUMMARY\n\n---\n\n## 2) Cron history (runs/*.jsonl)\n\nSource directory: \\\`~/.openclaw/cron/runs/\\\`\n\nFormat: \\\`jobId\\taction\\tstatus\\tdelivered\\tdeliveryStatus\\tts\\\`\n\n\\\`\\\`\\\`\n\$CRON_HISTORY\n\\\`\\\`\\\`\n\n---\n\n## 3) Workspace mirrors (memory/cron/*.json)\n\nSource directory: \\\`/home/manpac/.openclaw/workspace/memory/cron/\\\`\n\n\$MIRROR_STATUS\n\n---\n\n## 4) systemd user units\n\n### 4.1 Status\n\n\\\`\\\`\\\`\n\$SYSTEMD_STATUS\n\\\`\\\`\\\`\n\n### 4.2 Last 50 failure-level log lines (err..alert)\n\n#### openclaw-gateway.service\n\n\\\`\\\`\\\`\n\$J_GATEWAY_ERR\n\\\`\\\`\\\`\n\n#### openclaw-rotate.service\n\n\\\`\\\`\\\`\n\$J_ROTATE_ERR\n\\\`\\\`\\\`\n\n#### openclaw-rotate.timer\n\n\\\`\\\`\\\`\n\$J_TIMER_ERR\n\\\`\\\`\\\`\n\n---\n\n## 5) Skills inventory\n\nSource directory: \\\`/home/manpac/.openclaw/workspace/skills/\\\`\n\n### 5.1 Top-level skill directories\n\n\\\`\\\`\\\`\n\$SKILLS_DIRS\n\\\`\\\`\\\`\n\n### 5.2 Skills that look like pipelines (name match only)\n\n\\\`\\\`\\\`\n\$PIPELINES\n\\\`\\\`\\\`\nEOF\n\nprintf 'WROTE %s\\n' \"\$OUT\"\n"
             └─2399350 systemctl --user status openclaw-gateway.service --no-pager

Feb 28 19:42:16 srv1388589 node[2393976]: 2026-02-28T19:42:16.657Z [gateway] qmd memory startup initialization armed for agent "chief"
Feb 28 19:42:19 srv1388589 node[2393976]: 2026-02-28T19:42:19.672Z [gateway] qmd memory startup initialization armed for agent "ops"
Feb 28 19:42:22 srv1388589 node[2393976]: 2026-02-28T19:42:22.587Z [gateway] qmd memory startup initialization armed for agent "brokia"
Feb 28 19:42:25 srv1388589 node[2393976]: 2026-02-28T19:42:25.557Z [gateway] qmd memory startup initialization armed for agent "qubika"
Feb 28 19:42:28 srv1388589 node[2393976]: 2026-02-28T19:42:28.618Z [gateway] qmd memory startup initialization armed for agent "orchestrator-kimi"
Feb 28 19:44:01 srv1388589 node[2393976]: 2026-02-28T19:44:01.808Z [ws] ⇄ res ✓ usage.cost 134ms conn=d8f9a3f9…9fce id=bd280725…381a
Feb 28 19:44:02 srv1388589 node[2393976]: 2026-02-28T19:44:02.014Z [ws] ⇄ res ✓ sessions.usage 350ms conn=d8f9a3f9…9fce id=b02bdbc0…f6fc
Feb 28 19:47:23 srv1388589 node[2393976]: 2026-02-28T19:47:23.546Z [ws] ⇄ res ✓ sessions.usage 592ms conn=d8f9a3f9…9fce id=42d0b5c1…465b
Feb 28 19:48:25 srv1388589 node[2393976]: 2026-02-28T19:48:25.876+00:00 [hooks/session-memory] Session context saved to ~/.openclaw/workspace/memory/2026-02-28-morning-intel.md
Feb 28 19:48:31 srv1388589 node[2393976]: 2026-02-28T19:48:31.086+00:00 [tools] read failed: ENOENT: no such file or directory, access '/home/manpac/.openclaw/workspace/memory/2026-02-28.md'

× openclaw-rotate.service - OpenClaw model failover router + drift guard
     Loaded: loaded (/home/manpac/.config/systemd/user/openclaw-rotate.service; disabled; preset: enabled)
     Active: failed (Result: exit-code) since Sat 2026-02-28 19:55:14 UTC; 33s ago
 Invocation: b83661b0229c409eaca2066006d3bcbb
TriggeredBy: ● openclaw-rotate.timer
    Process: 2399040 ExecStart=/usr/bin/env python3 /home/manpac/.openclaw/workspace/scripts/config_lock_check.py (code=exited, status=1/FAILURE)
   Main PID: 2399040 (code=exited, status=1/FAILURE)
   Mem peak: 5.2M
        CPU: 31ms

Feb 28 19:55:14 srv1388589 env[2399040]: CONFIG_LOCK_FAILED
Feb 28 19:55:14 srv1388589 env[2399040]: - main.primary mismatch: expected=openrouter/moonshotai/kimi-k2.5 actual=openai-codex/gpt-5.2
Feb 28 19:55:14 srv1388589 env[2399040]: - main.fallbacks mismatch: expected=['openrouter/deepseek/deepseek-v3.2', 'openrouter/minimax/minimax-m2.1'] actual=['openrouter/moonshotai/kimi-k2.5', 'openrouter/deepseek/deepseek-v3.2', 'openrouter/minimax/minimax-m2.1']
Feb 28 19:55:14 srv1388589 env[2399040]: - writer.fallbacks mismatch: expected=['openrouter/deepseek/deepseek-v3.2'] actual=['openrouter/deepseek/deepseek-v3.2', 'openrouter/moonshotai/kimi-k2.5']
Feb 28 19:55:14 srv1388589 env[2399040]: - builder.primary mismatch: expected=openrouter/deepseek/deepseek-v3.2 actual=openai-codex/gpt-5.3-codex
Feb 28 19:55:14 srv1388589 env[2399040]: - builder.fallbacks mismatch: expected=['openai-codex/gpt-5.3-codex'] actual=['openai-codex/gpt-5.2-codex']
Feb 28 19:55:14 srv1388589 env[2399040]: - ops.fallbacks mismatch: expected=['openrouter/minimax/minimax-m2.1'] actual=['openai-codex/gpt-5.3-codex', 'openrouter/minimax/minimax-m2.1']
Feb 28 19:55:14 srv1388589 systemd[1326]: openclaw-rotate.service: Main process exited, code=exited, status=1/FAILURE
Feb 28 19:55:14 srv1388589 systemd[1326]: openclaw-rotate.service: Failed with result 'exit-code'.
Feb 28 19:55:14 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.

● openclaw-rotate.timer - Timer for OpenClaw model rotation
     Loaded: loaded (/home/manpac/.config/systemd/user/openclaw-rotate.timer; enabled; preset: enabled)
     Active: active (waiting) since Sun 2026-02-22 11:54:34 UTC; 6 days ago
 Invocation: 4888e603201f4d978dc97af1a83e6567
    Trigger: Sat 2026-02-28 20:00:00 UTC; 4min 12s left
   Triggers: ● openclaw-rotate.service

Feb 22 11:54:34 srv1388589 systemd[1326]: Stopping openclaw-rotate.timer - Timer for OpenClaw model rotation...
Feb 22 11:54:34 srv1388589 systemd[1326]: Started openclaw-rotate.timer - Timer for OpenClaw model rotation.
```

### 4.2 Last 50 failure-level log lines (err..alert)

#### openclaw-gateway.service

```
Feb 28 18:36:44 srv1388589 sudo[2372724]:   manpac : a password is required ; PWD=/home/manpac/.openclaw/workspace ; USER=root ; COMMAND=/usr/bin/true
```

#### openclaw-rotate.service

```
Feb 28 15:50:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 15:55:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 16:00:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 16:05:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 16:10:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 16:15:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 16:20:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 16:25:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 16:30:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 16:35:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 16:40:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 16:45:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 16:50:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 16:55:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 17:00:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 17:05:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 17:10:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 17:15:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 17:20:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 17:25:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 17:30:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 17:35:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 17:40:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 17:45:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 17:50:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 17:55:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 18:00:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 18:05:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 18:10:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 18:15:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 18:20:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 18:25:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 18:30:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 18:35:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 18:40:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 18:45:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 18:50:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 18:55:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 19:00:01 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 19:05:04 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 19:10:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 19:15:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 19:20:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 19:25:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 19:30:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 19:35:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 19:40:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 19:45:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 19:50:15 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
Feb 28 19:55:14 srv1388589 systemd[1326]: Failed to start openclaw-rotate.service - OpenClaw model failover router + drift guard.
```

#### openclaw-rotate.timer

```
-- No entries --
```

---

## 5) Skills inventory

Source directory: `/home/manpac/.openclaw/workspace/skills/`

### 5.1 Top-level skill directories

```
brokia-deadline-alerts
brokia-heartbeat
brokia-plan
brokia-telegram-intake
cron-middleware
daily-backup
daily-update
excalidraw-diagram
exec-compact
gateway-preflight
last30days
local_llm
model-admin
morning-intelligence
newsletter-digest
read-compact
searxng-search
secure-token
twitter-educativo
twitter-fetch
twitter-format
twitter-morning-briefing
```

### 5.2 Skills that look like pipelines (name match only)

```
brokia-deadline-alerts
brokia-heartbeat
brokia-plan
brokia-telegram-intake
cron-middleware
daily-backup
daily-update
morning-intelligence
newsletter-digest
twitter-educativo
twitter-fetch
twitter-format
twitter-morning-briefing
```
