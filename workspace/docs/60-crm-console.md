# 60 — CRM / Console (v0.3)

## Objetivo
Construir un **CRM/Console mínimo** que permita operar el MVP y, a la vez, no acople el core (porque luego se integra con CRMs externos).

> El core (decisions/events/process/integrations) debe ser usable incluso si la UI cambia o se reemplaza por CRM externo.

## Módulos UI mínimos

### 1) Customers
- Lista + detalle
- Datos mínimos:
  - phone_e164 (clave)
  - nombre (si se obtiene)
  - notas
- Acciones:
  - link a conversaciones y casos

### 2) Policies
- Mínimo:
  - policy_number
  - customer_id
  - aseguradora (texto)
- Se puede poblar:
  - manual (operator)
  - CRM webhook (si el CRM manda)
  - extraction (si hay evidencia)

### 3) Cases
- Representan “work items” operativos:
  - endorsement case
  - claim checklist case
- Linkean:
  - decision_object_id
  - process_execution_id
  - conversation_id

### 4) Live Chat Viewer (Live monitor mode)
- Lista de conversaciones activas (con badges: new, needs_approval, low_confidence, overdue)
- Vista chat en tiempo real con:
  - actor (customer/ai/human/system)
  - status de envío (outbound)
  - evidencias adjuntas (click)

**Panel clave (interpretación en vivo)**
- Un panel lateral “AI Interpretation / Workbench” que muestra en tiempo real:
  - Intent detectado (endoso/siniestro/renovación/cotización/otro) + confianza
  - DecisionObject(s) candidatos (draft) con campos y `unknown_fields`
  - `needs_info` (preguntas sugeridas) priorizadas
  - flags: materiality_high, ai_confidence_low, policy_violation
  - recomendación del Supervisor: `keep_ai`, `request_human`, `takeover`

- Controles:
  - Selector de `control_mode` (**AI-first / Human-led / Takeover**)
  - Acción al inicio de conversación nueva:
    - “Que lo tome la IA (hacer preguntas)”
    - “Lo tomo yo (responder como humano)”
  - “Approve suggested reply” (copilot: aprobar/copy)
  - “Send as human”
  - “Return to AI”
  - “Pause AI” (equivalente a takeover para esa conversación)

**Milestone visible para el corredor**
- Cuando `needs_info` queda vacío y confidence >= threshold:
  - badge: “Datos completos”
  - notificación: “Listo para cotizar / ejecutar proceso”
  - CTA: “Cotizar” / “Crear caso” / “Ejecutar siguiente step”

### 5) Decision Inbox
- Tabla de DecisionObjects:
  - status, type, scope_key, updated_at
  - badges: materiality, low confidence, overdue
- Acciones:
  - confirm/reject
  - edit fields (crea DecisionVersion human)
  - approve & execute (si aplica)

### 6) Evidence Viewer
- Lista de EvidenceLinks por decision field
- Signed URLs + range (transcript segment)
- Audit de accesos (opcional MVP)

### 7) Timeline unificada
Un feed único por Conversation/Decision/Process:
- Messages
- DecisionEvents
- StepRuns
- ConnectorResponses
- HandoffEvents
- NotificationDeliveries

### 8) Process Monitor
- Lista de process_executions por estado
- Drilldown:
  - current_step
  - step_runs
  - overdue + retry

## Configuración (por tenant)
### A) Schemas
- qué schemas de DecisionObjects existen
- versión activa

### B) Materiality rules
- reglas determinísticas (YAML/DB) por change_type

### C) Event → Process mapping
- decision.detected(schema X) => start template Y
- decision.confirmed => resume template step gate
- handoff events => alter conversation control_mode

### D) Notification preferences
- canales activos (email/dashboard)
- throttling policy

### E) Connector settings
- CRM webhook URL + secret
- email provider settings
- field mapping

## Cómo este CRM NO acopla el core
- El core expone:
  - contratos (events, decisions, processes)
  - connector framework
- El CRM es una proyección/operador:
  - puede ser reemplazado por CRM externo que consuma los mismos events
  - los conectores permiten empujar a CRMs externos sin reescribir process engine
