# Brokia — Validación de Núcleo de Problema (Revisión académica) (v0.1)

**Fecha:** 2026-03-04  
**Estado:** borrador para revisión académica (Enrique)  
**Alcance:** formulación y validación preliminar del núcleo de problema (pre‑diseño)

---

## 1. Introducción y contexto
Brokia se enmarca en el dominio de intermediación de seguros automotores y se propone, en esta etapa, **cerrar un núcleo de problema** defendible (delimitado, medible y prioritario) antes de avanzar a etapas de diseño.

En el contexto actual del mercado, los procesos de cotización, emisión, renovación y gestiones postventa se realizan mediante una combinación de mensajería, llamadas y portales de compañías, con heterogeneidad de requisitos y dependencia de múltiples actores. Esta realidad genera fricciones operativas, asimetrías de información y riesgos de interpretación o conflicto.

---

## 2. Problema general identificado
El problema general que motiva el trabajo puede expresarse como la existencia de **fricciones estructurales** en la intermediación de seguros automotores que afectan simultáneamente:
- la eficiencia operativa (tiempos de ciclo, retrabajo, capacidad),
- la calidad de la gestión (claridad, continuidad, consistencia de decisiones),
- y la exposición a conflictos o incertidumbre a lo largo del ciclo de vida (emisión, renovación, postventa).

Dado que este “problema general” es amplio, se realiza una descomposición en **núcleos alternativos** (A/B/C/D/E) para seleccionar un foco único mediante evidencia.

---

## 3. Marco conceptual actualizado (incluyendo Broker como actor)
El ecosistema se modela con actores primarios: **cliente (asegurado)**, **corredor**, **broker** (intermediario técnico‑comercial), **compañía de seguros** y **regulador**.

Se incorpora formalmente el **broker** como actor diferenciado del corredor y de la compañía: su participación es opcional pero frecuente, y actúa como canal operativo, técnico y comercial entre corredor y compañía, con un ejecutivo asignado al corredor.

Relación conceptual dominante:

Cliente → Corredor → Broker (frecuente) → Compañía de Seguros

La presencia del broker es relevante porque parte del tiempo de ciclo, la variabilidad de respuesta y algunos retrabajos pueden acumularse en eslabones fuera del control directo del corredor (broker–compañía), lo cual debe considerarse en la definición de métricas y en la interpretación de resultados.

---

## 4. Núcleos evaluados (A/B/C/D/E) — resumen sintético
A continuación se presentan los núcleos evaluados como alternativas de foco. En todos los casos, el objetivo es **validar el problema**, no diseñar soluciones.

### Núcleo A — Cotización multi‑aseguradora
Se refiere al cuello de botella operativo al cotizar con múltiples compañías: captura/normalización de datos, reprocesos por faltantes, variabilidad de requisitos entre aseguradoras y aumento del tiempo de ciclo. Puede impactar conversión y capacidad, especialmente bajo picos de demanda.

### Núcleo B — Cambios / cancelaciones
Se centra en la complejidad financiera y administrativa asociada a endosos, cambios de vehículo y cancelaciones: prorrateos, devoluciones, penalizaciones, correcciones y potenciales disputas por montos. El dolor puede ser relevante aun si su frecuencia es menor, por el costo de coordinación y la sensibilidad del cliente a resultados económicos.

### Núcleo C — Trazabilidad contractual
Se centra en la falta de evidencia recuperable sobre decisiones y aceptaciones (qué/por qué/cuándo/bajo qué condición). La información queda dispersa entre canales y documentos, dificultando reconstrucción posterior, continuidad en renovaciones y manejo de casos en paralelo o con traspaso entre personas.

### Núcleo D — Post‑siniestro / seguimiento
Se centra en el seguimiento de casos post‑siniestro: hitos, pendientes documentales, tiempos entre etapas, consultas recurrentes de estado y escalaciones. Presenta alta dependencia de terceros (broker/compañía/taller/perito), por lo que requiere especial cuidado metodológico para delimitar “dónde se acumula el tiempo”.

### Núcleo E — Renovación / comparación
Se centra en la renovación y la dificultad de comparar cambios de condiciones (prima, deducibles, exclusiones, servicios), con efectos en retención, churn y concentración estacional. El riesgo principal es que el cliente compare solo por precio o inercia y que la comparabilidad sea limitada por falta de estandarización.

---

## 5. Metodología Gate 1A (corredores) — explicación resumida
Gate 1A valida núcleos desde la perspectiva operativa del corredor mediante entrevistas estructuradas (30–40 min). El instrumento fuerza tres elementos:

1) **Priorización Top 3**: el entrevistado declara sus tres dolores principales “hoy”.
2) **Evidencia concreta**: por lo menos un ejemplo reciente por dolor priorizado.
3) **Medibilidad mínima**: al menos dos métricas base estimables por núcleo candidato.

La selección se realiza por conteo de frecuencia de aparición en Top 3 (sobre N entrevistas) y por cumplimiento simultáneo de requisitos de medibilidad y ejemplos concretos.

---

## 6. Metodología Gate 1B (clientes) — explicación resumida
Gate 1B valida fricciones desde la perspectiva cliente mediante encuesta estructurada de <5 minutos. El objetivo es estimar prevalencias (porcentaje) de:
- confusión percibida por momento (cotización, emisión, renovación, cambios/cancelaciones, siniestro),
- claridad percibida de condiciones/coberturas,
- confianza en que el cliente comprendió lo contratado,
- y frecuencia de malentendidos o sorpresas.

Se adopta un criterio exploratorio de confusión significativa (respuestas 4–5 en escala 1–5) para identificar momentos de mayor relevancia y cruzarlos con núcleos A/B/C/D/E.

---

## 7. Criterios de decisión y umbrales
La decisión de núcleo candidato se apoya en triangulación Gate 1A + Gate 1B:

- **Gate 1A (corredores):** el núcleo debe aparecer con consistencia en el Top 3 y sostenerse con ejemplos recientes y al menos dos métricas base.
- **Gate 1B (clientes):** los momentos asociados deben mostrar confusión/fricción relevante o, si no lo hacen, debe justificarse que el dolor es predominantemente operativo y no necesariamente visible para el cliente.

Umbrales orientativos para Gate 1A (según cantidad de entrevistas):
- N=5: Top 3 en al menos 3 entrevistas.
- N=8: Top 3 en al menos 5 entrevistas.
- N=10: Top 3 en al menos 6 entrevistas.

Umbral exploratorio para Gate 1B:
- >=40% de confusión 4–5 en un momento: relevante.

---

## 8. Riesgos metodológicos
Los riesgos principales considerados en esta etapa son:

1) **Dispersión**: intentar cubrir múltiples subprocesos sin cerrar un núcleo medible.
2) **Problema no operacionalizable**: formular dolores sin definición métrica y sin línea base.
3) **Sesgo por muestra o perfil**: entrevistas concentradas en un único tipo de corredor o contexto.
4) **Atribución incorrecta por multi‑actor**: especialmente con presencia de broker, parte del dolor puede originarse fuera del control del corredor (broker–compañía). Esto exige registrar, en ejemplos concretos, en qué eslabón se acumula el tiempo y por qué.
5) **Confusión terminológica**: mapear dolores mixtos a núcleos sin reglas claras. Se mitiga con guía de mapeo y regla 1 ítem Top 3 = 1 núcleo dominante.

---

## 9. Estado actual y próximos pasos
**Estado actual:** núcleos A/B/C/D/E definidos y documentados; metodologías Gate 1A (corredores) y Gate 1B (clientes) definidas; instrumentos listos para ejecución.

**Próximos pasos sugeridos:**
1) Ejecutar 2 entrevistas piloto Gate 1A y ajustar wording mínimo si corresponde.
2) Ejecutar el set inicial de entrevistas Gate 1A (N objetivo: 5/8/10 según disponibilidad) y completar conteo Top 3.
3) Desplegar encuesta Gate 1B, recolectar N suficiente y completar plantilla de análisis.
4) Triangular hallazgos y registrar decisión provisional de núcleo (o re‑evaluación) con evidencia.

---

### Referencias a anexos
Este documento evita detallar instrumentos completos. Los siguientes elementos se presentan en el anexo metodológico:
- metodología Gate 1A completa, guion y plantillas,
- guía de mapeo de núcleos,
- metodología Gate 1B completa, encuesta y plantilla de análisis,
- mapa conceptual actualizado (v0.2 con Broker),
- tabla comparativa de núcleos y criterios Gate 1.
