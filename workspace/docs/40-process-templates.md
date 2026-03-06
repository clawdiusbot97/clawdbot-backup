# 40 — Process Templates (v0.3)

## Principios
- Process Engine es **determinístico**.
- No ejecuta integraciones externas: genera `connector_requests` y espera resultados.
- En AI-first:
  - cuando falta info: **IA pregunta primero**
  - si baja confianza / materialidad alta: gate a humano (`waiting_human`)
  - confirmación material: puede ser Inbox o aprobación explícita en chat

## Estados estándar
- `running`
- `waiting_user` (esperando respuesta del cliente)
- `waiting_human` (esperando operador)
- `waiting_integration`
- `failed`
- `done`

---

## 40.1 endorsement_v1 (ChangeRequest.AutoPolicy@v1)

### Objetivo
Completar endoso/cambio con evidencia y confirmación humana para ejecución material.

### Step list (con inputs/outputs/idempotency/retries)

#### Step: `load_latest_decision_version`
- Input: `{ decision_object_id }`
- Output: `{ decision_version_id }` en context
- Idempotency: `t:<pe_id>:load_latest:<current_version_id>`
- Retry: no

#### Step: `validate_min_fields`
- Input: `decision_version.data`
- Regla:
  - `policy_number != unknown` OR fallback manual en Console
  - `change_type != unknown`
- Si faltan:
  - set `status=waiting_user`
  - avanzar a `ask_missing_info_ai`
- Idempotency: `t:<pe_id>:validate_min_fields:<dv_id>`
- Retry: no

#### Step: `ask_missing_info_ai`
- Input: `decision_version.needs_info[]`
- Acción:
  - AI Conversation Orchestrator genera 1 mensaje con 1–3 preguntas
  - crea `Message` outbound actor=ai, intent=ask_missing_info
- Output: `{ outbound_message_id }`
- Idempotency: `t:<pe_id>:ask_missing_info_ai:<dv_id>`
- Retry: sí (por idempotency outbound)

#### Step: `wait_user_response`
- Estado: `waiting_user`
- Resume cuando:
  - llega inbound message
  - Decision Engine crea una DecisionVersion nueva (v+1)
- Timeout:
  - si `due_at` vencido => event `process.overdue` + notificación

#### Step: `materiality_check`
- Input: `decision_version.data.change_type`
- Output: `context.materiality_required=true|false`
- Idempotency: `t:<pe_id>:materiality_check:<dv_id>`
- Retry: no

#### Step: `human_approval_gate`
- Condición de entrar:
  - `materiality_required=true` OR `ai_confidence_low=true` OR `policy_violation=true`
- Acción:
  - set `status=waiting_human`
  - emitir `handoff.requested` + notificación
- Salida:
  - operador aprueba en Console:
    - `Approve & Execute` OR `Approve message in chat` OR `Takeover`
- Idempotency: `t:<pe_id>:human_approval_gate:<dv_id>`

#### Step: `send_material_confirmation_ai` (opcional, si el flujo requiere confirmación explícita del cliente)
- Nota: materialidad requiere humano para ejecutar, pero el cliente puede también confirmar intención.
- Acción:
  - IA propone mensaje “Confirmás…” (draft)
  - Operador aprueba (si se configura modo “approve before send”)
- Idempotency: `t:<pe_id>:send_material_confirmation_ai:<dv_id>`

#### Step: `emit_integration_requests`
- Precondición:
  - `approved_by_human=true` (flag en context)
- Acción:
  - crear connector_request(email.send)
  - crear connector_request(crm_webhook.case_upsert) (si configurado)
- Output: ids de requests
- Idempotency:
  - Email: `t:<tenant>:email:endorsement:<do_id>:<dv_id>`
  - CRM: `t:<tenant>:crm:case_upsert:<do_id>:<dv_id>`
- Retry: sí (idempotente por constraints)

#### Step: `wait_integrations_complete`
- Estado: `waiting_integration`
- Condición:
  - responses success para required connectors
- Si falla:
  - retry policy en Integration Layer
  - si fatal => `process.failed` + notificación

#### Step: `mark_executed`
- Acción:
  - DecisionObject.status = executed
  - event `decision.executed`
  - ProcessExecution.status = done
- Idempotency: `t:<pe_id>:mark_executed:<dv_id>`

---

## 40.2 claim_checklist_v1 (Commitment.ClaimChecklist@v1)

### Objetivo
Checklist + recolección de evidencia con reminders, AI-first.

#### Step: `load_latest_decision_version`
- Igual.

#### Step: `build_commitments`
- Acción:
  - si no existe checklist en data, crear default (system)
  - emitir `commitments.created`
- Idempotency: `t:<pe_id>:build_commitments:<dv_id>`

#### Step: `ask_for_documents_ai`
- Acción:
  - IA solicita 2–3 documentos por turno
  - outbound message actor=ai
- Idempotency: `t:<pe_id>:ask_for_documents_ai:<dv_id>`
- Retry: sí

#### Step: `schedule_reminders`
- Acción:
  - crear scheduled jobs (Sidekiq) + record en events
- Idempotency:
  - `t:<pe_id>:reminder:day+1`
  - `t:<pe_id>:reminder:day+3`

#### Step: `track_completion`
- Fuente de completion:
  - cliente envía docs => Evidence Service linkea blobs
  - operador marca items done en Console
- Si IA detecta baja confianza / conflicto => `waiting_human`

#### Step: `close`
- Marca done y emite events.
