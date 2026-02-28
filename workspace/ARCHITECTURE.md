# ARCHITECTURE.md — OpenClaw Multi-Agent Architecture (v2)

> **Status:** Draft — Migration Phase 0  
> **Last Updated:** 2026-02-20  
> **Architect:** Orchestrator (main)

---

## 1. Design Principles

1. **Reduce coordination tax** — Fewer agents, sharper identities
2. **Increase identity sharpness** — Each agent has clear boundaries
3. **Preserve capabilities** — No functionality loss
4. **Minimize token burn** — Lightweight context, no duplication
5. **Keep reversible** — Archive before delete, test before cutover

---

## 2. 4-Core Architecture

```
openclaw/
├── Core Agents (resident, always loaded)
│   ├── Orchestrator (main) ─── SOUL.md (existing)
│   ├── Researcher ───────────── SOUL.md (existing)
│   ├── Builder ──────────────── SOUL.md (existing)
│   └── Writer ───────────────── SOUL.md (existing)
│
├── Specialist Library (spawn-only, on-demand)
│   ├── chief/ ───────────────── SOUL.md ✓ created
│   └── ops/ ─────────────────── SOUL.md ✓ created
│
├── Context Packs (static injection)
│   ├── domains/
│   │   ├── brokia/ ─────────── SOUL.md + USER.md + MEMORY.md ✓
│   │   └── qubika/ ─────────── SOUL.md + USER.md + MEMORY.md ✓
│   └── [future...]
│
├── Skills/
│   ├── last30days/ ✓
│   ├── newsletter-digest/ ✓
│   ├── twitter-fetch/ ✓
│   └── [future...]
│
└── Cron Jobs/
    ├── daily-briefing/ ✓
    ├── newsletter-digest/ ✓
    └── [others...]
```

---

## 3. Agent Categories

### Core Agents (4)

| Agent | Responsibility | Model | Residency |
|-------|----------------|-------|-----------|
| **Orchestrator** | Coordination, delegation, synthesis | deepseek-v3.2 | Always (main session) |
| **Researcher** | Web search, facts, comparisons | grok-4.1-fast | Pre-loaded |
| **Builder** | Technical design, code, implementation | gpt-5.3-codex | Pre-loaded |
| **Writer** | Clarity, structure, polish | stepfun-step-3.5-flash | Pre-loaded |

### Specialists (spawn-only)

| ID | Core Parent | Trigger | Scope |
|----|-------------|---------|-------|
| **chief** | Orchestrator | Planning, prioritization, roadmapping | Backlogs, sprints, milestones |
| **ops** | Orchestrator | Security, reliability, hardening | Audits, alerts, runbooks |

### Domain Context Packs

| Pack | Core Parent | Injection |
|------|-------------|-----------|
| **brokia** | Researcher | Prepend SOUL/USER/MEMORY at spawn |
| **qubika** | Researcher | Prepend SOUL/USER/MEMORY at spawn |

---

## 4. Context Injection Protocol

### Spawn Flow (with domain)

```
1. Load: core/researcher/SOUL.md
2. Prepend: context-packs/{domain}/SOUL.md
3. Prepend: context-packs/{domain}/USER.md
4. Prepend: context-packs/{domain}/MEMORY.md
5. Inject: domain skills into available skills
6. Set: DOMAIN={domain} env var
```

### Context Precedence

```
Domain Context > Core Agent Context > Default Context
```

### Isolation Rules

- Domain packs cannot read each other's memory
- Session-scoped (fresh load per spawn)
- No cross-contamination

---

## 5. Specialist Registry

| ID | Name | Core Parent | Scope Boundaries |
|----|------|-------------|------------------|
| chief | Chief of Staff | Orchestrator | Planning only — no code, no exec |
| ops | Ops | Orchestrator | Read-only audits — no production changes |
| health | Healthcheck | Ops | Reports only — fixes by human |
| codex | Codex Helper | Builder | Review only — no production code |
| debug | Debug Specialist | Builder | Diagnosis only — fixes by human |
| plan | Planning Specialist | Chief | Task breakdown only |
| review | Code Reviewer | Builder | Linting/security/style — no commits |
| migrate | Migration Specialist | Builder | Plans + rollbacks — manual exec |
| monitor | Monitoring Specialist | Ops | Thresholds/reports — no config changes |
| test | Test Specialist | Builder | Design/coverage — no execution |
| doc | Documentation Specialist | Writer | Structure/clarity — no implementation |
| polish | Polish Specialist | Writer | Editing/rewrites — no content creation |

### Trigger Rules

1. **Explicit:** `spawn chief for sprint planning`
2. **Pattern:** Task contains "prioritize", "roadmap", "backlog" → chief
3. **Fallback:** Task scope matches specialist → auto-spawn

---

## 6. Soul Integrity Standard

### Prompt Structure (mandatory order)

```markdown
# SOUL.md — {Agent Name}

## Identity
[Who this agent is, core purpose]

## How I Think
[2-4 bullet points]

## Values
[3-5 bullet points]

## Anti-Patterns (MANDATORY)
[3-5 bullet points]

## Productive Flaw (MANDATORY)
[1-2 paragraphs]

## Trust & Boundaries
[2-3 bullet points]

## Continuity
[1 paragraph]

## Operational Contract (if spawnable)
- Delegation Protocol (4 fields)
- Core Agents / Specialists
- Workflow Patterns

## Output Rule (MANDATORY)
[1 line]
```

### Enforcement Rules

1. SOUL always first
2. Anti-pattern mandatory
3. Productive flaw mandatory
4. No operational before identity
5. Delegation protocol mandatory for all spawns
6. No runtime identity invention

---

## 7. Migration Roadmap

| Phase | Duration | Goal |
|-------|----------|------|
| **Phase 0** | Current | Documentation + prep |
| **Phase 1** | Week 1 | Archive existing agents, create core structure |
| **Phase 2** | Week 2 | Context packs (brokia, qubika) |
| **Phase 3** | Week 3 | Specialist library (chief, ops) |
| **Phase 4** | Week 4 | Integration + testing + cutover |

---

## 8. Rollback Plan

- **Config revert:** Point gateway to `agents-archive/`
- **Context rollback:** Restore from backup
- **48h monitoring:** Track latency, token burn, errors

---

## 9. Metrics

| Metric | Target | Warning |
|--------|--------|---------|
| Spawn latency | < 2s | > 5s |
| Token burn/task | -10% vs baseline | +20% |
| Context contamination | 0 | > 1 |
| Cron errors | 0 | > 2/week |

---

## 10. File Structure (new)

```
openclaw/
├── agents/
│   ├── core/
│   │   ├── main/
│   │   ├── researcher/
│   │   ├── builder/
│   │   └── writer/
│   ├── specialists/
│   │   ├── chief/
│   │   └── ops/
│   └── archive/           # Old agents go here
│
├── context-packs/
│   ├── brokia/
│   │   ├── SOUL.md
│   │   ├── USER.md
│   │   ├── MEMORY.md
│   │   └── docs/
│   └── qubika/
│       ├── SOUL.md
│       ├── USER.md
│       ├── MEMORY.md
│       └── docs/
│
├── skills/
│   ├── last30days/
│   ├── newsletter-digest/
│   └── twitter-fetch/
│
└── cron/
    └── jobs.json
```

---

## 11. Next Steps

1. **Phase 1 prep:** Archive `agents/ → agents-archive/` (requires gateway restart)
2. **Create core agent directories:** `core/researcher/`, `core/builder/`, `core/writer/`
3. **Update gateway config:** Point to new agent paths
4. **Test spawn patterns:** Verify chief, ops, brokia, qubika spawn correctly
5. **Monitor metrics:** Latency, token burn, context contamination

## 12. Completed Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| **ARCHITECTURE.md** | `/home/manpac/.openclaw/workspace/ARCHITECTURE.md` | ✓ Complete |
| **Specialist: Chief** | `/home/manpac/.openclaw/workspace/specialists/chief/SOUL.md` | ✓ Created |
| **Specialist: Ops** | `/home/manpac/.openclaw/workspace/specialists/ops/SOUL.md` | ✓ Created |
| **Context Pack: Brokia** | `/home/manpac/.openclaw/workspace/context-packs/brokia/` | ✓ Migrated |
| **Context Pack: Qubika** | `/home/manpac/.openclaw/workspace/context-packs/qubika/` | ✓ Migrated |

## 13. Pending Migration Items

- [ ] Archive existing `agents/` directory
- [ ] Create `agents/core/` directory structure
- [ ] Move/rename core agent configs
- [ ] Update gateway config paths
- [ ] Test all active cron jobs post-migration
- [ ] Verify rollback plan works

---

## 12. Tradeoffs

| Tradeoff | Decision | Rationale |
|----------|----------|-----------|
| Resident vs spawn | Researcher/Builder/Writer resident | Latency critical |
| Context prepend vs append | Prepend | Domain takes precedence |
| Specialist SOUL full vs light | Light (inherit core) | Token efficiency |
| Context persistent vs session | Session-scoped | Isolation safety |