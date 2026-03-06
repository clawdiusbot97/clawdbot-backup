# 70 — Security & Privacy (v0.3)

## Objetivo
Asegurar:
- autenticidad del webhook
- control de acceso en Console
- evidencia privada (signed URLs)
- PII manejada correctamente
- no persistir prompts sensibles

---

## 70.1 Webhook verification (WhatsApp Cloud API)
**NEEDS RESEARCH (no afirmar sin fuente oficial)**

Hipótesis probable:
- header `X-Hub-Signature-256` con HMAC SHA256 del raw body (Meta ecosystem).

Plan:
- ver `90-open-questions.md` (queries concretas).

Decisión desbloqueada:
- implementar verificación HMAC obligatoria, o fallback.

Fallback MVP (si no hay firma o es compleja):
- verify token en GET
- rate limit por IP
- secret header adicional (si hay proxy)
- alerting ante anomalías

---

## 70.2 RBAC (Console)
- Roles:
  - admin
  - operator
  - viewer
- Reglas:
  - operator puede takeover/approve/execute
  - viewer no puede ejecutar ni enviar mensajes
- Auditoría:
  - toda acción genera DecisionEvent (`inbox.action_taken`) con `actor_user_id`

---

## 70.3 Signed URLs (Evidence)
- Evidence blobs en bucket privado
- Endpoint:
  - `GET /api/evidence_blobs/:id/signed_url?ttl=60`
- TTL corto (60s)
- Opcional: registrar acceso (audit event)

---

## 70.4 Retention policy
- Media (audio/image/doc): 90–180 días configurable
- Transcript/OCR: 180–365 días configurable
- Decisions/Events/StepRuns/ConnectorResponses: retención larga (audit)
- Purge job:
  - borra objeto en S3
  - marca tombstone en DB (preserva metadata mínima)
  - emite event `evidence.purged`

---

## 70.5 PII en logs
- Prohibido loguear bodies completos de mensajes.
- Logs deben usar:
  - message_id
  - conversation_id
  - decision_object_id
  - correlation_id
- Si se necesita debugging:
  - feature flag “secure debug” + acceso admin + audit

---

## 70.6 AI prompt handling
Guardar:
- output estructurado (DecisionVersion)
- evidence links
- metadata (model, request_id, token usage si disponible)
- rationale_summary corto

No guardar:
- prompts completos
- chain-of-thought
- secretos (tokens, connector secrets)
- dumps de conversaciones en logs
