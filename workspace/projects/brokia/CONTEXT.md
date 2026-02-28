# Brokia Context Packet v1

## Team context (important)
- Thesis team: 3 students/friends.
- Members:
  - Manu (software developer).
  - Rodrigo (lawyer, now studying Licenciatura en Sistemas).
  - Juan Manuel (insurance broker with ~10 years of field experience).
- Primary practical objective: build software that directly helps Juan Manuel’s daily broker operations.

## Current phase
- Validation-first (problem understanding before solution lock-in).
- Immediate activity: process observation/time measurement session on **Wednesday 18 Feb**.
- Goal of that session: identify highest-friction daily processes and evaluate automation feasibility.

## High-value automation hypothesis
- Candidate flow: **auto insurance quoting automation**.
- Current manual process (Juan Manuel):
  1) enter each insurer portal,
  2) login,
  3) input vehicle model/data,
  4) retrieve quote,
  5) compare across insurers.
- Aspirational target flow:
  - capture car ownership book photo,
  - extract structured data with AI,
  - trigger quote flow across insurers,
  - return best option(s) with traceability.
- Feasibility currently: unknown, pending discovery/validation and technical constraints.

---

## 1) One-liner
- An exploratory thesis project investigating operational inefficiencies and lack of decision traceability in auto insurance brokerage, with the goal of identifying and validating a viable digital solution.

## 2) Problem & User
- **Primary user(s):**
  - Independent insurance brokers (auto-focused).
  - Small brokerage offices.
- **Core pain points (top 3) – Hypothesized:**
  1. Important coverage decisions occur through informal channels without structured traceability.
  2. High operational load from repetitive manual processes (renewals, endorsements, follow-ups).
  3. Fragmented tools create cognitive overload and risk exposure.
- **Why current alternatives may fail (to be validated):**
  - Generic CRMs are not tailored to insurance contract logic.
  - Informal communication is not structured into auditable records.
  - Tools are fragmented and not workflow-driven.
- ⚠️ **Status:** These are hypotheses derived from professional experience and early observation. They are not yet validated through structured research.

## 3) Scope (MVP)
- ⚠️ The MVP is not yet defined. The following is exploratory.
- **In scope (tentative hypotheses):**
  - Structured client/policy data.
  - Decision logging mechanism.
  - Renewal workflow assistance.
  - Messaging-based interaction layer.
- **Out of scope (for now, tentatively):**
  - Full insurer integrations.
  - Claims management.
  - Multi-line insurance coverage.
  - Advanced analytics.
- **Success criteria for MVP (to be defined after validation):**
  - TBD.
  - Will depend on validated problem intensity and willingness to adopt.

## 4) Main Flows
- ⚠️ Not defined. Potential flows being explored:
  - **Flow A (Hypothesis): Renewal Support**
  - **Flow B (Hypothesis): Coverage Decision Capture**
  - **Flow C (Hypothesis): Operational Dashboard**
- All flows are conceptual and pending validation.

## 5) Data & Traceability
- **Key entities (tentative):**
  - Client
  - Policy
  - Coverage
  - Decision
  - Interaction
- **Audit/traceability requirements (hypothesized need):**
  - Timestamped decision records.
  - Clear mapping between interaction and contract state.
  - Immutable logs.
- ⚠️ These requirements depend on validation of the traceability problem’s severity.

## 6) AI Role
- ⚠️ AI role is exploratory.
- **Potential areas AI could help:**
  - Structuring informal conversations.
  - Guiding workflows.
  - Summarizing decisions.
  - Assisting operational prioritization.
  - OCR/vision-assisted intake for vehicle documentation (to evaluate).
- **Where AI should not decide:**
  - Legal/contractual binding decisions.
  - Final coverage approvals.
- This section remains conceptual.

## 7) Integrations
- **Needed now:** None.
- **Potential future integrations (if solution validated):**
  - Messaging platforms.
  - Insurer APIs/portals.
  - Notification systems.
- **Constraints (to investigate):**
  - Data protection regulations.
  - Messaging platform API limitations.
  - Compliance implications.
  - Insurer anti-bot / auth / portal restrictions.

## 8) Validation Plan
- This is the current active phase.
- **Assumptions to test first:**
  1. Brokers experience measurable operational inefficiencies.
  2. Lack of traceability creates real perceived or actual risk.
  3. Brokers are dissatisfied with current tools.
  4. Brokers would consider adopting a structured digital workflow.
- **Experiments:**
  - Structured interviews with brokers.
  - Process mapping of renewal workflow.
  - Time estimation exercises.
  - Problem-ranking surveys.
- **Metrics/KPIs:**
  - Frequency of operational pain points.
  - Time lost per week.
  - Risk perception intensity.
  - Stated willingness to change tools.
- **Kill criteria / pivot signals:**
  - Problem not perceived as significant.
  - No willingness to adopt change.
  - Pain points solved adequately by existing tools.

## 9) Delivery Plan
- **Milestones (current phase):**
  - M1: Problem interviews (in progress).
  - M2: Pain-point validation report.
  - M3: Decision whether to proceed to solution design.
- **Risks:**
  - Confirmation bias.
  - Overfitting solution before validation.
  - Scope expansion before problem clarity.
- **Dependencies:**
  - Access to brokers for interviews.
  - Clear thesis evaluation criteria.

## 10) Thesis Deliverables
- **Required artifacts (phase-dependent):**
  - Problem statement.
  - Validation evidence.
  - Market context analysis.
  - Hypothesis framework.
  - If validated: MVP definition and architecture.
  - Demo only if proceeding to solution stage.
- **Evaluation criteria:**
  - Rigor of validation.
  - Logical reasoning.
  - Feasibility analysis.
  - Academic clarity.
  - Entrepreneurial viability assessment.
