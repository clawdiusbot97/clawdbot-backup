---
id: {{ID}}
type: blocker
title: "{{TITLE}}"
description: |
  {{DESCRIPTION}}
status: NEW
tags:
  - blocker
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
suggested_model_tier: cheap
estimated_token_budget: low

# Legacy
legacy_id: "{{LEGACY_ID}}"
created_at: {{TIMESTAMP}}
updated_at: {{TIMESTAMP}}
---

## Impacto

<!-- Qué está bloqueando -->

## Causa Raíz

<!-- Análisis del problema -->

## Mitigación

<!-- Acciones para resolver -->

---

## Clarification Report

Ver: `reports/{{ID}}/clarification.md`

Para confirmar plan: `./scripts/wi-confirm.sh --id {{ID}} --plan A|B|C`