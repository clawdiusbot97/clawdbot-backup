# Mission Control v1

Work-items management interface for brokia.

## Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **Language:** TypeScript
- **Styles:** Tailwind CSS v4
- **Runtime:** Node.js
- **Storage:** JSON file (no DB, no ORM, no auth)

## Requirements

- Node.js 18.x or later
- npm 9.x or later

## Installation

```bash
npm install
```

## Environment Setup

```bash
# Copy the example environment file
cp .env.example .env.local
```

The `.env.local` file should contain:
- `BROKIA_ROOT` - Root directory of the brokia workspace
- `WORKITEMS_DIR` - Directory containing work-items scripts
- `EXPORT_PATH` - Path to canonical work-items JSON
- `LOGS_DIR` - Directory for application logs

## Development

```bash
npm run dev
```

The server will be available at http://localhost:3000

## Work-items Engine Location

Mission Control interfaces with the **real work-items engine** located at:
```
brokia/workitems/           (outside of mission-control/)
├── scripts/wi-*.sh         (engine scripts)
└── index/workitems.json    (canonical JSON export - único archivo canónico)
```

**Canonical Export Path:** `brokia/workitems/index/workitems.json`
- Default `EXPORT_PATH` apunta a este path exacto
- Único archivo canónico de workitems

**Important:** The engine lives **outside** of `mission-control/` directory. Mission Control is a thin UI layer that:
- Executes scripts from `brokia/workitems/scripts/`
- Reads the canonical JSON at `brokia/workitems/index/workitems.json`
- Never modifies the engine itself

## Fixture Mode (Development)

For development without the full engine, set `USE_FIXTURES=true` in `.env.local`:

```bash
USE_FIXTURES=true
```

In fixture mode:
- API returns `fixtures/workitems.json` directly
- No scripts are executed
- Useful for UI development without engine dependencies

Default: `USE_FIXTURES=false` (uses real engine)

## macOS Notes

Some engine scripts use `sed -i` which behaves differently on macOS. You may need:
- Install GNU sed: `brew install gnu-sed`
- Or set `SED=gsed` in your `.env.local`

## Log Convention

Logs are stored as JSON files:
- **Format:** `logs/<WORKITEM_ID>/<timestamp>_<action>.json`
- **System logs:** `logs/SYSTEM/<timestamp>_<action>.json`

**Examples:**
```
logs/
├── SYSTEM/
│   └── 2026-02-25T13-35-00-000Z_workitems_get.json
├── WI-001/
│   └── 2026-02-25T12-30-00-000Z_create.json
└── IDEA-20260225-001/
    └── 2026-02-25T11-15-00-000Z_update.json
```

**Log entry structure:**
```json
{
  "timestamp": "2026-02-25T13:35:00.000Z",
  "workitemId": "SYSTEM",
  "actionContext": "workitems_get",
  "success": true,
  "action": "workitems_get",
  "id": "N/A",
  "message": "...",
  "stdout": "...",
  "stderr": "",
  "blocked_by_guardrail": false
}
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/workitems` | Work items list (table view) |
| `/board` | Kanban board (8-column view) |

## API Response Contract

```json
{
  "success": true,
  "action": "create",
  "id": "wi-123",
  "message": "Work item created successfully",
  "stdout": "...",
  "stderr": "",
  "blocked_by_guardrail": false,
  "data": null
}
```

**Fields:**
- `success` (boolean): Whether the operation succeeded
- `action` (string): Action that was performed
- `id` (string): Workitem ID or "N/A" for system operations
- `message` (string): Human-readable result message
- `stdout` (string): Script standard output
- `stderr` (string): Script standard error
- `blocked_by_guardrail` (boolean): True if blocked by whitelist/security
- `data` (object|null): Optional payload (e.g., workitems list in GET /api/workitems)
