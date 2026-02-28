# Agent Mission Control (React V2.2)

Local-first React dashboard for agent operations, backed by markdown/json files in:

- `/home/manpac/.openclaw/workspace/dashboard/agents.md`
- `/home/manpac/.openclaw/workspace/dashboard/tasks.md`
- `/home/manpac/.openclaw/workspace/dashboard/handoffs.md`
- `/home/manpac/.openclaw/workspace/dashboard/models.md`
- `/home/manpac/.openclaw/workspace/dashboard/briefing-config.md`
- `/home/manpac/.openclaw/workspace/dashboard/approvals.md`
- `/home/manpac/.openclaw/workspace/dashboard/runtime-runs.json` (optional fallback live-runs source)
- `/home/manpac/.openclaw/workspace/dashboard/dispatch-queue/*.json` (approval dispatch jobs)

## V2.3 Features

- Global UI title renamed to **Agent Mission Control**.
- Views: Agents, Tasks, **Completed**, Handoffs, Models/Cost, Briefing Status, Approvals.
- **Dedicated Completed tab**:
  - pulls from merged task sources (`tasks.md` + live runs)
  - supports sidebar agent filter
  - sorts newest completion first when timestamp is available
  - shows source badge (`tasks.md` / `live-runs`) and completion time
- **Approval execution flow (approval-first)**:
  - Approve (single)
  - Reject (single)
  - Approve All Pending
  - Reject All Pending
- **Idempotent approval handling**: approving the same item twice does not duplicate dispatch.
- **Audit trail persistence**:
  - approval entries move through `pending -> approved -> executed` (or `rejected` / `failed`)
  - timestamps + actor fields are stored on each approval item
  - events are appended to `dashboard/handoffs.md`
- **Staged dispatch executor** (safe default):
  - Approve action writes a dispatch job file in `dashboard/dispatch-queue/`
  - Process endpoints execute queued jobs safely and record result in approvals + handoffs
- **Tasks + Live Runs merge**:
  - static tasks from `tasks.md`
  - live in-progress runs from subagent runtime (best effort)
  - fallback source: `runtime-runs.json`
  - merged list appears in Tasks board with `source: tasks.md` or `source: live-runs`

## Approval lifecycle (exact)

1. Request is queued (`POST /api/approvals`) with `status: pending`
2. Reviewer action:
   - `POST /api/approvals/:id/approve` → `status: approved`, `approvedAt`, `approvedBy`, dispatch job created once
   - `POST /api/approvals/:id/reject` → `status: rejected`, `rejectedAt`, `rejectedBy`
3. Dispatcher action:
   - `POST /api/dispatch/process-one` or `POST /api/dispatch/process-all`
   - approved job is processed and marked `status: executed` + `executedAt`
   - on failure: `status: failed` + `failedAt` + `failureReason`
4. Every state transition appends a handoff audit line to `handoffs.md`

### Safety constraints enforced

- No external send occurs from queue creation.
- Dispatch processing is gated behind explicit approval.
- Dispatch job creation is idempotent per approval (`JOB-<approval-id>`).

## Live runs source behavior

Backend tries this order:

1. `openclaw subagents list --json` (best effort)
2. fallback to `dashboard/runtime-runs.json`

### `runtime-runs.json` format (example)

```json
[
  {
    "id": "run-123",
    "agent": "builder",
    "title": "Implement auth routing",
    "status": "running",
    "startedAt": "2026-02-17T12:30:00.000Z"
  }
]
```

When present, these runs are mapped into Tasks as live `In Progress` items and can surface runtime-only workers in the Agents panel.

## API endpoints

- `GET /api/health`
- `GET /api/dashboard`
- `POST /api/approvals` (queue new approval)
- `POST /api/approvals/:id/approve`
- `POST /api/approvals/:id/reject`
- `POST /api/approvals/approve-all`
- `POST /api/approvals/reject-all`
- `GET /api/dispatch/jobs`
- `POST /api/dispatch/process-one`
- `POST /api/dispatch/process-all`
- `GET /api/workspace-file?path=<relative-path>`

## Run locally (dev)

```bash
cd /home/manpac/.openclaw/workspace/projects/agent-dashboard
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:3001/api/dashboard`

## Build

```bash
cd /home/manpac/.openclaw/workspace/projects/agent-dashboard
npm run build
```
