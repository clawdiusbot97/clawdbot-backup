---
name: brokia-plan
description: Generate structured plans with numbered stages for Brokia MVP and other projects.
metadata:
  {
    "openclaw": {
      "emoji": "🗺️",
      "tags": ["brokia", "planning", "workflow"]
    }
  }
---

# brokia-plan

Generate a structured, stage-based plan for Brokia MVP or other projects. Plans are saved in the `plans/` directory with numbered stages for externalized context and checkpoint resumption.

## When to use

- Starting a new Brokia MVP feature or validation experiment.
- Breaking down a complex task into executable stages.
- Creating a plan that can survive context window limits.

## How it works

1. **Input**: A goal or feature description.
2. **Process**: 
   - Analyze requirements and constraints.
   - Break into 3–7 numbered stages.
   - Each stage should be 1–2 days of work max.
   - Include validation criteria per stage.
3. **Output**: 
   - A markdown file in `/home/manpac/.openclaw/workspace/plans/` named `PLAN-{ID}-{slug}.md`.
   - A corresponding checkpoint file `plans/checkpoints/{ID}-stage-1.json` (optional).
   - Update `MEMORY.md` with plan reference.

## Plan template

```markdown
# PLAN-{ID}: {Title}

**Goal**: {concise goal}
**Priority**: High/Medium/Low
**Estimated total**: {X} days
**Created**: {date}
**Status**: draft

## Context
- Why this matters
- Dependencies / prerequisites
- Success metrics

## Stages

### Stage 1: {title}
- **Objective**: {what}
- **Deliverables**: {tangible outputs}
- **Validation**: {how to know it's done}
- **Estimated**: {hours/days}
- **Checkpoint file**: `plans/checkpoints/{ID}-stage-1.json`

### Stage 2: {title}
...

## Notes & Risks
- Assumptions
- Unknowns
- Fallback options

## Change log
- {date}: Created
```

## Commands / examples

**Generate a new plan** (run in main session):
```bash
# Use chief subagent for planning
sessions_spawn agentId=chief task="Create a stage-based plan for: {goal}. Save to plans/ directory with ID based on date+seq."
```

**Resume from checkpoint**:
```bash
# Check if checkpoint exists
read plans/checkpoints/{ID}-stage-{N}.json

# Continue with builder
sessions_spawn agentId=builder task="Resume stage {N} from plan PLAN-{ID}. Use checkpoint file for context."
```

**List active plans**:
```bash
find /home/manpac/.openclaw/workspace/plans -name "PLAN-*.md" -type f | head -10
```

## Integration with multi-agent workflow

1. **Chief** creates plan → saves to `plans/`.
2. **Builder** implements stage N → updates checkpoint.
3. **Ops** reviews stage output → approves/requests changes.
4. **Writer** documents decisions → updates `MEMORY.md`.
5. **Cron** monitors progress → sends alerts if stuck.

## Notes

- Plan IDs use format `YYYYMMDD-{seq}` (e.g., `20260218-01`).
- Checkpoints store intermediate state (e.g., files created, tests passed, git hash).
- Plans are living documents—update as stages complete.
- Keep stages small enough to fit in a single context window (≤ 2k tokens).