# DRIFT TRIAGE — OpenClaw

- Date (UTC): 2026-02-28
- Mode: read-only (no changes applied)
- Inputs: `/home/manpac/.openclaw/cron/jobs.json`, `/home/manpac/.openclaw/cron/runs/*.jsonl`, `/home/manpac/.openclaw/workspace/skills/*`
- Output: `/home/manpac/.openclaw/workspace/audits/DRIFT-TRIAGE-2026-02-28.md`

## Commands used (verbatim)
```bash
cat ~/.openclaw/cron/jobs.json
ls -1 ~/.openclaw/cron/runs/*.jsonl
# Orphan set: basenames(runs/*.jsonl) minus jobs[].id
# Per orphan evidence scan:
tail -n 20 ~/.openclaw/cron/runs/<jobId>.jsonl
find /home/manpac/.openclaw/workspace/skills -mindepth 1 -maxdepth 1 -type d -printf '%f\n' | sort
```

## 1) Orphaned jobIds
Definition: `runs/*.jsonl jobIds` minus `jobs.json jobs[].id`.

- jobs.json ids: 1
- runs/*.jsonl: 31
- orphaned: 30

- 02789295-9d14-479c-a9ef-d3c93bef2d4c (run file: `/home/manpac/.openclaw/cron/runs/02789295-9d14-479c-a9ef-d3c93bef2d4c.jsonl`)
- 075106a5-eb3c-40dd-875f-fd2229927ddd (run file: `/home/manpac/.openclaw/cron/runs/075106a5-eb3c-40dd-875f-fd2229927ddd.jsonl`)
- 09c8db11-a8c2-4091-b6c2-b0a8c68fc4a9 (run file: `/home/manpac/.openclaw/cron/runs/09c8db11-a8c2-4091-b6c2-b0a8c68fc4a9.jsonl`)
- 1179b115-83d0-47d6-830f-0687d53d343a (run file: `/home/manpac/.openclaw/cron/runs/1179b115-83d0-47d6-830f-0687d53d343a.jsonl`)
- 2888925e-a492-481e-bedb-db9fd615e403 (run file: `/home/manpac/.openclaw/cron/runs/2888925e-a492-481e-bedb-db9fd615e403.jsonl`)
- 2f57ee48-16b1-4a33-9ba1-d3728fa59fcc (run file: `/home/manpac/.openclaw/cron/runs/2f57ee48-16b1-4a33-9ba1-d3728fa59fcc.jsonl`)
- 59355241-f710-4002-b044-c6a5ac7d3351 (run file: `/home/manpac/.openclaw/cron/runs/59355241-f710-4002-b044-c6a5ac7d3351.jsonl`)
- 5ee30706-284b-4406-9512-91782b68672b (run file: `/home/manpac/.openclaw/cron/runs/5ee30706-284b-4406-9512-91782b68672b.jsonl`)
- 62497b07-d021-4655-9340-1cd82badcc45 (run file: `/home/manpac/.openclaw/cron/runs/62497b07-d021-4655-9340-1cd82badcc45.jsonl`)
- 6ed083c2-ac56-42dc-a18d-7ecf4d41ae7f (run file: `/home/manpac/.openclaw/cron/runs/6ed083c2-ac56-42dc-a18d-7ecf4d41ae7f.jsonl`)
- 74e0f30c-8f1e-4866-894c-fcaf6cb0ca93 (run file: `/home/manpac/.openclaw/cron/runs/74e0f30c-8f1e-4866-894c-fcaf6cb0ca93.jsonl`)
- 7c6a920b-ed3f-4701-ba09-65202d3c6026 (run file: `/home/manpac/.openclaw/cron/runs/7c6a920b-ed3f-4701-ba09-65202d3c6026.jsonl`)
- 7e76d0c9-97e3-4d00-aa4d-c24064519f9e (run file: `/home/manpac/.openclaw/cron/runs/7e76d0c9-97e3-4d00-aa4d-c24064519f9e.jsonl`)
- 80625409-f748-4bb7-89e7-f8952123c3af (run file: `/home/manpac/.openclaw/cron/runs/80625409-f748-4bb7-89e7-f8952123c3af.jsonl`)
- 83ef00f3-6414-490b-87c9-88bfcf12d3b9 (run file: `/home/manpac/.openclaw/cron/runs/83ef00f3-6414-490b-87c9-88bfcf12d3b9.jsonl`)
- 8c7f2ba1-a3a0-48c0-b788-407aa4286763 (run file: `/home/manpac/.openclaw/cron/runs/8c7f2ba1-a3a0-48c0-b788-407aa4286763.jsonl`)
- 91385195-348a-4006-9352-3c52f743c8d7 (run file: `/home/manpac/.openclaw/cron/runs/91385195-348a-4006-9352-3c52f743c8d7.jsonl`)
- 92783453-921f-4847-a288-c9fc430cba45 (run file: `/home/manpac/.openclaw/cron/runs/92783453-921f-4847-a288-c9fc430cba45.jsonl`)
- b625c33f-a9e5-46c2-92b6-946b5ccc8dc2 (run file: `/home/manpac/.openclaw/cron/runs/b625c33f-a9e5-46c2-92b6-946b5ccc8dc2.jsonl`)
- b8ea6237-5df6-41cf-af52-988abd5dd906 (run file: `/home/manpac/.openclaw/cron/runs/b8ea6237-5df6-41cf-af52-988abd5dd906.jsonl`)
- c8dfb239-ed97-4d74-80f5-0a403561fdd1 (run file: `/home/manpac/.openclaw/cron/runs/c8dfb239-ed97-4d74-80f5-0a403561fdd1.jsonl`)
- c93c5864-931c-4f16-b4ac-907702222853 (run file: `/home/manpac/.openclaw/cron/runs/c93c5864-931c-4f16-b4ac-907702222853.jsonl`)
- d7e1795d-77b5-4555-88e1-d3098c6ac643 (run file: `/home/manpac/.openclaw/cron/runs/d7e1795d-77b5-4555-88e1-d3098c6ac643.jsonl`)
- db0fe015-9d14-4522-acf2-8775a2b4b97e (run file: `/home/manpac/.openclaw/cron/runs/db0fe015-9d14-4522-acf2-8775a2b4b97e.jsonl`)
- dedba884-eb8d-42de-b637-fc345356a632 (run file: `/home/manpac/.openclaw/cron/runs/dedba884-eb8d-42de-b637-fc345356a632.jsonl`)
- efa06a4f-bfc8-449f-995a-c5cac0f56ba7 (run file: `/home/manpac/.openclaw/cron/runs/efa06a4f-bfc8-449f-995a-c5cac0f56ba7.jsonl`)
- f7ba2a8c-6339-4041-bac9-7e29f3f92383 (run file: `/home/manpac/.openclaw/cron/runs/f7ba2a8c-6339-4041-bac9-7e29f3f92383.jsonl`)
- fac822a3-7c2b-4b09-8181-acf586903840 (run file: `/home/manpac/.openclaw/cron/runs/fac822a3-7c2b-4b09-8181-acf586903840.jsonl`)
- fbd34d15-bde6-4f63-8bc6-6023e2be46c4 (run file: `/home/manpac/.openclaw/cron/runs/fbd34d15-bde6-4f63-8bc6-6023e2be46c4.jsonl`)
- fd9aeac4-275f-4b27-b051-39f10ea849cd (run file: `/home/manpac/.openclaw/cron/runs/fd9aeac4-275f-4b27-b051-39f10ea849cd.jsonl`)

## 2) Orphan details (evidence only)

### 02789295-9d14-479c-a9ef-d3c93bef2d4c
- run file: `/home/manpac/.openclaw/cron/runs/02789295-9d14-479c-a9ef-d3c93bef2d4c.jsonl`
- inferred likely name/purpose: **Done. Daily scouting completed and saved:**
- Evidence field: `.summary` first line in last 20 lines
- metrics evidence: max `.ts`=1771834500093 (2026-02-23T08:15:00.093000Z); `.status==error` count=1; `.delivered==true` count=0
- label: **ARCHIVE** — Evidence field(s): `.status` (last=error) and `.status==error` count=1
- evidence fields (from last event):
  - `last.status` = `error`
  - `last.deliveryStatus` = `unknown`

### 075106a5-eb3c-40dd-875f-fd2229927ddd
- run file: `/home/manpac/.openclaw/cron/runs/075106a5-eb3c-40dd-875f-fd2229927ddd.jsonl`
- inferred likely name/purpose: **⚠️ 🌐 Browser: `start` failed: Can't reach the OpenClaw browser control service. Restart the OpenClaw gateway (OpenClaw.app menubar, or `openclaw gateway`). Do NOT retry the browser tool — it will keep**
- Evidence field: `.summary` first line in last 20 lines
- metrics evidence: max `.ts`=1771841446765 (2026-02-23T10:10:46.765000Z); `.status==error` count=2; `.delivered==true` count=1
- label: **RESTORE** — Evidence field(s): `.delivered` (count=1) and/or `.deliveryStatus` (last=delivered)
- evidence fields (from last event):
  - `last.summary.firstLine` = `Encontré un evento Brokia/ORT con vencimiento próximo:`
  - `last.sessionKey` = `agent:main:cron:075106a5-eb3c-40dd-875f-fd2229927ddd:run:6ee0ac1a-bacd-482b-a7eb-94edd40d1765`
  - `last.status` = `ok`
  - `last.delivered` = `True`
  - `last.deliveryStatus` = `delivered`

### 09c8db11-a8c2-4091-b6c2-b0a8c68fc4a9
- run file: `/home/manpac/.openclaw/cron/runs/09c8db11-a8c2-4091-b6c2-b0a8c68fc4a9.jsonl`
- inferred likely name/purpose: ****Task completed successfully.****
- Evidence field: `.summary` first line in last 20 lines
- metrics evidence: max `.ts`=1771769419262 (2026-02-22T14:10:19.262000Z); `.status==error` count=0; `.delivered==true` count=0
- label: **IGNORE** — Evidence field(s): `.delivered` (count=0) and `.status` (last=ok)
- evidence fields (from last event):
  - `last.summary.firstLine` = `**Task completed successfully.**`
  - `last.sessionKey` = `agent:main:cron:09c8db11-a8c2-4091-b6c2-b0a8c68fc4a9:run:2cdfd993-1f29-4925-8e51-77c0efa95060`
  - `last.status` = `ok`

### 1179b115-83d0-47d6-830f-0687d53d343a
- run file: `/home/manpac/.openclaw/cron/runs/1179b115-83d0-47d6-830f-0687d53d343a.jsonl`
- inferred likely name/purpose: **Done. The module ran and generated:**
- Evidence field: `.summary` first line in last 20 lines
- metrics evidence: max `.ts`=1771824200111 (2026-02-23T05:23:20.111000Z); `.status==error` count=1; `.delivered==true` count=0
- label: **IGNORE** — Evidence field(s): `.delivered` (count=0) and `.status` (last=ok)
- evidence fields (from last event):
  - `last.summary.firstLine` = `✅ **Nightly backlog groomer completado**`
  - `last.sessionKey` = `agent:main:cron:1179b115-83d0-47d6-830f-0687d53d343a:run:0145e2ce-3374-4c10-a432-3cb26c65a4c9`
  - `last.status` = `ok`

### 2888925e-a492-481e-bedb-db9fd615e403
- run file: `/home/manpac/.openclaw/cron/runs/2888925e-a492-481e-bedb-db9fd615e403.jsonl`
- inferred likely name/purpose: **(no match)**
- Evidence: none found in last 20 lines
- metrics evidence: max `.ts`=1771587624197 (2026-02-20T11:40:24.197000Z); `.status==error` count=1; `.delivered==true` count=0
- label: **ARCHIVE** — Evidence field(s): `.status` (last=error) and `.status==error` count=1
- evidence fields (from last event):
  - `last.status` = `error`

### 2f57ee48-16b1-4a33-9ba1-d3728fa59fcc
- run file: `/home/manpac/.openclaw/cron/runs/2f57ee48-16b1-4a33-9ba1-d3728fa59fcc.jsonl`
- inferred likely name/purpose: **twitter-fetch**
- Evidence field: last20 text contains skill dir name 'twitter-fetch'
- metrics evidence: max `.ts`=1771629406371 (2026-02-20T23:16:46.371000Z); `.status==error` count=4; `.delivered==true` count=0
- label: **IGNORE** — Evidence field(s): `.delivered` (count=0) and `.status` (last=ok)
- evidence fields (from last event):
  - `last.summary.firstLine` = `Twitter RSS digest pipeline executed successfully.`
  - `last.sessionKey` = `agent:main:cron:2f57ee48-16b1-4a33-9ba1-d3728fa59fcc:run:0710cef0-c180-48c8-ba9b-7bf3d046e95d`
  - `last.status` = `ok`

### 59355241-f710-4002-b044-c6a5ac7d3351
- run file: `/home/manpac/.openclaw/cron/runs/59355241-f710-4002-b044-c6a5ac7d3351.jsonl`
- inferred likely name/purpose: **Budget guard OK: codex $0.00, openrouter $0.00, no new alerts.**
- Evidence field: `.summary` first line in last 20 lines
- metrics evidence: max `.ts`=1771363700506 (2026-02-17T21:28:20.506000Z); `.status==error` count=2; `.delivered==true` count=0
- label: **ARCHIVE** — Evidence field(s): `.status` (last=error) and `.status==error` count=2
- evidence fields (from last event):
  - `last.summary.firstLine` = `Budget guard updated: Codex $5.09 and OpenRouter $0.26 (UTC 2026-02-17), no new alert/hard-stop actions, paused=false.`
  - `last.sessionKey` = `agent:main:cron:59355241-f710-4002-b044-c6a5ac7d3351:run:96783b58-13e1-4abd-8243-cbec4b59aa91`
  - `last.status` = `error`

### 5ee30706-284b-4406-9512-91782b68672b
- run file: `/home/manpac/.openclaw/cron/runs/5ee30706-284b-4406-9512-91782b68672b.jsonl`
- inferred likely name/purpose: **local_llm**
- Evidence field: last20 text contains skill dir name 'local_llm'
- metrics evidence: max `.ts`=1771823417019 (2026-02-23T05:10:17.019000Z); `.status==error` count=0; `.delivered==true` count=0
- label: **IGNORE** — Evidence field(s): `.delivered` (count=0) and `.status` (last=ok)
- evidence fields (from last event):
  - `last.summary.firstLine` = `Report generated: `reports/nightly/cost_guard_2026-02-23.md``
  - `last.sessionKey` = `agent:main:cron:5ee30706-284b-4406-9512-91782b68672b:run:b05e2a27-9c97-47c0-ac6f-51e2b6f51f4c`
  - `last.status` = `ok`

### 62497b07-d021-4655-9340-1cd82badcc45
- run file: `/home/manpac/.openclaw/cron/runs/62497b07-d021-4655-9340-1cd82badcc45.jsonl`
- inferred likely name/purpose: **⚠️ ✉️ Message failed: Slack channels require a channel id (use channel:<id>)**
- Evidence field: `.summary` first line in last 20 lines
- metrics evidence: max `.ts`=1771878645625 (2026-02-23T20:30:45.625000Z); `.status==error` count=3; `.delivered==true` count=1
- label: **RESTORE** — Evidence field(s): `.delivered` (count=1) and/or `.deliveryStatus` (last=delivered)
- evidence fields (from last event):
  - `last.summary.firstLine` = `400 openrouter/deepseek-v3.2 is not a valid model ID`
  - `last.sessionKey` = `agent:main:cron:62497b07-d021-4655-9340-1cd82badcc45:run:b566bf26-44a6-42b6-9bdf-8e0b50cd36ec`
  - `last.status` = `ok`
  - `last.delivered` = `True`
  - `last.deliveryStatus` = `delivered`

### 6ed083c2-ac56-42dc-a18d-7ecf4d41ae7f
- run file: `/home/manpac/.openclaw/cron/runs/6ed083c2-ac56-42dc-a18d-7ecf4d41ae7f.jsonl`
- inferred likely name/purpose: **local_llm**
- Evidence field: last20 text contains skill dir name 'local_llm'
- metrics evidence: max `.ts`=1771828257867 (2026-02-23T06:30:57.867000Z); `.status==error` count=3; `.delivered==true` count=0
- label: **ARCHIVE** — Evidence field(s): `.status` (last=error) and `.status==error` count=3
- evidence fields (from last event):
  - `last.summary.firstLine` = `Exit code 3 indicates **critical/cost spike/high impact detected** — announcement required.`
  - `last.sessionKey` = `agent:main:cron:6ed083c2-ac56-42dc-a18d-7ecf4d41ae7f:run:3d384b12-77da-4de6-9fd1-0fda0294c214`
  - `last.status` = `error`

### 74e0f30c-8f1e-4866-894c-fcaf6cb0ca93
- run file: `/home/manpac/.openclaw/cron/runs/74e0f30c-8f1e-4866-894c-fcaf6cb0ca93.jsonl`
- inferred likely name/purpose: **✅ Summary delivered to **Calwdius - Briefings** (message ID: 518).**
- Evidence field: `.summary` first line in last 20 lines
- metrics evidence: max `.ts`=1771804854217 (2026-02-23T00:00:54.217000Z); `.status==error` count=1; `.delivered==true` count=0
- label: **ARCHIVE** — Evidence field(s): `.status` (last=error) and `.status==error` count=1
- evidence fields (from last event):
  - `last.summary.firstLine` = `✅ Summary delivered to **Calwdius - Briefings** (message ID: 518).`
  - `last.sessionKey` = `agent:main:cron:74e0f30c-8f1e-4866-894c-fcaf6cb0ca93:run:9a58c131-2956-4349-b279-398754d38eda`
  - `last.status` = `error`

### 7c6a920b-ed3f-4701-ba09-65202d3c6026
- run file: `/home/manpac/.openclaw/cron/runs/7c6a920b-ed3f-4701-ba09-65202d3c6026.jsonl`
- inferred likely name/purpose: **DAILY_LIFE_QUESTION – Es hora de la pregunta diaria de vida. Por favor selecciona una pregunta nueva del cuestionario y pregúntamela.**
- Evidence field: `.summary` first line in last 20 lines
- metrics evidence: max `.ts`=1771867843566 (2026-02-23T17:30:43.566000Z); `.status==error` count=0; `.delivered==true` count=0
- label: **IGNORE** — Evidence field(s): `.delivered` (count=0) and `.status` (last=ok)
- evidence fields (from last event):
  - `last.summary.firstLine` = `DAILY_LIFE_QUESTION – Es hora de la pregunta diaria de vida. Por favor selecciona una pregunta nueva del cuestionario y pregúntamela.`
  - `last.status` = `ok`
  - `last.deliveryStatus` = `not-requested`

### 7e76d0c9-97e3-4d00-aa4d-c24064519f9e
- run file: `/home/manpac/.openclaw/cron/runs/7e76d0c9-97e3-4d00-aa4d-c24064519f9e.jsonl`
- inferred likely name/purpose: **Tengo suficientes datos. Compilando el archivo de briefing...**
- Evidence field: `.summary` first line in last 20 lines
- metrics evidence: max `.ts`=1771843889296 (2026-02-23T10:51:29.296000Z); `.status==error` count=0; `.delivered==true` count=0
- label: **IGNORE** — Evidence field(s): `.delivered` (count=0) and `.status` (last=ok)
- evidence fields (from last event):
  - `last.summary.firstLine` = `Now let me create the briefing file with the gathered content:`
  - `last.sessionKey` = `agent:main:cron:7e76d0c9-97e3-4d00-aa4d-c24064519f9e:run:ca3cdecf-0cee-4099-ad0f-91ba60bc613f`
  - `last.status` = `ok`
  - `last.delivered` = `False`
  - `last.deliveryStatus` = `not-delivered`

### 80625409-f748-4bb7-89e7-f8952123c3af
- run file: `/home/manpac/.openclaw/cron/runs/80625409-f748-4bb7-89e7-f8952123c3af.jsonl`
- inferred likely name/purpose: **Done — executed:**
- Evidence field: `.summary` first line in last 20 lines
- metrics evidence: max `.ts`=1771825208566 (2026-02-23T05:40:08.566000Z); `.status==error` count=0; `.delivered==true` count=0
- label: **IGNORE** — Evidence field(s): `.delivered` (count=0) and `.status` (last=ok)
- evidence fields (from last event):
  - `last.sessionKey` = `agent:main:cron:80625409-f748-4bb7-89e7-f8952123c3af:run:0269596f-ca1f-4b71-960e-a14ba51cc520`
  - `last.status` = `ok`

### 83ef00f3-6414-490b-87c9-88bfcf12d3b9
- run file: `/home/manpac/.openclaw/cron/runs/83ef00f3-6414-490b-87c9-88bfcf12d3b9.jsonl`
- inferred likely name/purpose: **(no match)**
- Evidence: none found in last 20 lines
- metrics evidence: max `.ts`=1771594814915 (2026-02-20T13:40:14.915000Z); `.status==error` count=1; `.delivered==true` count=0
- label: **ARCHIVE** — Evidence field(s): `.status` (last=error) and `.status==error` count=1
- evidence fields (from last event):
  - `last.status` = `error`

### 8c7f2ba1-a3a0-48c0-b788-407aa4286763
- run file: `/home/manpac/.openclaw/cron/runs/8c7f2ba1-a3a0-48c0-b788-407aa4286763.jsonl`
- inferred likely name/purpose: **⚠️ 📝 Edit failed: Missing required parameter: path (path or file_path). Supply correct parameters before retrying.**
- Evidence field: `.summary` first line in last 20 lines
- metrics evidence: max `.ts`=1771808761174 (2026-02-23T01:06:01.174000Z); `.status==error` count=0; `.delivered==true` count=0
- label: **IGNORE** — Evidence field(s): `.delivered` (count=0) and `.status` (last=ok)
- evidence fields (from last event):
  - `last.summary.firstLine` = `⚠️ 📝 Edit failed: Missing required parameter: path (path or file_path). Supply correct parameters before retrying.`
  - `last.sessionKey` = `agent:main:cron:8c7f2ba1-a3a0-48c0-b788-407aa4286763:run:6f488d6f-7a5b-4346-af5a-07b5fadb62f7`
  - `last.status` = `ok`

### 91385195-348a-4006-9352-3c52f743c8d7
- run file: `/home/manpac/.openclaw/cron/runs/91385195-348a-4006-9352-3c52f743c8d7.jsonl`
- inferred likely name/purpose: **🧠 **Entrevista inicial de vida – Comencemos****
- Evidence field: `.summary` first line in last 20 lines
- metrics evidence: max `.ts`=1771606820372 (2026-02-20T17:00:20.372000Z); `.status==error` count=0; `.delivered==true` count=0
- label: **IGNORE** — Evidence field(s): `.delivered` (count=0) and `.status` (last=ok)
- evidence fields (from last event):
  - `last.summary.firstLine` = `🧠 **Entrevista inicial de vida – Comencemos**`
  - `last.status` = `ok`

### 92783453-921f-4847-a288-c9fc430cba45
- run file: `/home/manpac/.openclaw/cron/runs/92783453-921f-4847-a288-c9fc430cba45.jsonl`
- inferred likely name/purpose: **newsletter-digest**
- Evidence field: last20 text contains skill dir name 'newsletter-digest'
- metrics evidence: max `.ts`=1771806804907 (2026-02-23T00:33:24.907000Z); `.status==error` count=0; `.delivered==true` count=0
- label: **IGNORE** — Evidence field(s): `.delivered` (count=0) and `.status` (last=ok)
- evidence fields (from last event):
  - `last.summary.firstLine` = `✅ **Bitácora diaria sincronizada correctamente.**`
  - `last.sessionKey` = `agent:main:cron:92783453-921f-4847-a288-c9fc430cba45:run:30aa174c-3f4b-4b80-87ca-4c3637e808ed`
  - `last.status` = `ok`

### b625c33f-a9e5-46c2-92b6-946b5ccc8dc2
- run file: `/home/manpac/.openclaw/cron/runs/b625c33f-a9e5-46c2-92b6-946b5ccc8dc2.jsonl`
- inferred likely name/purpose: ****Briefing matutino (Manu) — 19/02****
- Evidence field: `.summary` first line in last 20 lines
- metrics evidence: max `.ts`=1771671698328 (2026-02-21T11:01:38.328000Z); `.status==error` count=3; `.delivered==true` count=0
- label: **ARCHIVE** — Evidence field(s): `.status` (last=error) and `.status==error` count=3
- evidence fields (from last event):
  - `last.sessionKey` = `agent:main:cron:b625c33f-a9e5-46c2-92b6-946b5ccc8dc2:run:0a25c6fe-0efa-4bcb-aa5e-2eb1a67f6142`
  - `last.status` = `error`

### b8ea6237-5df6-41cf-af52-988abd5dd906
- run file: `/home/manpac/.openclaw/cron/runs/b8ea6237-5df6-41cf-af52-988abd5dd906.jsonl`
- inferred likely name/purpose: **read-compact**
- Evidence field: last20 text contains skill dir name 'read-compact'
- metrics evidence: max `.ts`=1771761203901 (2026-02-22T11:53:23.901000Z); `.status==error` count=6; `.delivered==true` count=0
- label: **ARCHIVE** — Evidence field(s): `.status` (last=error) and `.status==error` count=6
- evidence fields (from last event):
  - `last.summary.firstLine` = `Daily Morning Briefing sent to Telegram target 2017549847 (messageId 513). Sections 1-5 populated from memory; sections 6-10 blank (no sources file). Usage: Context 16%, 230k in / 1.9k out, Risk Low.`
  - `last.sessionKey` = `agent:main:cron:b8ea6237-5df6-41cf-af52-988abd5dd906:run:044dd03c-f451-4d8f-b8de-2a802540af60`
  - `last.status` = `error`

### c8dfb239-ed97-4d74-80f5-0a403561fdd1
- run file: `/home/manpac/.openclaw/cron/runs/c8dfb239-ed97-4d74-80f5-0a403561fdd1.jsonl`
- inferred likely name/purpose: **Done. I ran:**
- Evidence field: `.summary` first line in last 20 lines
- metrics evidence: max `.ts`=1771827011855 (2026-02-23T06:10:11.855000Z); `.status==error` count=0; `.delivered==true` count=0
- label: **IGNORE** — Evidence field(s): `.delivered` (count=0) and `.status` (last=ok)
- evidence fields (from last event):
  - `last.sessionKey` = `agent:main:cron:c8dfb239-ed97-4d74-80f5-0a403561fdd1:run:f15dcda1-a756-498d-9d33-cdcd7e943303`
  - `last.status` = `ok`

### c93c5864-931c-4f16-b4ac-907702222853
- run file: `/home/manpac/.openclaw/cron/runs/c93c5864-931c-4f16-b4ac-907702222853.jsonl`
- inferred likely name/purpose: **Nightly healthcheck completed and report written to:**
- Evidence field: `.summary` first line in last 20 lines
- metrics evidence: max `.ts`=1771822810851 (2026-02-23T05:00:10.851000Z); `.status==error` count=0; `.delivered==true` count=0
- label: **IGNORE** — Evidence field(s): `.delivered` (count=0) and `.status` (last=ok)
- evidence fields (from last event):
  - `last.summary.firstLine` = `**Nightly Healthcheck Complete** ✅`
  - `last.sessionKey` = `agent:main:cron:c93c5864-931c-4f16-b4ac-907702222853:run:22ea094e-ce6e-4b53-9290-ee5e6942b8d2`
  - `last.status` = `ok`

### d7e1795d-77b5-4555-88e1-d3098c6ac643
- run file: `/home/manpac/.openclaw/cron/runs/d7e1795d-77b5-4555-88e1-d3098c6ac643.jsonl`
- inferred likely name/purpose: **function_calls>**
- Evidence field: `.summary` first line in last 20 lines
- metrics evidence: max `.ts`=1771621200375 (2026-02-20T21:00:00.375000Z); `.status==error` count=1; `.delivered==true` count=0
- label: **ARCHIVE** — Evidence field(s): `.status` (last=error) and `.status==error` count=1
- evidence fields (from last event):
  - `last.sessionKey` = `agent:main:cron:d7e1795d-77b5-4555-88e1-d3098c6ac643:run:2ab5b0c7-f113-4145-bce3-7a6240dc8ad2`
  - `last.status` = `error`

### db0fe015-9d14-4522-acf2-8775a2b4b97e
- run file: `/home/manpac/.openclaw/cron/runs/db0fe015-9d14-4522-acf2-8775a2b4b97e.jsonl`
- inferred likely name/purpose: **🌅 Morning Briefing**
- Evidence field: `.summary` first line in last 20 lines
- metrics evidence: max `.ts`=1771690204762 (2026-02-21T16:10:04.762000Z); `.status==error` count=2; `.delivered==true` count=0
- label: **ARCHIVE** — Evidence field(s): `.status` (last=error) and `.status==error` count=2
- evidence fields (from last event):
  - `last.summary.firstLine` = `🌅 Morning Briefing`
  - `last.sessionKey` = `agent:main:cron:db0fe015-9d14-4522-acf2-8775a2b4b97e:run:398eceea-3947-4906-81dc-44d33dc383d2`
  - `last.status` = `error`

### dedba884-eb8d-42de-b637-fc345356a632
- run file: `/home/manpac/.openclaw/cron/runs/dedba884-eb8d-42de-b637-fc345356a632.jsonl`
- inferred likely name/purpose: **Daily OpenClaw backup routine executed at 2026-02-21 07:30 UTC.**
- Evidence field: `.summary` first line in last 20 lines
- metrics evidence: max `.ts`=1771831841866 (2026-02-23T07:30:41.866000Z); `.status==error` count=2; `.delivered==true` count=1
- label: **RESTORE** — Evidence field(s): `.delivered` (count=1) and/or `.deliveryStatus` (last=delivered)
- evidence fields (from last event):
  - `last.summary.firstLine` = `functioninvoke name="exec">`
  - `last.sessionKey` = `agent:main:cron:dedba884-eb8d-42de-b637-fc345356a632:run:e0d971f3-ed6b-4d3e-b66b-7b44925cd847`
  - `last.status` = `ok`
  - `last.delivered` = `True`
  - `last.deliveryStatus` = `delivered`

### efa06a4f-bfc8-449f-995a-c5cac0f56ba7
- run file: `/home/manpac/.openclaw/cron/runs/efa06a4f-bfc8-449f-995a-c5cac0f56ba7.jsonl`
- inferred likely name/purpose: **gateway-preflight**
- Evidence field: last20 text contains skill dir name 'gateway-preflight'
- metrics evidence: max `.ts`=1771883138331 (2026-02-23T21:45:38.331000Z); `.status==error` count=8; `.delivered==true` count=0
- label: **IGNORE** — Evidence field(s): `.delivered` (count=0) and `.status` (last=ok)
- evidence fields (from last event):
  - `last.summary.firstLine` = `````
  - `last.sessionKey` = `agent:main:cron:efa06a4f-bfc8-449f-995a-c5cac0f56ba7:run:87eae5e2-b8e2-406c-8922-34046708747d`
  - `last.status` = `ok`
  - `last.delivered` = `False`
  - `last.deliveryStatus` = `not-delivered`

### f7ba2a8c-6339-4041-bac9-7e29f3f92383
- run file: `/home/manpac/.openclaw/cron/runs/f7ba2a8c-6339-4041-bac9-7e29f3f92383.jsonl`
- inferred likely name/purpose: **Perfecto. El **cron job `daily-research-scout`** ya estaba configurado y se ejecutó hoy a las 7:00 AM (Montevideo). El subagente `researcher` completó la investigación bajo los límites presupuestarios**
- Evidence field: `.summary` first line in last 20 lines
- metrics evidence: max `.ts`=1771668828314 (2026-02-21T10:13:48.314000Z); `.status==error` count=0; `.delivered==true` count=0
- label: **IGNORE** — Evidence field(s): `.delivered` (count=0) and `.status` (last=ok)
- evidence fields (from last event):
  - `last.summary.firstLine` = `Investigación diaria completada. Se realizaron 8 búsquedas (via search‑searx) y 6 lecturas profundas, dentro del presupuesto de tiempo y recursos.  `
  - `last.sessionKey` = `agent:main:cron:f7ba2a8c-6339-4041-bac9-7e29f3f92383:run:8af80c0c-f233-48d7-b8c9-ffaa5d0dea84`
  - `last.status` = `ok`

### fac822a3-7c2b-4b09-8181-acf586903840
- run file: `/home/manpac/.openclaw/cron/runs/fac822a3-7c2b-4b09-8181-acf586903840.jsonl`
- inferred likely name/purpose: **⚠️ 🛠️ Exec: `grep -i jira ~/.openclaw/workspace/memory/2026-02-18.md` failed: Command exited with code 1**
- Evidence field: `.summary` first line in last 20 lines
- metrics evidence: max `.ts`=1771846246352 (2026-02-23T11:30:46.352000Z); `.status==error` count=1; `.delivered==true` count=1
- label: **RESTORE** — Evidence field(s): `.delivered` (count=1) and/or `.deliveryStatus` (last=delivered)
- evidence fields (from last event):
  - `last.summary.firstLine` = `400 openrouter/deepseek-v3.2 is not a valid model ID`
  - `last.sessionKey` = `agent:main:cron:fac822a3-7c2b-4b09-8181-acf586903840:run:19644a17-5d34-43e9-bbe9-bb044ce2fec7`
  - `last.status` = `ok`
  - `last.delivered` = `True`
  - `last.deliveryStatus` = `delivered`

### fbd34d15-bde6-4f63-8bc6-6023e2be46c4
- run file: `/home/manpac/.openclaw/cron/runs/fbd34d15-bde6-4f63-8bc6-6023e2be46c4.jsonl`
- inferred likely name/purpose: **La capital de Uruguay es **Montevideo**.**
- Evidence field: `.summary` first line in last 20 lines
- metrics evidence: max `.ts`=1771598868291 (2026-02-20T14:47:48.291000Z); `.status==error` count=0; `.delivered==true` count=0
- label: **IGNORE** — Evidence field(s): `.delivered` (count=0) and `.status` (last=ok)
- evidence fields (from last event):
  - `last.summary.firstLine` = `La capital de Uruguay es **Montevideo**.`
  - `last.sessionKey` = `agent:main:cron:fbd34d15-bde6-4f63-8bc6-6023e2be46c4:run:dc7d48c5-64b2-4d2a-8969-6f64e91e3b02`
  - `last.status` = `ok`

### fd9aeac4-275f-4b27-b051-39f10ea849cd
- run file: `/home/manpac/.openclaw/cron/runs/fd9aeac4-275f-4b27-b051-39f10ea849cd.jsonl`
- inferred likely name/purpose: **newsletter-digest**
- Evidence field: last20 text contains skill dir name 'newsletter-digest'
- metrics evidence: max `.ts`=1771837201325 (2026-02-23T09:00:01.325000Z); `.status==error` count=2; `.delivered==true` count=0
- label: **IGNORE** — Evidence field(s): `.delivered` (count=0) and `.status` (last=ok)
- evidence fields (from last event):
  - `last.sessionKey` = `agent:main:cron:fd9aeac4-275f-4b27-b051-39f10ea849cd:run:e691a376-f17d-467a-9d2c-ddedf449c509`
  - `last.status` = `ok`
  - `last.delivered` = `False`
  - `last.deliveryStatus` = `not-delivered`

## 3) Ranked lists (top 10)

### 3.1 Most recent 10
| rank | jobId | last_ts_utc | errors | delivered_true | likely_name/purpose | label | justification | evidence (exact fields) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | efa06a4f-bfc8-449f-995a-c5cac0f56ba7 | 2026-02-23T21:45:38.331000Z | 8 | 0 | gateway-preflight | IGNORE | Evidence field(s): `.delivered` (count=0) and `.status` (last=ok) / Evidence field: last20 text contains skill dir name 'gateway-preflight' | last.summary.firstLine=```; last.sessionKey=agent:main:cron:efa06a4f-bfc8-449f-995a-c5cac0f56ba7:run:87eae5e2-b8e2-406c-8922-34046708747d; last.status=ok; last.delivered=False; last.deliveryStatus=not-delivered |
| 2 | 62497b07-d021-4655-9340-1cd82badcc45 | 2026-02-23T20:30:45.625000Z | 3 | 1 | ⚠️ ✉️ Message failed: Slack channels require a channel id (use channel:<id>) | RESTORE | Evidence field(s): `.delivered` (count=1) and/or `.deliveryStatus` (last=delivered) / Evidence field: `.summary` first line in last 20 lines | last.summary.firstLine=400 openrouter/deepseek-v3.2 is not a valid model ID; last.sessionKey=agent:main:cron:62497b07-d021-4655-9340-1cd82badcc45:run:b566bf26-44a6-42b6-9bdf-8e0b50cd36ec; last.status=ok; last.delivered=True; last.deliveryStatus=delivered |
| 3 | 7c6a920b-ed3f-4701-ba09-65202d3c6026 | 2026-02-23T17:30:43.566000Z | 0 | 0 | DAILY_LIFE_QUESTION – Es hora de la pregunta diaria de vida. Por favor selecciona una pregunta nueva del cuestionario y pregúntamela. | IGNORE | Evidence field(s): `.delivered` (count=0) and `.status` (last=ok) / Evidence field: `.summary` first line in last 20 lines | last.summary.firstLine=DAILY_LIFE_QUESTION – Es hora de la pregunta diaria de vida. Por favor selecciona una pregunta nueva del cuestionario y pregúntamela.; last.status=ok; last.deliveryStatus=not-requested |
| 4 | fac822a3-7c2b-4b09-8181-acf586903840 | 2026-02-23T11:30:46.352000Z | 1 | 1 | ⚠️ 🛠️ Exec: `grep -i jira ~/.openclaw/workspace/memory/2026-02-18.md` failed: Command exited with code 1 | RESTORE | Evidence field(s): `.delivered` (count=1) and/or `.deliveryStatus` (last=delivered) / Evidence field: `.summary` first line in last 20 lines | last.summary.firstLine=400 openrouter/deepseek-v3.2 is not a valid model ID; last.sessionKey=agent:main:cron:fac822a3-7c2b-4b09-8181-acf586903840:run:19644a17-5d34-43e9-bbe9-bb044ce2fec7; last.status=ok; last.delivered=True; last.deliveryStatus=delivered |
| 5 | 7e76d0c9-97e3-4d00-aa4d-c24064519f9e | 2026-02-23T10:51:29.296000Z | 0 | 0 | Tengo suficientes datos. Compilando el archivo de briefing... | IGNORE | Evidence field(s): `.delivered` (count=0) and `.status` (last=ok) / Evidence field: `.summary` first line in last 20 lines | last.summary.firstLine=Now let me create the briefing file with the gathered content:; last.sessionKey=agent:main:cron:7e76d0c9-97e3-4d00-aa4d-c24064519f9e:run:ca3cdecf-0cee-4099-ad0f-91ba60bc613f; last.status=ok; last.delivered=False; last.deliveryStatus=not-delivered |
| 6 | 075106a5-eb3c-40dd-875f-fd2229927ddd | 2026-02-23T10:10:46.765000Z | 2 | 1 | ⚠️ 🌐 Browser: `start` failed: Can't reach the OpenClaw browser control service. Restart the OpenClaw gateway (OpenClaw.app menubar, or `openclaw gateway`). Do NOT retry the browser tool — it will keep | RESTORE | Evidence field(s): `.delivered` (count=1) and/or `.deliveryStatus` (last=delivered) / Evidence field: `.summary` first line in last 20 lines | last.summary.firstLine=Encontré un evento Brokia/ORT con vencimiento próximo:; last.sessionKey=agent:main:cron:075106a5-eb3c-40dd-875f-fd2229927ddd:run:6ee0ac1a-bacd-482b-a7eb-94edd40d1765; last.status=ok; last.delivered=True; last.deliveryStatus=delivered |
| 7 | fd9aeac4-275f-4b27-b051-39f10ea849cd | 2026-02-23T09:00:01.325000Z | 2 | 0 | newsletter-digest | IGNORE | Evidence field(s): `.delivered` (count=0) and `.status` (last=ok) / Evidence field: last20 text contains skill dir name 'newsletter-digest' | last.sessionKey=agent:main:cron:fd9aeac4-275f-4b27-b051-39f10ea849cd:run:e691a376-f17d-467a-9d2c-ddedf449c509; last.status=ok; last.delivered=False; last.deliveryStatus=not-delivered |
| 8 | 02789295-9d14-479c-a9ef-d3c93bef2d4c | 2026-02-23T08:15:00.093000Z | 1 | 0 | Done. Daily scouting completed and saved: | ARCHIVE | Evidence field(s): `.status` (last=error) and `.status==error` count=1 / Evidence field: `.summary` first line in last 20 lines | last.status=error; last.deliveryStatus=unknown |
| 9 | dedba884-eb8d-42de-b637-fc345356a632 | 2026-02-23T07:30:41.866000Z | 2 | 1 | Daily OpenClaw backup routine executed at 2026-02-21 07:30 UTC. | RESTORE | Evidence field(s): `.delivered` (count=1) and/or `.deliveryStatus` (last=delivered) / Evidence field: `.summary` first line in last 20 lines | last.summary.firstLine=functioninvoke name="exec">; last.sessionKey=agent:main:cron:dedba884-eb8d-42de-b637-fc345356a632:run:e0d971f3-ed6b-4d3e-b66b-7b44925cd847; last.status=ok; last.delivered=True; last.deliveryStatus=delivered |
| 10 | 6ed083c2-ac56-42dc-a18d-7ecf4d41ae7f | 2026-02-23T06:30:57.867000Z | 3 | 0 | local_llm | ARCHIVE | Evidence field(s): `.status` (last=error) and `.status==error` count=3 / Evidence field: last20 text contains skill dir name 'local_llm' | last.summary.firstLine=Exit code 3 indicates **critical/cost spike/high impact detected** — announcement required.; last.sessionKey=agent:main:cron:6ed083c2-ac56-42dc-a18d-7ecf4d41ae7f:run:3d384b12-77da-4de6-9fd1-0fda0294c214; last.status=error |

### 3.2 Most errors 10
| rank | jobId | last_ts_utc | errors | delivered_true | likely_name/purpose | label | justification | evidence (exact fields) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | efa06a4f-bfc8-449f-995a-c5cac0f56ba7 | 2026-02-23T21:45:38.331000Z | 8 | 0 | gateway-preflight | IGNORE | Evidence field(s): `.delivered` (count=0) and `.status` (last=ok) / Evidence field: last20 text contains skill dir name 'gateway-preflight' | last.summary.firstLine=```; last.sessionKey=agent:main:cron:efa06a4f-bfc8-449f-995a-c5cac0f56ba7:run:87eae5e2-b8e2-406c-8922-34046708747d; last.status=ok; last.delivered=False; last.deliveryStatus=not-delivered |
| 2 | b8ea6237-5df6-41cf-af52-988abd5dd906 | 2026-02-22T11:53:23.901000Z | 6 | 0 | read-compact | ARCHIVE | Evidence field(s): `.status` (last=error) and `.status==error` count=6 / Evidence field: last20 text contains skill dir name 'read-compact' | last.summary.firstLine=Daily Morning Briefing sent to Telegram target 2017549847 (messageId 513). Sections 1-5 populated from memory; sections 6-10 blank (no sources file). Usage: Context 16%, 230k in / 1.9k out, Risk Low.; last.sessionKey=agent:main:cron:b8ea6237-5df6-41cf-af52-988abd5dd906:run:044dd03c-f451-4d8f-b8de-2a802540af60; last.status=error |
| 3 | 2f57ee48-16b1-4a33-9ba1-d3728fa59fcc | 2026-02-20T23:16:46.371000Z | 4 | 0 | twitter-fetch | IGNORE | Evidence field(s): `.delivered` (count=0) and `.status` (last=ok) / Evidence field: last20 text contains skill dir name 'twitter-fetch' | last.summary.firstLine=Twitter RSS digest pipeline executed successfully.; last.sessionKey=agent:main:cron:2f57ee48-16b1-4a33-9ba1-d3728fa59fcc:run:0710cef0-c180-48c8-ba9b-7bf3d046e95d; last.status=ok |
| 4 | 62497b07-d021-4655-9340-1cd82badcc45 | 2026-02-23T20:30:45.625000Z | 3 | 1 | ⚠️ ✉️ Message failed: Slack channels require a channel id (use channel:<id>) | RESTORE | Evidence field(s): `.delivered` (count=1) and/or `.deliveryStatus` (last=delivered) / Evidence field: `.summary` first line in last 20 lines | last.summary.firstLine=400 openrouter/deepseek-v3.2 is not a valid model ID; last.sessionKey=agent:main:cron:62497b07-d021-4655-9340-1cd82badcc45:run:b566bf26-44a6-42b6-9bdf-8e0b50cd36ec; last.status=ok; last.delivered=True; last.deliveryStatus=delivered |
| 5 | 6ed083c2-ac56-42dc-a18d-7ecf4d41ae7f | 2026-02-23T06:30:57.867000Z | 3 | 0 | local_llm | ARCHIVE | Evidence field(s): `.status` (last=error) and `.status==error` count=3 / Evidence field: last20 text contains skill dir name 'local_llm' | last.summary.firstLine=Exit code 3 indicates **critical/cost spike/high impact detected** — announcement required.; last.sessionKey=agent:main:cron:6ed083c2-ac56-42dc-a18d-7ecf4d41ae7f:run:3d384b12-77da-4de6-9fd1-0fda0294c214; last.status=error |
| 6 | b625c33f-a9e5-46c2-92b6-946b5ccc8dc2 | 2026-02-21T11:01:38.328000Z | 3 | 0 | **Briefing matutino (Manu) — 19/02** | ARCHIVE | Evidence field(s): `.status` (last=error) and `.status==error` count=3 / Evidence field: `.summary` first line in last 20 lines | last.sessionKey=agent:main:cron:b625c33f-a9e5-46c2-92b6-946b5ccc8dc2:run:0a25c6fe-0efa-4bcb-aa5e-2eb1a67f6142; last.status=error |
| 7 | 075106a5-eb3c-40dd-875f-fd2229927ddd | 2026-02-23T10:10:46.765000Z | 2 | 1 | ⚠️ 🌐 Browser: `start` failed: Can't reach the OpenClaw browser control service. Restart the OpenClaw gateway (OpenClaw.app menubar, or `openclaw gateway`). Do NOT retry the browser tool — it will keep | RESTORE | Evidence field(s): `.delivered` (count=1) and/or `.deliveryStatus` (last=delivered) / Evidence field: `.summary` first line in last 20 lines | last.summary.firstLine=Encontré un evento Brokia/ORT con vencimiento próximo:; last.sessionKey=agent:main:cron:075106a5-eb3c-40dd-875f-fd2229927ddd:run:6ee0ac1a-bacd-482b-a7eb-94edd40d1765; last.status=ok; last.delivered=True; last.deliveryStatus=delivered |
| 8 | fd9aeac4-275f-4b27-b051-39f10ea849cd | 2026-02-23T09:00:01.325000Z | 2 | 0 | newsletter-digest | IGNORE | Evidence field(s): `.delivered` (count=0) and `.status` (last=ok) / Evidence field: last20 text contains skill dir name 'newsletter-digest' | last.sessionKey=agent:main:cron:fd9aeac4-275f-4b27-b051-39f10ea849cd:run:e691a376-f17d-467a-9d2c-ddedf449c509; last.status=ok; last.delivered=False; last.deliveryStatus=not-delivered |
| 9 | dedba884-eb8d-42de-b637-fc345356a632 | 2026-02-23T07:30:41.866000Z | 2 | 1 | Daily OpenClaw backup routine executed at 2026-02-21 07:30 UTC. | RESTORE | Evidence field(s): `.delivered` (count=1) and/or `.deliveryStatus` (last=delivered) / Evidence field: `.summary` first line in last 20 lines | last.summary.firstLine=functioninvoke name="exec">; last.sessionKey=agent:main:cron:dedba884-eb8d-42de-b637-fc345356a632:run:e0d971f3-ed6b-4d3e-b66b-7b44925cd847; last.status=ok; last.delivered=True; last.deliveryStatus=delivered |
| 10 | db0fe015-9d14-4522-acf2-8775a2b4b97e | 2026-02-21T16:10:04.762000Z | 2 | 0 | 🌅 Morning Briefing | ARCHIVE | Evidence field(s): `.status` (last=error) and `.status==error` count=2 / Evidence field: `.summary` first line in last 20 lines | last.summary.firstLine=🌅 Morning Briefing; last.sessionKey=agent:main:cron:db0fe015-9d14-4522-acf2-8775a2b4b97e:run:398eceea-3947-4906-81dc-44d33dc383d2; last.status=error |

### 3.3 Delivered=true 10
| rank | jobId | last_ts_utc | errors | delivered_true | likely_name/purpose | label | justification | evidence (exact fields) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 62497b07-d021-4655-9340-1cd82badcc45 | 2026-02-23T20:30:45.625000Z | 3 | 1 | ⚠️ ✉️ Message failed: Slack channels require a channel id (use channel:<id>) | RESTORE | Evidence field(s): `.delivered` (count=1) and/or `.deliveryStatus` (last=delivered) / Evidence field: `.summary` first line in last 20 lines | last.summary.firstLine=400 openrouter/deepseek-v3.2 is not a valid model ID; last.sessionKey=agent:main:cron:62497b07-d021-4655-9340-1cd82badcc45:run:b566bf26-44a6-42b6-9bdf-8e0b50cd36ec; last.status=ok; last.delivered=True; last.deliveryStatus=delivered |
| 2 | fac822a3-7c2b-4b09-8181-acf586903840 | 2026-02-23T11:30:46.352000Z | 1 | 1 | ⚠️ 🛠️ Exec: `grep -i jira ~/.openclaw/workspace/memory/2026-02-18.md` failed: Command exited with code 1 | RESTORE | Evidence field(s): `.delivered` (count=1) and/or `.deliveryStatus` (last=delivered) / Evidence field: `.summary` first line in last 20 lines | last.summary.firstLine=400 openrouter/deepseek-v3.2 is not a valid model ID; last.sessionKey=agent:main:cron:fac822a3-7c2b-4b09-8181-acf586903840:run:19644a17-5d34-43e9-bbe9-bb044ce2fec7; last.status=ok; last.delivered=True; last.deliveryStatus=delivered |
| 3 | 075106a5-eb3c-40dd-875f-fd2229927ddd | 2026-02-23T10:10:46.765000Z | 2 | 1 | ⚠️ 🌐 Browser: `start` failed: Can't reach the OpenClaw browser control service. Restart the OpenClaw gateway (OpenClaw.app menubar, or `openclaw gateway`). Do NOT retry the browser tool — it will keep | RESTORE | Evidence field(s): `.delivered` (count=1) and/or `.deliveryStatus` (last=delivered) / Evidence field: `.summary` first line in last 20 lines | last.summary.firstLine=Encontré un evento Brokia/ORT con vencimiento próximo:; last.sessionKey=agent:main:cron:075106a5-eb3c-40dd-875f-fd2229927ddd:run:6ee0ac1a-bacd-482b-a7eb-94edd40d1765; last.status=ok; last.delivered=True; last.deliveryStatus=delivered |
| 4 | dedba884-eb8d-42de-b637-fc345356a632 | 2026-02-23T07:30:41.866000Z | 2 | 1 | Daily OpenClaw backup routine executed at 2026-02-21 07:30 UTC. | RESTORE | Evidence field(s): `.delivered` (count=1) and/or `.deliveryStatus` (last=delivered) / Evidence field: `.summary` first line in last 20 lines | last.summary.firstLine=functioninvoke name="exec">; last.sessionKey=agent:main:cron:dedba884-eb8d-42de-b637-fc345356a632:run:e0d971f3-ed6b-4d3e-b66b-7b44925cd847; last.status=ok; last.delivered=True; last.deliveryStatus=delivered |
| 5 | efa06a4f-bfc8-449f-995a-c5cac0f56ba7 | 2026-02-23T21:45:38.331000Z | 8 | 0 | gateway-preflight | IGNORE | Evidence field(s): `.delivered` (count=0) and `.status` (last=ok) / Evidence field: last20 text contains skill dir name 'gateway-preflight' | last.summary.firstLine=```; last.sessionKey=agent:main:cron:efa06a4f-bfc8-449f-995a-c5cac0f56ba7:run:87eae5e2-b8e2-406c-8922-34046708747d; last.status=ok; last.delivered=False; last.deliveryStatus=not-delivered |
| 6 | 7c6a920b-ed3f-4701-ba09-65202d3c6026 | 2026-02-23T17:30:43.566000Z | 0 | 0 | DAILY_LIFE_QUESTION – Es hora de la pregunta diaria de vida. Por favor selecciona una pregunta nueva del cuestionario y pregúntamela. | IGNORE | Evidence field(s): `.delivered` (count=0) and `.status` (last=ok) / Evidence field: `.summary` first line in last 20 lines | last.summary.firstLine=DAILY_LIFE_QUESTION – Es hora de la pregunta diaria de vida. Por favor selecciona una pregunta nueva del cuestionario y pregúntamela.; last.status=ok; last.deliveryStatus=not-requested |
| 7 | 7e76d0c9-97e3-4d00-aa4d-c24064519f9e | 2026-02-23T10:51:29.296000Z | 0 | 0 | Tengo suficientes datos. Compilando el archivo de briefing... | IGNORE | Evidence field(s): `.delivered` (count=0) and `.status` (last=ok) / Evidence field: `.summary` first line in last 20 lines | last.summary.firstLine=Now let me create the briefing file with the gathered content:; last.sessionKey=agent:main:cron:7e76d0c9-97e3-4d00-aa4d-c24064519f9e:run:ca3cdecf-0cee-4099-ad0f-91ba60bc613f; last.status=ok; last.delivered=False; last.deliveryStatus=not-delivered |
| 8 | fd9aeac4-275f-4b27-b051-39f10ea849cd | 2026-02-23T09:00:01.325000Z | 2 | 0 | newsletter-digest | IGNORE | Evidence field(s): `.delivered` (count=0) and `.status` (last=ok) / Evidence field: last20 text contains skill dir name 'newsletter-digest' | last.sessionKey=agent:main:cron:fd9aeac4-275f-4b27-b051-39f10ea849cd:run:e691a376-f17d-467a-9d2c-ddedf449c509; last.status=ok; last.delivered=False; last.deliveryStatus=not-delivered |
| 9 | 02789295-9d14-479c-a9ef-d3c93bef2d4c | 2026-02-23T08:15:00.093000Z | 1 | 0 | Done. Daily scouting completed and saved: | ARCHIVE | Evidence field(s): `.status` (last=error) and `.status==error` count=1 / Evidence field: `.summary` first line in last 20 lines | last.status=error; last.deliveryStatus=unknown |
| 10 | 6ed083c2-ac56-42dc-a18d-7ecf4d41ae7f | 2026-02-23T06:30:57.867000Z | 3 | 0 | local_llm | ARCHIVE | Evidence field(s): `.status` (last=error) and `.status==error` count=3 / Evidence field: last20 text contains skill dir name 'local_llm' | last.summary.firstLine=Exit code 3 indicates **critical/cost spike/high impact detected** — announcement required.; last.sessionKey=agent:main:cron:6ed083c2-ac56-42dc-a18d-7ecf4d41ae7f:run:3d384b12-77da-4de6-9fd1-0fda0294c214; last.status=error |
