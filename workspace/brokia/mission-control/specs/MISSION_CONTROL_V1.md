# Brokia Mission Control v1 — UX Specification

**Version:** 1.0  
**Date:** 2026-02-25  
**Status:** Draft  
**Schema Version:** 1.0 (frozen)

---

## 1. Overview

Mission Control v1 is a thin UI layer on top of the work-items engine. It provides a Kanban board interface for managing work-items through their lifecycle while respecting system guardrails.

**Design Principles:**
- UI is a thin layer—no business logic reinvention
- Consume JSON only; no markdown parsing in frontend
- All actions respect `allowed_actions` guardrails
- Clarification Layer governs blocked items

---

## 0. Technical Decisions (Frozen for v1)

### 0.1 Mode: LOCAL-ONLY

| Constraint | Implementation |
|------------|----------------|
| Multi-user | ❌ Not supported in v1 |
| Authentication | ❌ Not required (local-only) |
| Remote deployment | ❌ Not supported |
| Script execution | `child_process.exec()` from Next.js server |
| Paths | Relative to `BROKIA_ROOT` env variable |
| Work-items engine | **DO NOT modify** — thin layer only |

**Architecture:**
```
Frontend (Next.js) → Thin API (same server) → Scripts (workitems/scripts/) → Filesystem
```

### 0.2 API Response Contract (OBLIGATORY)

All action endpoints **MUST** return:

```json
{
  "success": boolean,
  "action": string,
  "id": string,
  "message": string,
  "stdout": string,
  "stderr": string,
  "blocked_by_guardrail": boolean,
  "updated_json": object  // Only on mutative actions
}
```

**HTTP Status Codes:**

| Code | Condition | Response Body |
|------|-----------|---------------|
| 200 | `success=true` OR `blocked_by_guardrail=true` | Full JSON response |
| 400 | Invalid input | `{ "success": false, "message": "Validation error", ... }` |
| 500 | System error (script failed, IO error) | `{ "success": false, "message": "Internal error", ... }` |

**Rules:**
- NO raw stack traces exposed to frontend
- If `blocked_by_guardrail=true`, include `recovery_message` in `message`
- `stdout`/`stderr` truncated to 500 chars max per field

### 0.3 UX for Actions

| Behavior | Implementation |
|----------|----------------|
| Execution | All actions are synchronous (`await`) |
| Loading state | Spinner on **affected card only**, not full screen |
| Polling | ❌ Not in v1 |
| After mutative action | Execute `wi-export.sh` automatically, return `updated_json` in response |

**UX Flow (Example: Clarify)**
```
1. User clicks "Clarify" on card IDEA-20260225-001
2. Card shows local spinner
3. API calls wi-clarify.sh --id IDEA-20260225-001
4. Script executes, generates clarification.md
5. API executes wi-export.sh (regenerates workitems.json)
6. API returns response with updated_json
7. UI replaces card data from updated_json, removes spinner
```

### 0.4 V1 Scope Freeze

**IN (v1) - Confirmed:**
| Action | Script | Description |
|--------|--------|-------------|
| `create` | `wi-create.sh` | Create new work-item |
| `update` | `wi-update.sh` | Update fields |
| `clarify` | `wi-clarify.sh` | Generate clarification report (A/B/C plans) |
| `confirm` | `wi-confirm.sh` | Confirm after clarification |
| `research` | `wi-pipeline.sh --step research` | Move to RESEARCHING |
| `move` | `wi-move.sh --to STATUS` | Move between pipelines |
| `approve_implementation` | `wi-approve.sh` | Approve for implementation |
| `view_report` | `wi-export.sh --format markdown` | View generated report |
| `refresh` | (API call) | Reload `workitems.json` |

**OUT (v1, deferred to v2):**
- `validate` - User validation phase
- `plan` - Task breakdown phase
- `build` - Implementation phase

---

## 1. Contract Freeze (Schema v1)

**Principle:** `workitems.json` is the single source of truth. No markdown parsing in frontend.

### 0.1 Canonical JSON Schema (v1)

```json
{
  "generated_at": "ISO8601",
  "version": "1.0",
  "total_items": 6,
  "items": [
    {
      "id": "IDEA-20260225-001",
      "type": "idea",
      "title": "Fresh Test Block",
      "description": "|",
      "status": "NEW",
      "owner": "brokia",
      "priority": "p2",
      "tags": ["idea"],
      "cost_estimate_usd_month": null,
      "impact": "",
      "effort": "",
      "needs_clarification": true,
      "clarification_status": "PENDING",
      "implementation_approved": false,
      "created_at": "ISO8601",
      "updated_at": "ISO8601",
      "path": "inbox/IDEA-20260225-001.md",
      "allowed_actions": ["clarify", "confirm"],
      "reports": {
        "clarification": true,
        "tech": false,
        "cost": false,
        "product": false,
        "arch": false
      }
    }
  ],
  "counts_by_status": { "NEW": 2, "RESEARCHING": 2, "RESEARCHED": 1, "DECIDED": 0, "PLANNED": 0, "BUILDING": 0, "DONE": 0, "DROPPED": 1 },
  "counts_by_type": { "idea": 4, "requirement": 1, "feature": 0, "blocker": 0, "decision": 0, "risk": 0, "research": 1, "solution": 0 },
  "total_cost_estimate_usd_month": 0
}
```

### 0.2 Contract Rules

| Rule | Description |
|------|-------------|
| **Version** | Must be `"1.0"` for v1 compatibility |
| **Paths** | Always relative to `WORKITEMS_DIR` (e.g., `inbox/IDEA-XXX.md`, not `/home/...`) |
| **Permissions** | `allowed_actions` is the **only** source of truth for UI permissions |
| **Timestamps** | ISO8601 format with UTC timezone |
| **Null handling** | Use `null` for optional fields, never omit |

---

## 0. Environment Variables

Minimum required configuration for Mission Control v1:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `BROKIA_ROOT` | Yes | - | Root directory of the Brokia project (parent of `workitems/` and `mission-control/`) |
| `WORKITEMS_DIR` | No | `$BROKIA_ROOT/workitems` | Path to the work-items engine directory |
| `EXPORT_PATH` | No | `$WORKITEMS_DIR/index/workitems.json` | Path to the canonical JSON export file |

### Usage in Scripts

```bash
# Example: Loading env vars in thin API
BROKIA_ROOT="${BROKIA_ROOT:-$(cd "$(dirname "$0")/../.." && pwd)}"
WORKITEMS_DIR="${WORKITEMS_DIR:-$BROKIA_ROOT/workitems}"
EXPORT_PATH="${EXPORT_PATH:-$WORKITEMS_DIR/index/workitems.json}"

# Verify paths exist
[[ -d "$WORKITEMS_DIR" ]] || die "WORKITEMS_DIR not found: $WORKITEMS_DIR"
[[ -f "$EXPORT_PATH" ]] || die "EXPORT_PATH not found: $EXPORT_PATH"
```

---

## 2. Screens

### 2.1 Board (Kanban View)

**Purpose:** Main dashboard showing all work-items organized by status pipeline.

**Columns:**
| Pipeline | Description |
|----------|-------------|
| `NEW` | Items awaiting clarification or first action |
| `RESEARCHING` | Items under investigation |
| `RESEARCHED` | Research complete, awaiting validation/approval |
| `DECIDED` | Decision made, ready for planning |
| `PLANNED` | Breakdown complete, awaiting build |
| `BUILDING` | In active implementation |
| `DONE` | Completed |
| `DROPPED` | Cancelled/declined |

**Card Information (per item):**
- ID (e.g., `IDEA-20260225-001`)
- Title (truncated to 60 chars)
- Type icon/badge (`idea`, `requirement`, `feature`, `blocker`, `decision`, `risk`, `research`, `solution`)
- Priority indicator (`p0`🔴, `p1`🟠, `p2`🟡, `p3`⚪)
- Tags (pill badges)
- Clarification indicator (⚠️ if `needs_clarification=true`)
- Action button (filtered by `allowed_actions`)

**Interactions:**
- Click card → Opens Drawer
- Drag card → Triggers `wi-move.sh` (if allowed)
- Filter controls → Top bar (see Filters section)

---

### 2.2 Drawer (Item Detail Panel)

**Purpose:** Side panel showing full item details and contextually-appropriate actions.

**Header:**
- ID and Type badge
- Title
- Status chip
- Close button (✕)

**Sections:**

| Section | Content |
|---------|---------|
| **Description** | Full description (rendered from JSON `description` field) |
| **Metadata** | Owner, Priority, Created/Updated timestamps |
| **Tags** | All tags |
| **Reports** | Boolean flags: `clarification`, `tech`, `cost`, `product`, `arch` |
| **Clarification** | Shows `clarification_status` and `needs_clarification` |
| **Implementation** | Shows `implementation_approved` |

**Footer Actions:**
- Buttons generated from `allowed_actions` array
- **Clarify** → Opens clarification modal
- **Confirm** → Triggers confirmation flow
- **Research** → Moves to RESEARCHING
- **Validate** → Marks as validated
- **Plan** → Creates breakdown
- **Build** → Moves to BUILDING
- **Export** → Triggers `wi-export.sh`
- **Reopen** → For DROPPED items
- **Update** → Opens edit modal

---

### 2.2b Report Rendering Decision (V1)

**Decision:** **Plain text only** for v1.

**Rationale:**
- Speed > Fancy: Avoid markdown parsing overhead in frontend
- Reports are markdown files generated by scripts in `workitems/reports/`
- For v1: Display report paths as clickable links that open in a new tab/view
- Future (v2): Can add markdown rendering if needed

**Implementation (v1):**
```javascript
// For each report flag that is true:
const reportPath = `${WORKITEMS_DIR}/reports/${item.id}/${reportType}.md`;
// Display as: <a href="view-report?path=${reportPath}">View ${reportType} report</a>
```

**Report Types (from `reports` object):**
- `clarification` → `reports/<ID>/clarification.md`
- `tech` → `reports/<ID>/tech.md`
- `cost` → `reports/<ID>/cost.md`
- `product` → `reports/<ID>/product.md`
- `arch` → `reports/<ID>/arch.md`

---

### 2.3 Create Modal

**Purpose:** Create new work-items via form.

**Fields:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Type | Dropdown | Yes | `idea`, `requirement`, `feature`, `blocker`, `decision`, `risk`, `research`, `solution` |
| Title | Text | Yes | Max 200 chars |
| Description | Textarea | Yes | Multiline, stored as-is |
| Priority | Select | Yes | `p0`, `p1`, `p2`, `p3` |
| Tags | Tags input | No | Free-form, autocomplete from existing |

**Actions:**
- **Create** → Calls `wi-create.sh` with form data
- **Cancel** → Closes modal

**Validation:**
- Client-side: Required fields, max lengths
- Server-side: Unique ID generation, folder creation

---

### 2.4 Filters Bar

**Purpose:** Filter board by various criteria.

**Filter Options:**
| Filter | Type | Notes |
|--------|------|-------|
| Status | Multi-select | Pipeline columns |
| Type | Multi-select | Item types |
| Priority | Multi-select | p0–p3 |
| Tags | Multi-select | Match any selected tag |
| Owner | Single-select | From items |
| Clarification | Toggle | Show only `needs_clarification=true` |
| Search | Text | Fuzzy match on title/description |

**State:** All filters reflected in URL query params for shareability.

---

## 3. User Flows

### 3.1 Full Lifecycle: Create → Clarify → Confirm → Research → Build

```
┌─────────┐    ┌──────────┐    ┌───────────┐    ┌───────────┐    ┌─────────┐
│ CREATE  │───►│ CLARIFY  │───►│ CONFIRM   │───►│ RESEARCH  │───►│  BUILD  │
└─────────┘    └──────────┘    └───────────┘    └───────────┘    └─────────┘
     │              │               │                │               │
     ▼              ▼               ▼                ▼               ▼
wi-create    wi-clarify.sh    wi-confirm.sh    wi-pipeline.sh   wi-move.sh
                                           --step research   --to BUILDING
```

**Step Details:**

| Step | Action | Script | Resulting Status |
|------|--------|--------|------------------|
| 1. Create | User submits Create modal | `wi-create.sh --type X --title "..."` | `NEW` |
| 2. Clarify | User clicks "Clarify" | `wi-clarify.sh --id WI-XXX` | Generates clarification report, sets `needs_clarification=false`, `clarification_status=CONFIRMED` |
| 3. Confirm | User clicks "Confirm" | `wi-confirm.sh --id WI-XXX` | `implementation_approved=true` |
| 4. Research | User clicks "Research" | `wi-pipeline.sh --id WI-XXX --step research` | `RESEARCHING` |
| 5. Build | User moves to BUILDING | `wi-move.sh --id WI-XXX --to BUILDING` | `BUILDING` |

---

### 3.2 Clarification-Only Flow (Blocked Items)

**Condition:** `needs_clarification=true` AND `status!=CONFIRMED`

```
┌─────────────────────────────────────────────────────────────┐
│  Only two actions available:                                │
│  • Clarify → wi-clarify.sh --id WI-XXX                     │
│  • Confirm → wi-confirm.sh --id WI-XXX                     │
│                                                             │
│  All other actions disabled/hidden until clarification     │
│  complete (clarification_status=CONFIRMED)                  │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.3 Export Flow

```
User clicks "Export" → wi-export.sh --id WI-XXX [--format json|markdown|html]
                        ↓
                    Returns: Download or preview
```

---

## 3b. Allowed Status Transitions (Drag & Drop)

**Rule:** Only transitions present in `allowed_actions` via `move` are permitted.

> **Note:** This table documents all valid system transitions. v1 UI only exposes `research` action. Other transitions (validate, plan, build) are available via script execution only.

| From Status | To Status | Allowed? | Error Message (if denied) |
|-------------|-----------|----------|---------------------------|
| NEW | RESEARCHING | ✅ Yes (via `research`) | "Transition not allowed: NEW → RESEARCHING" |
| NEW | DROPPED | ✅ Yes (via `drop`) | "Item dropped" |
| RESEARCHING | RESEARCHED | ✅ Yes (via `validate`) | "Transition not allowed: RESEARCHING → RESEARCHED" |
| RESEARCHING | DROPPED | ✅ Yes (via `drop`) | "Item dropped" |
| RESEARCHED | DECIDED | ✅ Yes (via `decide`) | "Transition not allowed: RESEARCHED → DECIDED" |
| RESEARCHED | DROPPED | ✅ Yes (via `drop`) | "Item dropped" |
| DECIDED | PLANNED | ✅ Yes (via `plan`) | "Transition not allowed: DECIDED → PLANNED" |
| DECIDED | DROPPED | ✅ Yes (via `drop`) | "Item dropped" |
| PLANNED | BUILDING | ✅ Yes (via `build`) | "Transition not allowed: PLANNED → BUILDING" |
| PLANNED | DROPPED | ✅ Yes (via `drop`) | "Item dropped" |
| BUILDING | DONE | ✅ Yes (via `done`) | "Transition not allowed: BUILDING → DONE" |
| BUILDING | DROPPED | ✅ Yes (via `drop`) | "Item dropped" |
| ANY → ANY (invalid) | ❌ No | "Transition from [X] to [Y] is not a valid pipeline step" |

---

## 4. Actions Mapping

### 4.1 Action Reference (v1 Scope)

| UI Action | Script | Required Params | Guardrail Check |
|-----------|--------|-----------------|-----------------|
| Create item | `wi-create.sh` | `--type`, `--title`, `--description`, `--priority`, `--tags` | None (new item) |
| Clarify | `wi-clarify.sh` | `--id` | `allowed_actions` must contain `clarify` |
| Confirm | `wi-confirm.sh` | `--id` | `allowed_actions` must contain `confirm` |
| Move card | `wi-move.sh` | `--id`, `--to` (pipeline name) | `allowed_actions` must contain `move` |
| Pipeline step | `wi-pipeline.sh` | `--id`, `--step` (research only in v1) | `allowed_actions` must contain `research` |
| Approve implementation | `wi-approve.sh` | `--id` | `allowed_actions` must contain `approve_implementation` |
| Update | `wi-update.sh` | `--id`, `--field`, `--value` | `allowed_actions` must contain `update` |
| Export/View report | `wi-export.sh` | `--id`, `--format` | `allowed_actions` must contain `view_report` |

**Error Handling:** If `allowed_actions` doesn't include the action, API returns `blocked_by_guardrail=true` with recovery message. UI disables button and shows tooltip.

---

## 5. Error States and Handling

| Scenario | UI Behavior | Recovery |
|----------|-------------|----------|
| Script fails (non-zero exit) | Show error toast: "Action failed: [reason]" | User retries; check logs |
| Item not found (404) | Show error state: "Item not found" | Refresh board |
| Network/timeout | Show loading spinner → error after 30s | Retry mechanism |
| Guardrail violation | Disable action, show tooltip | None (by design) |
| Invalid form data | Highlight invalid fields, show error text | User corrects and resubmits |
| Concurrent modification | Show conflict message: "Item was modified" | Reload item data |

**Toast Notifications:**
- Success: "Item [ID] moved to RESEARCHING"
- Error: "Failed to move [ID]: [details]"
- Info: "Clarification report generated for [ID]"

---

## 6. Component Hierarchy

```
App
├── Header
│   ├── Logo
│   ├── Title ("Mission Control")
│   └── Global stats (total items, by status)
├── FiltersBar
│   ├── StatusFilter (multi-select)
│   ├── TypeFilter (multi-select)
│   ├── PriorityFilter (multi-select)
│   ├── TagsFilter (multi-select)
│   └── SearchInput
├── Board (Kanban)
│   └── Column (×8: NEW, RESEARCHING, RESEARCHED, DECIDED, PLANNED, BUILDING, DONE, DROPPED)
│       └── Card
│           ├── ID
│           ├── Title
│           ├── Badges (type, priority, tags)
│           ├── ClarificationIndicator (conditional)
│           └── CardActions (dropdown)
└── Drawer (slide-in panel)
    ├── Header (ID, title, close)
    ├── Content
    │   ├── Description
    │   ├── MetadataGrid
    │   ├── TagsList
    │   └── ReportsFlags
    └── FooterActions (dynamic, based on allowed_actions)
```

---

## 7. State Management Approach

### 7.1 Data Flow

```
┌──────────┐     ┌───────────┐     ┌─────────────┐
│  Backend │────►│  Index    │────►│   UI State  │
│ (JSON)   │     │  (JSON)   │     │ (Reactive)  │
└──────────┘     └───────────┘     └─────────────┘
       ▲                               │
       │                               │
       └─────────── Actions ───────────┘
```

### 7.2 State Stores

| Store | Purpose | Updates When |
|-------|---------|--------------|
| `items` | All work-items (from `workitems.json`) | Load, after any action |
| `filters` | Active filters | User changes filter |
| `selectedItem` | Currently open drawer item | User clicks card |
| `modals` | Open/close state for modals | User opens/closes |
| `toasts` | Queue of notifications | Actions complete/fail |

### 7.3 Data Contract (Canonical JSON)

Frontend consumes `workitems.json` with this schema:

```json
{
  "generated_at": "ISO8601",
  "version": "1.0",
  "total_items": 6,
  "items": [
    {
      "id": "IDEA-20260225-001",
      "type": "idea",
      "title": "Fresh Test Block",
      "description": "|",
      "status": "NEW",
      "owner": "brokia",
      "priority": "p2",
      "tags": ["idea"],
      "cost_estimate_usd_month": null,
      "impact": "",
      "effort": "",
      "needs_clarification": true,
      "clarification_status": "PENDING",
      "implementation_approved": false,
      "created_at": "ISO8601",
      "updated_at": "ISO8601",
      "path": "inbox/IDEA-20260225-001.md",
      "allowed_actions": ["clarify", "confirm"],
      "reports": {
        "clarification": true,
        "tech": false,
        "cost": false,
        "product": false,
        "arch": false
      }
    }
  ],
  "counts_by_status": { "NEW": 2, ... },
  "counts_by_type": { "idea": 4, ... },
  "total_cost_estimate_usd_month": 0
}
```

### 7.4 Action Execution Flow

1. User clicks button (e.g., "Clarify")
2. UI checks `allowed_actions` includes "clarify"
3. UI calls `wi-clarify.sh --id ITEM_ID`
4. Script executes, updates markdown file
5. UI re-fetches `workitems.json` (or gets updated via WebSocket)
6. State store updates, UI re-renders

---

## 8. Guardrails Reference

### 8.1 Clarification Layer

```
IF needs_clarification = true AND status != "CONFIRMED":
    allowed_actions = ["clarify", "confirm"] ONLY
```

### 8.2 Tag Triggers (Examples)

| Tag | Effect |
|-----|--------|
| `voice` | Requires product report |
| `mvp` | Skips validation phase |
| `blocker` | Prioritized in sorting |

### 8.3 Allowed Actions by Status

> **Note:** Table documents system-wide actions. v1 UI exposes only: `clarify`, `confirm`, `research`, `move`, `update`, `approve_implementation`, `view_report`, `refresh`.

| Status | Typical allowed_actions |
|--------|------------------------|
| `NEW` | `clarify`, `confirm`, `view`, `export`, `update` |
| `RESEARCHING` | `view`, `export`, `research`, `validate`, `move`, `update` |
| `RESEARCHED` | `view`, `export`, `validate`, `plan`, `move`, `update` |
| `DECIDED` | `view`, `export`, `plan`, `move`, `update` |
| `PLANNED` | `view`, `export`, `build`, `move`, `update` |
| `BUILDING` | `view`, `export`, `validate`, `done`, `move`, `update` |
| `DONE` | `view`, `export`, `reopen` |
| `DROPPED` | `view`, `export`, `reopen`, `update` |

---

## 8.5 Log Persistence (Thin API)

Every action executed via the thin API must persist logs to:

```
brokia/mission-control/logs/<action_id>/
├── stdout.txt
├── stderr.txt
├── exit_code.txt
├── timestamp.txt
└── user_action.txt
```

**Log Structure:**

| File | Content |
|------|---------|
| `stdout.txt` | Standard output from script execution |
| `stderr.txt` | Standard error (includes error messages) |
| `exit_code.txt` | Numeric exit code (0 = success) |
| `timestamp.txt` | ISO8601 timestamp of execution start |
| `user_action.txt` | Human-readable action description (e.g., "User clicked Clarify on IDEA-20260225-001") |

**Example:**
```bash
# After executing wi-clarify.sh --id IDEA-20260225-001
mkdir -p "$MISSION_CONTROL_ROOT/logs/clarify_IDEA-20260225_$(date +%s)"
echo "$STDOUT" > "$LOG_DIR/stdout.txt"
echo "$STDERR" > "$LOG_DIR/stderr.txt"
echo "$EXIT_CODE" > "$LOG_DIR/exit_code.txt"
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$LOG_DIR/timestamp.txt"
echo "User clicked Clarify on IDEA-20260225-001" > "$LOG_DIR/user_action.txt"
```

---

## 9. File Structure

```
brokia/mission-control/
├── specs/
│   └── MISSION_CONTROL_V1.md   ← This file
├── src/
│   ├── components/
│   │   ├── Board/
│   │   ├── Column/
│   │   ├── Card/
│   │   ├── Drawer/
│   │   ├── CreateModal/
│   │   └── FiltersBar/
│   ├── hooks/
│   │   ├── useItems.js
│   │   ├── useActions.js
│   │   └── useFilters.js
│   ├── services/
│   │   ├── api.js
│   │   └── scripts.js
│   ├── stores/
│   │   ├── itemsStore.js
│   │   ├── filtersStore.js
│   │   └── uiStore.js
│   └── App.jsx
└── public/
    └── index.html
```

---

## 10. Appendix: Scripts Reference

| Script | Purpose | Key Flags |
|--------|---------|-----------|
| `wi-create.sh` | Create new item | `--type`, `--title`, `--priority`, `--tags` |
| `wi-update.sh` | Update item fields | `--id`, `--field`, `--value` |
| `wi-move.sh` | Move between pipelines | `--id`, `--to` |
| `wi-pipeline.sh` | Execute pipeline step | `--id`, `--step` |
| `wi-approve.sh` | Approve implementation | `--id` |
| `wi-confirm.sh` | Confirm after clarification | `--id` |
| `wi-clarify.sh` | Generate clarification report | `--id` |
| `wi-export.sh` | Export item data | `--id`, `--format` |
| `wi-watch.sh` | Watch for changes | `--id` |

---

**End of Specification**