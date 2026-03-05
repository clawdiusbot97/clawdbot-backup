# 11 — Mapa conceptual del ecosistema (correduría de seguros, visión industria) + Clústeres de oportunidad

**Objetivo**: construir un mapa conceptual global del **ecosistema de intermediación/correduría de seguros** (no centrado en un único corredor) para identificar dolores sistémicos y espacios de oportunidad para un producto emprendedor.

**Política de evidencia (regla dura)**: este documento usa únicamente fuentes locales del workspace. Todo lo que falte se lista en **INBOX** (no se inventa contenido).

## Glosario interno (terminología a usar)
- **Asegurado / cliente**: persona o empresa que contrata/renueva el seguro (cliente final).
- **Corredor / productor asesor / correduría**: intermediario (persona o agencia) que asesora y opera el ciclo comercial/servicio.
- **Aseguradora**: compañía que suscribe el riesgo (define aceptación, condiciones, prima, emisión, siniestros).
- **Cotización**: proceso y resultado de precio/condiciones previo a la emisión.
- **Emisión**: generación de póliza/contrato en la aseguradora.
- **Endosos**: modificaciones a una póliza vigente.
- **Renovaciones**: continuidad de cobertura al vencimiento.
- **Siniestros**: ciclo de reclamo/atención y resolución.
- **Captura (intake)**: ingreso inicial del caso (lead) y solicitud/recepción de datos.
- **Completitud**: grado en que los datos mínimos requeridos están presentes y correctos.
- **Retrabajo**: ciclos de ida y vuelta por datos faltantes/errores.
- **Trazabilidad**: capacidad de reconstruir qué se hizo, cuándo, con qué evidencia.
- **Registro de decisiones**: justificación documentada de recomendaciones/acciones.

---

## Fuentes utilizadas (local)
- Borrador base de mapeo del sistema: `brokia/entregables/mapa-conceptual.md`
- Restricciones de posicionamiento académico: `brokia/thesis-hub/ANTE_PROYECTO_ACADEMIC_CORE_V1.md`
- Restricciones de proceso ORT: `brokia/tesis/docs/drive-pdfs/304-normas-para-el-desarrollo-de-trabajos-finales-de-carrera__documento-304.txt`
- FAQ ORTsf: `brokia/tesis/docs/drive-pdfs/FAQ Proyectos Finales de Sistemas 122021.txt`
- Intel de tesis (señales de “por qué ahora”): `memory/thesis-intel/2026-02-26.md`, `2026-02-27.md`, `2026-02-28.md`

---

## A) Actores (visión industria)

### Actores primarios
- **Asegurado / cliente (tomador del seguro)**
  - Elige corredor/aseguradora; optimiza precio/cobertura/esfuerzo/tiempo percibidos.
  - Ancla de evidencia: actores + incentivos en `brokia/entregables/mapa-conceptual.md`.
- **Corredor / productor asesor / correduría**
  - Opera adquisición, asesoramiento, cotización, soporte de emisión, renovaciones y servicio.
  - Ancla de evidencia: ídem.
- **Aseguradora**
  - Aceptación del riesgo, condiciones/prima, emisión de póliza, administración de siniestros.
  - Ancla de evidencia: ídem.
- **Regulador / supervisor** (p.ej. SUSE en el mapa local)
  - Cumplimiento, trazabilidad, protección del asegurado.
  - Ancla de evidencia: ídem.

### Actores secundarios / de soporte
- **Equipo de la correduría** (productores junior, operaciones/administración)
- **Peritos / tasadores / inspectores**
- **Talleres / proveedores de servicio** (en especial durante siniestros)
- **Bancos / financieras** (cuando el vehículo está financiado/prendado)
- **Capa tecnológica**
  - Portales de aseguradoras, correo, planillas, apps de mensajería (WhatsApp), CRMs.
  - Ancla de evidencia: `brokia/entregables/mapa-conceptual.md`.

---

## B) Flujos (de punta a punta)

> Los flujos se describen a nivel ecosistema; cada correduría tendrá variaciones.

### 1) Adquisición / captura de lead (captura inicial)
- Aparece el lead (referido, mensaje entrante, llamada, presencial).
- Calificación inicial + solicitud del dataset mínimo.
- Ancla de evidencia: “captura desestructurada” + canales conversacionales en `brokia/entregables/mapa-conceptual.md`.

### 2) Cotización
- El corredor recolecta datos faltantes (ida y vuelta).
- El corredor cotiza contra múltiples aseguradoras vía portales separados (fricción multi‑portal).
- El corredor compara opciones y recomienda.
- Ancla de evidencia: flujos + fricciones en `brokia/entregables/mapa-conceptual.md`.

### 3) Emisión
- El corredor (o la aseguradora) vuelve a cargar datos en el flujo de emisión de la aseguradora elegida.
- Se emite la póliza; se registra comisión.
- Ancla de evidencia: “doble carga” y emisión en `brokia/entregables/mapa-conceptual.md`.

### 4) Renovaciones
- Recordatorio de renovación + actualización de datos (uso del vehículo, historial, cambios de conductor).
- Re‑cotización / negociación / re‑market.
- **INBOX**: no hay evidencia específica de flujo de renovaciones en los documentos locales (más allá de la mención general del ciclo).

### 5) Siniestros
- Aviso de siniestro (FNOL) / captura del reclamo.
- Recolección de evidencia, presentación del reclamo, seguimiento de estado, coordinación de reparación.
- **INBOX**: no hay evidencia local (workspace) de flujo de siniestros desde la perspectiva de correduría.

### 6) Servicio / endosos
- Cambios de póliza: domicilio, conductores, coberturas, pagos, certificados, comprobantes.
- Soporte continuo + recuperación/gestión de documentación.
- **INBOX**: no hay evidencia local de una taxonomía de solicitudes de servicio.

---

## C) Objetos de información (datos/documentos que se mueven)

### Objetos de datos del asegurado / riesgo
- Identidad y contacto
- Datos del vehículo (marca/modelo/año/VIN/matrícula)
- Datos del conductor / factores de riesgo
- Historial de seguros / siniestros previos (cuando existe)

### Objetos comerciales
- Paquete de solicitud de cotización (campos requeridos por aseguradora)
- Respuestas de cotización (prima, coberturas, límites, exclusiones)
- Racional de recomendación (por qué opción A vs B) + **registro de decisiones**

### Objetos de póliza
- Solicitud / propuesta
- Póliza emitida + endosos
- Certificados / comprobantes

### Objetos de siniestros (detalle INBOX)
- Aviso/denuncia
- Evidencia (fotos, informes)
- Notas del ajustador

### Objetos de cumplimiento / trazabilidad
- Registros de comunicaciones (mensajes, correos)
- Trazas de decisiones / asesoramiento
- Paquete de conservación de registros
- Ancla de evidencia: tensión de trazabilidad/compliance en `brokia/entregables/mapa-conceptual.md`.

---

## D) Puntos de dolor (sistémicos, transversales)

1) **Captura desestructurada → retrabajo**
   - Idas y vueltas para completar datos mínimos.
   - Source: `brokia/entregables/mapa-conceptual.md` (captura desestructurada).

2) **Interfaces fragmentadas por aseguradora (multi‑portales) → costo de tiempo + errores**
   - Logins/campos/orden distintos → “traducción” constante.
   - Source: `brokia/entregables/mapa-conceptual.md` (multi‑portales; documentación dispersa).

3) **Comparación y explicación manual → brecha de confianza**
   - El cliente no puede verificar “mejor opción” y el corredor invierte tiempo en justificar.
   - Source: `brokia/entregables/mapa-conceptual.md` (asimetría cliente; comparación manual).

4) **Doble carga (cotización → emisión) → desperdicio**
   - Los mismos datos se vuelven a ingresar.
   - Source: `brokia/entregables/mapa-conceptual.md` (doble carga).

5) **Cumplimiento / trazabilidad como trabajo paralelo manual**
   - Conflicto: operar rápido vs documentar para auditoría.
   - Source: `brokia/entregables/mapa-conceptual.md` (eficiencia vs compliance).

6) **Ausencia de memoria institucional**
   - Cada caso se trata como nuevo; no se reutiliza conocimiento.
   - Source: `brokia/entregables/mapa-conceptual.md` (sin memoria institucional).

---

## E) Incentivos / tensiones (por qué el dolor persiste)

- **Cliente quiere rapidez + mínimo esfuerzo + precio bajo** vs **aseguradora quiere selección de riesgo rentable**
  - Resultado: negociación repetida y datos iniciales incompletos.
  - Source: `brokia/entregables/mapa-conceptual.md` (incentivos/tensiones).

- **Correduría optimiza volumen** vs **calidad del asesoramiento + carga de documentación**
  - Tensión estructural: más volumen reduce tiempo disponible por caso y agrava la deuda de trazabilidad.
  - Source: `brokia/entregables/mapa-conceptual.md` (volumen vs calidad; eficiencia vs compliance).

- **Diferenciación por sistemas propietarios** vs **estandarización del ecosistema**
  - La fragmentación persiste por incentivos competitivos, aunque sea ineficiente a nivel industria.
  - Source: `brokia/entregables/mapa-conceptual.md` (fragmentación del mercado asegurador).

---

## F) Clústeres de oportunidad (3–5)

> Cada clúster se formula como **espacio de oportunidad**, no como lista de funcionalidades. La validación se plantea como **experimento mínimo en 2 semanas**.

### Clúster 1 — Captura estructurada + puntaje de completitud (conversacional)
- **Problema (enunciado)**
  - La captura desestructurada produce retrabajo, demoras y errores aguas abajo.
  - Source: `brokia/entregables/mapa-conceptual.md` (captura desestructurada; fricciones).
- **Beneficiados / resistencias**
  - Beneficia: corredurías (tiempo), clientes (rapidez), aseguradoras (paquetes más completos).
  - Resiste: clientes que rechazan “formularios”; corredurías que temen fricción al inicio del embudo.
- **Por qué ahora (señales)**
  - El diferencial competitivo se está moviendo hacia **fundación de datos + gobernanza** antes de “agentes”.
  - Source: `memory/thesis-intel/2026-02-26.md`.
- **Diferencial (no lista de features)**
  - Captura *nativa del flujo* (parece conversación) pero produce datos estructurados con trazabilidad.
- **Cómo validar en 2 semanas (experimento mínimo)**
  - Ejecutar una conversación guionada por WhatsApp para N leads (manual detrás de escena), midiendo:
    - tiempo a completar dataset mínimo
    - cantidad de mensajes de ida y vuelta
    - % de casos que llegan a estado “cotizable” en 24h
  - Evidencia: planilla de timestamps + conteo de mensajes (sin automatización).

### Clúster 2 — “Memoria del corredor” (casos + trazabilidad)
- **Problema (enunciado)**
  - Cada caso se trata como nuevo; se pierde conocimiento institucional; las recomendaciones no tienen racional repetible.
  - Source: `brokia/entregables/mapa-conceptual.md` (sin memoria institucional; trazabilidad manual).
- **Beneficiados / resistencias**
  - Beneficia: corredurías (reutilización), clientes (consistencia), regulador (trazabilidad).
  - Resiste: miedo a responsabilidad legal por “dejar escrito”; preocupaciones de privacidad.
- **Por qué ahora (señales)**
  - “RAG seguro” + auditoría/gobernanza están volviéndose requisito de facto en productos de asistencia.
  - Source: `memory/thesis-intel/2026-02-26.md`, `2026-02-27.md`.
- **Diferencial (no lista de features)**
  - Memoria *con responsabilidad*: cada recomendación se liga a evidencia y a casos previos, con incertidumbre explícita.
- **Cómo validar en 2 semanas (experimento mínimo)**
  - Crear una plantilla simple de “tarjeta de caso” y exigirla en N cotizaciones:
    - 3 bullets: objetivo del cliente, restricciones clave, por qué se recomendó la opción
    - guardar en carpeta compartida/documento
  - Medir: tiempo adicional por tarjeta + si reduce preguntas de aclaración posteriores.

### Clúster 3 — IA documental evaluable (extracción con métricas)
- **Problema (enunciado)**
  - Los documentos son heterogéneos; la extracción/reingreso manual es costosa y propensa a errores.
  - Ancla: doble carga + documentación dispersa en `brokia/entregables/mapa-conceptual.md`.
- **Beneficiados / resistencias**
  - Beneficia: operaciones (velocidad), aseguradoras (calidad), clientes (tiempos).
  - Resiste: desconfianza por errores de extracción; necesidad de ver métricas.
- **Por qué ahora (señales)**
  - La calidad de parseo varía fuertemente según tipo de documento; se impone elegir por evidencia/corpus.
  - Source: `memory/thesis-intel/2026-02-27.md`.
- **Diferencial (no lista de features)**
  - Pipeline documental *evaluable*: se mide corrección en un corpus antes de escalar.
- **Cómo validar en 2 semanas (experimento mínimo)**
  - Armar un mini‑corpus (p.ej. 30 documentos anonimizados) y definir 10–15 campos.
  - Construir “verdad terreno” manual + correr extracción (aunque sea semi‑manual) y calcular:
    - exactitud por campo
    - tasa de campos faltantes
  - Salida: scorecard + taxonomía de errores.

### Clúster 4 — Explicación de cotizaciones (transparencia sin sobrecargar)
- **Problema (enunciado)**
  - Persisten desconfianza y fricción porque el razonamiento es manual e inconsistente.
  - Source: `brokia/entregables/mapa-conceptual.md` (asimetría cliente; comparación manual).
- **Beneficiados / resistencias**
  - Beneficia: clientes (confianza), corredurías (conversión), aseguradoras (menos decisión puramente por precio).
  - Resiste: miedo a comoditización; posibles tensiones comerciales.
- **Por qué ahora (señales)**
  - Presión competitiva por mejorar experiencia digital y servicio “siempre disponible”.
  - Source: `memory/thesis-intel/2026-02-26.md`.
- **Diferencial (no lista de features)**
  - Claridad de decisión: justificación corta, consistente y trazable (sin “pared de texto”).
- **Cómo validar en 2 semanas (experimento mínimo)**
  - A/B test de presentación en N cotizaciones:
    - Versión A: mensaje actual
    - Versión B: racional estructurado en 5 líneas
  - Medir: tasa de aceptación + cantidad de preguntas de aclaración.

---

## INBOX (faltantes para fortalecer este mapa)

Falta evidencia local (workspace) para completar el ciclo completo con el mismo rigor que cotización:
- Evidencia del ciclo de **renovaciones** (pasos, artefactos, cuellos de botella, métricas).
- Evidencia del ciclo de **siniestros** (FNOL → resolución) desde la perspectiva de correduría.
- Taxonomía de **solicitudes de servicio/endosos** (tipos y volúmenes).
- Evidencia específica de **cumplimiento** (qué conservar, por cuánto tiempo, fallas típicas de auditoría) más allá de la tensión general.
- Restricciones y resistencias del lado de **aseguradoras** levantadas por entrevistas (requiere nuevas notas/entrevistas).
