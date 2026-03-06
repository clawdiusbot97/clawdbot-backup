# Brokia — Validacion de Nucleo de Problema (Revision academica) (v0.1)

**Fecha:** 2026-03-04  
**Estado:** borrador para revision academica (Enrique)  
**Alcance:** formulacion y validacion preliminar del nucleo de problema (pre-diseno)

---

## 1. Introduccion y contexto
Brokia se enmarca en el dominio de intermediacion de seguros automotores y se propone, en esta etapa, **cerrar un nucleo de problema** defendible (delimitado, medible y prioritario) antes de avanzar a etapas de diseno.

En el contexto actual del mercado, los procesos de cotizacion, emision, renovacion y gestiones postventa se realizan mediante una combinacion de mensajeria, llamadas y portales de companias, con heterogeneidad de requisitos y dependencia de multiples actores. Esta realidad genera fricciones operativas, asimetrias de informacion y riesgos de interpretacion o conflicto.

---

## 2. Problema general identificado
El problema general que motiva el trabajo puede expresarse como la existencia de **fricciones estructurales** en la intermediacion de seguros automotores que afectan simultaneamente:
- la eficiencia operativa (tiempos de ciclo, retrabajo, capacidad),
- la calidad de la gestion (claridad, continuidad, consistencia de decisiones),
- y la exposicion a conflictos o incertidumbre en el ciclo de vida (emision, renovacion, postventa).

Dado que este “problema general” es amplio, se realiza una descomposicion en **nucleos alternativos** (A/B/C/D/E) para seleccionar un foco unico mediante evidencia.

---

## 3. Marco conceptual actualizado (incluyendo Broker)
El ecosistema se modela con actores primarios: **cliente (asegurado)**, **corredor**, **broker** (intermediario tecnico-comercial), **compania de seguros** y **regulador**.

Se incorpora formalmente el **broker** como actor diferenciado del corredor y de la compania: su participacion es opcional pero frecuente, y actua como canal operativo, tecnico y comercial entre corredor y compania, con un ejecutivo asignado al corredor.

Relaciones conceptuales dominantes:

Cliente → Corredor → Broker (frecuente) → Compania de Seguros

La presencia del broker es relevante porque parte del tiempo de ciclo, la variabilidad de respuesta y algunos retrabajos pueden acumularse en eslabones fuera del control directo del corredor (broker–compania), lo cual debe considerarse en la definicion de metricas y en la interpretacion de resultados.

---

## 4. Nucleos evaluados (A/B/C/D/E) — resumen sintetico

A continuacion se presentan los nucleos evaluados como alternativas de foco. En todos los casos, el objetivo es **validar el problema**, no disenar soluciones.

### Nucleo A — Cotizacion multi-aseguradora
Se refiere al cuello de botella operativo al cotizar con multiples companias: captura/normalizacion de datos, reprocesos por faltantes, variabilidad de requisitos entre aseguradoras y aumento del tiempo de ciclo. Puede impactar conversion y capacidad, especialmente bajo picos de demanda.

### Nucleo B — Cambios / cancelaciones
Se centra en la complejidad financiera y administrativa asociada a endosos, cambios de vehiculo y cancelaciones: prorrateos, devoluciones, penalizaciones, correcciones y potenciales disputas por montos. El dolor puede ser relevante aun si su frecuencia es menor, por el costo de coordinacion y la sensibilidad del cliente a resultados economicos.

### Nucleo C — Trazabilidad contractual
Se centra en la falta de evidencia recuperable sobre decisiones y aceptaciones (que/por que/cuando/bajo que condicion). La informacion queda dispersa entre canales y documentos, dificultando reconstruccion posterior, continuidad en renovaciones y manejo de casos en paralelo o con traspaso entre personas.

### Nucleo D — Post-siniestro / seguimiento
Se centra en el seguimiento de casos post-siniestro: hitos, pendientes documentales, tiempos entre etapas, consultas recurrentes de estado y escalaciones. Presenta alta dependencia de terceros (broker/compania/taller/perito), por lo que requiere especial cuidado metodologico para delimitar “donde se acumula el tiempo”.

### Nucleo E — Renovacion / comparacion
Se centra en la renovacion y la dificultad de comparar cambios de condiciones (prima, deducibles, exclusiones, servicios), con efectos en retencion, churn y concentracion estacional. El riesgo principal es que el cliente compare solo por precio o inercia y que la comparabilidad sea limitada por falta de estandarizacion.

---

## 5. Metodologia Gate 1A (corredores) — explicacion resumida
Gate 1A valida nucleos desde la perspectiva operativa del corredor mediante entrevistas estructuradas (30–40 min). El instrumento fuerza tres elementos:

1) **Priorizacion Top 3**: el entrevistado declara sus tres dolores principales “hoy”.
2) **Evidencia concreta**: por lo menos un ejemplo reciente por dolor priorizado.
3) **Medibilidad minima**: al menos dos metricas base estimables por nucleo candidato.

La seleccion se realiza por conteo de frecuencia de aparicion en Top 3 (sobre N entrevistas) y por cumplimiento simultaneo de requisitos de medibilidad y ejemplos concretos.

---

## 6. Metodologia Gate 1B (clientes) — explicacion resumida
Gate 1B valida fricciones desde la perspectiva cliente mediante encuesta estructurada de <5 minutos. El objetivo es estimar prevalencias (porcentaje) de:
- confusion percibida por momento (cotizacion, emision, renovacion, cambios/cancelaciones, siniestro),
- claridad percibida de condiciones/coberturas,
- confianza en que el cliente comprendio lo contratado,
- y frecuencia de malentendidos o sorpresas.

Se adopta un criterio exploratorio de confusion significativa (respuestas 4–5 en escala 1–5) para identificar momentos de mayor relevancia y cruzarlos con nucleos A/B/C/D/E.

---

## 7. Criterios de decision y umbrales
La decision de nucleo candidato se apoya en triangulacion Gate 1A + Gate 1B:

- **Gate 1A (corredores):** el nucleo debe aparecer con consistencia en el Top 3 y sostenerse con ejemplos recientes y al menos dos metricas base.
- **Gate 1B (clientes):** los momentos asociados deben mostrar confusion/friccion relevante o, si no lo hacen, debe justificarse que el dolor es predominantemente operativo y no necesariamente visible para cliente.

Umbrales orientativos para Gate 1A (segun cantidad de entrevistas):
- N=5: Top 3 en al menos 3 entrevistas.
- N=8: Top 3 en al menos 5 entrevistas.
- N=10: Top 3 en al menos 6 entrevistas.

Umbral exploratorio para Gate 1B:
- >=40% de confusion 4–5 en un momento: relevante.

---

## 8. Riesgos metodologicos
Los riesgos principales considerados en esta etapa son:

1) **Dispersión**: intentar cubrir multiples subprocesos sin cerrar un nucleo medible.
2) **Problema no operacionalizable**: formular dolores sin definicion metrica y sin linea base.
3) **Sesgo por muestra o perfil**: entrevistas concentradas en un unico tipo de corredor o contexto.
4) **Atribucion incorrecta por multi-actor**: especialmente con presencia de broker, parte del dolor puede originarse fuera del control del corredor (broker–compania). Esto exige registrar, en ejemplos concretos, en que eslabon se acumula el tiempo y por que.
5) **Confusion terminologica**: mapear dolores mixtos a nucleos sin reglas claras. Se mitiga con guia de mapeo y regla 1 item Top 3 = 1 nucleo dominante.

---

## 9. Estado actual y proximos pasos
**Estado actual:** nucleos A/B/C/D/E definidos y documentados; metodologia Gate 1A (corredores) y Gate 1B (clientes) definidas; instrumentos listos para ejecucion.

**Proximos pasos sugeridos:**
1) Ejecutar 2 entrevistas piloto Gate 1A y ajustar wording minimo si corresponde.
2) Ejecutar el set inicial de entrevistas Gate 1A (N objetivo: 5/8/10 segun disponibilidad) y completar conteo Top 3.
3) Desplegar encuesta Gate 1B, recolectar N suficiente y completar plantilla de analisis.
4) Triangular hallazgos y registrar decision provisional de nucleo (o re-evaluacion) con evidencia.

---

### Referencias a anexos
Este documento evita detallar instrumentos completos. Los siguientes elementos se presentan en el anexo metodologico:
- metodologia Gate 1A completa, guion y plantillas,
- guia de mapeo de nucleos,
- metodologia Gate 1B completa, encuesta y plantilla de analisis,
- mapa conceptual actualizado,
- tabla comparativa de nucleos y criterios Gate 1.
