# MEMORY.md — Qubika Long-Term Memory

## Project Status

- **Stage:** Ruby/dependency upgrade program (batched approach)
- **Focus:** Safe batch execution, observability, workflow standardization
- **Philosophy:** Measure, batch, verify, repeat

## Key Context

### Ruby Upgrade Program

- **Total estimated effort:** 119–179 days (excluding loyalty-service, vpos-portal)
- **Services classified:** 3 tiers (1/2/3 by compatibility/effort)
- **Legacy cases:** JRuby 1.7.x, Ruby 2.1.10 still in use

### Deployment Pipeline

- **Docker-based CI/CD** with CircleCI
- **Branch model:** develop (servicios/portales), master (gems), feature/*
- **Release workflow:** merge → STG → QA → PROD

### Known Blockers (Historical)

1. External dependencies (C4C, connectivity, DBA)
2. Data quality issues (duplicates, incomplete)
3. Ticket definition gaps
4. Cross-team coordination delays

## Key Decisions

### 2025-11: Batch Strategy Over Big Bang
- **Decision:** Split Ruby upgrades into 3 lotes (L1/L2/L3)
- **Rationale:** Reduced risk, better observability, incremental learning
- **Next:** Define concrete services per batch

### 2025-11: Go/No-Go Checklist Mandatory
- **Decision:** Every release requires completed Go/No-Go checklist
- **Components:** Infrastructure checks, data migrations, Sentry coverage
- **Next:** Standardize template across all services

### 2025-11: Fix Version Mandatory
- **Decision:** All Ruby upgrade tickets must have Fix Version
- **Rationale:** Tracibility, changelog generation, release reporting
- **Next:** Enforce in Jira workflow

## Backlog

### Immediate (Next Sprint)
- [ ] Define L1 batch (services with lowest friction)
- [ ] Complete compatibility matrix for L1
- [ ] Run Go/No-Go checklist for first L1 deployment
- [ ] Verify Sentry coverage for L1 services

### Short-Term (This Quarter)
- [ ] Execute L1 batch (1–2 services)
- [ ] Adjust playbook based on L1 learnings
- [ ] Define L2 batch criteria
- [ ] Standardize branch policy compliance

### Medium-Term
- [ ] Execute L2 batch
- [ ] Execute L3 batch
- [ ] Deprecate legacy Ruby versions (2.1.10, JRuby 1.7.x)

## Guardrails

1. No upgrade without compatibility matrix
2. No release without Go/No-Go checklist
3. No deploy without Sentry baseline
4. No merge without branch policy compliance
5. No batch without rollback plan

## Quick Wins (7–10 Days)

1. Identify L1 services (tier 1/2, minimal dependencies)
2. Complete Go/No-Go template for L1 pilot
3. Enforce Fix Version in Jira for remaining tickets
4. Verify Sentry status for L1 services
5. Sanitize docs with exposed secrets

---

## References

- `CONFLUENCE_ACTIONABLE_SUMMARY.md` — Full 15 findings analysis
- `context/raw/confluence-export/` — Original Jira/Confluence exports
- Status syncs (Nov 2025) — Historical blockers and coordination