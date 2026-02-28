# Cost Routing Policy

## Objective
Minimize LLM costs while maintaining pipeline reliability, using Gateway Usage as the single source of truth (not provider‑side quotas).

## Scope
- All cron jobs, sub‑agent sessions, and main‑session interactions.
- Model selection, fallback ordering, and concurrency limits.
- Usage monitoring and daily reporting.

---

## 1. Default Routing Rules

### 1.1 Primary Model (cheap mass traffic)
**Default for:** main session, cron jobs, triage, lightweight tasks.  
**Model:** `openrouter/deepseek/deepseek‑v3.2`  
**Reason:** Low cost (~$0.14/1M tokens), strong reasoning, good for general orchestration.

### 1.2 Sub‑agent Defaults
**Primary:** `openrouter/minimax/minimax‑m2.1` (cheap, fast)  
**Fallbacks:** `openai‑codex/gpt‑5.1‑codex` (expensive) – **only for tasks marked `heavy`**.  
**Max concurrent sub‑agents:** 2 (down from 4) to reduce parallel token burn.

### 1.3 Heavy‑duty Agents (allow expensive models)
| Agent      | Primary Model                  | Fallback                   | When to use                          |
|------------|--------------------------------|----------------------------|--------------------------------------|
| researcher | `x‑ai/grok‑4.1‑fast`           | `openrouter/minimax/minimax‑m2.1` | Web research, competitor analysis, market scans |
| builder    | `openai‑codex/gpt‑5.3‑codex`   | `openrouter/deepseek/deepseek‑v3.2` | Technical design, code generation, architecture |
| writer     | `stepfun/step‑3.5‑flash:free`  | `openai‑codex/gpt‑5.1‑codex`       | Drafting, polishing, formatting (free tier first) |
| chief      | `openrouter/deepseek/deepseek‑v3.2` | `openai‑codex/gpt‑5.1‑codex` | Planning, prioritization, backlog grooming |
| ops        | `openrouter/deepseek/deepseek‑v3.2` | `openai‑codex/gpt‑5.1‑codex` | Security audits, hardening, runbooks |
| brokia     | `openrouter/deepseek/deepseek‑v3.2` | `openai‑codex/gpt‑5.1‑codex` | Brokia MVP, thesis validation |
| qubika     | `openrouter/deepseek/deepseek‑v3.2` | `openai‑codex/gpt‑5.1‑codex` | Qubika/Bancard daily focus, deadline checks |

**Rule:** Do **not** upgrade to expensive models unless the task is explicitly marked as `heavy` (e.g., complex research, critical code correctness). Cron jobs should never use expensive models unless unavoidable.

### 1.4 Heartbeat & Periodic Checks
- **Heartbeat model:** `openrouter/minimax/minimax‑m2.1` (cheapest reliable).
- **Frequency:** Every 4 hours (6 checks/day) – implemented via cron job `heartbeat‑light`.
- **Purpose:** Email/calendar/notification checks only; no deep analysis.

---

## 2. Configuration Changes (openclaw.json)

### 2.1 Global Defaults
```json
"agents": {
  "defaults": {
    "model": {
      "primary": "openrouter/deepseek/deepseek‑v3.2"
    },
    "subagents": {
      "maxConcurrent": 2,
      "model": {
        "primary": "openrouter/minimax/minimax‑m2.1",
        "fallbacks": [
          "openai‑codex/gpt‑5.1‑codex"
        ]
      }
    }
  }
}
```

### 2.2 Agent‑specific Overrides
- Keep `researcher` and `builder` with expensive primaries (they are heavy‑duty).
- Change `qubika` primary from `x‑ai/grok‑4.1‑fast` to `openrouter/deepseek/deepseek‑v3.2`.
- All other agents already use cheap primaries.

### 2.3 Heartbeat (if supported)
If the `agents.defaults.heartbeat` field is supported, add:
```json
"heartbeat": {
  "every": "4h",
  "model": "openrouter/minimax/minimax‑m2.1"
}
```
Otherwise, create a cron job `heartbeat‑light` that runs every 4h with the cheap model.

---

## 3. Usage Monitoring

### 3.1 Snapshot Collection
**Goal:** Capture per‑job, per‑agent, per‑model token usage and estimated cost.

**Implementation:**  
- After each cron job run, append a JSONL line to `reports/usage_snapshots/YYYY‑MM‑DD.jsonl`.  
- Fields:
  ```json
  {
    "timestamp": "2026‑02‑22T00:00:00Z",
    "job_name": "daily‑morning‑briefing‑telegram",
    "agent_id": "main",
    "model": "openrouter/deepseek/deepseek‑v3.2",
    "tokens_prompt": 1200,
    "tokens_completion": 450,
    "total_tokens": 1650,
    "estimated_cost_usd": 0.000231,
    "provider": "openrouter",
    "status": "ok"
  }
  ```
- Source: Gateway Usage API (via `openclaw gateway usage --json` or internal metrics).

### 3.2 Daily Cost Report
**Cron job:** `daily‑cost‑report` at 07:10 America/Montevideo.

**Steps:**  
1. Read `reports/usage_snapshots/YYYY‑MM‑DD.jsonl` (previous day).  
2. Aggregate totals: cost, tokens, top jobs, top agents, top models.  
3. Write `reports/cost/YYYY‑MM‑DD.md` with:
   - Daily totals (cost, tokens, messages, tools)
   - Top 10 jobs by cost
   - Top 10 agents by cost  
   - Top 10 models by cost
   - Error/retry summary
   - Recommendations (e.g., “Job X uses expensive model; consider switching.”)
4. Deliver summary to Telegram group `‑5130387079` (OpenClaw Ops).

### 3.3 Validation via Gateway Panel
- Open `http://localhost:18789/usage` (or `openclaw gateway usage` CLI).
- Filter by agent, model, cron job name.
- Compare snapshots with panel totals for consistency.

---

## 4. Rollback & Safety

### 4.1 Disable‑First Approach
- Any change to model routing is first applied as `enabled: false` on a duplicate job.
- After 24h of validation, switch traffic to new job and delete old one.

### 4.2 Quick Rollback
- Keep `openclaw.json.bak` before each config change.
- Revert with `openclaw config restore openclaw.json.bak.<timestamp>`.

### 4.3 Pipeline Verification Checklist
After any routing change, verify:
- [ ] Newsletter digest still delivers.
- [ ] Nightly chain runs without errors.
- [ ] Brokia calendar alerts fire.
- [ ] Qubika daily focus appears.
- [ ] Briefing pipeline (sources + assembly) works.
- [ ] Usage snapshots are being written.

---

## 5. Implementation Phases

1. **Phase 1 (Config)** – Update `openclaw.json` with cheap defaults and concurrency limits.
2. **Phase 2 (Monitoring)** – Deploy usage snapshot collector and daily cost report cron.
3. **Phase 3 (Optimization)** – Analyze daily reports and downgrade expensive jobs (e.g., `researcher` used in lightweight cron).
4. **Phase 4 (Automation)** – Auto‑alert on cost spikes (> $0.50/day) and auto‑pause offending jobs.

---

## 6. References
- OpenRouter pricing: https://openrouter.ai/models
- OpenClaw Gateway Usage docs: `openclaw gateway usage --help`
- Existing cron inventory: `cron/JOBS_INVENTORY.json`
- Pipeline map: `cron/JOB_MAP.md`

---

*Last updated: 2026‑02‑22*  
*Owner: Manuel Pacheco*  
*Review cycle: Weekly (Monday 09:00 UTC)*