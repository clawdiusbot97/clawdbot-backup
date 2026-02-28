# MEMORY.md - Long-Term Curated Memory

## Identity & Profile
- Name: Manuel Pacheco (Manu)
- Timezone: America/Montevideo (GMT-3)
- Country: Uruguay
- Languages: Spanish, English

## Durable Preferences
- Prefer concise, structured, actionable responses.
- Prefer checklists, clear next steps, and implementation-ready outputs.
- Make assumptions explicit.
- Ask clarifying questions only when necessary.
- End important responses with 1–3 next actions.
- Technical naming/code in English; client-facing messages/test data often in Spanish.

## Professional Context
- Software developer at Qubika, working in Bancard ecosystem contexts.
- Strong backend/architecture/systems mindset.
- Recurring domains: auth, audit traceability, payments, notifications, service integrations.
- Strong focus on reliability, data integrity, and edge cases.

## Technical Stack (Frequent)
- Ruby/Rails (often Docker), JRuby in some contexts.
- MySQL, Redis, RSpec/TDD.
- Angular + Angular Material in frontend contexts.
- Also works with ASP.NET Web API, DTO design, and custom exception patterns.
- Applies SOLID and package principles (REP/CCP/CRP/ADP/SDP/SAP).

## Active Priorities
- Finish thesis product (Brokia) with strong execution quality.
- Keep scope tight and execution practical.
- Build practical, reusable multi-agent workflows.
- Move experiments toward commercially viable products.

## Current Major Project
- Brokia: insurance broker MVP (auto focus).
- Thesis team: Manu + Rodrigo (legal background, now systems student) + Juan Manuel (broker, ~10 years field experience).
- Core goals: operational automation + decision traceability.
- Product direction: messaging-first flows + structured data capture + AI support.
- Current phase: validation-first (process mapping/time measurement before locking MVP scope).
- High-value hypothesis: automate multi-insurer quote workflow, potentially from AI extraction of vehicle ownership document photo (feasibility TBD).
- Needs ongoing support in: MVP scope, validation strategy, and execution planning.

## Working Rules for Assistant
- Avoid fluff, vague advice, and motivational filler.
- Prefer pragmatic execution over theory.
- Minimize overcomplication and scope creep.
- Be decisive when proposing plans (time-boxed, step-by-step).

## Multi‑agent Workflow Infrastructure (2026‑02‑18)
**Status:** Operational with checkpoint patterns.

### Implemented Patterns
1. **Plan‑Stage‑Checkpoint** – For complex tasks that need resumption.
   - Skill: `brokia‑plan` (generates stage‑based plans in `plans/`).
   - Directories: `plans/`, `plans/checkpoints/`.
   - Used for: Brokia MVP feature breakdowns.

2. **Research‑Curate‑Deliver** – For regular ingestion/filtering/delivery.
   - Skill: `newsletter‑digest` (daily newsletter pipeline).
   - Cron job: `Daily Newsletter Digest` (9 AM UTC → `#newsletter‑digest`).
   - Checkpoints: `checkpoints/newsletter/YYYY‑MM‑DD.json`.
   - Senders: 8 newsletter emails (NYT, Hustle, TLDR, History Facts, AI Secret, Marginalian, Ruby Weekly, Node Weekly).

3. **Security audit pattern** (to be implemented).

### Technical Notes
- **Checkpoints** store intermediate state as JSON; allow crash recovery.
- **Skills** are lightweight documentation + orchestration templates.
- **Model selection:** Codex for code correctness, DeepSeek for planning, Minimax for research/writing.
- **Cron jobs** invoke isolated agent sessions that spawn sub‑agents.

### Next Steps
- Apply Plan‑Stage‑Checkpoint to Brokia MVP scoping.
- Extend checkpoint system to git integration (worktrees, automated commits).
- Add health monitoring for long‑running pipelines.
