---
id: {{ID}}
type: idea
title: "{{TITLE}}"
description: |
  {{DESCRIPTION}}
status: NEW
tags:
  - idea
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
  - product-strategist
suggested_model_tier: balanced
estimated_token_budget: medium

# Legacy
legacy_id: "{{LEGACY_ID}}"
created_at: {{TIMESTAMP}}
updated_at: {{TIMESTAMP}}
---

## Contexto

<!-- De dónde surge la idea -->

## Hipótesis

<!-- Qué creemos que es verdad -->

## Validación Pendiente

<!-- Qué necesitamos confirmar -->
- [ ] ¿El problema es real para los usuarios?
- [ ] ¿Hay alternativas existentes?
- [ ] ¿Cuál es el esfuerzo estimado?

## Notas de Investigación

<!-- Se completa en fase RESEARCHING -->

## Resultado de Validación

<!-- Completar post-validación -->
- Validado: (pendiente)
- Próximo paso: (pendiente aprobación para implementar)

---

## Clarification Report

Ver: `reports/{{ID}}/clarification.md`

Para confirmar plan: `./scripts/wi-confirm.sh --id {{ID}} --plan A|B|C`