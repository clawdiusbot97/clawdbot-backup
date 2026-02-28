# Brokia Telegram Intake MVP

Create workitems from Telegram with confirm-first workflow.

## Overview

- **Polling-based**: Fetches Telegram updates every minute via cron
- **Confirm-first**: Bot proposes, user confirms with "OK"
- **Heuristic classification**: Prefix routing (idea:, risk:, etc.)
- **Deduplication**: 10-minute window with OK2 override
- **Control commands**: STATUS, CANCEL <prop_id>

## Installation

```bash
cd skills/brokia-telegram-intake
cp .env.example .env
# Edit .env with your tokens
```

## Environment Variables

```bash
TELEGRAM_BOT_TOKEN=           # From BotFather
BROKIA_INBOX_CHAT_ID=         # Target chat ID (e.g., -1001234567890)
MISSION_CONTROL_BASE_URL=     # http://localhost:3000
INTAKE_USE_LLM_CLASSIFIER=    # false (default)
INTAKE_DEDUPE_WINDOW_MINUTES= # 10 (default)
```

## Manual Run

```bash
bash scripts/telegram-poll.sh
```

## Cron Job

```
*/1 * * * * cd /home/manpac/.openclaw/workspace && bash skills/brokia-telegram-intake/scripts/telegram-poll.sh
```

## Workflow

1. User sends message to Telegram chat
2. Bot replies with structured proposal
3. User replies "OK" to create, "EDIT: ..." to modify, "DISCARD" to cancel
4. Bot calls Mission Control API to create workitem
5. Bot confirms with canonical ID

## Classification Rules

| Prefix | Type |
|--------|------|
| idea: | idea |
| risk: | risk |
| feature: | feature |
| research: | research |
| requirement: | requirement |
| (none) | idea (default) |

Title = first sentence (max 80 chars)
Priority = p2 (default)
Needs clarification = true (default)

## State File

Persisted in `state/state.json`:
- `last_update_id`: Last processed Telegram update
- `pending_proposals`: Awaiting confirmation

## Commands

| Command | Description |
|---------|-------------|
| `OK` | Create workitem from proposal |
| `OK2` | Force create (bypass dedupe) |
| `EDIT: type=risk priority=p1` | Modify proposal fields |
| `DISCARD` | Cancel proposal |
| `STATUS` | List pending proposals |
| `CANCEL <prop_id>` | Cancel specific proposal |