---

## TEST 1: Validate workitems.json Contract - Schema & Structure

**Precondition:** API server running, work items exist

**Steps:**
1. Create a new work item via POST `/api/workitems`
2. Retrieve the work item file from filesystem (WORKITEMS_DIR/<id>/workitems.json)
3. Verify `schema_version` field is present and equals `1`
4. Verify all paths in the file are **relative**, not absolute (e.g., `logs/<action_id>/` not `/absolute/path/`)
5. Verify `allowed_actions` is present and is the **single source of truth** for action permissions
6. Verify required fields: `id`, `created_at`, `status`, `needs_clarification`, `implementation_approved`, `allowed_actions`

**Expected Result:**
- Status code: 201 Created for creation
- `schema_version: "1"` present in JSON
- No absolute paths (all relative to work item directory)
- `allowed_actions` matches computed permissions based on state
- File structure matches defined schema

**Guardrail Validated:** Schema validation, allowed_actions as source of truth

---

## TEST 2: allowed_actions as Single Source of Truth

**Precondition:** Work item exists, retrieve `allowed_actions` list

**Steps:**
1. GET `/api/workitems/:id` and capture `allowed_actions`
2. Attempt an action NOT in `allowed_actions` list (e.g., if "approve_implementation" not present)
3. Verify request is blocked with 403
4. Perform an action that IS in `allowed_actions`
5. Verify request succeeds and `allowed_actions` may be updated
6. Cross-verify: `allowed_actions` in API response matches filesystem state

**Expected Result:**
- Disallowed actions: 403 Forbidden, "Action not in allowed_actions"
- Allowed actions: 200 OK, state updates
- `allowed_actions` is authoritative - UI/CLI must reference it, not compute separately

**Guardrail Validated:** allowed_actions (whitelist enforcement)

---

## TEST 3: Drag&Drop Transitions - Allowed Moves

**Precondition:** Work item exists in known column (e.g., "backlog")

**Steps:**
1. Identify adjacent column (e.g., "ready")
2. Send move action:
   ```json
   { "action": "move", "target_column": "ready" }
   ```
3. Verify move succeeds (column exists in allowed_actions)
4. Attempt move to different adjacent column
5. Verify each allowed move updates status correctly

**Expected Result:**
- Valid adjacent move: 200 OK, status updates to target column
- `allowed_actions` reflects new available actions for updated column
- Work item visible in new Kanban column in UI

**Guardrail Validated:** allowed_actions, status transition rules

---

## TEST 4: Drag&Drop Transitions - Blocked Moves (Error Messages)

**Precondition:** Work item exists, `allowed_actions` does NOT include target move

**Steps:**
1. Attempt move to non-adjacent column (e.g., "done" from "backlog"):
   ```json
   { "action": "move", "target_column": "done" }
   ```
2. Attempt move to same column:
   ```json
   { "action": "move", "target_column": "backlog" }
   ```
3. Attempt move to non-existent column:
   ```json
   { "action": "move", "target_column": "invalid_column" }
   ```
4. Attempt move when action not in `allowed_actions`:
   ```json
   { "action": "move", "target_column": "ready" }
   ```
5. Attempt move with missing target_column field

**Expected Result:**
- Non-adjacent: 400 Bad Request, "Must move to adjacent column only"
- Same column: 400 Bad Request, "Cannot move to current column"
- Non-existent column: 400 Bad Request, "Invalid target column: invalid_column"
- Not in allowed_actions: 403 Forbidden, "Move action not in allowed_actions"
- Missing field: 400 Bad Request, "target_column required"
- Status remains unchanged in all failure cases

**Guardrail Validated:** allowed_actions, status transition rules (specific error messages)

---

## TEST 5: Create Work Item (POST /api/workitems)

**Precondition:** API server running, no existing work items with test data

**Steps:**
1. Send POST request to `/api/workitems` with JSON body:
   ```json
   {
     "title": "Test Feature",
     "description": "Test description",
     "status": "backlog",
     "metadata": { "priority": "high" }
   }
   ```
2. Capture the response (work item ID, status code)
3. Verify the work item was created via GET `/api/workitems/:id`
4. Verify workitems.json file structure on disk

**Expected Result:**
- Status code: 201 Created
- Response includes: `id`, `created_at`, `status`, `needs_clarification=false`, `implementation_approved=false`
- `allowed_actions` includes: ["research", "clarify", "confirm", "update", "refresh", "view_report"]
- Work item is visible in the first Kanban column
- Filesystem: WORKITEMS_DIR/<id>/workitems.json created

**Guardrail Validated:** None (base state initialization)

---

## TEST 6: Clarify → Confirm Flow with Clarification Layer

**Precondition:** Work item created with `needs_clarification=false`

**Steps:**
1. Send POST to `/api/workitems/:id/actions` with action: `clarify`
   ```json
   { "action": "clarify", "clarification": "What are the exact requirements?" }
   ```
2. Verify response shows `needs_clarification=true`
3. Send GET `/api/workitems/:id` to confirm state
4. Send POST to `/api/workitems/:id/actions` with action: `confirm`
   ```json
   { "action": "confirm", "resolution": "Requirements clarified with stakeholder" }
   ```
5. Verify response shows `needs_clarification=false`

**Expected Result:**
- After clarify action: `needs_clarification=true`, `allowed_actions` restricted to ["confirm", "refresh", "view_report"]
- After confirm action: `needs_clarification=false`, `allowed_actions` restored
- Status remains unchanged throughout clarification flow
- Audit logs created for both actions (see TEST 11)

**Guardrail Validated:** Clarification Layer (blocks progress until clarification resolved)

---

## TEST 7: Blocked Actions When needs_clarification=true

**Precondition:** Work item exists with `needs_clarification=true` (from TEST 6 step 2)

**Steps:**
1. Attempt POST to `/api/workitems/:id/actions` with each action:
   - `research`
   - `approve_implementation`
   - `move`
   - `update`
   - `refresh`
2. Record all response codes and messages

**Expected Result:**
- All requests return: 403 Forbidden
- Response includes error: "Action blocked - clarification required. Resolve with 'clarify' or 'confirm'"
- `needs_clarification` flag remains true
- No status changes occur
- Only "confirm", "clarify", "refresh", "view_report" remain allowed

**Guardrail Validated:** Clarification Layer (blocks non-clarification actions when active)

---

## TEST 8: Blocked approve_implementation When implementation_approved=false

**Precondition:** Work item exists, implementation_approved is implicit based on allowed_actions

**Steps:**
1. Verify `approve_implementation` is NOT in `allowed_actions` (precondition)
2. Send POST to `/api/workitems/:id/actions` with action: `approve_implementation`
   ```json
   { "action": "approve_implementation", "approver": "qa-lead" }
   ```
3. Check the response and work item state after request

**Expected Result:**
- Request returns: 403 Forbidden
- Response includes error: "approve_implementation not in allowed_actions"
- `implementation_approved` remains unchanged (or not yet set)
- No status changes occur

**Guardrail Validated:** implementation_approved (enforced via allowed_actions)

---

## TEST 9: Action Endpoint - v1 Frozen Scope Actions

**Precondition:** Work item exists in "backlog" status

**Steps:**
1. **Create action (via POST /api/workitems):**
   - Covered in TEST 5

2. **Update action:**
   ```
   POST /api/workitems/:id/actions { "action": "update", "updates": { "title": "Updated Title" } }
   ```
   - Expected: 200 OK, metadata reflects changes

3. **Research action:**
   ```
   POST /api/workitems/:id/actions { "action": "research", "notes": "Initial research findings" }
   ```
   - Expected: 200 OK, log file created

4. **Clarify action:**
   ```
   POST /api/workitems/:id/actions { "action": "clarify", "clarification": "Question for stakeholder" }
   ```
   - Expected: 200 OK, needs_clarification=true

5. **Confirm action:**
   ```
   POST /api/workitems/:id/actions { "action": "confirm", "resolution": "Clarification resolved" }
   ```
   - Expected: 200 OK, needs_clarification=false

6. **Move action:**
   ```
   POST /api/workitems/:id/actions { "action": "move", "target_column": "ready" }
   ```
   - Expected: 200 OK, status updates

7. **Approve_implementation action:**
   ```
   POST /api/workitems/:id/actions { "action": "approve_implementation", "approver": "lead" }
   ```
   - Expected: 200 OK when in allowed_actions

8. **View_report action:**
   ```
   POST /api/workitems/:id/actions { "action": "view_report" }
   ```
   - Expected: 200 OK, report data returned

9. **Refresh action:**
   ```
   POST /api/workitems/:id/actions { "action": "refresh" }
   ```
   - Expected: 200 OK, current state refreshed

**Expected Result:** Each action returns appropriate response; only v1 IN-scope actions tested

**Guardrail Validated:** allowed_actions (per action requirements)

**Note:** validate, plan, build are OUT for v1 - skip these tests

---

## TEST 10: Report Viewer v1 (GET /api/workitems/:id/report)

**Precondition:** Work item exists with actions performed

**Steps:**
1. Perform research action on work item
2. Send GET request to `/api/workitems/:id/report`
3. Verify report format matches spec decision (markdown vs plain text)
4. Test with invalid ID: GET `/api/workitems/invalid-id/report`
5. Test with non-existent but valid-format ID

**Expected Result:**
- Status code: 200 OK
- Report format: **[CONFIRM FROM SPEC: markdown rendered OR plain text]**
- Report includes: work item summary, action history, timestamps, clarifications
- Invalid ID: 404 Not Found with "Work item not found"
- Non-existent ID: 404 Not Found or empty response

**Guardrail Validated:** Output format compliance (per spec decision)

---

## TEST 11: Audit Logs - Persistence & Structure

**Precondition:** API server running, work item exists

**Steps:**
1. Perform an action (e.g., `research`) on work item
2. Check filesystem for log directory: `WORKITEMS_DIR/<workitem_id>/logs/<action_id>/`
3. Verify log structure exists:
   - `stdout` - contains command output
   - `stderr` - contains error output (if any)
   - `exit_code` - numeric exit code
   - `timestamp` - ISO 8601 timestamp
4. Perform a `clarify` action and verify its log
5. Perform an `update` action and verify its log
6. Verify log directory structure is created for each action

**Expected Result:**
- Log directory created for each action
- All 4 files present: stdout, stderr, exit_code, timestamp
- stdout contains expected command output
- stderr empty on success, contains error message on failure
- exit_code is 0 for success, non-zero for failures
- timestamp is valid ISO 8601 format
- Logs persist after request completes

**Guardrail Validated:** Audit trail completeness

---

## TEST 12: Environment Variables - .env vs Defaults

**Precondition:** API server can be started with different env configs

**Steps:**
1. **Without .env (defaults):**
   - Start API without BROKIA_ROOT, WORKITEMS_DIR, EXPORT_PATH set
   - Create a work item
   - Verify default paths are used (check logs or error messages)

2. **With .env configured:**
   - Set custom values:
     ```
     BROKIA_ROOT=/custom/brokia
     WORKITEMS_DIR=/custom/brokia/workitems
     EXPORT_PATH=/custom/brokia/exports
     ```
   - Restart API
   - Create a work item
   - Verify files are created in custom paths

3. **Partial configuration:**
   - Set only BROKIA_ROOT, leave others unset
   - Verify WORKITEMS_DIR derives from BROKIA_ROOT

4. **Invalid paths:**
   - Set WORKITEMS_DIR to non-existent path
   - Attempt work item creation
   - Verify error response

**Expected Result:**
- Without .env: Uses sensible defaults (error or built-in paths)
- With .env: Creates files in specified custom paths
- Partial config: WORKITEMS_DIR defaults to `$BROKIA_ROOT/workitems`
- Invalid paths: 500 Error, "Invalid WORKITEMS_DIR path"
- Environment variables validated at startup

**Guardrail Validated:** Configuration management, path validation

---

## TEST 13: Security - Script Injection & Invalid IDs

**Precondition:** API server running, work item exists

**Steps:**
1. **Title injection:**
   ```
   POST /api/workitems { "title": "<script>alert('xss')</script>" }
   ```
2. **Description injection:**
   ```
   PATCH /api/workitems/:id { "description": "'; DROP TABLE workitems; --" }
   ```
3. **Metadata injection:**
   ```
   PATCH /api/workitems/:id { "metadata": { "eval": "${malicious}" } }
   ```
4. **Action notes injection:**
   ```
   POST /api/workitems/:id/actions { "action": "research", "notes": "$(whoami)" }
   ```
5. **Invalid ID - path traversal:**
   ```
   GET /api/workitems/../../../etc/passwd
   ```
6. **SQL injection style ID:**
   ```
   GET /api/workitems/1' OR '1'='1/report
   ```
7. **Null byte injection:**
   ```
   GET /api/workitems/nullbyte%00id/report
   ```

**Expected Result:**
- All injection attempts: 400 Bad Request or 200 with sanitized/escaped output
- Script tags: Sanitized or rejected with "Invalid characters in field"
- SQL injection patterns: 400 Bad Request, "Suspicious input pattern"
- Path traversal: 400 Bad Request, "Invalid ID format"
- Null bytes: 400 Bad Request, "Null bytes not allowed"
- No code execution or data leakage occurs
- Invalid IDs return 404 (not 500 internal error)

**Guardrail Validated:** Input validation, sanitization, ID handling security

---

## Summary

| Test # | Test Name | Guardrail(s) Validated | Pass Criteria |
|--------|-----------|----------------------|---------------|
| 1 | workitems.json Contract | Schema, relative paths | schema_version=1, no absolute paths |
| 2 | allowed_actions Source of Truth | allowed_actions | Whitelist enforced, authoritative |
| 3 | Drag&Drop - Allowed Moves | allowed_actions, status | 200, status updates |
| 4 | Drag&Drop - Blocked Moves | allowed_actions, status | 400, specific error messages |
| 5 | Create Work Item | None (base state) | 201 Created, correct initial state |
| 6 | Clarify → Confirm Flow | Clarification Layer | Flag toggles, actions blocked/restored |
| 7 | Blocked Actions (needs_clarification=true) | Clarification Layer | 403, "clarification required" |
| 8 | Blocked approve_implementation | implementation_approved | 403, not in allowed_actions |
| 9 | v1 Action Scope | allowed_actions | Only IN-scope actions tested |
| 10 | Report Viewer v1 | Output format | Per spec decision (markdown/plain) |
| 11 | Audit Logs | Log persistence | stdout, stderr, exit_code, timestamp |
| 12 | Environment Variables | Config validation | .env vs defaults, invalid paths |
| 13 | Security - Script Injection | Input sanitization | All injection attempts rejected |

**Total Test Cases:** 13  
**Guardrails Covered:** Clarification Layer, implementation_approved, allowed_actions  
**Coverage Areas:** Schema validation, drag&drop, API operations, guardrails, report viewer, audit logs, environment config, security

**v1 Action Scope (FROZEN):**
- ✅ IN: create, update, clarify, confirm, research, move, approve_implementation, view_report, refresh
- ❌ OUT (v2): validate, plan, build

---

*Document Version: 1.1 - 2026-02-25 (Updated with 6 adjustments)*  
*Next.js Application - Thin API wrapping shell scripts*