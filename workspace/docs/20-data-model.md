# 20 — Data Model (Postgres) (v0.3)

## Objetivo
Persistencia/auditabilidad de TODO:
- conversations + participants
- messages (inbound/outbound, actor customer/ai/human/system)
- handoffs (ai↔human)
- notifications
- evidence + links
- decisions + versions + events
- process executions + step runs
- connector requests/responses

## Convenciones
- IDs: ULID recomendado (ordenable), o UUID si prefieren simplicidad.
- Multi-tenant: `tenant_id` en todas las tablas.
- Append-only: events, versions, step_runs, connector_responses.

---

## 20.1 Tenancy + Users (mínimo)
### `tenants`
- `id` (pk)
- `name`
- `created_at`

### `users`
- `id`
- `tenant_id`
- `email`
- `role` (admin|operator|viewer)
- `created_at`
- UNIQUE `(tenant_id, email)`

---

## 20.2 Conversations (AI-first)
### `conversations`
- `id`
- `tenant_id`
- `channel` (whatsapp)
- `provider_conversation_ref` (nullable) (NEEDS RESEARCH si WABA expone algo utilizable)
- `customer_phone_e164` (NOT NULL)
- `status` (open|closed)
- `control_mode` (ai_first|human_led|human_takeover)
- `last_message_at`
- `last_ai_message_at` (nullable)
- `last_human_message_at` (nullable)
- `created_at`, `updated_at`
Indexes:
- `(tenant_id, customer_phone_e164)`
- `(tenant_id, status, last_message_at desc)`

### `conversation_participants`
- `id`
- `tenant_id`
- `conversation_id`
- `participant_type` (customer|ai|human)
- `participant_ref` (e.g. `user_id` for human; `agent_id` for ai; phone for customer)
- `created_at`
UNIQUE:
- `(tenant_id, conversation_id, participant_type, participant_ref)`

### `handoff_events`
- `id`
- `tenant_id`
- `conversation_id`
- `from_mode` (ai_first|human_takeover)
- `to_mode` (ai_first|human_takeover)
- `reason` (materiality|low_confidence|operator_request|policy_violation|other)
- `initiated_by` (system|ai|human)
- `initiator_user_id` (nullable)
- `correlation_id`
- `occurred_at`
Indexes:
- `(tenant_id, conversation_id, occurred_at desc)`

---

## 20.3 Messages (unificado para auditabilidad)
> En v0.2 separábamos inbound/outbound. En v0.3 recomendamos **unificar** en `messages` para:
- timeline único
- actor typing consistente
- menos joins para live monitor

### `messages`
- `id`
- `tenant_id`
- `conversation_id`
- `channel` (whatsapp)
- `direction` (inbound|outbound)
- `actor_type` (customer|ai|human|system)
- `actor_ref` (phone/user_id/agent_id)
- `intent` (nullable) (ask_missing_info|confirm_materiality|freeform|handoff_notice|etc)
- `provider_message_id` (nullable para drafts; not null cuando enviado/recibido)
- `provider_payload` (jsonb) NOT NULL (raw-ish; cuidado PII en logs)
- `text_body` (text nullable)
- `media_count` int default 0
- `created_at` (server time)
- `provider_timestamp` (nullable)
- `status` (received|queued|sent|delivered|read|failed)
- `idempotency_key` (nullable; requerido para outbound/system)
- `correlation_id` (NOT NULL)
Constraints:
- Inbound idempotency:
  - UNIQUE `(tenant_id, channel, provider_message_id)` WHERE direction='inbound' AND provider_message_id IS NOT NULL
- Outbound idempotency:
  - UNIQUE `(tenant_id, channel, idempotency_key)` WHERE direction='outbound' AND idempotency_key IS NOT NULL
Indexes:
- `(tenant_id, conversation_id, created_at)`
- `(tenant_id, actor_type, created_at desc)`
- `(tenant_id, status, created_at desc)`

### `message_statuses`
- `id`
- `tenant_id`
- `message_id` (fk messages)
- `provider_message_id`
- `status` (sent|delivered|read|failed)
- `payload` (jsonb)
- `occurred_at`
Index:
- `(tenant_id, provider_message_id, occurred_at desc)`

---

## 20.4 Evidence
### `evidence_blobs`
- `id`
- `tenant_id`
- `kind` (whatsapp_media|audio|image|document|transcript_json|ocr_json|email_eml|manual_note)
- `storage_key` (s3 key)
- `sha256`
- `mime_type`
- `size_bytes`
- `created_at`
UNIQUE (opcional dedupe):
- `(tenant_id, sha256)`
Indexes:
- `(tenant_id, kind, created_at desc)`

### `evidence_links`
- `id`
- `tenant_id`
- `evidence_blob_id`
- `source_type` (Message|DecisionVersion|ConnectorResponse|Manual)
- `source_id`
- `range` (jsonb) (segment timestamps, ocr bbox, etc.)
- `created_at`
Indexes:
- `(tenant_id, source_type, source_id)`
- `(tenant_id, evidence_blob_id)`

---

## 20.5 Decision Store
### `decision_objects`
- `id`
- `tenant_id`
- `type` (ChangeRequest|Commitment|RenewalOpportunity)
- `schema`
- `scope_key` (e.g. policy:ABC123 / customer:+598...)
- `status` (open|needs_info|confirmed|rejected|executed|cancelled)
- `current_version_id` (nullable)
- `conversation_id` (nullable but recommended link)
- `created_at`, `updated_at`
Indexes:
- `(tenant_id, status, updated_at desc)`
- `(tenant_id, scope_key)`
- `(tenant_id, conversation_id)`

### `decision_versions` (append-only)
- `id`
- `tenant_id`
- `decision_object_id`
- `version_number`
- `source_kind` (llm|human|system)
- `source_ref` (nullable: user_id / agent_id)
- `extractor_version` (nullable)
- `data` (jsonb)
- `unknown_fields` (jsonb)
- `needs_info` (jsonb)
- `confidence` (jsonb)
- `evidence_map` (jsonb) NOT NULL
- `rationale_summary` (text nullable)  (no prompts)
- `llm_metadata` (jsonb nullable: model, request_id, latency_ms, token_usage)
- `payload_hash`
- `diff_from_prev` (jsonb)
- `created_at`
Constraints:
- UNIQUE `(tenant_id, decision_object_id, version_number)`

### `decision_events` (append-only)
- `id`
- `tenant_id`
- `event_type`
- `aggregate_type` ('DecisionObject'|'Conversation'|'ProcessExecution'...)
- `aggregate_id`
- `idempotency_key`
- `payload` (jsonb)
- `causation` (jsonb) (message_id, correlation_id)
- `occurred_at`
Constraints:
- UNIQUE `(tenant_id, idempotency_key)`
Indexes:
- `(tenant_id, aggregate_id, occurred_at desc)`
- `(tenant_id, event_type, occurred_at desc)`

---

## 20.6 Outbox (event bus)
### `outbox_events`
- `id`
- `tenant_id`
- `topic`
- `payload`
- `idempotency_key`
- `status` (pending|published|failed)
- `attempts` default 0
- `available_at`
- `created_at`
Constraints:
- UNIQUE `(tenant_id, idempotency_key)`
Indexes:
- `(status, available_at)`

---

## 20.7 Process Execution Layer
### `process_executions`
- `id`
- `tenant_id`
- `template` (endorsement_v1|claim_checklist_v1)
- `template_version`
- `decision_object_id`
- `conversation_id` (nullable)
- `status` (running|waiting_user|waiting_human|waiting_integration|failed|done)
- `current_step_key`
- `context` (jsonb)
- `due_at` (nullable)
- `created_at`, `updated_at`
Indexes:
- `(tenant_id, status, updated_at desc)`
- `(tenant_id, decision_object_id)`

### `step_runs` (append-only)
- `id`
- `tenant_id`
- `process_execution_id`
- `step_key`
- `attempt`
- `status` (success|failed_retryable|failed_fatal|skipped|waiting)
- `idempotency_key`
- `input` jsonb
- `output` jsonb
- `error` jsonb
- `started_at`, `finished_at`
Constraints:
- UNIQUE `(tenant_id, idempotency_key)`
Index:
- `(tenant_id, process_execution_id, started_at desc)`

---

## 20.8 Integration Layer
### `connector_requests`
- `id`
- `tenant_id`
- `connector` (email|crm_webhook)
- `action` (send|case_upsert|...)
- `idempotency_key`
- `context` jsonb (decision_object_id, decision_version_id, process_execution_id)
- `payload` jsonb
- `status` (queued|running|success|failed)
- `attempts`
- `created_at`, `updated_at`
Constraints:
- UNIQUE `(tenant_id, connector, idempotency_key)`

### `connector_responses` (append-only)
- `id`
- `tenant_id`
- `connector_request_id`
- `attempt`
- `status` (success|retryable_error|fatal_error)
- `provider_reference`
- `http_status`
- `response_payload` jsonb
- `error` jsonb
- `responded_at`
Index:
- `(tenant_id, connector_request_id, responded_at desc)`

---

## 20.9 Notifications (broker/operator)
### `notification_events`
- `id`
- `tenant_id`
- `event_type` (new_conversation.started|decision.needs_info.material|conversation.ai_data_complete|process.overdue|...)
- `aggregate_type`
- `aggregate_id`
- `payload` jsonb
- `idempotency_key`
- `occurred_at`
Constraints:
- UNIQUE `(tenant_id, idempotency_key)`

### `notification_deliveries`
- `id`
- `tenant_id`
- `notification_event_id`
- `channel` (email|dashboard_badge|whatsapp_internal) (MVP: email+dashboard)
- `recipient` (user_id or email)
- `status` (queued|sent|failed|suppressed)
- `attempts`
- `last_error`
- `sent_at` (nullable)
Constraints:
- UNIQUE `(tenant_id, notification_event_id, channel, recipient)`
Indexes:
- `(tenant_id, status, created_at desc)`
