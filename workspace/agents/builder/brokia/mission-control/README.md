# Mission Control v1

Work-items management interface for brokia.

## Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styles:** Tailwind CSS
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
- `USE_FIXTURES` - Set to `true` for development without the real engine

## Fixture Mode vs Real Mode

Mission Control supports two data sources for workitems:

### Fixture Mode (`USE_FIXTURES=true`)
When `USE_FIXTURES=true` is set in `.env.local`, the API returns data from `fixtures/workitems.json` without executing any scripts.

**Use cases:**
- Development without the real workitems engine
- UI testing and prototyping
- Demonstrations

**Setup:**
```bash
echo "USE_FIXTURES=true" >> .env.local
```

### Real Mode (default)
When `USE_FIXTURES=false` or not set, the API:
1. Executes `brokia/mission-control/brokia/workitems/wi-export.sh`
2. Reads the canonical JSON from `brokia/mission-control/brokia/workitems/index/workitems.json`
3. Returns aggregated data (total_items, counts_by_status, counts_by_type)

This is the production mode that interfaces with the real workitems engine.

## Development

```bash
npm run dev
```

The server will be available at http://localhost:3000

## Important: Do Not Modify Workitems Engine

Mission Control is designed to interface with the existing work-items engine at `brokia/mission-control/brokia/workitems/`. 

**Do not modify the engine scripts** — they are the source of truth. Mission Control provides a UI layer on top of them.

## Log Convention

Logs are stored at: `logs/<WORKITEM_ID>/<timestamp>_<action>.log`

Example: `logs/WI-001/2026-02-25T07-13-00Z_create.log`

## macOS Notes

Some scripts use `sed -i` for in-place file editing. On macOS, the default `sed` is BSD-based and may not be compatible with GNU sed syntax used in these scripts.

### Options:

1. **Install GNU sed** (recommended):
   ```bash
   brew install gnu-sed
   ```
   Then use `gsed` instead of `sed` in scripts, or configure it via environment.

2. **Configure via .env.local**:
   ```bash
   SED=gsed
   ```
   Set this in your `.env.local` file if you have GNU sed installed.

### Testing
To verify sed compatibility on macOS:
```bash
# Test if you have GNU sed
sed --version 2>/dev/null || echo "BSD sed detected - install gnu-sed"
```

## API Response Contract

```json
{
  "success": true,
  "action": "create",
  "id": "wi-123",
  "message": "Work item created successfully",
  "stdout": "...",
  "stderr": "",
  "blocked_by_guardrail": false
}
```
