# Brokia — Indice y comparativo de nucleos de problema (v0.2)

**Fecha:** 2026-03-03  
**Version:** v0.2 (exploratoria)  
**Modo:** analisis comparativo de problema nucleo (sin diseno de solucion)

---

## 1) Contexto (breve)
Este paquete documenta, en forma persistente y navegable, un analisis comparativo de **nucleos de problema** para Brokia. El objetivo es mantener separacion rigurosa entre **problema** y **solucion**, y habilitar validacion empirica con entrevistas/mediciones bajo un criterio minimo (Gate 1).

---

## 2) Indice de nucleos (archivos)
- **Nucleo C — Trazabilidad contractual:** [`nucleo-c-trazabilidad-contractual-v0.2.md`](./nucleo-c-trazabilidad-contractual-v0.2.md)
- **Nucleo A — Cotizacion multi-aseguradora:** [`nucleo-a-cotizacion-multiaseguradora-v0.2.md`](./nucleo-a-cotizacion-multiaseguradora-v0.2.md)
- **Nucleo B — Cambios / cancelaciones:** [`nucleo-b-cambios-cancelaciones-v0.2.md`](./nucleo-b-cambios-cancelaciones-v0.2.md)
- **Nucleo D — Post-siniestro / seguimiento:** [`nucleo-d-postsiniestro-seguimiento-v0.2.md`](./nucleo-d-postsiniestro-seguimiento-v0.2.md)
- **Nucleo E — Renovacion / comparacion:** [`nucleo-e-renovacion-comparacion-v0.2.md`](./nucleo-e-renovacion-comparacion-v0.2.md)

---

## 3) Resumen ejecutivo por núcleo (5–8 líneas)

### C) Trazabilidad contractual (emisión/renovación)
El proceso de emisión y renovación mediado por corredores deja decisiones y aceptaciones registradas de forma parcial, informal o dispersa. Esto dificulta reconstruir qué se decidió, por qué, cuándo y con qué información, especialmente con el paso del tiempo o con casos en paralelo. La falta de evidencia verificable incrementa retrabajo, errores de comunicación, tiempos de resolución, pérdida de continuidad en renovaciones y exposición a conflictos posteriores. El foco no es “orden” general, sino **recuperabilidad y reconstrucción de decisiones específicas** (qué cambió, quién pidió, cuándo se aceptó y bajo qué condición).

### A) Cotización multi‑aseguradora (cuello de botella operativo)
La cotización con múltiples aseguradoras exige relevar y normalizar información heterogénea y sostener iteraciones con el cliente ante omisiones/ambigüedades. La variabilidad de requisitos entre compañías eleva tiempos de ciclo, reprocesos y variabilidad de calidad en la oferta final. El canal humano queda tensionado por tareas administrativas, afectando escalabilidad y experiencia del cliente. El riesgo clave es que el dolor sea estacional (picos) o ya mitigado por portales/agregadores.

### B) Cambios de vehículo / cancelaciones (complejidad financiera)
Cambios, endosos, cancelaciones y reemisiones introducen prorrateos, recálculos, devoluciones y penalizaciones poco transparentes. La incertidumbre sobre montos y consecuencias económicas incrementa consultas, fricción y riesgo de disputas. Operativamente, el proceso es propenso a demoras y correcciones, con impacto potencial en retención y continuidad de cobertura. El riesgo es que sea de baja frecuencia o muy dependiente de política de aseguradoras.

### D) Post‑siniestro (seguimiento y pendientes)
Tras un siniestro, el asegurado enfrenta múltiples puntos de contacto, requisitos documentales y tiempos inciertos, requiriendo seguimiento activo. Para el corredor, esto se traduce en coordinación sostenida y gestión de pendientes, con demoras, reprocesos y conflictos cuando el cliente percibe falta de acompañamiento. Suele dominar la pregunta “en qué está” y la falta de visibilidad de hitos. El riesgo es alta dependencia de terceros y competencia fuerte (apps/portales).

### E) Renovación (comparación de condiciones)
La renovación es crítica para retención y continuidad de cobertura, pero suele operarse con asimetría de información: el cliente compara por precio o inercia, sin comprender cambios de condiciones. Para el corredor, implica revisar tarifas/condiciones, ajustar coberturas al perfil y gestionar en ventanas acotadas. La falta de comparación accesible puede inducir decisiones subóptimas y churn. El riesgo es baja predisposición del cliente a comparar y comparabilidad limitada por falta de estandarización.

---

## 4) Tabla comparativa final (A/B/C/D/E)

### 4.1 Criterios y escala (cualitativa)
- **Medibilidad (Alta/Media/Baja):** facilidad de capturar línea base y post‑medición con métricas observables (tiempo, frecuencia, interacciones, impacto).
- **Diferenciación (Alta/Media/Baja):** claridad con que el problema exige capacidades específicas del dominio (no reducibles a “orden” general).
- **Complejidad futura (Alta/Media/Baja):** riesgo de que el núcleo arrastre variabilidad, dependencias externas y casos borde que dificulten sostenerlo como foco.
- **Competencia existente (Alta/Media/Baja):** presencia de soluciones parciales en mercado (portales, apps, multicotizadores) que ya mitiguen el dolor.
- **Riesgo de dispersión (Alta/Media/Baja):** probabilidad de que el núcleo empuje a abarcar múltiples subprocesos antes de validar.

| Núcleo | Medibilidad | Diferenciación | Complejidad futura | Competencia existente | Riesgo de dispersión |
|---|---|---|---|---|---|
| **A) Cotización multi‑aseguradora** | Alta | Media | Media | Alta | Media |
| **B) Cambios / cancelaciones** | Media | Media | Alta | Media | Media‑Alta |
| **C) Trazabilidad contractual** | Alta | Alta | Media | Media | Media |
| **D) Post‑siniestro / seguimiento** | Media | Media | Alta | Alta | Alta |
| **E) Renovación / comparación** | Alta | Media | Media | Alta | Media |

---

## 5) Criterio Gate 1 (validación preliminar)
Para considerar que un núcleo de problema está “cerrado” a nivel anteproyecto (pre‑solución), se establece como criterio mínimo:
- Identificación del actor principal (p. ej., corredor independiente vs agencia).
- Delimitación del punto exacto del proceso donde ocurre el dolor.
- Existencia de al menos **2 métricas base** capturables en operación real (p. ej., tiempo por cotización, idas y vueltas por datos, tasa de caída/abandono).
- Evidencia trazable: registros de timestamps y conteo de interacciones por caso (N casos, T semanas), para comparación posterior.

---

## 6) Decisión provisional
**Pendiente de validar.** La elección del núcleo debe cerrarse con evidencia: si un núcleo no aparece en el **top 3** de dolores y/o no se logra instrumentación métrica mínima en entrevistas/mediciones, debe re‑evaluarse.
