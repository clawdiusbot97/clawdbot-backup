---
id: {{ID}}
type: risk
title: "{{TITLE}}"
description: |
  {{DESCRIPTION}}
status: NEW
tags:
  - risk
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
  - product-strategist
suggested_model_tier: cheap
estimated_token_budget: low

# Legacy
legacy_id: "{{LEGACY_ID}}"
created_at: {{TIMESTAMP}}
updated_at: {{TIMESTAMP}}
---

## Descripción

<!-- Qué puede salir mal -->

## Probabilidad / Impacto

<!-- Alta/Media/Baja -->

## Mitigación

<!-- Plan de contingencia -->

---

## Clarification Report

Ver: `reports/{{ID}}/clarification.md`

Para confirmar plan: `./scripts/wi-confirm.sh --id {{ID}} --plan A|B|C`