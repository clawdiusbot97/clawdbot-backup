# 00 — Overview (v0.3)

## Framing
Brokia se modela como un **motor de conversación auditable** que genera y ejecuta decisiones operativas:

**Conversation → Decision Objects → Decision Events → Process Execution**

### Problema que resuelve
En brokers de seguros auto, la operación real vive en WhatsApp: pedidos de endoso, siniestros, recolección de documentos, seguimiento.

El problema: WhatsApp es un **system of conversation** (mensajes), pero el broker necesita un **system of record** (decisiones, evidencias, estado, SLA, integraciones).

Brokia MVP crea ese system of record y lo mantiene sincronizado con la conversación (AI-first + HIL).

## Qué entra en el MVP
- Canal: WhatsApp Business Cloud API (WABA)
- Vertical: **corredores de seguros auto**
- Flujos:
  - **Endosos/cambios**: `ChangeRequest.AutoPolicy`
  - **Siniestro checklist**: `Commitment.ClaimChecklist`
- Modos de chat (dos mundos)
  - **AI-first chat**: IA responde y recopila datos; Humano interviene por materialidad/riesgo.
  - **Human-led chat (broker-first)**: el corredor chatea siempre con el cliente; la plataforma estructura decisiones, genera eventos y dispara procesos (IA como copiloto, no como “cara” del chat).
- Audit trail completo:
  - messages inbound/outbound (con actor customer|ai|human|system)
  - decisions (objects/versions)
  - evidence (media, transcript, OCR)
  - events (append-only)
  - process execution (step runs)
  - integration runs (connector requests/responses)
- Console/CRM propio mínimo:
  - Customers / Policies / Cases
  - Live chat viewer (monitor + takeover)
  - Decision Inbox + Evidence Viewer + Timeline + Process Monitor
- Integrabilidad:
  - Conectores (email + CRM webhook genérico)
  - Mapping por tenant
  - Event → process mapping configurable

## Qué NO entra (explícito)
- Marketplace de conectores “plug&play” (solo framework + 2 conectores MVP)
- Autopilot de ejecuciones materiales sin aprobación humana
- Omnicanal (solo WhatsApp)
- Modelos avanzados de ML propios (solo LLMs + reglas)
- Billing multi-tenant complejo / SSO enterprise (RBAC mínimo)

## Definiciones rápidas
### Conversation
Entidad que agrupa mensajes entre participantes (Customer ↔ AI ↔ Human) en un canal (WhatsApp).

### Decision Object
Entidad de negocio que representa “algo que hay que decidir/ejecutar”.
Ejemplos:
- Endoso/cambio en póliza
- Checklist de siniestro

Es **versionada append-only** mediante DecisionVersions.

### Decision Version
Snapshot inmutable de la decisión extraída/propuesta/corregida (source: llm/human/system), con:
- datos
- unknown_fields
- needs_info
- confidence
- evidence_map

### Evidence
Prueba que sustenta lo extraído:
- mensajes
- adjuntos
- transcript segments
- OCR bounding boxes
- emails
- notas humanas

Se referencia por EvidenceLinks.

### Decision Event
Evento append-only que registra qué ocurrió:
- decision.detected
- decision.needs_info
- decision.confirmed
- integration.succeeded
- process.overdue
etc.

### Process Execution
Instancia de workflow determinístico (endorsement_v1, claim_checklist_v1) que:
- avanza por steps
- espera input del usuario/humano
- solicita integraciones por ConnectorRequests
- marca done/executed

## Reglas duras del producto
- **Materialidad ⇒ confirmación humana antes de ejecutar** (en Inbox o en chat con “approve”).
- **Todo output del LLM** debe tener evidence links o `unknown`.
- **Proceso** y **Integración** son capas separadas.
- **Live monitor mode**: el broker puede observar el chat, intervenir y tomar control.
