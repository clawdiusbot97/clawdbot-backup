# Anteproyecto v1 — Brokia (borrador 1, contenido)

> Nota: este borrador contiene **solo contenido**. Los requisitos de formato de entrega final (Docs 302/303/306) **no aplican al anteproyecto**.

---

## A) Resumen ejecutivo (máx. 200 palabras)

El ecosistema de correduría de seguros automotores presenta fricciones sistémicas que afectan simultáneamente a clientes/asegurados, corredurías y aseguradoras. En particular, la captura desestructurada de datos, la fragmentación de portales por aseguradora, la comparación manual de cotizaciones y la doble carga de información entre cotización y emisión generan retrabajo, demoras, errores y una brecha de confianza en la recomendación del corredor.

Brokia se plantea como un proyecto emprendedor aplicado: diseñar e implementar una capa operativa que permita (i) captura estructurada conversacional con completitud verificable y (ii) una “memoria del corredor” basada en casos, con trazabilidad y registro de decisiones. La validación se realizará en un entorno real con un corredor actuando como cliente/usuario experto, utilizado únicamente como **ambiente de validación**, sin centrar el problema en un caso individual.

El aporte académico se sostiene en un enfoque medible: línea base → intervención (MVP) → post‑medición, con métricas primarias de tiempo de ciclo, retrabajo y completitud/calidad de datos.

---

## B) Contexto y problema (visión ecosistema industria)

### Actores (visión industria)

El ecosistema está compuesto por: el asegurado/cliente (tomador), el corredor/productor asesor (correduría), la aseguradora y el regulador/supervisor. A su alrededor intervienen actores de soporte, como el equipo operativo de la correduría, peritos/tasadores/inspectores, talleres/proveedores de servicio, bancos/financieras (cuando hay financiación) y la capa tecnológica (portales, mensajería, correo, planillas, CRM).

### Flujos de punta a punta (alto nivel)

En términos de ciclo de vida, se considera el flujo general: captura del lead → cotización → emisión → renovaciones → siniestros → servicio/endosos.

INBOX: el detalle operacional de renovaciones, siniestros y servicio/endosos debe respaldarse con evidencia específica (entrevistas/notas), ya que actualmente se encuentra identificado como faltante.

### Fricciones (operativas, información y regulatorias)

Las fricciones principales se agrupan en:

- Captura desestructurada por mensajería: obliga a interpretar información y pedir faltantes, generando retrabajo y demoras.
- Fragmentación por aseguradora: cada aseguradora solicita campos en formatos y secuencias distintas, lo que obliga a “traducir” información.
- Multi‑portales: interfaces y credenciales separadas por aseguradora elevan el costo por cotización.
- Comparación manual: consolidar opciones para el cliente suele hacerse de forma artesanal, con riesgo de error u omisiones.
- Doble carga: la información ingresada para cotizar suele reingresarse para emitir.
- Asimetría de información: el cliente no puede verificar fácilmente si la opción recomendada es la “mejor” dentro del mercado.
- Trazabilidad y conservación de registros: en ausencia de herramientas, la documentación queda dispersa y depende de prácticas manuales.

### Tensiones (por qué el problema persiste)

El problema persiste por tensiones estructurales:

- Eficiencia/volumen vs cumplimiento/trazabilidad: documentar compite con el tiempo de atención y con la presión por volumen.
- Personalización vs estandarización: los clientes son heterogéneos y las aseguradoras requieren datos distintos; no existe un formato universal.
- Fragmentación del mercado: incentivos competitivos sostienen sistemas propietarios y dificultan la interoperabilidad.

---

## C) Oportunidad emprendedora + diferencial (2 clústeres → hipótesis de producto)

Se seleccionan exactamente 2 clústeres y se formulan como hipótesis:

### Hipótesis 1 — Captura estructurada + puntaje de completitud (conversacional)

**Hipótesis**: una captura conversacional guiada, que produzca datos estructurados con completitud verificable, reduce retrabajo y acelera el pasaje a estado “cotizable”, sin deteriorar la experiencia del cliente.

**Por qué ahora**: la presión competitiva por eficiencia y la madurez de prácticas de gobernanza de datos hacen viable priorizar la calidad y trazabilidad desde el inicio del flujo.

**Diferencial**: no es un “formulario”; es una captura nativa del flujo de comunicación que genera evidencia operativa reutilizable.

### Hipótesis 2 — “Memoria del corredor” (casos + trazabilidad)

**Hipótesis**: una memoria basada en casos, con registro de decisiones y trazabilidad mínima, mejora la consistencia de la recomendación, reduce aclaraciones posteriores y habilita reutilización de conocimiento sin aumentar el riesgo operativo.

**Por qué ahora**: la necesidad de gobernanza, privacidad y auditabilidad vuelve insuficientes los sistemas basados únicamente en memoria personal y documentación dispersa.

**Diferencial**: “memoria con responsabilidad”: cada recomendación queda documentada con su racional y evidencia asociada.

---

## D) Objetivos medibles

Se definen métricas con targets a establecer luego de medir la línea base. Los objetivos se expresarán como % de mejora vs línea base.

### Métricas primarias (3)

1) **Tiempo de ciclo a primera cotización**
- Definición: tiempo desde el primer contacto/lead hasta el envío de la primera cotización utilizable.
- Cómo se mide: timestamps (inicio del caso y entrega de cotización).

2) **Retrabajo por caso de cotización**
- Definición: cantidad de interacciones asociadas a faltantes/correcciones.
- Cómo se mide: conteo de mensajes/eventos etiquetados como “pedido de faltante” o “corrección”.

3) **Completitud/calidad del dataset mínimo para cotizar**
- Definición: porcentaje de casos que alcanzan estado “cotizable” con dataset mínimo completo y sin errores detectados.
- Cómo se mide: checklist de campos mínimos + conteo de re‑cotizaciones por datos erróneos.

### Métricas secundarias (2)

4) **Tasa de abandono del lead**
- Definición: porcentaje de leads que no llegan a recibir una primera cotización.
- Cómo se mide: conteo de leads abiertos vs cotizaciones enviadas.

5) **Preguntas de aclaración posteriores a la entrega de cotización**
- Definición: cantidad de preguntas adicionales del cliente luego de recibir una propuesta.
- Cómo se mide: conteo de mensajes etiquetados como “aclaración”.

---

## E) Metodología de validación (línea base → intervención → post‑medición)

La validación seguirá un diseño antes/después:

1) **Línea base (AS‑IS)**: medir el proceso actual sin intervención.
2) **Intervención (MVP)**: aplicar las dos hipótesis seleccionadas.
3) **Post‑medición (TO‑BE)**: repetir la medición con definiciones idénticas y comparar.

### Ventanas de medición

- Ventana 1: línea base (duración a definir según disponibilidad de casos).
- Ventana 2: post‑medición (misma duración y criterios que ventana 1).

### Evidencia a capturar

- Planilla de timestamps por caso.
- Conteo de interacciones de retrabajo.
- Checklist de completitud.
- Registro de decisiones (racional breve por recomendación).

Nota: el piloto se ejecutará en un entorno real (corredor como cliente/usuario experto), pero el proyecto se diseña para no depender de un único actor para avanzar en construcción y preparación de mediciones.

---

## F) Alcance 6 meses (Licenciatura) — entregables, must‑haves, de‑scopes

### Entregables

1) Flujo AS‑IS validado y medido (línea base documentada).
2) MVP del flujo (captura estructurada conversacional + tracking básico + registro de decisiones).
3) Piloto operativo con casos reales y post‑medición.
4) Informe antes/después con hallazgos y limitaciones.

### Must‑haves

- Captura de lead y creación de caso.
- Dataset mínimo para cotización.
- Seguimiento de solicitud de cotización y estado.
- Comparación de cotizaciones + nota de recomendación (registro de decisiones).
- Reporte básico de métricas.

### De‑scopes

- Integraciones directas con APIs de aseguradoras (salvo una trivial y acotada).
- Procesamiento de pagos.
- Automatización completa de OCR/documentos desde el día 1.
- Hardening multi‑tenant/multi‑correduría.

---

## G) Riesgos y mitigaciones

1) **Dependencia del entorno de validación (piloto)**
- Riesgo: disponibilidad limitada del entorno real reduce cantidad de casos/mediciones.
- Mitigación: separar actividades de construcción/diseño de las ventanas de medición y definir una operación mínima de captura de evidencia.

2) **Privacidad y cumplimiento (comunicaciones y datos personales)**
- Riesgo: captura de información sensible en mensajería y en el registro de decisiones.
- Mitigación: minimizar dataset, anonimizar evidencias, control de acceso a repositorio de evidencia.
- INBOX: precisar requisitos concretos de conservación/retención y prácticas de auditoría aplicables.

3) **Alcance excesivo**
- Riesgo: que se perciba como plataforma integral.
- Mitigación: de‑scopes explícitos y MVP acotado.

4) **Adopción (fricción percibida por el cliente)**
- Riesgo: que la captura estructurada sea percibida como “formulario”.
- Mitigación: captura conversacional guionada y medición explícita de abandono y retrabajo.

---

## H) Paquete de entrega (checklist administrativo) — con placeholders

- [ ] Formulario de Presentación de Proyectos (Aulas) — LINK: __________
- [ ] Formulario con descripción funcional por propuesta — LINK: __________
- [ ] PDF del correo con visto bueno docente laboratorio — LINK: __________
- [ ] (Si aplica) Proyecto emprendedor: formulario adicional + documentación CIE — LINK: __________
- [ ] (Si aplica) Proyecto con empresa: carta de autorización firmada — LINK: __________
- [ ] Certificados de escolaridad (por integrante) — LINK: __________
- [ ] CVs (por integrante) — LINK: __________
- [ ] Evidencia de inscripción a la instancia (por integrante) — LINK: __________

Notas de proceso relevantes:
- La propuesta/anteproyecto es evaluada por tribunal; si es aceptada se asigna tutor.
- Si la propuesta es inadecuada puede pedirse reformulación en un plazo breve.

---

## I) INBOX (incógnitas/pendientes) — con owner sugerido

- (Rodrigo) Evidencia específica de renovaciones: pasos/artefactos/métricas.
- (Rodrigo) Evidencia específica de siniestros desde correduría: flujo aviso/FNOL → resolución.
- (Rodrigo) Requisitos concretos de cumplimiento/retención (qué conservar, por cuánto tiempo, fallas típicas) aplicables a correduría.
- (Manu) Definir dataset mínimo para cotización (campos) y cómo se valida completitud.
- (JM) Proveer acceso a N casos reales para línea base y post‑medición (sin PII en el repositorio de tesis).
- (Manu) Definir mecanismo de etiquetado simple para clasificar mensajes como “retrabajo” vs “información nueva” (para métricas).
