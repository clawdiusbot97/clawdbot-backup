# 05 — AI-first Chat + Human-in-the-loop (v0.3)

## Objetivo
El cliente final conversa principalmente con la **IA** (rápido, 24/7).
El corredor/broker opera en **supervisión**, interviniendo por:
- materialidad
- riesgo/ambigüedad
- baja confianza de IA
- preferencia manual (takeover)

## Roles

### Customer (cliente final)
- Envía mensajes (texto, audio, imágenes, docs).
- Responde preguntas de la IA.
- No ve “decisiones internas”; solo interacción natural.

### AI Agent
- Responde como “asistente del corredor”.
- Recopila datos faltantes.
- Propone DecisionVersions y preguntas `needs_info`.
- Nunca ejecuta acciones materiales sin aprobación.

### Operator/Human (corredor / supervisor)
- Monitorea conversaciones (“observer mode”).
- Interviene en:
  - confirmación material
  - corrección de datos
  - mensajes sensibles
  - cierre/derivación
- Puede tomar control (“takeover mode”).

## Modos de control

### 1) AI-first mode (default)
- IA responde automáticamente.
- Cada mensaje outbound de IA queda auditado:
  - actor = `ai`
  - intent = `ask_missing_info` / `explain_next_steps` / `confirm_materiality` etc.
  - referencia a DecisionObject/ProcessExecution si aplica.

### 2) Human-led mode (broker-first)
- El **corredor** chatea siempre con el cliente (actor = `human`).
- La IA funciona como **copiloto**:
  - sugiere respuestas (drafts) que el humano puede copiar/aprobar
  - extrae estructura (DecisionVersions) en background
  - dispara alerts (materiality/low confidence/overdue)
- Política:
  - en este modo, por defecto **IA no envía** outbound al cliente.
  - opcional configurable: “send as AI” sólo si el broker lo habilita (por conversación/tenant).

### 3) Observer mode (humano monitorea sin intervenir)
- El operador ve en Console:
  - chat en vivo (inbound/outbound)
  - sugerencias de respuesta (drafts) generadas por IA
  - status de decisiones/procesos

### 4) Takeover (humano toma control)
- El operador cambia `conversation.control_mode = human_takeover`
- Efectos:
  - IA deja de enviar mensajes outbound automáticamente (solo sugiere drafts)
  - el humano responde (actor = `human`)
  - todo queda auditado con `HandoffEvent` + `Conversation.control_mode` actualizado
- Retorno a IA: `control_mode = ai_first` con evento de handoff.

## Reglas de intervención (policy)
**Regla base:** “IA puede conversar, NO puede ejecutar materialidad”.

### Materialidad ⇒ requiere confirmación humana antes de ejecutar
Ejemplos típicos (MVP seguros auto):
- cambio de vehículo / conductor / uso / suma asegurada
- cualquier acción que implique enviar una solicitud “final” a aseguradora o modificar CRM externo

**Confirmación humana puede ser:**
- Inbox: botón “Approve & Execute”
- Chat approval: el humano aprueba el mensaje de confirmación final que la IA propone (human approves message)

### Señales para solicitar intervención humana (Supervisor Agent)
- `ai_confidence_low` (por debajo de umbral)
- `policy_violation` (prompt injection, contenido riesgoso)
- `materiality_high`
- `customer_angry` / escalamiento (heurística)
- `handoff_requested_by_operator` (manual)

## Audit trail en AI-first
Todo mensaje y acción debe registrar:
- **quién** (customer/ai/human/system)
- **cuándo**
- **a qué conversación pertenece**
- **qué intent tenía** (clasificación de intención)
- **qué decisión/proceso afectó** (foreign keys)
- **evidence links** relevantes cuando el mensaje justifica/extrajo algo

### Qué se guarda de “razonamiento” de la IA
No persistimos prompts completos ni chain-of-thought.
Persistimos solo:
- `model`, `request_id`, `latency_ms`, `token_usage` (si disponible)
- `rationale_summary` (1–3 bullets, sin contenido sensible)
- `policy_tags` (e.g. `["evidence_bound", "materiality_requires_approval"]`)
- `evidence_refs` (ids)

## Notificaciones al corredor (alto nivel)
Ver `35-notifications.md`. En AI-first / human-led es clave notificar:
- cliente nuevo / conversación nueva (para elegir modo: IA vs humano)
- nueva request (endoso/siniestro/cotización/renovación)
- materialidad detectada
- baja confianza / handoff requerido
- **datos completos** (cuando la IA ya juntó lo mínimo para cotizar/ejecutar)

## Live monitor mode (experiencia)
En Console:
- panel “Live Chats”
- cada chat muestra:
  - control_mode (ai_first / human_takeover)
  - último mensaje + quién lo envió
  - alerts/badges (materiality, overdue, low confidence)
- acciones:
  - “Take over”
  - “Return to AI”
  - “Approve suggested reply”
  - “Send as human”
