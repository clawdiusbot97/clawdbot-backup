# Brokia — MVPs alternativos (menú de soluciones)

**Fecha:** 2026-03-04  
**Objetivo:** ofrecer varias opciones de MVP (según foco: cliente, corredor, operación) con el problema/hipótesis que resuelven, por qué tienen sentido, alcance hasta septiembre (tesis) y fases posteriores.

> Nota: este documento está planteado como “menú” para elegir 1 MVP principal para la tesis (hasta septiembre) y dejar el resto como fases/roadmap posteriores.

---

## MVP A — “Conserje de Cotización por WhatsApp” (foco cliente)

### Problema núcleo / hipótesis
- **Problema:** el cliente abandona o se frustra porque cotizar implica demasiada fricción (muchas preguntas, idas y vueltas, tiempos muertos).
- **Hipótesis:** si Brokia convierte la consulta en un **flujo conversacional guiado** (WhatsApp) y pide **solo lo mínimo necesario** en cada paso, aumenta la tasa de avance a cotización y disminuye el tiempo a la primera oferta.

### Por qué esta solución
- En seguros, el cuello de botella suele ser el **time-to-quote** (tiempo a cotización).
- WhatsApp baja fricción y se adapta bien al comportamiento real de clientes en Uruguay/LatAm.

### Alcance MVP (hasta septiembre)
1) **Intake conversacional guiado** (campos mínimos): nombre, documento, datos básicos del vehículo (marca/modelo/año), uso, zona, presupuesto, coberturas deseadas.
2) **Gestión de documentos**: solicitud opcional de foto de libreta/título/póliza anterior.
3) **Precalificación simple**: reglas por tipo de vehículo/uso/cobertura (sin “pricing inteligente”).
4) **Pipeline de oportunidades**: “Nuevo → En carga de datos → Cotizando → Oferta enviada → Ganado/Perdido”.
5) **Seguimiento automatizado** con plantillas (por ejemplo a 24 h y 72 h) y registro de respuesta.
6) **Trazabilidad mínima**: qué se pidió, cuándo y por qué (auditabilidad básica para tesis).

### Fuera de alcance (post-septiembre)
- Extracción automática confiable desde fotos/documentos como flujo principal.
- Comparación multi-aseguradora end-to-end con integración total.
- Recomendación automática sin confirmación humana.

### Tecnología / formas de resolver
- Canal: WhatsApp Business (ideal vía API; alternativa: modo semi-manual con plantillas y registro).
- Backend con **máquina de estados** conversacional.
- IA (opcional y acotada): clasificación de intención, resumen del caso, sugerencia de próximos pasos (siempre con control del corredor).

### Métricas para tesis
- Tiempo desde primer mensaje → “cotización enviada”.
- % leads que completan datos mínimos.
- Tasa de respuesta al seguimiento.
- Conversión (aunque sea como métrica proxy).

---

## MVP B — “Cockpit del Corredor + Trazabilidad” (foco corredor)

### Problema núcleo / hipótesis
- **Problema:** el corredor pierde tiempo en coordinación, repite preguntas, comete errores por datos incompletos y cuesta justificar por qué se recomendó una opción.
- **Hipótesis:** si el corredor tiene un **cockpit** que centraliza conversación, datos estructurados, próximos pasos y un **log de decisiones**, baja el tiempo operativo y mejora la calidad (y la trazabilidad para tesis).

### Por qué esta solución
- Impacta directamente en costo operativo y capacidad del equipo.
- Encaja con un eje fuerte de tesis: **automatización + trazabilidad**.

### Alcance MVP (hasta septiembre)
1) **CRM mínimo**: clientes, vehículos, oportunidades, estado, prioridad.
2) **Vista de conversación** (aunque sea linkeada o resumida) + extracción a campos con confirmación.
3) **Checklist de cotización** por auto + validaciones (no avanzar si faltan datos críticos).
4) **Generador de propuesta** (PDF simple o mensaje plantilla con condiciones).
5) **Audit trail (log de decisiones)**:
   - datos utilizados,
   - alternativas consideradas,
   - motivo de recomendación (ej.: “mejor relación cobertura/precio”).
6) **Tareas y recordatorios** automáticos (seguimiento, solicitud de faltantes, próximos pasos).

### Fuera de alcance (post-septiembre)
- Integraciones profundas con todas las aseguradoras.
- Automatización completa de cotización sin intervención.

### Tecnología / formas de resolver
- Portal web interno (corredor) + API.
- IA de alto ROI (asistiva):
  - “resumir el caso”,
  - “extraer campos del chat/documentos” con revisión,
  - “redactar respuesta al cliente” con tono definido.
- Auditoría tipo **event log** (append-only) para trazabilidad.

### Métricas para tesis
- Tiempo promedio por cotización.
- Errores por datos incompletos.
- % casos con recomendación “justificable” (log completo).

---

## MVP C — “Orquestador Multi-aseguradora (humano en el circuito)” (foco operación)

### Problema núcleo / hipótesis
- **Problema:** cotizar con varias aseguradoras es artesanal (portales, correos, WhatsApp, capturas, planillas) y no hay estandarización.
- **Hipótesis:** si Brokia estandariza un **modelo de datos** y un flujo “solicitar → recibir → normalizar → comparar”, el corredor cotiza más rápido aunque parte de la ejecución siga siendo manual.

### Por qué esta solución
- Ataca el corazón de la operación del broker: comparación y gestión multi-proveedor.
- No depende de APIs perfectas para aportar valor.

### Alcance MVP (hasta septiembre)
1) **Modelo de datos único**: cliente, vehículo, coberturas deseadas, variables de riesgo.
2) **Plantillas por aseguradora**: checklist + mensajes/correos de solicitud.
3) **Registro de respuestas**: carga manual + adjuntos (PDF/capturas).
4) **Normalización básica**: mapear campos clave (prima, deducible, coberturas, exclusiones).
5) **Comparador**: lista/tabla de ofertas + recomendación asistida + “por qué”.
6) **Trazabilidad**: cuándo se solicitó, cuándo se recibió, quién cargó y qué evidencia respaldó.

### Fuera de alcance (post-septiembre)
- Integración automática con todas las aseguradoras.
- Extracción perfecta de PDFs sin revisión humana.

### Tecnología / formas de resolver
- Web app interna.
- IA opcional para extracción de PDFs con verificación.
- Event log para auditoría.

### Métricas para tesis
- Tiempo para obtener N cotizaciones.
- % ofertas “comparables” (normalizadas).
- Tiempo hasta recomendación final.

---

## MVP D — “Motor de Renovaciones y Retención” (foco cartera)

### Problema núcleo / hipótesis
- **Problema:** se pierden renovaciones por falta de seguimiento; el corredor reacciona tarde.
- **Hipótesis:** si automatizás alertas, campañas y tareas de renovación, sube la retención sin aumentar el equipo.

### Por qué esta solución
- Alto impacto en ingresos recurrentes.
- Muy medible para tesis (antes/después).

### Alcance MVP (hasta septiembre)
1) Importación de pólizas (CSV) con fechas de vencimiento.
2) Segmentación por ventanas (30/15/7 días).
3) Mensajería (WhatsApp/email) con plantillas + registro.
4) Tareas automáticas (contactar, pedir documentación, cerrar).
5) Dashboard “renovaciones en riesgo”.

### Fuera de alcance (post-septiembre)
- Modelos predictivos avanzados de churn.
- Ofertas personalizadas automáticas.

### Tecnología / formas de resolver
- Scheduler + mensajería.
- IA opcional: detectar objeciones y sugerir respuesta.

### Métricas para tesis
- % renovaciones gestionadas a tiempo.
- Retención vs baseline.
- Tiempo invertido por renovación.

---

## MVP E — “Documento a Datos (IA) + Evidencia y Cumplimiento” (foco extracción)

### Problema núcleo / hipótesis
- **Problema:** capturar datos desde documentos (libreta, cédula, póliza anterior) es lento y propenso a error.
- **Hipótesis:** si IA extrae y sugiere campos y el humano confirma, baja el tiempo y aumenta consistencia.

### Por qué esta solución
- Diferencial tecnológico claro.
- Riesgo: la calidad de fotos/OCR puede variar; conviene mantenerlo como **asistencia**.

### Alcance MVP (hasta septiembre)
1) Subida de fotos/PDF.
2) Extracción de 8–15 campos clave.
3) UI de verificación (confirmar/editar) con “confianza”.
4) Trazabilidad: documento → campos → validación (quién/cuándo).

### Fuera de alcance (post-septiembre)
- Automatización completa sin verificación.
- Extracción de campos complejos no estandarizados.

### Tecnología / formas de resolver
- OCR + extractor con esquema (con validación).
- Almacenamiento de evidencias + auditoría.

### Métricas para tesis
- Tiempo de carga vs manual.
- Tasa de correcciones.
- % campos extraídos correctamente.

---

# Recomendación práctica para un “MVP de tesis hasta septiembre”

Para maximizar probabilidad de entrega y medición de impacto:

1) **MVP B (Cockpit del corredor + trazabilidad)** + un componente pequeño del **MVP A (intake por WhatsApp)**.
2) **MVP D (Renovaciones)** si ya existe cartera con datos utilizables.
3) **MVP C (Orquestador multi-aseguradora)** si el dolor principal hoy es multi-cotización.
4) **MVP E (Documento a datos)** como fase 2 o MVP muy acotado con verificación.

---

# Preguntas mínimas para elegir el MVP principal (rápidas)

1) ¿Prioridad principal: **venta nueva**, **eficiencia operativa** o **retención**?
2) ¿Canal sí o sí: **WhatsApp**? ¿Tienen acceso a WhatsApp Business API?
3) ¿Hay **cartera** para probar renovaciones (con fechas) y medir impacto?
4) ¿El cuello de botella más doloroso hoy es: **captura de datos**, **multi-cotización** o **seguimiento**?
