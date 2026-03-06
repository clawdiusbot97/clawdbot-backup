# 10 — Architecture (v0.3)

## Stack (principal)
- Ruby on Rails (API + Web Console)
- Postgres (system of record + outbox)
- Redis + Sidekiq (jobs)
- S3-compatible (evidence blobs)
- Observability: logs JSON + Sentry (MVP)

## Capas y separación (explícita)
1) Ingestion  
2) Conversation Orchestrator (AI)  
3) Evidence  
4) Decision Engine  
5) Decision Store  
6) Event Bus (Outbox)  
7) Process Execution Layer  
8) Integration Layer  
9) CRM Console  
10) Notification Service  

## Componentes y responsabilidades

### A) Ingestion Service (WhatsApp Edge)
- Endpoints:
  - `GET /webhooks/whatsapp` (verify)
  - `POST /webhooks/whatsapp` (events)
- Persistencia:
  - `webhook_deliveries`
  - `messages` (unificado inbound/outbound) + `message_statuses`
- Idempotencia:
  - unique `(tenant_id, channel, provider_message_id)` para inbound
- Publica evento outbox:
  - `message.received`

### B) AI Conversation Orchestrator (core)
**Responsabilidad:** decidir “¿responde IA o requiere humano?” y manejar el estado conversacional permitido.

En conversaciones nuevas, el Orchestrator trabaja junto al **Notification Service** para alertar al corredor y permitir una decisión explícita:
- “tomar como IA” (AI-first)
- “tomar como humano” (human-led)
- “takeover inmediato”

Además, alimenta el **Workbench de interpretación en vivo** en la Console (intent, draft decisions, needs_info, flags, recomendación).
- Inputs:
  - `Conversation`
  - último `Message` inbound + historial permitido (policy)
  - flags de riesgo/materialidad/baja confianza
- Outputs:
  - `Message` outbound (actor=ai) *o* `HandoffEvent` (request_human)
  - `DecisionEvent` (ai_confidence_low, handoff_requested)
- State:
  - `conversation.control_mode` (ai_first|human_led|human_takeover)
  - `conversation.allowed_context_window` (policy) (implícito por reglas del orquestador)
  - `conversation.last_ai_message_at`
- Reglas:
  - si `human_led` => el broker chatea siempre; IA no envía outbound (solo drafts/sugerencias)
  - si `human_takeover` => IA no envía outbound, solo sugiere drafts
  - si `materiality_high` => IA puede preguntar, pero **no ejecutar** y solicita aprobación

### C) Evidence Service
- Descarga media -> S3
- Transcribe audio -> transcript evidence
- (Opcional) OCR -> ocr evidence
- Crea EvidenceLinks a:
  - message
  - decision_version
  - connector_response (si aplica)

### D) Decision Engine
- Deterministic classifier + LLM extraction (evidence-bound)
- Crea/actualiza:
  - DecisionObject
  - DecisionVersions
  - DecisionEvents

### E) Decision Store (Postgres)
- Append-only:
  - decision_versions
  - decision_events
  - step_runs
  - connector_responses
- Proyecciones:
  - current_version_id en decision_objects
  - search indices

### F) Event Bus (Outbox)
- `outbox_events` en la misma transacción del write
- Publisher job:
  - marca published
  - dispara handlers internos por topic

### G) Process Execution Layer
- Ejecuta ProcessTemplates determinísticos:
  - endorsement_v1
  - claim_checklist_v1
- No ejecuta integraciones:
  - genera connector_requests
  - espera outcomes

### H) Integration Layer
- Consume `connector_requests`
- Ejecuta side-effects:
  - email
  - crm_webhook
- Persiste responses + emite eventos

### I) CRM Console
- UI + API:
  - Live chat viewer (monitor + takeover)
  - Decision inbox
  - Evidence viewer
  - Timeline
  - Process monitor
  - Configuración (mapping, rules, notification prefs)

### J) Notification Service
- Consume NotificationEvents
- Entrega:
  - MVP: email + dashboard badges
  - (opcional) whatsapp interno al broker (NEEDS RESEARCH)

## Diagramas ASCII

### Flujo base (inbound -> AI -> decisions -> process -> integrations)
```
Customer -> WABA -> Ingestion -> DB + Outbox(message.received)
                         |
                         v
                Conversation Orchestrator (AI)
                 | reply as AI OR handoff
                 v
            Message outbound (ai) -> WABA send
                 |
                 v
     Evidence -> Decision Engine -> Decision Store + Events
                 |
                 v
        Process Execution -> connector_requests -> Integrations
                 |
                 v
        Console + Notifications (operator)
```

### Separación Process vs Integrations
```
[Process Execution]
  - decide next step
  - emit connector_request
  - wait for result
       |
       v
[Integration Layer]
  - perform external call
  - persist connector_response
  - emit integration.succeeded/failed
       |
       v
[Process Execution resumes]
```

## Observability (mínimo)
- correlation_id por:
  - conversation_id
  - decision_object_id
  - process_execution_id
- Logs JSON con:
  - tenant_id
  - correlation_id
  - actor_type
  - event_type
- Sentry para exceptions + performance básico
