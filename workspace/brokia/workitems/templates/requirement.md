---
id: {{ID}}
type: requirement
title: "{{TITLE}}"
description: |
  {{DESCRIPTION}}
status: NEW
tags:
  - requirement
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
  - cost-analyst
suggested_model_tier: balanced
estimated_token_budget: medium

# Legacy
legacy_id: "{{LEGACY_ID}}"
created_at: {{TIMESTAMP}}
updated_at: {{TIMESTAMP}}
---

## Contexto de Negocio

<!-- Por qué se necesita esto -->

## Criterios de Aceptación

- [ ] Criterio 1
- [ ] Criterio 2

## Notas Técnicas

<!-- Análisis de viabilidad -->

## Dependencias

<!-- Qué necesitamos primero -->

---

## Clarification Report

Ver: `reports/{{ID}}/clarification.md`

Para confirmar plan: `./scripts/wi-confirm.sh --id {{ID}} --plan A|B|C`