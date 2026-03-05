# Núcleo A — Cuello de botella operativo en cotización multi‑aseguradora (v0.2)

**Fecha:** 2026-03-03  
**Versión:** v0.2 (exploratoria)

---

## 1) Problema (redacción académica)
En el mercado de seguros automotores, el proceso de cotización con múltiples aseguradoras constituye un cuello de botella operativo recurrente para corredores y operadores comerciales. La solicitud de cotización exige relevar información heterogénea, validarla, adaptarla a criterios no uniformes entre compañías y sostener iteraciones con el cliente ante omisiones o ambigüedades. Esta dinámica genera tiempos de ciclo elevados, reprocesos y variabilidad en la calidad de la oferta final, afectando tanto la eficiencia interna del corredor como la experiencia del cliente. En consecuencia, el canal humano se ve tensionado por tareas de coordinación y captura de datos que no agregan valor directo, limitando la capacidad de escalar volumen de cotizaciones sin degradación del servicio.

## 2) Definición operativa (si aplica)
**“Cuello de botella en cotización multi‑aseguradora”**: incremento medible del **tiempo de ciclo** y del **retrabajo** (idas y vueltas por datos) al intentar obtener y comparar cotizaciones de más de una aseguradora, debido a heterogeneidad de requisitos de información, validaciones y re‑cotizaciones.

## 3) Hipótesis testeables (numeradas)
1. Una fracción significativa del tiempo total de una cotización se consume en **recolección/normalización de datos** y no en análisis de alternativas.
2. La **tasa de reproceso** (solicitudes de información adicional) aumenta de manera no lineal con el número de aseguradoras consultadas.
3. Existen **campos mínimos críticos** cuya ausencia explica la mayor parte de los retrasos (p. ej., uso del vehículo, conductores, zona).
4. La variabilidad entre aseguradoras en requisitos de datos incrementa el **tiempo de ciclo** y reduce la comparabilidad efectiva de propuestas.
5. Los clientes perciben el proceso como “lento” principalmente cuando no reciben un **primer feedback** dentro de una ventana temporal corta (p. ej., <2 horas).
6. Una parte relevante de las cotizaciones iniciadas se abandona por **fricción temporal** (esperas, múltiples idas y vueltas).
7. La carga operativa de cotizaciones multi‑aseguradora desplaza tiempo del corredor desde actividades de asesoramiento hacia tareas administrativas.
8. La falta de estandarización de datos provoca **errores de transcripción/interpretación** que afectan precio o condiciones ofertadas.
9. La presión por responder rápido incrementa la probabilidad de **ofertas incompletas** (menos aseguradoras, menos coberturas comparadas).
10. Los picos de demanda (horarios/días) amplifican demoras y elevan el backlog, reduciendo el ratio cotización→cierre.

## 4) Métricas a medir (por categorías)

### A) Frecuencia
- Tasa de reproceso: % cotizaciones con ≥1 solicitud de datos adicional.
- % cotizaciones abandonadas y “motivo de abandono” (si se registra).
- Cobertura de mercado: # aseguradoras incluidas por cotización / objetivo.
- Conversión: cotización→emisión.

### B) Tiempo
- Tiempo de ciclo total por cotización (inicio → entrega de opciones).
- Tiempo a primer respuesta (TTFR).
- Desvío entre tiempo estimado vs real (variabilidad operativa).

### C) Impacto
- Cotizaciones por operador por día (capacidad).
- # de interacciones necesarias para completar datos (mensajes, llamadas).

### D) Riesgo / calidad
- % de cotizaciones con errores detectados (datos inconsistentes / correcciones).

## 5) Segmento prioritario
- **Corredores pequeños/medianos** con alta carga administrativa y poca capacidad de backoffice.
- **Clientes que demandan inmediatez** (compra de vehículo, exigencias de financiación/entrega).
- Zonas con alta competencia donde la velocidad de respuesta define la captación.

## 6) Riesgos de no ser núcleo real
- Parte del mercado puede tolerar tiempos largos si el precio final es competitivo.
- Algunas aseguradoras o agregadores ya ofrecen cotización rápida, reduciendo el dolor percibido.
- El cuello de botella puede explicarse más por “falta de leads calificados” que por operación.
- El problema podría ser importante solo en picos, no en el promedio (prioridad discutible).

## 7) Diferenciación vs “CRM genérico” (cuando aplique)
- El foco está en métricas operativas de **tiempo de ciclo**, **retrabajo** y **capacidad** vinculadas al proceso de cotización multi‑aseguradora (no en “ordenar contactos”).
- La evidencia relevante no es solo registro de actividad, sino **medición de fricción por heterogeneidad** (requisitos de datos, re‑cotizaciones, cobertura efectiva comparada).

## 8) Preguntas para entrevista/encuesta (mín. 10; incluir 2 pruebas prácticas)
1. En una cotización típica, ¿qué datos se piden siempre y cuáles suelen faltar o venir incompletos?
2. ¿Cuántas idas y vueltas promedio requiere completar una cotización (mensajes/llamadas)?
3. ¿Qué porcentaje de cotizaciones necesita al menos una re‑consulta por datos faltantes?
4. Cuando cotizás con varias aseguradoras, ¿qué parte del proceso consume más tiempo (captura, normalización, seguimiento, comparación)?
5. ¿Qué diferencias entre aseguradoras (requisitos, formatos, validaciones) te generan más reproceso?
6. ¿En qué momento el cliente suele “perderse” o abandonar la cotización? ¿Por qué?
7. ¿Cuánto tarda, en promedio, la primera respuesta útil al cliente desde que inicia la consulta?
8. ¿En qué horarios/días se concentran picos y cómo afecta eso el backlog?
9. ¿Qué errores se repiten (transcripción, versión de vehículo, coberturas solicitadas) y cómo los detectan?
10. Si tuvieras que elegir 2 métricas que más te duelen hoy en cotización, ¿cuáles serían?

**Prueba práctica 1:** Elegí una cotización reciente que se haya demorado. Reconstruí el timeline (inicio → primer feedback → datos completos → entrega). ¿Cuánto tiempo tomó cada tramo?

**Prueba práctica 2:** Tomá una cotización donde hubo reproceso. Enumerá los “puntos de falta” (qué dato faltó) y cuántas interacciones adicionales generó.

## 9) Umbral de validación sugerido (Gate 1)
Se considera validado preliminarmente si, en entrevistas/mediciones:
- Aparece consistentemente en el **top 3** de dolores operativos.
- Se pueden capturar al menos **2 métricas base** con definiciones operativas claras (p. ej., tiempo de ciclo mediana/p90 y tasa de reproceso).
- Se identifican **puntos críticos** (campos mínimos) responsables de la mayor parte del retrabajo, con evidencia repetida en múltiples casos.
