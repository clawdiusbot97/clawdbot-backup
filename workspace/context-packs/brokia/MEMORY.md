# MEMORY.md — Brokia Long-Term Memory

## Project Status

- **Stage:** Validation-first (pre-MVP lock)
- **Focus:** Process mapping, time measurement, bottleneck identification
- **Philosophy:** Measure twice, build once

## Team

- **Manu:** Product/tech/architecture
- **Rodrigo:** Legal + systems
- **Juan Manuel:** Broker field experience (10 years)

## Key Decisions

### 2026-02-18: Validation-First Approach
- **Decision:** Don't lock full MVP scope until we measure current process
- **Rationale:** Avoid building the wrong thing
- **Next:** Map as-is process, measure times, identify friction points

### 2026-02-17: Messaging-First Product Direction
- **Decision:** Lead with WhatsApp-style flows, not web UI
- **Rationale:** Broker and clients live in messaging apps
- **Implication:** Structured data capture from conversational input

## Hypothesis Log

1. **Quote Automation Leverage:** Multi-insurer quote workflow is the biggest time sink
   - **Status:** Pending validation
   - **Test:** Time measurement in current process

2. **Data Capture Friction:** Manual re-entry from photos/documents
   - **Status:** Feasibility TBD
   - **Test:** Photo extraction experiment (future)

3. **Traceability Value:** Explicit decision audit trail improves quality
   - **Status:** Accepted (guardrail)
   - **Implementation:** Decision log mandatory

## Backlog

### Immediate (Validation Phase)
- [ ] As-is process map
- [ ] Time measurement per stage
- [ ] Friction point identification
- [ ] Minimum dataset definition
- [ ] Message templates creation

### Short-Term (MVP Prep)
- [ ] Decision log template
- [ ] AI summary prototype
- [ ] Quote comparison mockup

### Medium-Term (Future)
- [ ] Multi-insurer API integration
- [ ] Photo-based data extraction
- [ ] Client-facing web/mobile UI

## Guardrails

1. No scope creep without evidence
2. Every experiment needs explicit success criteria
3. Keep operator experience simple
4. Document decisions (what, why, impact)

## References

- `BROKIA_CONTEXT_PACK_V1.md` (source)
- `documentacion/` (daily logs)
- `tesis/` (thesis docs)