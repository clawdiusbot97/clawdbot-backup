# Brokia — Competitive + Positioning Radar (OpenClaw cron spec)

**Objetivo:** radar liviano 2–3 veces por semana sobre posicionamiento/competencia indirecta (evitar que Brokia se perciba como “CRM/chatbot más”).

## Asunciones de entrega a Discord
- Se publica usando **OpenClaw message tool**, no webhooks.
- Acción usada: `message(action="send", channel="discord", target="1478821189584424991", message="...")`.
- No requiere bot token manual: se asume que OpenClaw ya tiene Discord configurado (como en otros cron jobs con `delivery.channel="discord"`).

> Nota: si tu setup no tiene Discord configurado, este cron va a fallar al enviar. En ese caso la alternativa es webhook, pero no la uso porque pediste OpenClaw cron.

---

## Schedule (2–3 veces/semana)
**Propuesta:** Lunes, Miércoles, Viernes 09:15 (America/Montevideo)
- Cron expr: `15 9 * * 1,3,5`

---

## Prompt (job payload.message)
Pegar tal cual en el job:

```
Brokia Radar — Competitive + Positioning (STRICT)

Objective:
- Produce a short competitive + positioning radar for Brokia.
- Focus ONLY on: conversational CRMs, WhatsApp business tooling, chat-to-work / ticket automation, conversation intelligence.
- Output MUST be <= 10 bullets total.
- No invented numbers. No long lists of links.

Seeds (run web_search for each):
1) WhatsApp CRM interactive messages buttons lists carousel
2) conversation governance decisions audit trail from chat
3) insurance broker WhatsApp workflow follow up documentation

Process:
1) Run 3 web_search queries above (count<=5 each). Extract only what’s relevant to positioning.
2) If there are no clear new findings (nothing that changes messaging / risk / opportunity), do NOT send to Discord. Return NO_REPLY.
3) Otherwise, compose a Discord-ready message with this exact structure:

TITLE: Brokia Radar — Competitive + Positioning (YYYY-MM-DD)

- Mercado (max 2 bullets):
- Posicionamiento observado (max 3 bullets):
- Riesgos de confusión para Brokia (max 3 bullets):
- Oportunidades para nuestro mensaje (max 2 bullets):

Acciones sugeridas (1–2 bullets):
- ...

4) Send it to Discord channelId 1478821189584424991 using the message tool:
message(action="send", channel="discord", target="1478821189584424991", message=<your message>)
5) After sending, return NO_REPLY.
```

---

## OpenClaw cron job JSON (listo para pegar)

Pegar como nuevo objeto dentro de `/home/manpac/.openclaw/cron/jobs.json` → `jobs[]`.

```json
{
  "id": "brokia-intel-radar-001",
  "name": "brokia-intel-radar",
  "enabled": true,
  "createdAtMs": 0,
  "updatedAtMs": 0,
  "schedule": {
    "kind": "cron",
    "expr": "15 9 * * 1,3,5",
    "tz": "America/Montevideo"
  },
  "sessionTarget": "isolated",
  "wakeMode": "now",
  "payload": {
    "kind": "agentTurn",
    "message": "Brokia Radar — Competitive + Positioning (STRICT)\n\nObjective:\n- Produce a short competitive + positioning radar for Brokia.\n- Focus ONLY on: conversational CRMs, WhatsApp business tooling, chat-to-work / ticket automation, conversation intelligence.\n- Output MUST be <= 10 bullets total.\n- No invented numbers. No long lists of links.\n\nSeeds (run web_search for each):\n1) WhatsApp CRM interactive messages buttons lists carousel\n2) conversation governance decisions audit trail from chat\n3) insurance broker WhatsApp workflow follow up documentation\n\nProcess:\n1) Run 3 web_search queries above (count<=5 each). Extract only what’s relevant to positioning.\n2) If there are no clear new findings (nothing that changes messaging / risk / opportunity), do NOT send to Discord. Return NO_REPLY.\n3) Otherwise, compose a Discord-ready message with this exact structure:\n\nTITLE: Brokia Radar — Competitive + Positioning (YYYY-MM-DD)\n\n- Mercado (max 2 bullets):\n- Posicionamiento observado (max 3 bullets):\n- Riesgos de confusión para Brokia (max 3 bullets):\n- Oportunidades para nuestro mensaje (max 2 bullets):\n\nAcciones sugeridas (1–2 bullets):\n- ...\n\n4) Send it to Discord channelId 1478821189584424991 using the message tool:\nmessage(action=\"send\", channel=\"discord\", target=\"1478821189584424991\", message=<your message>)\n5) After sending, return NO_REPLY.",
    "thinking": "low",
    "timeoutSeconds": 600
  },
  "delivery": {
    "mode": "none"
  },
  "state": {}
}
```

### Importante (2 cosas)
- `createdAtMs/updatedAtMs`: ponelos con timestamp real si tu tooling lo requiere. Si no, el scheduler suele sobreescribirlos.
- Si preferís que el resultado “aparezca” como announce automático, se puede setear `delivery.mode=announce` y que el job responda con el texto; pero pediste post explícito a `brokia-intel` y anti-ruido (mejor `delivery.mode=none`).
