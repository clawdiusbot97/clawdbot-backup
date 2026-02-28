---
id: {{ID}}
type: solution
title: "{{TITLE}}"
description: |
  {{DESCRIPTION}}
status: NEW
tags:
  - solution
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
  - architecture-lead
  - tech-researcher
suggested_model_tier: reasoning
estimated_token_budget: medium

# Legacy
legacy_id: "{{LEGACY_ID}}"
created_at: {{TIMESTAMP}}
updated_at: {{TIMESTAMP}}
---

## Problema Resuelto

<!-- Link al research/decision -->

## Solución Técnica

<!-- Cómo se implementa -->

## Diagramas / Código

<!-- Referencias -->

---

## Clarification Report

Ver: `reports/{{ID}}/clarification.md`

Para confirmar plan: `./scripts/wi-confirm.sh --id {{ID}} --plan A|B|C`