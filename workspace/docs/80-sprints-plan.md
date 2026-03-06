# 80 — Sprints Plan (v0.3)

## Premisa
AI-first debe existir temprano (aunque básico) para validar la experiencia real.
Cada sprint tiene DoD verificable, priorizando trazabilidad/idempotencia.

---

## Sprint 1 — Foundations + Conversations + Messages
**Objetivo:** persistir conversaciones/mensajes + Console mínima para ver chats.

**Entregables**
- Webhook GET verify (WABA)
- Webhook POST persist:
  - conversations (create-or-get por customer_phone)
  - messages inbound idempotente
- UI: Live Chats list + Chat viewer (read-only)
- Correlation IDs end-to-end
- Docker compose + CI básico

**DoD**
- dedupe inbound por provider_message_id
- query chat < 2s en dataset chico
- logs sin PII

---

## Sprint 2 — AI Conversation Orchestrator (basic) + Outbound
**Objetivo:** IA responde con preguntas simples y auditabilidad total.

**Entregables**
- Conversation Orchestrator job:
  - si control_mode=ai_first => genera outbound message actor=ai
- Outbound sender (WABA send) con idempotency_key
- message_statuses ingestion (si WABA envía statuses) — NEEDS RESEARCH exact payload
- UI: mostrar outbound y status

**DoD**
- outbound idempotente (no duplica envíos)
- cada outbound ligado a conversation + correlation_id

---

## Sprint 3 — Evidence Service (media + S3 + signed URLs)
**Entregables**
- Fetch media -> evidence_blob
- Evidence links a message
- Signed URL endpoint
- UI: evidence viewer en chat

**DoD**
- evidence accesible con TTL corto
- audit mínimo de accesos (opcional)

---

## Sprint 4 — Decision Store + Events + Outbox
**Entregables**
- decision_objects / versions / events (append-only)
- outbox publisher + handlers
- timeline unificada (messages + decision events)

**DoD**
- replay básico por aggregate_id
- constraints de idempotency para events

---

## Sprint 5 — Decision Engine v0 (classifier + extraction evidence-bound)
**Entregables**
- classifier agent (endorsement vs claim)
- extraction agent:
  - ChangeRequest.AutoPolicy@v1
  - Commitment.ClaimChecklist@v1
- validator evidence_map/unknown_fields
- IA pregunta needs_info automáticamente

**DoD**
- si no hay evidencia => unknown
- low confidence => event + badge en UI

---

## Sprint 6 — Process Execution Layer + endorsement_v1 (AI-first + HIL gate)
**Entregables**
- process_executions + step_runs
- endorsement_v1 completo con:
  - ask_missing_info_ai
  - human_approval_gate (materiality)
  - emit connector_requests
- UI: Decision Inbox + Approve/Reject/Edit

**DoD**
- operator puede aprobar y disparar ejecución
- step_runs auditables

---

## Sprint 7 — Integration Layer (email + CRM webhook) + notifications
**Entregables**
- connector_requests/responses + retries + failed state
- email connector MVP
- crm_webhook connector MVP
- notification_events/deliveries (email + dashboard)
- throttling básico

**DoD**
- integración idempotente (no duplica cases/emails)
- alert visible si falla

---

## Sprint 8 — claim_checklist_v1 + reminders + hardening + security
**Entregables**
- audio pipeline (transcribe) — provider seleccionado
- claim_checklist_v1 + reminders + overdue
- webhook signature verification resuelta (o fallback documentado)
- retention purge job
- observability (Sentry + dashboards mínimos)

**DoD**
- overdue notifica
- purge no rompe audit trail (tombstones)
