---
name: daily-backup
description: Daily backup of critical OpenClaw files to private GitHub repository with secret scanning and placeholder replacement.
metadata:
  {
    "openclaw": {
      "emoji": "💾",
      "tags": ["backup", "github", "secrets", "cron"]
    }
  }
---

# daily-backup

Daily backup routine that pushes all critical OpenClaw configuration and workspace files to a private GitHub repository.

## Pipeline

1. **Collect critical files**:
   - `/home/manpac/.openclaw/workspace/` (excluding large caches/venvs)
   - `/home/manpac/.openclaw/openclaw.json` (main config)
   - `/home/manpac/.openclaw/memory/` (daily memory files)
   - Cron job definitions (exported via `cron list`)
   - Agent SOUL files
   - Skill configurations

2. **Scan for secrets**:
   - API keys, tokens, passwords, credentials
   - Private URLs with authentication
   - Environment variables in config files
   - Replace with descriptive placeholders: `[CLAUDE_API_KEY]`, `[GITHUB_TOKEN]`, etc.

3. **Prepare backup directory**:
   - Create temporary directory with timestamp
   - Copy sanitized files
   - Add README with backup metadata

4. **Git operations**:
   - Clone/pull existing private GitHub repo (if configured)
   - Copy sanitized files into repo
   - Commit with date and change summary
   - Push to remote

5. **Report**:
   - Send one-line confirmation to Telegram group `Clawdius - Backups` (-5130387079)
   - Report any errors (missing files, push failures)

## Configuration

### Environment variables (required)
- `BACKUP_GITHUB_REPO`: Private GitHub repository URL (e.g., `https://github.com/username/openclaw-backup.git`)
- `BACKUP_GITHUB_TOKEN`: Personal access token with repo permissions (or use `gh` auth)

### Optional
- `BACKUP_EXCLUDE_PATTERNS`: Comma-separated glob patterns to exclude
- `BACKUP_TEMP_DIR`: Temporary directory path (default: `/tmp/openclaw-backup`)

## Usage

### Manual invocation
```bash
cd /home/manpac/.openclaw/workspace/skills/daily-backup
BACKUP_GITHUB_REPO=... BACKUP_GITHUB_TOKEN=... python3 scripts/backup.py
```

### Cron job
Scheduled at 4:30 AM America/Montevideo (07:30 UTC).