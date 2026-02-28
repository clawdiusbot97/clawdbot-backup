# USER.md — About the Qubika Human

## About Manu (Primary)

- **Role:** Developer at Qubika, working in Bancard ecosystem
- **Background:** Ruby/Rails, backend/architecture, strong systems mindset
- **Preferences:** Concise, structured, actionable. Avoid fluff. End with next actions.
- **Language:** Spanish for work context, English for technical code/naming

## Domain Context

### Qubika/Bancard Focus Areas

1. **Ruby Upgrades**
   - Current: Managing Ruby version upgrades across services
   - Focus: Batched upgrades, compatibility matrix, gem dependencies
   - Estimated effort: 119–179 days total (excluding some services)

2. **Deployment Workflows**
   - Docker-based CI/CD pipeline
   - Branch policies (develop/master, feature/*)
   - Deploy to staging/production

3. **Release Management**
   - Jira workflow: merge → deploy STG → QA → deploy PROD
   - Fix Version tracking for releases
   - Go/No-Go checklists

4. **Observability**
   - Sentry for error tracking
   - Baseline requirements per service

### Key Documents

- `CONFLUENCE_ACTIONABLE_SUMMARY.md` — Top 15 findings for Ruby/dependencies
- Status syncs (Nov 2025) — Blockers, dependencies, coordination issues
- Ruby Upgrade Estimations — Service-by-service effort breakdown

### Common Pain Points

- Dependencies on external teams (C4C, DBA, infra)
- Incomplete ticket definitions
- Manual procedures (VPN, hosts, dumps)
- Observability gaps in some services

---

## Communication Style

- Short, structured, actionable
- Avoid motivational filler
- Ground proposals in measurable current state
- End with 1–3 next actions