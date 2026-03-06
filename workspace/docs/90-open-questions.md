# 90 — Open Questions / NEEDS RESEARCH (v0.3)

## Objetivo
Lista de incertidumbres donde no debemos inventar detalles.
Cada item incluye:
- qué investigar
- qué decisión desbloquea
- queries sugeridas (dónde buscar)

---

## 1) WhatsApp Cloud API — Webhook signature verification
**NEEDS RESEARCH**
- Investigar: ¿WhatsApp Cloud API webhooks incluyen `X-Hub-Signature-256`? ¿cómo se calcula (app secret)? ¿aplica siempre?
- Desbloquea:
  - implementar verificación HMAC obligatoria y almacenar `signature_valid`
  - o fallback de seguridad
- Queries:
  - `site:developers.facebook.com whatsapp cloud api webhooks x-hub-signature-256`
  - `site:developers.facebook.com "X-Hub-Signature-256" "whatsapp"`
  - `meta webhook signature verification x-hub-signature-256 app secret`

---

## 2) WABA pricing (por conversación/categoría/país)
**NEEDS RESEARCH**
- Investigar: modelo actual de pricing por país (Uruguay), categorías (service/utility/marketing/auth), free tier, y cómo se clasifica.
- Desbloquea:
  - estrategia de mensajes outbound (plantillas vs sesión)
  - throttling y quotas por tenant
- Dónde:
  - pricing oficial: https://business.whatsapp.com/products/platform-pricing
  - docs Meta / release notes
- Queries:
  - `WhatsApp Business Platform pricing Uruguay service utility`
  - `WhatsApp Cloud API conversation category pricing`

---

## 3) Rate limits / throughput / retry semantics (Graph API)
**NEEDS RESEARCH**
- Investigar: límites por app/WABA, comportamiento de retries, ordering.
- Desbloquea:
  - diseño de backpressure y reintentos en Ingestion
- Queries:
  - `WhatsApp Cloud API rate limits`
  - `Graph API WhatsApp Cloud API throughput limits`

---

## 4) Media download expiry / URLs temporales
**NEEDS RESEARCH**
- Investigar: cuánto dura la URL del media, mejores prácticas, reintentos.
- Desbloquea:
  - estrategia de fetch inmediato y retries
- Queries:
  - `WhatsApp Cloud API media download URL expiration`

---

## 5) Status callbacks para outbound messages
**NEEDS RESEARCH**
- Investigar: payload exacto de statuses (sent/delivered/read/failed) y cómo correlacionar.
- Desbloquea:
  - data model de `message_statuses` y UI de delivery
- Queries:
  - `WhatsApp Cloud API webhooks message status payload`

---

## 6) Transcripción (proveedor)
**NEEDS RESEARCH**
- Investigar: proveedor ideal (latencia/costo/calidad español rioplatense), soporte timestamps.
- Desbloquea:
  - contrato de transcript evidence + costos + SLAs
- Queries:
  - `speech to text spanish latam timestamps pricing`
  - `whisper api timestamps segments` (si se usa)

---

## 7) WhatsApp templates vs session messages (para preguntas needs_info)
**NEEDS RESEARCH**
- Investigar: cuándo se requiere template para outbound, cómo funciona la ventana de 24h, implicancias para AI-first.
- Desbloquea:
  - diseño de outbound_messages + estrategia de engagement
- Queries:
  - `WhatsApp Cloud API 24 hour customer service window templates`
  - `WhatsApp Business Platform template required after 24 hours`

---

## 8) Compliance local (retención, consentimiento)
**NEEDS RESEARCH**
- Investigar: políticas del broker + requisitos locales (Uruguay) para retención de PII y audio.
- Desbloquea:
  - retention defaults + terms
- Queries:
  - `Uruguay personal data protection law retention`
  - `insurance broker data retention requirements`

---

## 9) “WhatsApp internal notifications to broker” viability
**NEEDS RESEARCH**
- Investigar: si conviene notificar al broker por el mismo canal WhatsApp (costos + plantillas + UX).
- Desbloquea:
  - canales de Notification Service
- Queries:
  - `WhatsApp Business Platform internal notifications best practices`
