---
name: daily-update
description: Daily maintenance routine for OpenClaw: update package, gateway, skills; restart gateway; report results.
metadata:
  {
    "openclaw": {
      "emoji": "🔧",
      "tags": ["maintenance", "update", "gateway", "cron"]
    }
  }
---

# daily-update

Runs daily OpenClaw update and maintenance at 4:00 AM Montevideo time.

## Pipeline

1. Check current version status (`openclaw update status`)
2. Run update (`openclaw update --yes`)
3. Restart gateway (handled by update command unless `--no-restart`)
4. Report results to Telegram group `Clawdius - Backups` (ID: -5130387079)

## Configuration

- **Update command**: `/home/manpac/.npm-global/bin/openclaw update --yes`
- **Timeout**: 1200 seconds (default)
- **Channel**: stable (configurable via `--channel`)

## Output

- **Success report**: Version before/after, any changes.
- **Failure report**: Error details, exit code, suggestions for manual fix.

## Usage

### Manual invocation
```bash
cd /home/manpac/.openclaw/workspace/skills/daily-update
python3 scripts/update_and_report.py
```

### Cron job
See cron job `daily-openclaw-update` (scheduled at 4:00 AM America/Montevideo).