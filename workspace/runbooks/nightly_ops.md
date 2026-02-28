# Nightly Ops Runbook

## Purpose
Run a low-cost proactive overnight pipeline with strict early-exit and fallback behavior.

## Schedule (America/Montevideo)
- 02:00 `nightly_healthcheck`
- 02:10 `nightly_cost_guard`
- 02:20 `nightly_backlog_groomer`
- 02:40 `trends_digest` (only if >=30 new items)
- 03:10 `inbox_triage` (only if relevant new emails)
- 03:30 `nightly_summary`

## Alert policy (Slack `C0AFK08BFR8`)
Send only if:
1. critical health error
2. cost spike detected
3. backlog has high-impact item

## Files
- `reports/nightly/health_YYYY-MM-DD.md`
- `reports/nightly/cost_guard_YYYY-MM-DD.md`
- `reports/nightly/backlog_top3_YYYY-MM-DD.md`
- `reports/trends/daily/YYYY-MM-DD.md` (conditional)
- `reports/nightly/inbox_digest_YYYY-MM-DD.md` (conditional)
- `reports/nightly/summary_YYYY-MM-DD.md`

## Manual run
```bash
bash /home/manpac/.openclaw/workspace/scripts/nightly_ops/run.sh
```

## Smoke test
```bash
bash /home/manpac/.openclaw/workspace/workflows/nightly_ops/smoke_test.sh
```

## Rollback
Disable nightly jobs:
- `cron remove <jobId>` for `nightly_*` entries

## Notes
- Uses local LLM when available.
- If local LLM fails, pipelines fallback to rules and still complete.
