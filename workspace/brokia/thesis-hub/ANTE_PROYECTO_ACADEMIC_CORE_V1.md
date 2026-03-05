# Brokia — Núcleo académico del anteproyecto v1

Propósito: definir un **posicionamiento académico sólido** para aprobación del Comité de Selección, para un **proyecto emprendedor** (track CIE) que usa un **cliente real** como **entorno de validación** (no como dependencia condicional).

Reglas duras (explícitas):
- No modificar cron jobs
- No agregar deadlines
- No incluir reglas de formato de entrega final (Docs 302/303/306)

## Glosario interno (terminología a usar)
- **Asegurado / cliente**: cliente final (tomador/asegurado).
- **Corredor / productor asesor / correduría**: intermediario (persona o agencia).
- **Aseguradora**: compañía.
- **Captura**: ingreso del caso + recolección inicial de datos.
- **Completitud**: datos mínimos presentes y correctos.
- **Retrabajo**: idas y vueltas por faltantes/errores.
- **Trazabilidad**: reconstrucción del proceso (qué/cuándo/por qué).
- **Registro de decisiones**: racional documentado de recomendaciones.

---

## 1) Clasificación del proyecto final (para el Comité de Selección)

**Clasificación**: *Proyecto emprendedor aplicado de ingeniería de software con validación en entorno real*.

### Fundamentación
- ORT reconoce proyectos de corte emprendedor (“Formación de empresas”).
  - Source: `FAQ Proyectos Finales de Sistemas 122021.txt:L7-L12`
- En proyectos emprendedores, la figura de **cliente** se utiliza para definir alcance y priorizar, incluso si se construye un producto.
  - Source: `FAQ Proyectos Finales de Sistemas 122021.txt:L25-L29`

### Declaración de posicionamiento (para pegar en formularios)
> Brokia se presenta como un **proyecto emprendedor aplicado**, cuyo objetivo es diseñar, implementar y validar un flujo operacional de correduría de seguros automotor mediante un sistema de soporte (mensajería + captura estructurada + trazabilidad). La validación se realiza en un **entorno real** con un corredor (Juan Manuel) actuando como **cliente/usuario experto** para priorización, revisión y medición de impacto; el caso real funciona como **ambiente de validación**, no como condición de existencia del proyecto.

---

## 2) Aporte académico (más allá de “construir un producto”)

### 2.1 Conocimiento generado (artefactos reutilizables académicamente)
1) **Conocimiento de proceso**: modelo medido y explícito del flujo de cotización (as‑is/to‑be), con cuellos de botella, fuentes de error y puntos de decisión.
2) **Artefacto metodológico**: protocolo liviano de validación para proyectos emprendedores que requieren evidencia en entorno real (línea base → intervención → post‑medición).
3) **Conocimiento de diseño**: modelo de trazabilidad para el “por qué” detrás de recomendaciones/cotizaciones (registro de decisiones + links a evidencia), alineado con necesidades de confiabilidad y auditabilidad.

### 2.2 Innovación (qué es “nuevo”)
La innovación se define como **proceso + integración + ingeniería aplicada** (no “IA por IA”):
- **Innovación de proceso**: automatización operativa + trazabilidad de decisiones en un entorno de correduría.
- **Innovación de integración**: interfaz conversacional (mensajería) integrada con captura estructurada y medición.

Esto alinea con lo esperado por ORT: “el proyecto debe tener valor académico” y puede ser “innovador: producto, procesos, tecnología, integración”.
- Source: `FAQ Proyectos Finales de Sistemas 122021.txt:L19-L22`

### 2.3 Por qué es valioso académicamente
- Produce **evidencia transferible**: línea base medida + mejora medida, no solo demo.
- Obliga a decisiones explícitas de ingeniería: control de alcance, métricas, restricciones, atributos de calidad.
- Alinea con el énfasis ORT: importa el resultado y también el proceso.
  - Source: `FAQ Proyectos Finales de Sistemas 122021.txt:L142-L143`

---

## 3) Estructura de enunciado de problema (medible)

Usar esta estructura en el “Formulario con descripción funcional” y en la narrativa del anteproyecto, asegurando que cada afirmación sea medible.

### 3.1 Contexto
- Dominio: flujo de cotización en correduría de seguros automotor.
- Actores: corredor, asegurado/cliente, aseguradoras, soporte administrativo.

### 3.2 Problema (estado actual) — medible
Definir el problema como síntomas observables:
- **Tiempo de ciclo**: tiempo desde lead/contacto → primera cotización entregada.
- **Retrabajo**: cantidad de idas y vueltas por cotización.
- **Tasa de error**: datos faltantes/incorrectos que generan rechazo o re‑cotización.
- **Throughput / capacidad**: cotizaciones completadas por semana.

### 3.3 Causas raíz (hipótesis)
- Captura desestructurada por mensajería.
- Cambio de contexto y copiado manual entre herramientas.
- Falta de trazabilidad y de evidencia asociada a decisiones.

### 3.4 Objetivo (mejoras objetivo)
Expresar objetivos como metas cuantitativas en una ventana piloto, por ejemplo:
- Reducir el tiempo de ciclo mediano en X%.
- Reducir retrabajo (interacciones) en X%.
- Reducir incidentes por datos faltantes en X%.

### 3.5 Límite de alcance (no‑objetivos explícitos)
- No es una plataforma completa multi‑aseguradora.
- No es un CRM completo.
- No es un motor de pricing/underwriting.

---

## 4) Metodología de validación (cliente real como entorno, no condición)

La metodología está diseñada para seguir avanzando aunque el cliente esté temporalmente no disponible: se puede continuar con backlog/diseño/construcción; las **ventanas de medición** requieren disponibilidad.

### 4.1 Línea base (AS‑IS)
- Recolectar **N** casos reales de cotización (definir N en el anteproyecto) durante **T** semanas.
- Capturar métricas mínimas:
  - tiempo a cotización (mediana, p90)
  - cantidad de mensajes/interacciones por caso
  - incidentes por datos faltantes
  - tasa de abandono del lead
- Evidencia: logs + planilla de timestamps + export simple (si existe) de CRM/herramienta.

### 4.2 Implementación (intervención)
Entregar un MVP que garantice:
- captura estructurada (dataset mínimo viable)
- máquina de estados del flujo (lead → captura → solicitud a aseguradora → cotización → entrega)
- registro de decisiones (por qué se recomendó una opción)

### 4.3 Post‑medición (TO‑BE)
Repetir medición con definiciones iguales:
- mismas métricas, misma ventana
- comparación línea base vs post

### 4.4 Criterios de evaluación (éxito/fracaso + interpretación)
- **Efectividad**: mejora vs línea base en métrica(s) primaria(s).
- **Eficiencia**: reducción de retrabajo y tiempo de ciclo.
- **Calidad de datos**: menos faltantes/errores.
- **Adopción/usabilidad**: el corredor completa el flujo sin workarounds.

---

## 5) Alcance realista a 6 meses (acotado, “comité‑friendly”)

La FAQ indica 6 meses para Licenciatura; el alcance debe ser realista.
- Source: `FAQ Proyectos Finales de Sistemas 122021.txt:L41-L43`

### 5.1 Entregables (qué existe al mes 6)
1) **Flujo AS‑IS validado** (documentado + línea base medida).
2) **Herramienta MVP del flujo** (mensajería + captura estructurada + tracking básico).
3) **Ejecución de piloto** con corredor usando el MVP en casos reales.
4) **Informe antes/después**: métricas, hallazgos y limitaciones.

### 5.2 Límite del MVP (must‑have)
- Captura de lead y creación de caso
- Esquema mínimo de datos vehículo/conductor/necesidad (solo lo necesario para pedir cotización)
- Seguimiento de solicitud de cotización + estado
- Comparación de cotizaciones + nota de recomendación (trazabilidad)
- Reporte básico de métricas seleccionadas

### 5.3 De‑scopes explícitos (protección de factibilidad)
- Integraciones directas con APIs de aseguradoras (salvo una trivial y time‑boxed)
- Procesamiento de pagos
- Automatización completa de OCR/documentos desde el día 1
- Hardening multi‑tenant/multi‑correduría

---

## 6) Factores de rechazabilidad (qué puede hacer que el Comité lo rechace)

1) **Sin valor académico / solo pitch de producto**: no se explicita conocimiento generado + innovación más allá de construir.
   - Contramedida: atar explícitamente a “valor académico” + “innovación en procesos/tecnología/integración”.
   - Source: `FAQ Proyectos Finales de Sistemas 122021.txt`

2) **Problema no medible**: objetivos vagos (“mejorar eficiencia”) sin métricas/línea base.
   - Contramedida: plan de línea base y post‑medición.

3) **Alcance excesivo**: se percibe como plataforma de seguros/CRM/underwriting/integraciones.
   - Contramedida: de‑scopes duros + alcance 6 meses.

4) **Riesgo de dependencia del cliente**: si la disponibilidad de Juan Manuel se vuelve “single point of failure”.
   - Contramedida: posicionarlo como entorno de validación + definir qué avanza sin él (diseño/build) vs qué requiere ventana de medición.

5) **Faltan gates emprendedores obligatorios** (CIE) en el paquete de anteproyecto.
   - Contramedida: checklist de anteproyecto incluyendo documentación CIE cuando aplique.
   - Source: `10_STAGE_APPLICABILITY_REMAP.md`

---

## 7) Factores de fortaleza (qué aumenta probabilidad de aprobación)

1) **Valor + innovación clara** (proceso + integración) alineada con expectativas ORT.
   - Source: `FAQ Proyectos Finales de Sistemas 122021.txt`

2) **Plan de validación real** con línea base y criterios.

3) **Disciplina de alcance**: MVP 6 meses + no‑objetivos explícitos.

4) **Alineación con tutoría**: el tutor es responsable de garantizar valor académico.
   - Source: `FAQ Proyectos Finales de Sistemas 122021.txt:L23-L24`

5) **Conciencia del ciclo formal**: propuesta evaluada; si es inadecuada, puede requerirse reformulación ≤ 2 semanas.
   - Source: `304-normas-para-el-desarrollo-de-trabajos-finales-de-carrera__documento-304.txt:L44-L48`

---

## Apéndice — Restricciones de proceso (solo lo relevante para posicionamiento)

- La propuesta/anteproyecto se evalúa formalmente; si es inadecuada puede pedirse reformulación en ≤ 2 semanas.
  - Source: `304-normas-para-el-desarrollo-de-trabajos-finales-de-carrera__documento-304.txt:L44-L48`
- La defensa es oral y pública; la calificación es posterior a la entrega final y defensa (no hay notas intermedias).
  - Source: `FAQ Proyectos Finales de Sistemas 122021.txt:L90-L95`
