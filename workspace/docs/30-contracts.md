# 30 — Contracts (JSON) (v0.3)

## Regla global (NO negociable)
**Todo output del LLM** (extraction o response generation) debe:
- mapear cada campo a `evidence_links[]` o marcarlo como `unknown`
- nunca inventar valores
- incluir metadata de modelo sin guardar prompts sensibles

---

## 30.1 Conversation
```json
{
  "id": "cv_01J...",
  "tenant_id": "t_uruguay_001",
  "channel": "whatsapp",
  "customer_phone_e164": "+5989xxxxxxx",
  "status": "open",
  "control_mode": "ai_first",
  "last_message_at": "2026-03-05T17:29:00Z",
  "created_at": "2026-03-05T17:00:00Z"
}
```

## 30.2 Message
> Unifica inbound/outbound y soporta actor typing (customer|ai|human|system).

```json
{
  "id": "msg_01J...",
  "tenant_id": "t_uruguay_001",
  "conversation_id": "cv_01J...",
  "channel": "whatsapp",
  "direction": "outbound",
  "actor": {
    "type": "ai",
    "ref": "agent:conversation_v1"
  },
  "intent": "ask_missing_info",
  "text_body": "¿Me confirmás el número de póliza?",
  "provider_message_id": "wamid.HBgL...",
  "provider_payload": { "raw": "..." },
  "status": "sent",
  "idempotency_key": "t_uy:cv_01J:ask_missing_info:policy_number:v2",
  "correlation_id": "corr_cv_01J",
  "created_at": "2026-03-05T17:10:00Z",
  "provider_timestamp": 1710000000
}
```

## 30.3 HandoffEvent
```json
{
  "id": "ho_01J...",
  "tenant_id": "t_uruguay_001",
  "conversation_id": "cv_01J...",
  "from_mode": "ai_first",
  "to_mode": "human_takeover",
  "reason": "materiality",
  "initiated_by": "ai",
  "initiator_user_id": null,
  "correlation_id": "corr_cv_01J",
  "occurred_at": "2026-03-05T17:12:00Z"
}
```

## 30.4 NotificationEvent
```json
{
  "id": "ne_01J...",
  "tenant_id": "t_uruguay_001",
  "event_type": "new_conversation.started",
  "aggregate": { "type": "Conversation", "id": "cv_01J..." },
  "payload": {
    "customer_phone_e164": "+5989xxxxxxx",
    "preview": "Hola, necesito cambiar el auto..."
  },
  "idempotency_key": "t_uy:new_conversation.started:cv_01J",
  "occurred_at": "2026-03-05T17:00:03Z"
}
```

---

## 30.5 DecisionObject
```json
{
  "id": "do_01J...",
  "tenant_id": "t_uruguay_001",
  "type": "ChangeRequest",
  "schema": "ChangeRequest.AutoPolicy@v1",
  "scope": { "scope_key": "policy:ABC123" },
  "status": "needs_info",
  "current_version_id": "dv_01J...",
  "conversation_id": "cv_01J...",
  "created_at": "2026-03-05T17:05:00Z",
  "updated_at": "2026-03-05T17:10:00Z"
}
```

## 30.6 DecisionVersion (evidence-bound extraction)
```json
{
  "id": "dv_01J...",
  "decision_object_id": "do_01J...",
  "version_number": 2,
  "source": {
    "kind": "llm",
    "actor_ref": "agent:extraction_v1",
    "extractor_version": "llm:model_x|prompt:v7",
    "request_id": "req_123"
  },
  "data": {
    "schema": "ChangeRequest.AutoPolicy@v1",
    "policy_number": "ABC123",
    "change_type": "vehicle_change",
    "effective_date": "unknown",
    "vehicle": { "make": "Toyota", "model": "Corolla", "year": 2019 }
  },
  "unknown_fields": ["effective_date"],
  "needs_info": [
    {
      "field_path": "effective_date",
      "question_to_user": "¿Desde qué fecha querés que corra el cambio?",
      "reason": "No está en evidencia",
      "priority": "high"
    }
  ],
  "confidence": { "overall": 0.78, "per_field": { "policy_number": 0.95 } },
  "evidence_map": {
    "policy_number": ["evl_01..."],
    "vehicle.make": ["evl_01..."],
    "vehicle.model": ["evl_01..."],
    "vehicle.year": ["evl_01..."]
  },
  "rationale_summary": "Extracción basada en el último mensaje del cliente. Falta fecha de vigencia.",
  "llm_metadata": {
    "model": "NEEDS_RESEARCH",
    "latency_ms": 820,
    "token_usage": { "input": 1200, "output": 350 }
  },
  "created_at": "2026-03-05T17:09:00Z"
}
```

### Representación de “AI response rationale” (sin prompts sensibles)
Se guarda:
- `rationale_summary` (texto corto)
- `llm_metadata` (model, request_id, latencia, tokens)
- `policy_tags` (si se necesita)

No se guarda:
- prompts completos
- tool traces con PII
- chain-of-thought detallado

---

## 30.7 DecisionEvent (append-only)
```json
{
  "id": "de_01J...",
  "tenant_id": "t_uruguay_001",
  "event_type": "ai_confidence_low",
  "aggregate": { "type": "DecisionObject", "id": "do_01J..." },
  "idempotency_key": "t_uy:ai_confidence_low:do_01J:dv_01J",
  "payload": { "confidence_overall": 0.42, "threshold": 0.6 },
  "causation": { "message_id": "msg_01J...", "correlation_id": "corr_cv_01J" },
  "occurred_at": "2026-03-05T17:11:00Z"
}
```

---

## 30.8 ProcessExecution
```json
{
  "id": "pe_01J...",
  "tenant_id": "t_uruguay_001",
  "template": "endorsement_v1",
  "template_version": 1,
  "decision_object_id": "do_01J...",
  "conversation_id": "cv_01J...",
  "status": "waiting_human",
  "current_step_key": "human_approval_gate",
  "context": {
    "decision_version_id": "dv_01J...",
    "materiality_required": true
  },
  "due_at": "2026-03-06T17:10:00Z"
}
```

## 30.9 StepRun
```json
{
  "id": "sr_01J...",
  "process_execution_id": "pe_01J...",
  "step_key": "ask_missing_info_ai",
  "attempt": 1,
  "status": "success",
  "idempotency_key": "t_uy:pe_01J:ask_missing_info_ai:dv_01J",
  "input": { "needs_info": [{ "field_path": "effective_date" }] },
  "output": { "outbound_message_id": "msg_01J..." },
  "started_at": "2026-03-05T17:10:00Z",
  "finished_at": "2026-03-05T17:10:01Z"
}
```

---

## 30.10 ConnectorRequest / ConnectorResponse
```json
{
  "id": "crq_01J...",
  "tenant_id": "t_uruguay_001",
  "connector": "crm_webhook",
  "action": "case_upsert",
  "idempotency_key": "t_uy:crm:case_upsert:do_01J:dv_01J",
  "context": {
    "decision_object_id": "do_01J...",
    "decision_version_id": "dv_01J...",
    "process_execution_id": "pe_01J..."
  },
  "payload": {
    "case_type": "endorsement",
    "policy_number": "ABC123",
    "fields": {
      "change_type": "vehicle_change",
      "vehicle_make": "Toyota"
    }
  },
  "status": "queued",
  "requested_at": "2026-03-05T17:20:00Z"
}
```

```json
{
  "id": "crs_01J...",
  "connector_request_id": "crq_01J...",
  "attempt": 1,
  "status": "success",
  "http_status": 200,
  "provider_reference": "CRM-CASE-9912",
  "response_payload": { "id": "CRM-CASE-9912" },
  "responded_at": "2026-03-05T17:20:02Z"
}
```
