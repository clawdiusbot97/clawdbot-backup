# Brokia MVP WhatsApp Middleware — Docs Pack (v0.3)

Este paquete describe el blueprint implementable del MVP de Brokia como **middleware** entre WhatsApp (WABA) y un **CRM/Console** (propio inicialmente, integrable a CRMs externos).

## Cómo navegar
- **Producto + framing:** `00-overview.md`
- **AI-first chat + Human-in-the-loop (HIL):** `05-ai-chat-hil.md`
- **Arquitectura y responsabilidades:** `10-architecture.md`
- **Modelo de datos (Postgres) e idempotencia:** `20-data-model.md`
- **Contratos JSON (internos/API):** `30-contracts.md`
- **Notificaciones (broker/operator):** `35-notifications.md`
- **Process templates (endorsement, claim checklist):** `40-process-templates.md`
- **Arquitectura de agentes IA + guardrails:** `45-ai-agent-architecture.md`
- **Conectores e integraciones (email/CRM/webhook):** `50-connectors.md`
- **CRM/Console (UI mínima + configuración):** `60-crm-console.md`
- **Seguridad/privacidad/retención:** `70-security-privacy.md`
- **Plan por sprints (6–8):** `80-sprints-plan.md`
- **Open questions / NEEDS RESEARCH:** `90-open-questions.md`
- **Brief para reunión con profesora (1 página + bullets):** `95-professor-brief.md`

## Orden recomendado de lectura
1. `00-overview.md`
2. `05-ai-chat-hil.md`
3. `10-architecture.md`
4. `20-data-model.md`
5. `30-contracts.md`
6. `40-process-templates.md`
7. `35-notifications.md`
8. `45-ai-agent-architecture.md`
9. `50-connectors.md`
10. `60-crm-console.md`
11. `70-security-privacy.md`
12. `80-sprints-plan.md`
13. `90-open-questions.md`

## Convenciones clave (para todo el pack)
- **Audit trail es feature #1**: append-only para events, versions, runs.
- **LLM extraction es evidence-bound**: si no hay evidencia => `unknown`.
- **Idempotencia**: constraints + idempotency keys en TODOS los bordes.
- **Process Execution Layer** no ejecuta side-effects; solo genera **ConnectorRequests**.
- **AI-first chat**: el cliente conversa principalmente con IA; el humano supervisa/entra por materialidad, riesgo o decisión del broker.

## Estado del documento
- Versión: **v0.3**
- Stack preferido: **Ruby on Rails + Postgres + Redis/Sidekiq + S3-compatible**
- Alcance: MVP 6 meses, equipo 2–3 devs
