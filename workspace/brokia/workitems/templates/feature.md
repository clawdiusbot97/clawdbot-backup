---
id: {{ID}}
type: feature
title: "{{TITLE}}"
description: |
  {{DESCRIPTION}}
status: NEW
tags:
  - feature
owner: {{OWNER}}
priority: {{PRIORITY}}

# Clarification & Control Fields
needs_clarification: true
clarification_status: PENDING
proposed_actions: []

# Implementation Guard
implementation_approved: true

# Delegation Metadata (preparatory)
suggested_agents:
  - tech-researcher
  - architecture-lead
suggested_model_tier: balanced
estimated_token_budget: medium

# Legacy
legacy_id: "{{LEGACY_ID}}"
created_at: {{TIMESTAMP}}
updated_at: {{TIMESTAMP}}
---

## Alcance

<!-- Qué incluye y qué NO incluye -->

## Tareas Técnicas

- [ ] Task 1
- [ ] Task 2

## Notas de Implementación

<!-- Decisiones técnicas, trade-offs -->

## QA / Testing

- [ ] Tests unitarios
- [ ] Validación con usuario

---

## Clarification Report

Ver: `reports/{{ID}}/clarification.md`

Para confirmar plan: `./scripts/wi-confirm.sh --id {{ID}} --plan A|B|C`