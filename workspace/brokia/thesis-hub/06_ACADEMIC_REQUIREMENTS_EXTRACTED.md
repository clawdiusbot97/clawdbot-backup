# 06 — Academic Requirements Extracted (ORT/CIE) — from local `.txt`

Authoritative inputs folder:
- `/home/manpac/.openclaw/workspace/brokia/tesis/docs/drive-pdfs/` (ALL `*.txt`)

> Citation format: `source_file:L<line>` (line numbers from `nl -ba` output).
> If a source is known to be lossy (legacy `.doc` → `strings`), items derived from it are marked **LOW_CONFIDENCE**.

---

## Sources used (this extraction)

High-confidence sources (PDF→txt):
- `302-normas-especificas-...__documento-302.txt`
- `303-hoja-de-verificacion-...__documento-303.txt`
- `304-normas-para-el-desarrollo-...__documento-304.txt`
- `FAQ Proyectos Finales de Sistemas 122021.txt`
- `Carta PY ID MARZO 26.txt`
- `Proyectos emprendedores.txt`

Template/model sources (DOCX→txt):
- `Aprobación de propuesta de proyecto.txt`
- `Carta de Confidencialidad_MODELO.txt`

Lossy sources (DOC→strings→txt):
- `ALUMNOS - proyectos elegidos.txt` (**LOW_CONFIDENCE**)
- `PresentacionProyectosAlumnos 2025.txt` (**LOW_CONFIDENCE**)

---

## Mandatory deliverables / submissions (anteproyecto + proceso)

### Anteproyecto — requisitos obligatorios para la entrega
- Formulario de Presentación de Proyectos (en Aulas). (Source: `Carta PY ID MARZO 26.txt:L50-L52`)
- Formulario con descripción funcional de cada propuesta de proyecto (“Formulario para Presentación de Proyectos (descripción funcional)”). (Source: `Carta PY ID MARZO 26.txt:L52-L54`)
- Copia del correo electrónico (en PDF) con visto bueno del docente del laboratorio para la presentación de cada proyecto elegido. (Source: `Carta PY ID MARZO 26.txt:L54-L55`)
  - Existe un texto modelo para ese correo (“Aprobación de propuesta de proyecto”), que indica que el docente envía el email, el equipo saca copia en PDF y la incluye en la entrega de anteproyecto. (Source: `Aprobación de propuesta de proyecto.txt:L1-L2`)
- Si corresponde (proyecto emprendedor): Formulario adicional + documentación exigida por CIE. (Source: `Carta PY ID MARZO 26.txt:L56-L57`)
- Si corresponde (proyecto propio con empresa): carta de autorización firmada (en Aulas). (Source: `Carta PY ID MARZO 26.txt:L58-L59`)
- Certificado de escolaridad de cada integrante (se solicita por Gestión). (Source: `Carta PY ID MARZO 26.txt:L60`)
- Curriculum vitae de cada integrante del equipo. (Source: `Carta PY ID MARZO 26.txt:L61`)
- Regla de bloqueo: la asignación de proyecto no se realiza si falta alguno de los ítems anteriores. (Source: `Carta PY ID MARZO 26.txt:L63-L65`)
- Entrega por un integrante del equipo, pero es indispensable que todos estén inscriptos a la instancia. (Source: `Carta PY ID MARZO 26.txt:L66-L67`)

### Proyectos emprendedores (CIE)
- Postular idea al CIE vía web cie.ort.edu.uy. (Source: `Proyectos emprendedores.txt:L9-L10`)
- Tomar “Taller Emprendedor”. (Source: `Proyectos emprendedores.txt:L11-L12`)
- Completar “Ficha Taller Proyecto emprendedor” y presentarla al CIE para aprobación y firma. (Source: `Proyectos emprendedores.txt:L11-L13`)
- En la carta: previo a presentar la propuesta, contar con aprobación del CIE (carta firmada). (Source: `Carta PY ID MARZO 26.txt:L105-L107`)

### Proceso de entrega / inscripción (universidad)
- No se puede comenzar ninguna etapa (incluye “presentación de la propuesta o del anteproyecto”) sin estar previamente inscripto al curso correspondiente en el sistema de gestión. (Source: `304-normas-para-el-desarrollo-de-trabajos-finales-de-carrera__documento-304.txt:L12-L15`)
- La entrega finalizada debe realizarse según cronograma; cada integrante debe inscribirse individualmente a la entrega vía sistema de autoservicio (gestión.ort.edu.uy). (Source: `304-normas-para-el-desarrollo-de-trabajos-finales-de-carrera__documento-304.txt:L72-L75`)
- “La universidad sólo recibe los trabajos finales en la Bedelía correspondiente.” (Source: `304-normas-para-el-desarrollo-de-trabajos-finales-de-carrera__documento-304.txt:L75-L76`)
- El material debe entregarse acompañado de boletas de inscripción; si falta inscripción de un integrante se interpreta como abandono de ese integrante. (Source: `304-normas-para-el-desarrollo-de-trabajos-finales-de-carrera__documento-304.txt:L77-L79`)

---

## Mandatory sections / headings (estructura) — Documento 302

Componentes (en orden): Portada; Declaración de autoría; Dedicatoria (opcional); Agradecimientos (opcional); Abstract; Palabras clave; Índice; Índice de tablas (opcional); Índice de ilustraciones (opcional); Cuerpo de la obra; Referencias bibliográficas; Anexos. (Source: `302-normas-especificas-...__documento-302.txt:L40-L45`)

Portada (obligatoria) debe incluir (entre otros): Universidad ORT Uruguay; Facultad de Ingeniería; título; leyenda “Entregado como requisito…”; autores; tutor; año. (Source: `302-normas-especificas-...__documento-302.txt:L52-L65`)

Declaración de autoría (obligatoria): incrustar firmas escaneadas + aclaración + fecha. (Source: `302-normas-especificas-...__documento-302.txt:L68-L70`)

Abstract (obligatorio): máximo 400 palabras. (Source: `302-normas-especificas-...__documento-302.txt:L78-L83`)

Palabras clave (obligatorio): deben incluirse en propiedades del PDF para indexación. (Source: `302-normas-especificas-...__documento-302.txt:L91-L95`)

Índice (obligatorio): debe incluir partes/capítulos/subcapítulos + referencias bibliográficas + anexos. (Source: `302-normas-especificas-...__documento-302.txt:L96-L102`)

Referencias bibliográficas (obligatoria): formato IEEE. (Source: `302-normas-especificas-...__documento-302.txt:L106-L109`)

Cuerpo: dividido en capítulos. (Source: `302-normas-especificas-...__documento-302.txt:L103-L105`)

---

## Formatting rules (extensión, PDF, márgenes, tipografía, paginación)

### Extensión
- Máximo 350 páginas sin incluir anexos. (Source: `302-normas-especificas-...__documento-302.txt:L124-L126`; también `303-hoja-de-verificacion-...__documento-303.txt:L61-L62`)

### Entrega en PDF + propiedades
- Trabajo en formato PDF; propiedades del PDF deben coincidir con la portada (título, autores, palabras clave, etc.). (Source: `303-hoja-de-verificacion-...__documento-303.txt:L62-L66`)
- Documento electrónico PDF debe tener asociadas propiedades (autores, título, tema, palabras clave). (Source: `302-normas-especificas-...__documento-302.txt:L215-L219`)

### Tipografía
- Tamaño de letra del texto normal: 12 puntos. (Source: `303-hoja-de-verificacion-...__documento-303.txt:L72-L75`; también `302-normas-especificas-...__documento-302.txt:L175-L183`)
- Usar el mismo tipo de letra en todo el trabajo (incluye preliminares y bibliografía). (Source: `303-hoja-de-verificacion-...__documento-303.txt:L77-L79`; `302-normas-especificas-...__documento-302.txt:L180-L183`)
- Itálica/cursiva: no usar salvo palabras en idioma distinto o citas literales. (Source: `303-hoja-de-verificacion-...__documento-303.txt:L67-L70`; `302-normas-especificas-...__documento-302.txt:L175-L178`)

### Márgenes
- 2,5 cm mínimo de margen para el texto en cada borde; 1,5 cm mínimo para número de página. (Source: `302-normas-especificas-...__documento-302.txt:L150-L153`)
- En hoja de verificación: márgenes 2,5 cm (aprox.) o superior. (Source: `303-hoja-de-verificacion-...__documento-303.txt:L117-L120`)

### Paginación y numeración
- Todo el trabajo paginado en una sola secuencia; portada cuenta como página 1, pero no imprime el número. (Source: `302-normas-especificas-...__documento-302.txt:L138-L140`; `303-hoja-de-verificacion-...__documento-303.txt:L151-L156`)
- Números de página en ángulo inferior derecho; solo el número (sin “página”, sin 1/40, sin “pag.”). (Source: `302-normas-especificas-...__documento-302.txt:L144-L147`; `303-hoja-de-verificacion-...__documento-303.txt:L161-L167`)
- No usar encabezados ni pie de página (excepto número). (Source: `302-normas-especificas-...__documento-302.txt:L149`; `303-hoja-de-verificacion-...__documento-303.txt:L123-L132`)

### Espaciado
- Párrafos: interlineado 1,5; espaciado anterior 0p y posterior 12p. (Source: `302-normas-especificas-...__documento-302.txt:L157-L159`)
- Títulos (cualquier nivel): interlineado 1,5 y espaciado anterior 12p y posterior 12p. (Source: `302-normas-especificas-...__documento-302.txt:L160-L161`)
- En hoja de verificación: “Deja doble espacio después de cada título y/o subtítulo y entre párrafos del texto.” (Source: `303-hoja-de-verificacion-...__documento-303.txt:L175-L177`) **(interpretación de compatibilidad con 1,5 NO inferida)**

---

## Submission process + approvals/signatures

- La propuesta (propuesta/anteproyecto) es evaluada por un tribunal; si es aceptada, se asigna tutor. (Source: `304-normas-para-el-desarrollo-...__documento-304.txt:L44-L46`)
- Si la propuesta es inadecuada, puede solicitarse reformulación o nueva; plazo no superior a dos semanas. (Source: `304-normas-para-el-desarrollo-...__documento-304.txt:L46-L48`)
- Tutor no puede actuar como corrector ni participar en tribunal. (Source: `304-normas-para-el-desarrollo-...__documento-304.txt:L19-L20`)
- Declaración de autoría: firmas escaneadas + aclaración + fecha. (Source: `302-normas-especificas-...__documento-302.txt:L68-L70`)
- En anteproyecto: incluir PDF del correo con visto bueno del docente (modelo disponible). (Source: `Carta PY ID MARZO 26.txt:L54-L55`; `Aprobación de propuesta de proyecto.txt:L1-L2`)

---

## Evaluation criteria / tribunal / notas

- Documento 303 define niveles de conformidad (A/B/C/D) y que el nivel global corresponde al más severo constatado. (Source: `303-hoja-de-verificacion-...__documento-303.txt:L11-L13`)
- Si no se cumplen pautas de formato en los plazos estipulados, el trabajo no puede ser aprobado. (Source: `303-hoja-de-verificacion-...__documento-303.txt:L7-L9`)
- En 304: el fallo del tribunal es integral (contenido + formato) y “ningún trabajo con errores severos de formato puede obtener una calificación superior a 85 puntos.” (Source: `304-normas-para-el-desarrollo-...__documento-304.txt:L122-L124`)
- En FAQ: el proyecto se califica solo luego de la entrega final, por tribunal (2 docentes externos al laboratorio, uno extranjero). (Source: `FAQ Proyectos Finales de Sistemas 122021.txt:L84-L86`)
- En FAQ: no hay notas intermedias; se califica la entrega final luego de la defensa oral y pública. (Source: `FAQ Proyectos Finales de Sistemas 122021.txt:L92-L95`)

---

## Applies_to (Licenciatura vs Ingeniería)

- Duración esperada: Ingeniería en Sistemas 1 año; Licenciatura en Sistemas 6 meses. (Source: `FAQ Proyectos Finales de Sistemas 122021.txt:L41-L44`)
- Si el requisito aplica específicamente a una carrera (Ingeniería vs Licenciatura) fuera de lo anterior: **UNKNOWN** (no se encontró mención explícita en los `.txt` revisados).

---

## LOW_CONFIDENCE items (lossy sources)

- `ALUMNOS - proyectos elegidos.txt`: contiene palabras como “Firma” y “Proyectos seleccionados”, pero el contexto completo puede estar incompleto por extracción `strings`. (Source: `ALUMNOS - proyectos elegidos.txt:L12-L16`) **LOW_CONFIDENCE**
- `PresentacionProyectosAlumnos 2025.txt`: se observa que el documento “presenta el proyecto” y menciona “carta firmada”, pero el texto parece cortado en varios lugares. (Source: `PresentacionProyectosAlumnos 2025.txt:L9-L12`; `L29-L34`) **LOW_CONFIDENCE**
