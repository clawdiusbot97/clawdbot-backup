# Anteproyecto v1 — Brokia (borrador 1, contenido)

> Nota: borrador **solo de contenido** para anteproyecto. Requisitos de formato de entrega final (Docs 302/303/306) **NO APLICAN AL ANTEPROYECTO**.

---

## A) Resumen ejecutivo (máx. 200 palabras)

El ecosistema de correduría de seguros automotores presenta fricciones sistémicas que afectan simultáneamente a clientes/asegurados, corredurías y aseguradoras: la captura desestructurada de datos, la fragmentación de portales por aseguradora, la comparación manual de cotizaciones y la doble carga de información entre cotización y emisión generan retrabajo, demoras, errores y una brecha de confianza en la recomendación del corredor. (Source: brokia/entregables/mapa-conceptual.md:L155-L183)

Brokia se propone como proyecto emprendedor aplicado: diseñar e implementar una capa operativa que permita (i) captura estructurada conversacional con completitud verificable y (ii) una “memoria del corredor” basada en casos, con trazabilidad y registro de decisiones. Estas hipótesis se validarán en un entorno real con un corredor actuando como cliente/usuario experto, solo como **ambiente de validación**, sin centrar el problema en un caso individual. (Source: brokia/thesis-hub/ANTE_PROYECTO_ACADEMIC_CORE_V1.md:L22-L34)

El aporte académico se apoya en un enfoque medible: línea base → intervención (MVP) → post-medición, con métricas primarias de tiempo de ciclo, retrabajo y completitud/calidad de datos. (Source: brokia/thesis-hub/ANTE_PROYECTO_ACADEMIC_CORE_V1.md:L60-L122)

---

## B) Contexto y problema (visión ecosistema industria)

### Actores (visión industria)
- Asegurado / cliente (tomador)
- Corredor / productor asesor / correduría
- Aseguradora
- Regulador / supervisor
- Actores de soporte: equipo de la correduría, peritos/tasadores/inspectores, talleres/proveedores, bancos/financieras, capa tecnológica (portales, mensajería, email, planillas, CRM). (Source: brokia/thesis-hub/11_ECOSYSTEM_CONCEPT_MAP.md:L33-L56)

### Flujos de punta a punta (alto nivel)
- Captura de lead → cotización → emisión → renovaciones → siniestros → servicio/endosos. (Source: brokia/thesis-hub/11_ECOSYSTEM_CONCEPT_MAP.md:L60-L93)

> INBOX: el detalle de renovaciones/siniestros/servicio requiere evidencia adicional; hoy está identificado como faltante en el mapa conceptual. (Source: brokia/thesis-hub/11_ECOSYSTEM_CONCEPT_MAP.md:L80-L93)

### Fricciones (operativas, información, regulatorias)
- Captura desestructurada (WhatsApp) → interpretación manual + pedidos de faltantes → retrabajo y demoras. (Source: brokia/entregables/mapa-conceptual.md:L161-L168)
- Documentación dispersa: cada aseguradora solicita campos levemente distintos → traducción constante. (Source: brokia/entregables/mapa-conceptual.md:L163-L167)
- Multi‑portales: logins e interfaces distintas → costo de tiempo por aseguradora. (Source: brokia/entregables/mapa-conceptual.md:L163-L167)
- Comparación manual de cotizaciones para presentar al cliente → riesgo de error/omisión. (Source: brokia/entregables/mapa-conceptual.md:L161-L167)
- Doble carga: datos ingresados para cotizar se vuelven a cargar para emitir. (Source: brokia/entregables/mapa-conceptual.md:L163-L168)
- Asimetría de información: el cliente no sabe si la cotización presentada es realmente la mejor disponible. (Source: brokia/entregables/mapa-conceptual.md:L171-L176)
- Trazabilidad manual y conservación de registros dispersa → riesgo de incumplimiento/estrés operativo. (Source: brokia/entregables/mapa-conceptual.md:L177-L183)

### Tensiones (por qué el problema persiste)
- Eficiencia/volumen vs cumplimiento/trazabilidad: documentar para auditoría compite contra atender clientes. (Source: brokia/entregables/mapa-conceptual.md:L186-L193)
- Personalización vs estandarización: cada cliente y cada aseguradora requieren datos distintos; no hay formato único. (Source: brokia/entregables/mapa-conceptual.md:L195-L199)
- Fragmentación del mercado asegurador: sistemas propietarios y formatos distintos dificultan integración. (Source: brokia/entregables/mapa-conceptual.md:L210-L213)

---

## C) Oportunidad emprendedora + diferencial (2 clústeres → hipótesis de producto)

Se seleccionan **exactamente 2** clústeres del mapa conceptual, formulados como hipótesis:

### Hipótesis 1 — Captura estructurada + puntaje de completitud (conversacional)
**Problema**: la captura desestructurada produce retrabajo, demoras y errores aguas abajo. (Source: brokia/thesis-hub/11_ECOSYSTEM_CONCEPT_MAP.md:L176-L179)

**Por qué ahora**: el diferencial competitivo se está moviendo hacia fundación de datos + gobernanza antes de automatizaciones más avanzadas. (Source: brokia/thesis-hub/11_ECOSYSTEM_CONCEPT_MAP.md:L183-L185)

**Diferencial** (no lista de funcionalidades): una captura nativa del flujo (parece conversación) pero produce datos estructurados con completitud verificable y evidencia reutilizable para cotización y emisión.

### Hipótesis 2 — “Memoria del corredor” (casos + trazabilidad)
**Problema**: cada caso se trata como nuevo; se pierde conocimiento institucional; las recomendaciones no tienen racional repetible. (Source: brokia/thesis-hub/11_ECOSYSTEM_CONCEPT_MAP.md:L195-L198)

**Por qué ahora**: la necesidad de trazabilidad y gobernanza se vuelve requisito de facto en productos de asistencia, especialmente por privacidad/seguridad y auditabilidad. (Source: brokia/thesis-hub/11_ECOSYSTEM_CONCEPT_MAP.md:L202-L204)

**Diferencial**: memoria con responsabilidad; toda recomendación queda vinculada a evidencia y a un registro de decisiones, con incertidumbre explícita.

---

## D) Objetivos medibles

### Métricas primarias (3)
1) **Tiempo de ciclo a primera cotización**
   - Definición: tiempo desde el primer contacto/lead hasta el envío de la primera cotización utilizable.
   - Medición: timestamps (mensaje inicial + mensaje de entrega de cotización).

2) **Retrabajo por caso de cotización**
   - Definición: cantidad de interacciones (mensajes/pedidos) asociados a faltantes/correcciones.
   - Medición: conteo de mensajes o eventos de “pedido de faltante”.

3) **Completitud/calidad del dataset mínimo para cotizar**
   - Definición: porcentaje de casos que alcanzan estado “cotizable” con dataset mínimo completo y sin errores detectados.
   - Medición: checklist de campos mínimos (completo / incompleto) + conteo de re‑cotizaciones por datos erróneos.

> Targets: **a definir luego de la línea base**, expresados como % de mejora vs línea base (p.ej. reducir tiempo de ciclo X%, retrabajo X%, aumentar completitud Y%). (Source: brokia/thesis-hub/ANTE_PROYECTO_ACADEMIC_CORE_V1.md:L80-L85)

### Métricas secundarias (2)
4) **Tasa de abandono del lead**
   - Definición: % de leads que no llegan a recibir una primera cotización.
   - Medición: conteo de leads abiertos vs cotización enviada.

5) **Preguntas de aclaración posteriores a la entrega de cotización**
   - Definición: cantidad de preguntas adicionales del cliente luego de recibir una propuesta.
   - Medición: conteo de mensajes etiquetados como “aclaración”.

---

## E) Metodología de validación (línea base → intervención → post‑medición)

### Diseño general
- **Línea base (AS‑IS)**: medir el proceso actual sin intervención.
- **Intervención (MVP)**: aplicar las dos hipótesis seleccionadas (captura estructurada + memoria/registro de decisiones).
- **Post‑medición (TO‑BE)**: repetir medición con definiciones idénticas y comparar.

Este enfoque está alineado a la metodología propuesta para validación con entorno real. (Source: brokia/thesis-hub/ANTE_PROYECTO_ACADEMIC_CORE_V1.md:L93-L116)

### Ventanas de medición
- Ventana 1: línea base (duración a definir según disponibilidad de casos; se sugiere una ventana mínima que permita N casos).
- Ventana 2: post‑medición bajo intervención (misma duración/criterios que ventana 1).

### Evidencia a capturar
- Planilla de timestamps por caso (lead → dataset mínimo completo → cotización enviada).
- Conteo de mensajes/eventos de retrabajo.
- Checklist de completitud del dataset mínimo.
- Registro de decisiones (racional breve por recomendación).

> Nota: el “cliente real” se utiliza como **ambiente de validación**. El proyecto no depende de un único cliente para existir; la construcción puede avanzar aunque el entorno no esté disponible temporalmente. (Source: brokia/thesis-hub/ANTE_PROYECTO_ACADEMIC_CORE_V1.md:L93-L96)

---

## F) Alcance 6 meses (Licenciatura) — entregables, must‑haves, de‑scopes

### Entregables
1) Flujo AS‑IS validado y medido (línea base documentada).
2) MVP del flujo (captura estructurada conversacional + tracking básico + registro de decisiones).
3) Piloto operativo con casos reales y post‑medición.
4) Informe antes/después con hallazgos y limitaciones. (Source: brokia/thesis-hub/ANTE_PROYECTO_ACADEMIC_CORE_V1.md:L130-L135)

### Must‑haves
- Captura de lead y creación de caso.
- Dataset mínimo para cotización (campos necesarios).
- Seguimiento de solicitud de cotización + estado.
- Comparación de cotizaciones + nota de recomendación (registro de decisiones/trazabilidad).
- Reporte básico de métricas. (Source: brokia/thesis-hub/ANTE_PROYECTO_ACADEMIC_CORE_V1.md:L136-L142)

### De‑scopes
- Integraciones directas con APIs de aseguradoras (salvo una trivial y acotada).
- Procesamiento de pagos.
- Automatización completa de OCR/documentos desde el día 1.
- Hardening multi‑tenant/multi‑correduría. (Source: brokia/thesis-hub/ANTE_PROYECTO_ACADEMIC_CORE_V1.md:L143-L147)

---

## G) Riesgos y mitigaciones

1) **Dependencia del entorno de validación (piloto)**
- Riesgo: disponibilidad limitada del entorno real reduce cantidad de casos/mediciones.
- Mitigación: separar claramente (i) desarrollo/diseño (independiente) de (ii) ventanas de medición (dependientes). (Source: brokia/thesis-hub/ANTE_PROYECTO_ACADEMIC_CORE_V1.md:L93-L96)

2) **Privacidad y cumplimiento (comunicaciones y datos personales)**
- Riesgo: captura de información sensible en mensajería y registro de decisiones.
- Mitigación: minimizar dataset; redacción/anonimización en evidencias; control de acceso a repositorio de evidencia.
- INBOX: falta evidencia local específica sobre requisitos exactos de conservación/retención y prácticas de auditoría; levantar con Rodrigo. (Source: brokia/thesis-hub/11_ECOSYSTEM_CONCEPT_MAP.md:L259-L268)

3) **Alcance excesivo**
- Riesgo: el comité o el plan se perciben como “plataforma completa”.
- Mitigación: de‑scopes explícitos y MVP acotado. (Source: brokia/thesis-hub/ANTE_PROYECTO_ACADEMIC_CORE_V1.md:L160-L162)

4) **Calidad de datos / adopción**
- Riesgo: el cliente percibe fricción si la captura se vuelve “formulario”.
- Mitigación: captura conversacional guionada, medir retrabajo y abandono.

---

## H) Paquete de entrega (checklist administrativo) — con placeholders

> Checklist (artefactos) según SOT de anteproyecto. **Completar con links concretos** en el momento de preparar entrega. (Source: brokia/thesis-hub/ANTE_PROYECTO_SOT_V1.md:L15-L70)

- [ ] Formulario de Presentación de Proyectos (Aulas) — LINK: __________
- [ ] Formulario con descripción funcional por propuesta — LINK: __________
- [ ] PDF del correo con visto bueno docente laboratorio — LINK: __________
- [ ] (Si aplica) Proyecto emprendedor: formulario adicional + documentación CIE — LINK: __________
- [ ] (Si aplica) Proyecto con empresa: carta de autorización firmada — LINK: __________
- [ ] Certificados de escolaridad (por integrante) — LINK: __________
- [ ] CVs (por integrante) — LINK: __________
- [ ] Evidencia de inscripción a la instancia (por integrante) — LINK: __________

Notas de proceso relevantes:
- La propuesta/anteproyecto es evaluada por tribunal; si es aceptada se asigna tutor. (Source: brokia/tesis/docs/drive-pdfs/304-normas-para-el-desarrollo-de-trabajos-finales-de-carrera__documento-304.txt:L44-L46)
- Si la propuesta es inadecuada puede pedirse reformulación en ≤2 semanas. (Source: brokia/tesis/docs/drive-pdfs/304-normas-para-el-desarrollo-de-trabajos-finales-de-carrera__documento-304.txt:L46-L48)

---

## I) INBOX (incógnitas/pendientes) — con owner sugerido

- (Rodrigo) Evidencia específica de renovaciones: pasos/artefactos/métricas (para robustecer la visión ecosistema). (Source: brokia/thesis-hub/11_ECOSYSTEM_CONCEPT_MAP.md:L80-L83)
- (Rodrigo) Evidencia específica de siniestros desde correduría: flujo FNOL → resolución (para robustecer la visión ecosistema). (Source: brokia/thesis-hub/11_ECOSYSTEM_CONCEPT_MAP.md:L85-L88)
- (Rodrigo) Requisitos concretos de cumplimiento/retención (qué conservar, por cuánto tiempo, fallas típicas) aplicables a correduría. (Source: brokia/thesis-hub/11_ECOSYSTEM_CONCEPT_MAP.md:L259-L268)
- (Manu) Definir dataset mínimo para cotización (campos) por tipo de aseguradora y cómo se valida completitud.
- (JM) Proveer acceso a N casos reales para línea base y post‑medición (sin PII en el repositorio de tesis).
- (Manu) Definir mecanismo de etiquetado simple para clasificar mensajes como “retrabajo” vs “información nueva” (para métricas).
