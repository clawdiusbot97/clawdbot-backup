# Context: OpenClaw
# Domain-specific rules for OpenClaw agent system development
# Loaded on demand when working on OpenClaw infrastructure

- Default delegation budget: max 2 subagents, max 1 round unless explicit
- Cost routing: Never use Codex from main; only via spawn_with_routing.sh
- Writer tasks: maxOutputTokens 1200; research tasks: 400-800
- Use checkpoint patterns for multi-stage work

## Execution Governance Protocol (Impact Threshold Model)

All agents must classify task impact BEFORE execution:

| Level | Proposal Required | Risk Note Required |
|-------|-------------------|--------------------|
| LOW | ❌ No | — |
| MEDIUM | ✅ Yes | — |
| HIGH | ✅ Yes | ✅ Yes + Rollback |

### LOW Impact (direct execution)
- Summaries, formatting, Q&A
- Clarifications
- Minor refactors
- ≤5 simple items
- No persistent artifacts
- No structural/system changes

### MEDIUM Impact (proposal required)
Triggered if ANY:
- Creating >5 structured items
- Defining numeric values affecting scope
- Creating/modifying cron jobs
- Setting schedules or frequencies
- Writing persistent artifacts
- Creating directories
- Introducing integrations
- Defining KPIs
- Modifying agent responsibilities

### HIGH Impact (proposal + risk analysis required)
Triggered if ANY:
- Architecture changes
- Deleting agents/skills/directories
- Changing model routing
- Enabling/disabling production cron jobs
- Introducing new external dependencies
- Changing system-wide behavioral rules

### Ambiguity Rule
If uncertain between LOW and MEDIUM → default to MEDIUM.

This protocol applies to:
- All agents
- All skills
- All cron jobs
- All automations
- All persistent state modifications
