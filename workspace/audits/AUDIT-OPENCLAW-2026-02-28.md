# OpenClaw System Audit — 2026-02-28

## 0. Evidence collected (commands + file excerpts)

### CLI / live status
- `openclaw` was **not on PATH** in this exec environment; used explicit path:
  - `/home/manpac/.npm-global/bin/openclaw`

**Cron list (CLI)**
```text
$ /home/manpac/.npm-global/bin/openclaw cron list
ID                                   Name                 Schedule                           Next    Last     Status   Target    Agent
 d4755542-b64c-4067-90b1-4e1076b31990 morning-intelligence  cron 0 8 * * * @ America/Monte...  in 17h  30m ago  ok       isolated  default
```
Source: `/home/manpac/.npm-global/bin/openclaw cron list` (2026-02-28)

**System status (CLI)**
- Gateway: local loopback, reachable ~22ms, service running.
- Repeated warning in CLI output: `Failed to discover vLLM models: TypeError: fetch failed`.
Source: `/home/manpac/.npm-global/bin/openclaw status` (2026-02-28)

### Live config files
**Cron jobs source of truth**
- `/home/manpac/.openclaw/cron/jobs.json`
  - Contains **1 job** (`morning-intelligence`).

**OpenClaw config**
- `/home/manpac/.openclaw/openclaw.json`
  - Contains plaintext tokens for Telegram/Discord/Slack.
  - For this audit report, tokens are **redacted** (they were visible in the raw file output).

### Runtime folders
- Agents dir: `/home/manpac/.openclaw/agents/`
- Workspace skills: `/home/manpac/.openclaw/workspace/skills/`
- Cron run history (JSONL-backed): `/home/manpac/.openclaw/cron/runs/`

### Checkpoints
Top-level dirs under workspace:
- `/home/manpac/.openclaw/workspace/checkpoints/{brokia,morning-intelligence,newsletter,thesis}`

Files present (sample):
- `checkpoints/morning-intelligence/news-2026-02-28.json`
- `checkpoints/thesis/2026-02-26.json` … `2026-02-28.json`
- `checkpoints/newsletter/2026-02-19.json`, `2026-02-20.json`

### Workspace cron “mirror”
- `/home/manpac/.openclaw/workspace/memory/cron/morning-intelligence.json` ✅ valid JSON
- `/home/manpac/.openclaw/workspace/memory/cron/brokia-deadline-alerts.json` ❌ INVALID JSON (control characters)
- `/home/manpac/.openclaw/workspace/memory/cron/brokia-heartbeat.json` ❌ INVALID JSON (control characters)

(Those invalid JSON files are reliability hazards if anything tries to parse them.)

---

## 1. Cron jobs inventory (active + inactive)

### 1.1 Active jobs (from CLI + `jobs.json`)
Only **one** cron job is currently registered in the Gateway scheduler.

| job_id | name | enabled | schedule (expr) | tz | sessionTarget | timeoutSeconds | delivery targets | last run status | last duration | checkpoints |
|---|---|---:|---|---|---|---:|---|---|---:|---|
| d4755542-b64c-4067-90b1-4e1076b31990 | morning-intelligence | true | `0 8 * * *` | America/Montevideo | isolated | 600 | Discord: briefings `1475961144416931931` (job delivery.to), plus explicit sends to multiple Discord channel IDs inside task | ok | 257,528ms | `checkpoints/thesis/YYYY-MM-DD.json`, `checkpoints/morning-intelligence/news-YYYY-MM-DD.json` |

Evidence:
- `openclaw cron list` shows one job (above)
- `jobs.json` contains the same job id and schedule

### 1.2 Inactive / orphaned jobs (present in run history but NOT in current scheduler)
Cron run history directory contains **31** job-id JSONL files:
- `/home/manpac/.openclaw/cron/runs/*.jsonl`

But only **1** of those jobIds exists in current `jobs.json`. That means drift:
- either jobs were removed/rotated from scheduler, or
- jobs.json was pruned and old run logs remain.

**Drift report (high confidence):**
- Scheduler list (CLI): 1 job
- Run logs: 31 jobIds
- → 30 jobIds are “orphaned” (cannot be inspected via `cron inspect` because they don’t exist as jobs anymore).

**Orphaned run IDs with errors observed (sample):**
- `02789295-9d14-479c-a9ef-d3c93bef2d4c` last_status=error
- `6ed083c2-ac56-42dc-a18d-7ecf4d41ae7f` last_status=error
- `74e0f30c-8f1e-4866-894c-fcaf6cb0ca93` last_status=error
- `b8ea6237-5df6-41cf-af52-988abd5dd906` last_status=error

Actionable point: either delete old run logs or restore job inventory history somewhere, because right now you can’t map most run IDs to job definitions.

### 1.3 Delivery risk report
**morning-intelligence** previously experienced delivery misconfiguration failures:
- error: `No delivery target resolved for channel "discord". Set delivery.to.`
- error: `Channel is required when multiple channels are configured ... Set delivery.channel explicitly`

Current job is now hardened (explicit `channel_id` rules) and recent runs show delivered.

---

## 2. System wiring map (jobs → agents → skills)

### 2.1 Agents inventory (from `/home/manpac/.openclaw/openclaw.json`)
Configured agents (10):
- main
- researcher
- writer
- builder
- codex_builder
- chief
- ops
- brokia
- qubika
- orchestrator-kimi

Model routing (high level):
- main: `openai-codex/gpt-5.2` (fallbacks include OpenRouter models)
- researcher/writer: `openrouter/minimax/minimax-m2.1` (fallback deepseek)
- chief/ops/brokia/qubika: `openrouter/deepseek/deepseek-v3.2` (fallback minimax)
- builder/codex_builder: Codex (`openai-codex/gpt-5.3-codex`)

### 2.2 Skills inventory (from `/home/manpac/.openclaw/workspace/skills/`)
Present skills directories (non-exhaustive names, as listed):
- morning-intelligence
- searxng-search
- newsletter-digest
- daily-backup, daily-update
- gateway-preflight
- cron-middleware
- secure-token
- model-admin
- twitter-* (educativo/fetch/format/morning-briefing)
- brokia-* (plan, heartbeat, telegram-intake, deadline-alerts)
- exec-compact, read-compact, excalidraw-diagram, last30days

### 2.3 Wiring graph (what is actually used “today”)
Ground truth: only one active cron job → one pipeline.

**Job: morning-intelligence**
- Agent: default (runs as `main` model `gpt-5.2` per run history)
- Skills/tools used (as implied by instructions + outputs):
  - Web search via local SearXNG wrapper script:
    - `/home/manpac/.openclaw/workspace/skills/searxng-search/scripts/searxng_search.sh`
  - Gmail retrieval (via whatever Gmail tool integration is available at runtime)
  - Reads local task file:
    - `/home/manpac/.openclaw/workspace/dashboard/personal_tasks.md`
  - Checkpoints:
    - `checkpoints/thesis/YYYY-MM-DD.json`
    - `checkpoints/morning-intelligence/news-YYYY-MM-DD.json`
  - Deliveries (Discord):
    - Channel 1 briefings: `1475961144416931931`
    - Channel 2 newsletters: `1475961125257351423`
    - Channel 4 to-dos: `1475961183533273249`
    - Channel 5 index: `1475957499642380523`
    - Thesis Intel only: `1476311753305362564`
    - News Extension only: `1477319018992898171`

---

## 3. State & checkpoint audit

### 3.1 Checkpoint formats observed
- `checkpoints/morning-intelligence/news-2026-02-28.json`
  - Has `{date, stage, sections{global/uruguay/watch}, sources_count, generated_at}`
  - ✅ stage is present (`ok`)

- `checkpoints/thesis/2026-02-28.json` etc.
  - Present but not audited deeply in this run (file size small ~1KB).

- `checkpoints/newsletter/*.json`
  - Small, likely minimal state.

**Problem:** checkpoint schemas are not centrally documented; each pipeline invents its own schema.

### 3.2 Resume capability
- morning-intelligence News Extension has a dedupe precheck: if today’s checkpoint has `stage: ok`, skip web + skip posting.
  - ✅ prevents repost spam
  - ❌ makes manual “re-run to verify fix” harder unless checkpoint is moved/overridden.

### 3.3 State consistency scorecard
| Pipeline | Checkpoint present | Stage semantics consistent | Dedupe guard | Resume/retry model | Score |
|---|---:|---:|---:|---|---:|
| morning-intelligence / News Extension | ✅ | ✅ (`ok`/`error` + message) | ✅ | retry once only | 8/10 |
| thesis | ✅ | unknown (not validated here) | ✅ (cache reuse) | partial | 7/10 |
| newsletter | ✅ | unknown | unknown | unknown | 5/10 |

---

## 4. Dedupe & cache audit

### What exists
- News Extension: daily checkpoint prevents repost.
- Thesis Intel: cache reuse if checkpoint exists with findings.

### What’s missing
- No shared cache layer across jobs (currently only 1 job, but skills suggest more existed).
- No canonical dedupe utility (each pipeline does bespoke dedupe if any).

---

## 5. Cost & latency audit

### 5.1 Token usage from cron run history (morning-intelligence)
From `openclaw cron runs --id d475...`:
- Latest run: **39,729 tokens** (36,639 in / 9,754 out)
- Another run: **45,861 tokens** (44,882 in / 10,596 out)

**Latency (durationMs):**
- Latest run: 257,528ms (~4m 17s)
- Prior run: 133,062ms (~2m 13s)

### 5.2 Frequency + monthly estimate (only active job)
- Frequency: daily (cron `0 8 * * *`)
- Rough monthly tokens: 40k/day × 30 ≈ **1.2M tokens/month** (job only)

### 5.3 Top cost offenders (ground truth)
Given only 1 active job:
1) morning-intelligence — high context size + multiple sections + multi-delivery

**But** run logs show historical jobs with very high average tokens (orphaned):
- jobId `62497b07-...` avg_tokens ~80k (from JSONL aggregation)
These are not active now, but indicate patterns that could return.

### 5.4 Easiest token wins (surgical)
1) **Stop embedding huge instruction blocks** in job payload; move stable instructions into versioned skill docs/files and reference by path.
   - Impact: reduce repeated prompt tokens daily.
   - Rollback: restore the old payload string.

2) **Compress repeated channel maps** (Discord channel IDs repeated multiple times in payload).
   - Replace with a short “Channel Map (IDs)” and refer to it.

3) **Hard cap newsletter section** size and enforce “no placeholder narrative” when Gmail fails.

---

## 6. Reliability risks (ranked)

### Top 10 risks (Impact × Likelihood)
1) **Secrets in plaintext config** (`openclaw.json` contains Discord/Slack/Telegram tokens). (High × High)
2) **Cron drift / orphan run IDs**: run logs exist for jobs not present in scheduler → hard to debug / audit. (High × High)
3) **Gmail auth instability**: job previously attempted wrong account; OAuth missing leads to silent degradation. (Medium × High)
4) **Timeouts**: historical `cron: job execution timed out` at 300s. (Medium × Medium)
5) **Multi-channel ambiguity**: historical errors about missing `delivery.channel` / `delivery.to`. (Medium × Medium)
6) **Invalid JSON in workspace cron mirrors** (brokia-*). (Medium × Medium)
7) **vLLM model discovery failing** logged every CLI run; noise + potential slowdown. (Low × High)
8) **Checkpoint correctness vs delivery correctness**: stage ok doesn’t guarantee message visible to user if Discord permissions fail later. (Medium × Low)
9) **No standardized retry/backoff** across deliveries except bespoke “retry once”. (Medium × Low)
10) **No preflight for required local services** (SearXNG availability, Gmail auth, gateway health). (Medium × Low)

Minimal mitigations (1–3 line changes):
- Add `gateway-preflight` calls at start of cron pipelines.
- Validate required local endpoints (SearXNG) before running searches.
- Validate checkpoint JSON schema with a tiny helper before writing.

---

## 7. Incremental improvement plan (P1/P2/P3/STOP)

### P1 (do first) — high impact / low risk / low effort
1) **Move secrets out of `openclaw.json`**
   - Change: configure tokens via env/secret store; use `skills/secure-token` pattern.
   - Why: plaintext tokens are the biggest blast radius.
   - Effort: M
   - Impact: reliability ↑, security ↑
   - Rollback: restore tokens in config (not recommended).

2) **Fix/normalize workspace cron mirror JSON**
   - Change: rewrite `/workspace/memory/cron/brokia-*.json` into valid JSON or delete if unused.
   - Why: currently invalid → breaks tooling that expects JSON.
   - Effort: S
   - Impact: reliability ↑
   - Rollback: restore from git/backups.

3) **Add a preflight section to morning-intelligence**
   - Change (payload string): before web/gmail, check:
     - SearXNG reachable (`curl http://127.0.0.1:8088`)
     - Gmail auth for `tachipachi9797@gmail.com` is present
   - Why: convert silent degradation into explicit failure reason.
   - Effort: S
   - Impact: reliability ↑

4) **Stop vLLM discovery noise**
   - Change: disable vLLM discovery if not used (wherever configured) or add a longer cache/backoff.
   - Why: repeated warnings pollute logs.
   - Effort: S/M (depends on config location)
   - Impact: operator sanity ↑

### P2 — medium impact
1) **Centralize checkpoint schema docs**
   - Add: `/workspace/checkpoints/SCHEMAS.md` and enforce `stage` everywhere.
   - Effort: S
   - Impact: maintainability ↑

2) **Cron drift cleanup**
   - Add: monthly job that archives or deletes `/home/manpac/.openclaw/cron/runs/*.jsonl` entries not present in current job registry, or writes `registry_snapshot.json` each change.
   - Effort: S
   - Impact: auditability ↑

### P3 — larger refactors (only if justified)
1) **Convert morning-intelligence into a skill-driven orchestrator**
   - Split stable instruction into skill files, keep cron payload minimal.
   - Effort: L
   - Impact: tokens ↓, reliability ↑

### STOP (don’t do now)
- Don’t add Prometheus/Grafana yet.
- Don’t add more agents; current set is already wide.
- Don’t “auto-fix” cron drift by guessing old job definitions from run logs.

---

## Appendix: raw outputs (trimmed)

### A1. `openclaw.json` security note
Raw file contains plaintext tokens. This report intentionally redacts them.
Location: `/home/manpac/.openclaw/openclaw.json`

### A2. Cron runs (source)
- CLI: `/home/manpac/.npm-global/bin/openclaw cron runs --id d4755542-b64c-4067-90b1-4e1076b31990`
- FS: `/home/manpac/.openclaw/cron/runs/d4755542-b64c-4067-90b1-4e1076b31990.jsonl`
