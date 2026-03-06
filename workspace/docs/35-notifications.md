# 35 — Notifications (v0.3)

## Objetivo
Notificar al corredor/operator con señal alta y bajo spam, especialmente en modo AI-first:
- cliente nuevo / conversación nueva
- nueva request (endoso/siniestro)
- materialidad/riesgo
- overdue / SLA
- baja confianza IA / handoff requerido

## Canales (MVP)
- **Dashboard badge + inbox alerts** (siempre)
- **Email** (MVP recomendado)
- (Opcional) WhatsApp interno al broker: **NEEDS RESEARCH** por fricción/plantillas/costo

## Eventos que disparan notificaciones (mínimo MVP)
1) `new_conversation.started`
   - dispara cuando se crea una conversación nueva
   - incluye CTA: “Tomar como IA” / “Tomar como humano” (en dashboard)
2) `new_customer.requested`
   - primera intención clasificada como endoso/siniestro
   - en human-led es clave porque el broker va a responder manualmente
3) `decision.needs_info.material`
   - falta info y además hay materialidad alta o riesgo
4) `conversation.ai_data_complete`
   - la IA (o el motor) detecta que ya están todos los datos mínimos para avanzar
   - objetivo: avisarle al corredor: “ya podés cotizar/ejecutar”
4) `ai_confidence_low`
   - confidence debajo de umbral (ej. < 0.6)
5) `handoff.requested`
   - supervisor pide takeover
6) `process.overdue`
   - execution due_at vencido
7) `integration.failed`
   - conector falló fatal o agotó retries

## Contrato y tracking
- Crear `notification_events` append-only
- Por cada canal/recipient, crear `notification_deliveries` para tracking.

### Idempotencia
- `notification_events.idempotency_key`:
  - `t:<tenant>:<event_type>:<aggregate_id>:<time_bucket>`
- `notification_deliveries` unique:
  - `(tenant_id, notification_event_id, channel, recipient)`

## Throttling / anti-spam
Reglas MVP:
- Por conversación: máximo 1 notificación “new_customer.requested” por 24h
- `ai_confidence_low`: agrupar por 30 min (time bucket)
- `process.overdue`: notificar al vencer y luego cada 24h si sigue overdue
- `decision.needs_info.material`: solo si:
  - materiality_high OR
  - customer inactive por X horas OR
  - IA ya preguntó 2 veces y no logra completar

Implementación:
- generar `idempotency_key` con bucket:
  - `bucket=YYYYMMDDHH` o `YYYYMMDD` según tipo

## Delivery (MVP)
### Email
- Plantilla simple:
  - asunto: `[Brokia] Nueva conversación / Endoso pendiente / Overdue...`
  - cuerpo: link directo al Console (conversation + decision)
- Guardar:
  - delivery status, attempts, last_error

### Dashboard badge
- `notification_deliveries.channel = dashboard_badge`
- UI muestra contador por tipo (live chats, needs approval, overdue).

## Observabilidad
- Toda notificación debe poder “tracearse” a:
  - conversation_id / decision_object_id / process_execution_id
  - correlation_id
