# Núcleo E — Renovación y comparación de condiciones (v0.2)

**Fecha:** 2026-03-03  
**Versión:** v0.2 (exploratoria)

---

## 1) Problema (redacción académica)
La renovación de pólizas automotor constituye un momento crítico del ciclo de vida del seguro en el que se materializa la retención del cliente y la continuidad de cobertura. Sin embargo, el proceso suele caracterizarse por asimetrías de información: el asegurado enfrenta dificultades para comparar adecuadamente condiciones, exclusiones, deducibles y servicios, y tiende a decidir con base en precio o inercia. Para el corredor, la renovación implica revisar cambios en tarifas, detectar variaciones contractuales, ajustar coberturas al perfil actual del cliente y gestionar múltiples interacciones en ventanas temporales acotadas. La ausencia de un análisis comparativo accesible y consistente promueve decisiones subóptimas, potencial infraaseguramiento y churn hacia alternativas percibidas como más convenientes, incluso cuando no lo son en términos de cobertura real.

## 2) Definición operativa (si aplica)
**“Renovación y comparación de condiciones”**: capacidad (medible) de identificar y comunicar cambios relevantes entre periodos (prima, deducibles, exclusiones, servicios) y de sostener una comparación mínima entre alternativas, reflejada en tasa de renovación, churn, anticipación de contacto, interacciones y reclamos por malentendidos de cobertura.

## 3) Hipótesis testeables (numeradas)
1. Una porción significativa de clientes renueva por inercia sin comprender cambios de condiciones.
2. El churn en renovación está más asociado a incrementos de prima percibidos como injustificados que a cambios de cobertura.
3. Los clientes no disponen de herramientas para comparar exclusiones/deducibles y por eso comparan solo precio.
4. La carga operativa de renovaciones se concentra en un período corto, generando cuellos de botella estacionales.
5. Un resumen claro de cambios (prima, deducible, coberturas) reduce consultas y mejora retención.
6. La tasa de reclamo post‑siniestro aumenta cuando el cliente renovó sin entender exclusiones o deducibles.
7. Clientes con siniestros recientes o cambios de riesgo (nuevo conductor, nueva zona) requieren ajustes que no se realizan por falta de revisión.
8. La posibilidad de comparar condiciones entre aseguradoras aumenta la probabilidad de migración, pero también la satisfacción si se mantiene transparencia.
9. La retención mejora cuando existe contacto previo a vencimiento con suficiente anticipación.
10. La “calidad” de la renovación (adecuación cobertura‑perfil) correlaciona con la duración del vínculo con el corredor.

## 4) Métricas a medir (por categorías)

### A) Frecuencia
- Tasa de renovación (% pólizas que continúan).
- Tasa de churn en ventana de renovación (y motivo declarado).
- % renovaciones con comparación explícita (si se registra) vs renovación automática.

### B) Tiempo
- Anticipación promedio del primer contacto (días antes del vencimiento).
- # de interacciones por renovación.

### C) Impacto
- Variación de prima en renovación (%).
- Persistencia: duración media del cliente (meses/años).
- NPS post‑renovación / satisfacción 1–5.

### D) Riesgo / calidad
- Reclamos/insatisfacción por “no sabía que no cubría” (proxy).

## 5) Segmento prioritario
- Clientes con baja alfabetización financiera/aseguradora (alto riesgo de mala elección).
- Corredores con cartera grande y ventana de renovación concentrada.
- Clientes sensibles a precio por contexto económico, donde pequeños cambios impactan decisión.

## 6) Riesgos de no ser núcleo real
- El mercado puede estar dominado por renovaciones automáticas y baja predisposición a comparar.
- Competidores (bancos/insurtechs) ya atacan fuerte la renovación con campañas de precio.
- La comparabilidad real de condiciones puede ser limitada por falta de estandarización (difícil medir).
- Puede derivar en un problema más “comercial” que “operativo”, según enfoque de tesis.

## 7) Diferenciación vs “CRM genérico” (cuando aplique)
- El núcleo no es “recordar vencimientos” únicamente, sino reducir asimetría de información en renovación mediante comparación mínima y trazabilidad de cambios relevantes (prima/condiciones).
- La evidencia clave se expresa en churn/retención, anticipación de contacto, cantidad de interacciones y reclamos por comprensión de cobertura.

## 8) Preguntas para entrevista/encuesta (mín. 10; incluir 2 pruebas prácticas)
1. ¿Qué porcentaje de tu cartera renueva automáticamente y qué porcentaje requiere gestión activa?
2. ¿Cuáles son las razones más frecuentes de churn en renovación (precio, mala experiencia, cobertura, falta de contacto)?
3. ¿Con cuánta anticipación empezás a contactar al cliente antes del vencimiento?
4. ¿Qué cambios de condiciones generan más confusión (deducibles, exclusiones, servicios)?
5. ¿Los clientes comparan por precio, por cobertura, o por confianza? ¿Cómo lo observás?
6. ¿Cuántas interacciones promedio requiere cerrar una renovación?
7. ¿Qué tan común es que el cliente diga “no sabía que no cubría” luego de renovar?
8. ¿Cómo impacta un siniestro reciente en la decisión de renovar y en la conversación?
9. En tu experiencia, ¿qué información mínima debería entender un cliente para decidir una renovación con criterio?
10. Si tuvieras que elegir 2 métricas para monitorear la “salud” de renovaciones, ¿cuáles serían?

**Prueba práctica 1:** Tomá 3 renovaciones recientes (1 simple, 1 con churn, 1 con discusión por condiciones). Reconstruí motivo y timeline: ¿qué pasó y cuándo?

**Prueba práctica 2:** Tomá una renovación donde hubo aumento de prima. ¿Cuál fue el argumento del cliente y qué información faltó para sostener la decisión?

## 9) Umbral de validación sugerido (Gate 1)
Se considera validado preliminarmente si:
- Aparece consistentemente en el **top 3** de dolores del ciclo de vida.
- Se pueden capturar al menos **2 métricas base** (p. ej., tasa de churn y anticipación de contacto o # interacciones) con definiciones operativas claras.
- Se detectan patrones repetidos de decisiones subóptimas por asimetría de información (comparación por precio/inercia, reclamos por comprensión de cobertura).
