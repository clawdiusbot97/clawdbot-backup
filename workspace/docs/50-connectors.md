# 50 — Connectors / Integration Layer (v0.3)

## Objetivo
Permitir integrar el core con:
- Email (operación aseguradora)
- CRM externo (webhook genérico)

Sin acoplar el core a un CRM específico.

## Principios
- Connector ejecuta side-effects; Process Engine no.
- Idempotencia por `connector_requests.idempotency_key` + unique constraints.
- Retries controlados, y DLQ lógico (failed) con alertas.
- Mapping por tenant (fields + auth + endpoints).

---

## 50.1 Connector contract
Ver `30-contracts.md` (ConnectorRequest/Response).

### Retries
- `retryable_error` => reintentar con backoff
- `fatal_error` => marcar failed, emitir `integration.failed`, notificar

### DLQ (MVP)
- Estado `failed` + UI “Retry” manual (operator/admin).
- Registro completo en `connector_responses` (append-only).

---

## 50.2 Email Connector (MVP)
### Acciones
- `send`

### Input payload (ejemplo)
- `to[]`, `subject`, `template`, `template_vars`, `attachments[]`

### Persistencia
- request + response + provider_reference
- opcional: guardar `.eml` como evidence_blob(kind=email_eml)

### NEEDS RESEARCH
- Elegir provider (SES/SendGrid/Mailgun) según disponibilidad/costo.
- Decisión: ¿queremos DKIM/SPF gestionado? (impacta setup sprint).

---

## 50.3 CRM Webhook Connector (genérico, recomendado)
### Acciones
- `case_upsert`
- `customer_upsert`
- `policy_upsert` (opcional MVP)

### Auth
- HMAC shared secret (recomendado) o bearer token por tenant.

### Payload mapping por tenant
- Tabla/config: `connector_mappings`
  - `tenant_id`
  - `connector`
  - `mapping_json` (source_field -> target_field)
  - `endpoint_url`
  - `auth_config`

### Idempotencia
- Enviar header `Idempotency-Key: <idempotency_key>`
- Persistir el request/response para replay.

---

## 50.4 Cómo agregar nuevos conectores (proceso)
1) Definir `connector` name + actions
2) Implementar handler (Sidekiq worker) que:
   - toma connector_request
   - hace call
   - crea connector_response append-only
   - actualiza status
3) Agregar mapping schema
4) Agregar tests de idempotencia + retries
5) Agregar UI mínima en Console (config + runs)

---

## 50.5 Event → Process mapping (integrabilidad)
- Se define un registry/config:
  - cuando `decision.detected` con schema X => start process template Y
  - cuando `handoff.approved` => resume process en step gate

Esto permite adaptar a CRMs/procesos distintos sin reescribir core.
