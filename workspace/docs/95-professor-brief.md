# 95 — Brief para profesora (reunión lunes) (v0.1)

> Objetivo: explicar **problema + solución + alcance 6 meses + validación** en 5–7 minutos.

## 1) Problema (System of Conversation vs System of Record)
- En la operación real del corredor, el trabajo sucede en **WhatsApp**.
- WhatsApp es un **system of conversation** (mensajes), pero el corredor necesita un **system of record**:
  - decisiones
  - evidencia
  - estado
  - seguimiento/SLA
  - integraciones
- Hoy eso se hace manualmente y se pierde información → re-trabajo, olvidos, seguimiento inconsistente.

**Objetivo medible (tesis):** reducir **≥30%** la carga operativa semanal de Juan Manuel (sin degradar calidad).

## 2) Solución propuesta (núcleo técnico)
Un **CRM WhatsApp-first para corredor** + motor interno que transforma chats en trabajo estructurado:

**Conversation → Decision Objects → Decision Events → Process Execution**

- **Conversation:** persistencia de mensajes y participantes (cliente, corredor, IA opcional).
- **Decision Objects (versionados):** endosos, siniestros checklist, renovaciones (cotización como roadmap).
- **Decision Events (append-only):** audit trail completo.
- **Process Execution:** workflows determinísticos (pedir datos, confirmar materialidad, reminders, disparar integraciones).

## 3) Experiencia de producto (confianza/adopción)
Modo híbrido:
- **Human-led (default):** el corredor chatea siempre; la IA es copiloto (drafts/sugerencias + extracción + alertas).
- **AI-first (opcional):** IA recopila datos y el humano aprueba por materialidad/riesgo.

Dashboard/Console:
- conversación nueva → notificación → el corredor decide si la toma IA o humano.
- panel “AI Interpretation / Workbench” en vivo: intención, datos faltantes, materialidad, recomendación de handoff.

## 4) Alcance (6 meses) — qué entra y qué no
### Entra (implementable)
- Endosos/cambios + siniestro checklist (core)
- CRM mínimo: Customers / Policies / Cases + Live chat + Inbox + Timeline + Evidence
- Notificaciones: conversación nueva, needs approval, overdue, low confidence, datos completos
- Integración MVP: email + CRM webhook genérico
- Persistencia/auditoría end-to-end (append-only + evidencia linkeada)

### No entra / roadmap
- Cotización multi-aseguradora full automation (depende de integraciones externas)
- Omnicanal (solo WhatsApp)
- Autopilot sin aprobación humana

## 5) Plan por fases (para demostrar realismo)
- **Fase 1 (Sem 1–4):** CRM WhatsApp-first + persistencia total + dashboard (usable manual)
- **Fase 2 (Sem 5–10):** decisiones + procesos core (endorsement_v1 + claim_checklist_v1) + evidencia + approvals + email
- **Fase 3 (Sem 11–14):** renovaciones operativas (cola + reminders)
- **Fase 4 (Sem 15+):** cotización / integraciones avanzadas (si aplica)

Entrega de tesis: **Fase 1 + Fase 2** (Fase 3 si da el tiempo).

## 6) Validación (cómo demostramos el 30%)
- Baseline: medir tiempo por caso y horas semanales (endosos/siniestros/renovaciones).
- Con Brokia: medir automáticamente con timestamps/events:
  - tiempo activo por caso
  - rondas de needs_info
  - overdue/casos olvidados
  - re-trabajo

## 7) Riesgos y mitigaciones (resumen)
- WABA details (firma webhooks, límites): **NEEDS RESEARCH** y diseño idempotente/outbox.
- IA: evidencia-bound + unknown-first + gates humanos por materialidad.
- Adopción: arrancar human-led.

---

## Slide outline (5 bullets)
1) Problema: WhatsApp ≠ system of record → carga alta + retrabajo + olvidos.
2) Solución: CRM WhatsApp-first + motor (Conversation → Decision → Events → Process).
3) Confianza: human-led default (IA copiloto) + AI-first opcional.
4) Alcance 6 meses: Endosos + Siniestros checklist + audit trail + integraciones mínimas.
5) Validación: objetivo ≥30% ahorro medido antes/después en caso real (Juan Manuel).
