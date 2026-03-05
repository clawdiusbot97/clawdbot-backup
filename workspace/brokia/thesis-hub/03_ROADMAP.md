# 03 — Roadmap (tesis → 26/03/2026 y más allá)

> Enfoque: progresión real de tesis hacia **anteproyecto (26/03/2026 21:00)**, con placeholders explícitos donde falte evidencia.
> Owners: **Manu (PM/Tech)**, **Rodrigo (Legal/Network)**, **JM (Broker/domain)**.

---

## Phase 1 — Problem crystallization (ahora → ASAP)

**Objective**
- Cerrar una definición de problema *operativa y medible* (qué duele, a quién, cuánto, y por qué ahora) para que el anteproyecto no sea “idea” sino “problema demostrable”.

**Deliverables**
- 1-pager de problema (versión anteproyecto):
  - Problema, usuario, contexto (correduría), alcance, hipótesis, métricas iniciales.
  - Fuente base (existente): `brokia/tesis/problem-plan-14dias.md`.
- Mapa de proceso actual + fricciones principales (resumen):
  - Fuente base (existente): `brokia/diagramas/*`, `brokia/subprocesos-consolidado.csv`.
- Set mínimo de “evidencias” recolectables (baseline):
  - Fuente base (existente): `brokia/tesis/pm-turbo/README.md` (plantillas/plan).

**Owner**
- Manu (lead) + JM (inputs de proceso) + Rodrigo (validación de framing legal/actor mapping).

**Risk**
- Confundir “feature/MVP” con problema de tesis; quedar sin métrica base defendible.

**Dependency**
- Datos de proceso reales (JM) y/o entrevistas (mínimo 2) para cuantificar fricción.

---

## Phase 2 — Anteproyecto build (hasta 26/03/2026 21:00)

**Objective**
- Construir y entregar el **anteproyecto** con estructura académica correcta y trazabilidad mínima (problema → objetivos → metodología → plan → riesgos).

**Deliverables**
- Anteproyecto v1 listo para revisión:
  - Preguntas de investigación / objetivos.
  - Alcance (qué entra / qué NO entra).
  - Metodología (cómo se valida: entrevistas + time-and-motion + evidencias).
  - Cronograma (marzo–septiembre 2026, con placeholder si falta fecha final exacta).
- Checklist académico “source of truth”:
  - Fuente base (existente): `brokia/thesis-hub/02_ACADEMIC_CHECKLIST.md`.
- Anexos mínimos de evidencia:
  - Referencia a normas ORT en PDFs (existente): `brokia/tesis/docs/drive-pdfs/*`.

**Owner**
- Manu (redacción técnica + arquitectura mínima) + Rodrigo (redacción formal/legal + coherencia narrativa) + JM (validación de realismo operativo).

**Risk**
- Fechas condicionales sin hora/confirmación; requisitos formales no cubiertos.

**Dependency**
- Confirmación de:
  - hora oficial de “asignación” (13/04/2026) (si aplica)
  - reglas sobre “nueva propuesta” (22/04/2026 21:00) (si aplica)
  - fecha exacta de entrega final septiembre 2026 (TBD)

---

## Phase 3 — Validation loop (post-anteproyecto → hasta septiembre 2026)

**Objective**
- Ejecutar ciclos de validación (problema/solución) con evidencia cuantitativa + cualitativa y convertirlos en resultados defendibles de tesis.

**Deliverables**
- Registro de experimentos y resultados (mínimo):
  - Baseline de tiempos por cotización / variabilidad / pasos manuales.
  - Evidencia de entrevistas y hallazgos.
  - (Si aplica) prototipo “MVP-0” o demo controlada.
- Backlog vivo priorizado por evidencia:
  - Fuente base (hub): `brokia/thesis-hub/04_BACKLOG.md`.
- Bitácora de decisiones (académica):
  - Fuentes existentes: `brokia/documentacion/*` y `brokia/documentacion/diario/*`.

**Owner**
- Manu (diseño de experimentos + medición + prototipos mínimos)
- Rodrigo (reclutamiento/entrevistas + síntesis para tesis)
- JM (operación real + datos + feedback)

**Risk**
- Falta de consistencia en recolección de evidencia (sin baseline comparable).

**Dependency**
- Acceso sostenido a operadores/brokers (JM + red de Rodrigo) y disponibilidad para mediciones repetidas.

---

## Phase 4 — Final thesis delivery (septiembre 2026 — fecha exacta TBD)

**Objective**
- Convertir evidencia + metodología + resultados en documento final (y defensa si aplica), cumpliendo formato ORT.

**Deliverables**
- Índice final + capítulos completos:
  - problema, marco, metodología, resultados, discusión, conclusiones.
- Checklist final de cumplimiento (formato/anexos/entregables):
  - Basado en PDFs ORT: `brokia/tesis/docs/drive-pdfs/*`.
- Paquete de anexos (evidencias, tablas, logs resumidos) con redacción/PII control.

**Owner**
- Manu (integración técnica + redacción final)
- Rodrigo (coherencia argumental + compliance académico)
- JM (validación de “realismo operativo” + citas/insights de dominio)

**Risk**
- Fecha final no confirmada (riesgo de planificación) + acumulación de deuda de redacción.

**Dependency**
- Confirmación oficial de fecha/hora final (septiembre 2026) + requisitos finales CIE/ORT.

---

## Mapa conceptual → Plan de validación (próximas acciones, sin fechas)

Propósito: transformar el mapa conceptual del ecosistema en un backlog de validación de **2 semanas** que alimente el anteproyecto (problema medible + innovación + factibilidad).

Próximas 5 tareas (concretas) + responsables:
1) **Revisión del mapa conceptual (global, no centrado en JM)**
   - Responsable: Manu
   - Entregable: marcar qué partes están “respaldadas por evidencia” vs “INBOX” en `brokia/thesis-hub/11_ECOSYSTEM_CONCEPT_MAP.md`.

2) **Levantamiento de flujo de renovaciones (patrones industria)**
   - Responsable: Rodrigo
   - Entregable: 2 notas breves de entrevista (corredores que no sean JM) enfocadas en renovaciones: pasos, artefactos, cuellos de botella, métricas.

3) **Levantamiento de flujo de siniestros (perspectiva correduría)**
   - Responsable: Rodrigo
   - Entregable: 1–2 notas de entrevista (no JM) + resumen de 1 página del flujo (aviso/FNOL → resolución).

4) **Diseño de medición de línea base para el Clúster 1 (captura estructurada)**
   - Responsable: Manu
   - Entregable: planilla mínima de métricas (definiciones + cómo recolectar) alineada con `ANTE_PROYECTO_ACADEMIC_CORE_V1.md`.

5) **Alineación del entorno de validación (qué se puede pilotear sin riesgo)**
   - Responsable: JM
   - Entregable: lista de 10 casos reales que puedan usarse para línea base/post‑medición + restricciones (PII, canales, qué se puede registrar).

---

## INBOX (preguntas abiertas que bloquean planificación fina)
- Confirmar fecha exacta (día/hora) de entrega final de septiembre 2026.
- Confirmar si 13/04/2026 (asignación) tiene hora oficial.
- Confirmar condiciones de 22/04/2026 21:00 (nueva propuesta): aplica/depende de qué.
