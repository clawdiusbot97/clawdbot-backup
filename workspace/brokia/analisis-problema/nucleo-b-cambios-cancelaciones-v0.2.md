# Núcleo B — Complejidad financiera en cambios de vehículo y cancelaciones (v0.2)

**Fecha:** 2026-03-03  
**Versión:** v0.2 (exploratoria)

---

## 1) Problema (redacción académica)
Las modificaciones de pólizas automotor (cambio de vehículo, endosos, cancelaciones y reemisiones) introducen una complejidad financiera y administrativa que suele ser poco transparente para el asegurado y altamente demandante para el corredor. Estas operaciones implican prorrateos, recálculos de prima, eventuales penalizaciones, devoluciones, ajustes por siniestralidad, y diferencias de condiciones según normativa y políticas de cada aseguradora. La falta de claridad sobre reglas, montos y consecuencias económicas incrementa la incertidumbre del cliente, eleva la carga de consultas y genera fricciones operativas. El resultado es un proceso propenso a demoras y disputas, con riesgo de insatisfacción, pérdida de continuidad (churn) y errores que pueden impactar en la cobertura efectiva.

## 2) Definición operativa (si aplica)
**“Complejidad financiera en cambios/cancelaciones”**: dificultad (medible) para estimar, explicar y ejecutar ajustes económicos asociados a modificaciones de póliza (prorrateos, devoluciones, penalizaciones), reflejada en tiempos de resolución, número de interacciones, correcciones y reclamos.

## 3) Hipótesis testeables (numeradas)
1. Una proporción relevante de consultas post‑venta se concentra en **cambios de vehículo** y **cancelaciones**.
2. La principal fuente de fricción es la **incertidumbre del cliente** sobre montos finales (devolución/ajuste) y plazos.
3. La tasa de reclamos aumenta cuando no existe una explicación consistente del **criterio de prorrateo** o penalización.
4. El tiempo de resolución de cambios/cancelaciones es mayor que el de emisión inicial por dependencia de validaciones internas/externas.
5. Operadores cometen errores por reglas heterogéneas, elevando la tasa de **correcciones** y re-trabajo.
6. Los cambios de vehículo elevan el riesgo de **periodos de cobertura incompleta** por desfase temporal (altas/bajas).
7. La falta de trazabilidad documental incrementa disputas sobre “lo solicitado” vs “lo ejecutado”.
8. La experiencia de post‑venta influye más en retención que el precio inicial de la póliza.
9. En cancelaciones, la falta de claridad del costo de salida incrementa la percepción de “prácticas abusivas”.
10. El problema es más intenso en clientes con pagos fraccionados (cuotas) y en pólizas con beneficios/bonificaciones condicionadas.

## 4) Métricas a medir (por categorías)

### A) Frecuencia
- # de solicitudes de cambio/cancelación por 100 pólizas activas/mes.
- Tasa de reclamo asociada a endosos/cancelaciones.
- % casos con corrección posterior (errores de cálculo / documentación).

### B) Tiempo
- Tiempo de resolución (solicitud → confirmación).
- # de interacciones por caso.

### C) Impacto
- Monto promedio de ajuste/devolución y dispersión (desviación estándar).
- Tasa de retención post‑operación (90 días).

### D) Riesgo / calidad
- Incidentes de “gap de cobertura” detectados (si aplica).
- % clientes que reportan “no entendí el cálculo” (encuesta corta).

## 5) Segmento prioritario
- Clientes que **cambian de vehículo con frecuencia** (familias, flotas pequeñas, compra-venta).
- Clientes sensibles a caja (cuotas), para quienes un ajuste inesperado es crítico.
- Corredores que gestionan alto volumen de post‑venta sin estructura administrativa formal.

## 6) Riesgos de no ser núcleo real
- Puede ser un problema de baja frecuencia (importante, pero no masivo).
- Algunas aseguradoras tienen procesos estandarizados y portales que ya reducen fricción.
- El dolor puede recaer más en el corredor que en el cliente (prioridad depende del objetivo).
- Puede variar mucho por país/aseguradora, dificultando generalización como “núcleo”.

## 7) Diferenciación vs “CRM genérico” (cuando aplique)
- El núcleo no es “gestionar tareas” en abstracto: es la **opacidad y variabilidad** del cálculo/explicación de ajustes económicos y sus efectos en experiencia, tiempos y reclamos.
- La evidencia prioritaria es económica y de proceso: montos, dispersiones, tiempos, correcciones y fricción por comprensión.

## 8) Preguntas para entrevista/encuesta (mín. 10; incluir 2 pruebas prácticas)
1. ¿Con qué frecuencia recibís solicitudes de cambio de vehículo, endosos o cancelaciones?
2. ¿Qué parte del proceso genera más fricción: cálculo, explicación al cliente, o ejecución con la aseguradora?
3. ¿Qué preguntas repiten más los clientes sobre prorrateos, devoluciones o penalizaciones?
4. ¿Cuánto tiempo promedio toma cerrar un cambio/cancelación desde la solicitud?
5. ¿Qué factores disparan correcciones (reglas distintas, documentación faltante, errores de interpretación)?
6. ¿Qué tan frecuente es el reclamo del tipo “yo entendí otra cosa” en este tipo de operaciones?
7. ¿Cómo se maneja el riesgo de quedar con cobertura incompleta durante el cambio?
8. ¿Qué aseguradoras o tipos de póliza generan más complejidad y por qué?
9. ¿Qué efecto tiene una mala experiencia en un cambio/cancelación sobre la renovación o continuidad del cliente?
10. Si pudieras medir solo 2 cosas por un mes para entender este dolor, ¿cuáles elegirías?

**Prueba práctica 1:** Tomá un caso real de cambio/cancelación reciente. ¿Cuál fue el monto final de ajuste/devolución y cuántas interacciones requirió?

**Prueba práctica 2:** Tomá un caso donde hubo reclamo por el cálculo. Reconstruí el criterio aplicado y el punto exacto donde el cliente no lo comprendió.

## 9) Umbral de validación sugerido (Gate 1)
Se considera validado preliminarmente si:
- Aparece consistentemente en el **top 3** de dolores post‑venta.
- Se pueden capturar al menos **2 métricas base** (p. ej., tiempo de resolución y % correcciones/reclamos) en una ventana de medición.
- Se identifican patrones repetidos de incomprensión/reclamo asociados a criterios de cálculo o comunicación de consecuencias económicas.
