---
id: {{ID}}
type: research
title: "{{TITLE}}"
description: |
  {{DESCRIPTION}}
status: NEW
tags:
  - research
owner: {{OWNER}}
priority: {{PRIORITY}}

# Clarification & Control Fields
needs_clarification: true
clarification_status: PENDING
proposed_actions: []

# Implementation Guard
implementation_approved: false

# Delegation Metadata (preparatory)
suggested_agents:
  - tech-researcher
  - architecture-lead
suggested_model_tier: balanced
estimated_token_budget: high

# Legacy
legacy_id: "{{LEGACY_ID}}"
created_at: {{TIMESTAMP}}
updated_at: {{TIMESTAMP}}
---

## Pregunta de Investigación

<!-- Qué queremos saber -->

## Hallazgos

<!-- Resultados del research -->

## Recomendación

<!-- Conclusión y próximo paso -->

---

## Clarification Report

Ver: `reports/{{ID}}/clarification.md`

Para confirmar plan: `./scripts/wi-confirm.sh --id {{ID}} --plan A|B|C`