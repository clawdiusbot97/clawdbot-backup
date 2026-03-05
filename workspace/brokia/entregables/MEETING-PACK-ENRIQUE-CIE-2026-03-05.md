# Brokia — Reunión con Enrique (CIE) — Pack final

**Fecha:** 2026-03-04  
**Reunión:** 2026-03-05  
**Objetivo:** mostrar análisis del problema + camino (MVP principal + Plan B) y salir con criterio de aprobación para el 19/03.

---

## A) Micro-ajustes acordados (para decir en vivo)
- **Slide 2 (Insight):** “Esto ya lo vimos en **entrevistas preliminares / casos cercanos**; nos faltan **5–10 entrevistas más** para confirmarlo y cuantificar baseline.”
- **Slide 4 (MVP):** en vez de “decisiones registradas”, decir: **“lo acordado queda en una versión vigente + confirmación explícita”**.

---

## B) Deck final (6 slides core + 2 backup)

### Slide 1 (Core) — Problema
- En seguros auto, acuerdos clave se toman por WhatsApp (texto/audios/llamadas).
- Hoy el flujo real es: conversación → memoria/copy‑paste → operación.
- Se rompe por: ambigüedad, cambios por goteo, estado vigente implícito.
- Aunque el cliente confirme, no se dispara trabajo (tareas/seguimiento dependen del corredor).
- Resultado: retrabajo, errores, demoras y reclamos + trazabilidad manual.

### Slide 2 (Core) — Insight (entrevistas / hipótesis)
- El dolor no es “usar WhatsApp”: es gobernar decisiones en conversación.
- Audios aceleran, pero empeoran recuperabilidad (“¿qué quedó?”).
- La operación diaria se llena de: faltantes, confirmaciones informales y seguimiento.
- Impacto en experiencia: tiempo de primera respuesta + claridad.
- Impacto en costo: reprocesos por malentendidos.

### Slide 3 (Core) — Propuesta (Brokia)
- Asistente conversacional para corredores de seguros auto.
- Estructura WhatsApp en decisiones con evidencia (sin releer chats).
- Preguntas paso a paso; botones/listas cuando aplica para reducir ambigüedad.
- Human-in-the-loop: el corredor valida decisiones materiales.
- Qué NO es: no CRM completo/pipeline; no cotizador universal; no reemplaza al corredor.

### Slide 4 (Core) — MVP elegido (wedge)
- 1 flujo end-to-end: Cotización → Propuesta → Aceptación (WhatsApp-first).
- Cotización manual del corredor (sin integraciones con aseguradoras).
- Entregable central: versión vigente + confirmación explícita + trazabilidad.
- Intervención mínima: Inbox simple para faltantes + validar decisiones materiales.
- Objetivo: que “lo conversado” se convierta en trabajo operativo sin memoria humana.

### Slide 5 (Core) — Plan de validación (hasta 19/03)
- Validar: adopción, reducción de ambigüedad, cierre del loop operativo.
- Evidencia pre-19/03: 5–10 entrevistas + 3 casos mapeados (timeline) + prototipo/demostración.
- Métricas (baseline y luego):
  - tiempo de primera respuesta
  - tiempos de ciclo (cotización→propuesta, propuesta→aceptación)
  - % faltantes detectados tarde
  - # reprocesos por malentendido
  - tiempo para reconstruir historial de un caso

### Slide 6 (Core) — Qué necesitamos de Enrique
- ¿Se entiende como decisiones + operación o suena a CRM/chatbot?
- ¿Wedge correcto: cotización o endosos?
- ¿Riesgos principales: adopción/posicionamiento/ejecución?
- ¿2 métricas go/no-go?
- Pregunta clave: ¿qué evidencia mínima necesitás ver para aprobar el 19/03?
- Próximos entregables: anteproyecto vs slides vs entrevistas vs prototipo.

### Slide 7 (Backup) — Matriz MVP vs Plan B (Endosos)
- MVP Cotización→Aceptación: Impacto medio/alto; Riesgo medio; Esfuerzo medio.
- Plan B Endosos/Cambios: Impacto alto; Riesgo bajo/medio; Esfuerzo medio.
- Regla: elegir wedge más defendible para aprobación + piloto.

### Slide 8 (Backup) — Núcleo mínimo (no plataforma)
- Decisiones (estado vigente)
- Evidencia (mensaje/audio asociado)
- Confirmación explícita (cuando importa)
- Tareas/seguimiento (lo confirmado dispara trabajo)

---

## C) Notas del presentador (script — core slides)
- Slide 1: “Acá el problema es que lo importante se acuerda por WhatsApp, pero se opera con memoria. El estado vigente queda implícito y los cambios llegan por goteo. Aunque confirmen, el trabajo no se dispara solo.”
- Slide 2: “Esto ya lo vimos en entrevistas preliminares/casos cercanos; ahora queremos 5–10 más para confirmarlo. El dolor es gobernar decisiones, no chatear.”
- Slide 3: “Brokia guía por WhatsApp y estructura lo acordado con evidencia. No es CRM, no es cotizador universal, no reemplaza al corredor.”
- Slide 4: “MVP = 1 flujo completo. Lo importante: lo acordado queda en versión vigente + confirmación explícita, y eso dispara tareas/seguimiento.”
- Slide 5: “Queremos evidencia concreta para 19/03: entrevistas, 3 timelines reales y un prototipo simple. Medimos primera respuesta, ciclos y reprocesos.”
- Slide 6 (cierre): “La pregunta clave: ¿qué evidencia mínima necesitás ver para aprobar el 19/03?”

---

## D) 1‑pager — Case Timeline (ejemplo)
1) detected — QuoteRequest (draft) — msg inicial
2) needs_info — QuoteRequest (v2) — faltantes + botones/lista
3) confirmed — QuoteRequest (v3) — lista para propuesta
4) proposal_sent — QuoteProposal — propuesta enviada
5) confirmed — PolicySelection — elige opción
6) confirmed — PolicyAcceptance — confirmación explícita
7) process_run_started — emisión (manual) — tareas creadas
8) executed — proceso actualizado

---

## E) Ask list (Top 7)
1) ¿Framing se entiende o suena a CRM/chatbot?
2) ¿Wedge correcto: cotización o endosos?
3) Riesgo principal para aprobar (adopción/posicionamiento/ejecución)
4) 2 métricas go/no-go
5) Evidencia mínima para 19/03
6) Siguiente entregable prioritario
7) Contactos recomendados para validar rápido
