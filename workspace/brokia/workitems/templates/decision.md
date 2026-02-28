---
id: {{ID}}
type: decision
title: "{{TITLE}}"
description: |
  {{DESCRIPTION}}
status: NEW
tags:
  - decision
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
  - architecture-lead
  - product-strategist
suggested_model_tier: reasoning
estimated_token_budget: medium

# Legacy
legacy_id: "{{LEGACY_ID}}"
created_at: {{TIMESTAMP}}
updated_at: {{TIMESTAMP}}
---

## Contexto

<!-- Qué decidimos -->

## Opciones

<!-- Alternativas consideradas -->

## Decisión

<!-- Opción elegida y por qué -->

## Implicaciones

<!-- Qué cambia -->

---

## Clarification Report

Ver: `reports/{{ID}}/clarification.md`

Para confirmar plan: `./scripts/wi-confirm.sh --id {{ID}} --plan A|B|C`