# Brokia 14-Day Operational Plan

Based on cie_strategist analysis.

## 1. Plan de 14 días (día por día)

**Day 1: Define measurement methodology**
- **Task:** Establish a clear protocol for Juan Manuel to manually measure time spent on quoting tasks. Identify which activities count (search, calls, forms, negotiation). Create a simple spreadsheet template.
- **Owner:** Manuel Pacheco (tech), Juan Manuel (domain)
- **Output:** Measurement protocol document + spreadsheet template.
- **Metric:** Protocol accepted by Juan Manuel; template ready.
- **Risk:** Overcomplicating measurement; Juan Manuel may resist tracking.

**Day 2: Baseline measurement start**
- **Task:** Juan Manuel begins manual time logging for all quoting activities. Use stopwatch/spreadsheet. Capture: client, line, time spent, steps, outcome (quote sent?).
- **Owner:** Juan Manuel
- **Output:** First day of raw time logs.
- **Metric:** Number of quotes logged (target: ≥5).
- **Risk:** Inconsistent logging; forgetting to track.

**Day 3: Review initial data & refine**
- **Task:** Manuel Pacheco reviews logs, identifies patterns, refines categories. Ensure data quality. Adjust protocol if needed.
- **Owner:** Manuel Pacheco
- **Output:** Refined measurement protocol v2.
- **Metric:** Data completeness (no missing fields).
- **Risk:** Data too sparse to draw insights.

**Day 4-6: Intensive measurement week**
- **Task:** Juan Manuel continues logging, aiming for a full week of data (Mon–Fri). Rodrigo (if available) assists with data entry or validation.
- **Owner:** Juan Manuel, Rodrigo
- **Output:** Week‑long dataset (25–30 quotes).
- **Metric:** Total quotes logged (target: 25).
- **Risk:** Burnout from manual tracking; data accuracy declines.

**Day 7: Data synthesis**
- **Task:** Manuel Pacheco aggregates logs, calculates average time per quote, breakdown by step, identifies biggest time sinks.
- **Owner:** Manuel Pacheco
- **Output:** Summary report with averages, distribution, top pain points.
- **Metric:** Average quoting time (baseline).
- **Risk:** Sample size too small; outliers skew average.

**Day 8: Problem quantification**
- **Task:** Translate time savings into economic value (hourly rate × quotes × time saved). Estimate annual opportunity per broker.
- **Owner:** Manuel Pacheco
- **Output:** One‑pager “Problem quantified” (Slide 1 content).
- **Metric:** Dollar value per broker per year.
- **Risk:** Over‑estimating savings; ignoring broker resistance.

**Day 9: MVP‑0 scope definition**
- **Task:** Based on pain points, define the smallest possible intervention that could reduce quoting time by 20% (e.g., automated search, pre‑filled forms, quick‑reference tool).
- **Owner:** Manuel Pacheco, Juan Manuel
- **Output:** MVP‑0 specification (features, non‑features).
- **Metric:** Scope fits within 2‑week build time.
- **Risk:** Scope creep; building too much.

**Day 10: Business‑model decision**
- **Task:** Evaluate the four payment models (Individual broker, Broker network, Insurer, Hybrid) using economic‑incentive, scalability, strategic‑risk lenses. Choose one.
- **Owner:** Manuel Pacheco
- **Output:** Decision memo with justification (Section 3).
- **Metric:** Clear decision with rationale.
- **Risk:** Indecision; choosing a model that misaligns incentives.

**Day 11: Uruguay sandbox planning**
- **Task:** Research regulatory requirements for Uruguay sandbox (if any). Identify 3–5 brokers in Uruguay for pilot. Draft outreach email.
- **Owner:** Rodrigo (or Manuel if Rodrigo unavailable)
- **Output:** List of target brokers, sandbox checklist, email template.
- **Metric:** At least 3 brokers identified.
- **Risk:** Lack of contacts; regulatory hurdles.

**Day 12: MVP‑0 build start**
- **Task:** Begin development of the chosen minimal feature (e.g., browser extension that auto‑fills known fields). Use simplest stack possible.
- **Owner:** Manuel Pacheco
- **Output:** Working prototype (local).
- **Metric:** Prototype passes basic smoke test.
- **Risk:** Technical blockers; underestimated complexity.

**Day 13: Internal testing**
- **Task:** Juan Manuel tests prototype with dummy quotes, provides feedback. Iterate on UX.
- **Owner:** Juan Manuel, Manuel Pacheco
- **Output:** Feedback list, updated prototype.
- **Metric:** Usability score (subjective 1–5).
- **Risk:** Prototype too crude; broker frustration.

**Day 14: Pilot preparation**
- **Task:** Prepare pilot deployment (install instructions, one‑page guide). Finalize MVP‑0 measurement plan (what to track during pilot).
- **Owner:** Manuel Pacheco
- **Output:** Deployment package, measurement plan.
- **Metric:** All materials ready for pilot.
- **Risk:** Deployment issues; missing measurement setup.

## 2. Estructura de MVP‑0

**What to measure**
- Quoting time per line (start to quote sent).
- Number of manual steps (clicks, copy‑paste, searches).
- Quote accuracy (re‑work due to errors).
- Broker satisfaction (quick survey after each quote).

**How to measure**
- Manual logging (spreadsheet) for baseline.
- After MVP‑0: automated time‑tracking (browser extension logs timestamps).
- Step‑count via screen‑record sampling (optional).
- Satisfaction: 1‑question Likert scale (“How much easier was this quote?” 1–5).

**Tools**
- Spreadsheet (Google Sheets / Excel) for manual logs.
- Simple browser extension (Chrome) to inject autofill and log events.
- Quick survey (Typeform / Google Forms).
- Basic dashboard (Data Studio / Metabase) to visualize trends.

**Success metrics**
- 20% reduction in average quoting time (from baseline).
- 30% reduction in manual steps.
- Broker satisfaction ≥4/5.
- Pilot brokers willing to continue using tool after 2 weeks.

## 3. Decisión de modelo de negocio

**Chosen model: B) Broker network pays**

**Justification**

1. **Economic incentive**
   - Broker networks (associations, aggregators) already charge brokers for services (software, training, leads). Adding Brokia as a value‑added service aligns with existing revenue streams.
   - Networks can amortize cost across many brokers (e.g., $50/broker/month) vs. individual brokers paying directly (higher friction).
   - Networks have budget for “productivity tools” that increase broker retention and attract new members.

2. **Scalability**
   - Selling to a network reaches hundreds/thousands of brokers at once, not one‑by‑one.
   - Networks provide built‑in distribution (newsletters, events, admin panels) and trust (endorsement).
   - Once a network adopts, onboarding individual brokers becomes a top‑down decision, reducing sales effort.

3. **Strategic risk**
   - **Individual broker pays (A)**: High churn, low willingness‑to‑pay, high acquisition cost. Risky.
   - **Insurer pays (C)**: Misaligned incentives (insurers want lower commissions, not broker productivity). Could be seen as favoring certain insurers.
   - **Hybrid (D)**: Complex, dilutes focus, creates channel conflict.
   - **Broker network pays (B)**: Aligns with network’s goal to increase member value. Medium risk: networks move slowly, but once locked in, they provide stable recurring revenue.

**Implementation path**
- Start with Uruguay broker association (e.g., Asociación de Productores Asesores de Seguros – APAS). Offer free pilot to prove value, then tiered pricing per broker.
- Expand to similar networks in Argentina, Chile, Mexico.

## 4. Lista de descartes

Concrete things NOT to do in the next 30 days:

1. **Do not build AI‑based recommendation engine** – too complex, distracts from core time‑saving.
2. **Do not pursue insurer integrations** – O2 (insurer matching) is deferred.
3. **Do not develop mobile app** – desktop‑first, brokers work on computers.
4. **Do not create broker‑facing dashboard** – MVP‑0 is about reducing time, not reporting.
5. **Do not invest in brand/marketing** – all effort on product‑market fit.
6. **Do not expand beyond Uruguay** – focus on sandbox, resist temptation to chase AR/CL/MX immediately.
7. **Do not automate full quote workflow** – only the biggest pain point (data entry/search).
8. **Do not hire full‑time sales** – founder‑led sales until first network deal.
9. **Do not raise external funding** – bootstrap with existing resources.
10. **Do not change target persona** – stay focused on commercial‑line brokers (Juan Manuel’s profile).

## 5. 3 slides for Enrique

### Slide 1: Problem quantified
- **Headline:** Brokers waste 4.5 hours per week on manual quoting.
- **Data:** Baseline measurement from Juan Manuel: average 27 minutes per commercial‑line quote × 10 quotes/week = 4.5 hours.
- **Value:** At $50/hour, that’s $225/week ($11,700/year) per broker in lost productivity.
- **Visual:** Bar chart comparing time spent per step (search, forms, calls, negotiation).

### Slide 2: Concrete opportunity
- **Headline:** Reduce quoting time 20% with a simple browser extension.
- **Solution:** Auto‑fill known fields, quick search across insurers, one‑click form reuse.
- **Market:** Uruguay sandbox → 500 commercial brokers → $5.8M/year productivity savings.
- **Next:** Pilot with 3 brokers in Uruguay, measure time saved, then sell to broker networks.

### Slide 3: Experiment in progress
- **Status:** Week 1 – Manual measurement complete. Week 2 – MVP‑0 build.
- **Metrics:** Current baseline: 27 min/quote. Target: 22 min/quote after MVP‑0.
- **Team:** Manuel (tech), Juan Manuel (domain), Rodrigo (ops).
- **Ask:** Feedback on business‑model choice (Broker network pays). Introductions to Uruguay broker associations.

---

*Documento creado: 2026‑02‑25*  
*Última actualización: 2026‑02‑25*