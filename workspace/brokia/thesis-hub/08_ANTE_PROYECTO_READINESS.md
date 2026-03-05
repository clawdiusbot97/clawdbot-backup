# 08 — Anteproyecto Readiness (evaluation) — Brokia

Inputs used:
- `06_ACADEMIC_REQUIREMENTS_EXTRACTED.md`
- `ANTE_PROYECTO_SOT_V1.md`
- `02_ACADEMIC_CHECKLIST.md`
- `05_SOURCES.md`

Scope of this evaluation:
- **Detect academic-content risks (NOT formatting risks).**
- No cron changes. No deadline changes. No changes to VALID/EXCLUDED lists.

---

## 1) Requirements classification (format vs admin vs content)

### A) Pure formatting requirements (tracked but not evaluated here)
These are requirements that only constrain presentation/format, not academic content:
- Document structure components (Portada, Declaración, Abstract, Keywords, Índice, etc.) are *structural-format* requirements in 302. (Source: `302-normas-especificas-...__documento-302.txt:L40-L45`)
- Max length 350 pages excl. annexes. (Source: `302-normas-especificas-...__documento-302.txt:L124-L126`; `303-hoja-de-verificacion-...__documento-303.txt:L61-L62`)
- PDF required + PDF properties must match cover (metadata). (Source: `303-hoja-de-verificacion-...__documento-303.txt:L62-L66`; `302-normas-especificas-...__documento-302.txt:L215-L219`)
- Fonts (12pt, consistent, italics constraints). (Source: `303-hoja-de-verificacion-...__documento-303.txt:L67-L79`; `L72-L75`)
- Margins and spacing and pagination rules. (Source: `302-normas-especificas-...__documento-302.txt:L150-L161`; `303-hoja-de-verificacion-...__documento-303.txt:L117-L132`; `L151-L167`)

### B) Administrative artifacts (submission package / approvals)
These are required artifacts or admin steps that gate acceptance/assignment:
- Aulas forms: “Formulario de Presentación de Proyectos” + “Formulario descripción funcional”. (Source: `Carta PY ID MARZO 26.txt:L50-L54`)
- Visto bueno email PDF from lab teacher. (Source: `Carta PY ID MARZO 26.txt:L54-L55`; model `Aprobación de propuesta de proyecto.txt:L1-L2`)
- Certificado de escolaridad + CV por integrante. (Source: `Carta PY ID MARZO 26.txt:L60-L61`)
- Completeness gate: no assignment if missing items; all members must be enrolled/inscribed. (Source: `Carta PY ID MARZO 26.txt:L63-L67`)
- Precondition: must be enrolled in the corresponding course before any stage. (Source: `304-normas-para-el-desarrollo-de-trabajos-finales-de-carrera__documento-304.txt:L12-L15`)
- Delivery process constraints (Bedelía / autoservicio). (Source: `304-normas-para-el-desarrollo-de-trabajos-finales-de-carrera__documento-304.txt:L72-L79`)
- CIE path (if emprendedor): idea submission + workshop + CIE approval/carta + lab endorsement. (Source: `Proyectos emprendedores.txt:L9-L13`; `Carta PY ID MARZO 26.txt:L105-L107`; `L112-L113`; `FAQ Proyectos Finales de Sistemas 122021.txt:L35-L38`)
- Optional confidentiality request (admin/legal). (Source: `Carta de Confidencialidad_MODELO.txt:L10-L13`; also policy in `304-...__documento-304.txt:L131-L134`)

### C) Academic content expectations (explicit or implicit)
These are requirements that constrain what the anteproyecto must *say* / prove (content), even if not a full template:
- The proposal/anteproyecto is evaluated by a tribunal; if inadequate, must be reformulated/new within <=2 weeks. (Source: `304-normas-para-el-desarrollo-de-trabajos-finales-de-carrera__documento-304.txt:L44-L48`)
- The project must have **academic value**; scope defined with the client; innovator (product/process/tech/integration). (Source: `FAQ Proyectos Finales de Sistemas 122021.txt:L19-L22`)
- The tutor is responsible for giving the project academic value (content guidance). (Source: `FAQ Proyectos Finales de Sistemas 122021.txt:L23-L24`)
- For emprendimientos: demonstrate market opportunity; validation supported by CIE across technical/market/economic/legal dimensions. (Source: `Carta PY ID MARZO 26.txt:L103-L107`)

**Key gap:** none of the extracted sources provides a **canonical “anteproyecto academic contents outline”** (problem statement, objectives, methodology, evaluation plan, etc.) as a prescribed list. `ANTE_PROYECTO_SOT_V1.md` currently uses placeholders for those.

---

## 2) Detected ambiguities / missing references

### 2.1 Missing definition: what an “anteproyecto” must academically contain
Status: **MISSING / UNKNOWN in authoritative sources available**.
Evidence:
- SOT explicitly notes that sources describe structure/format/process but **do not enumerate** a standard academic anteproyecto index. (Source: `ANTE_PROYECTO_SOT_V1.md` comment under section 9)
- Requirements extraction doc does not list mandatory anteproyecto headings beyond the generic 302 monograph structure. (Source: `06_ACADEMIC_REQUIREMENTS_EXTRACTED.md` sections “Mandatory sections/headings” and “Mandatory deliverables”)

Impact:
- High **content risk**: you can comply with forms + format and still fail tribunal expectations if the academic framing is weak/underspecified.

### 2.2 Ambiguity: “Documento 302 structure” vs “anteproyecto” structure
Observation:
- Documento 302 defines structure for the TFDC monograph components (Portada/Abstract/etc.). (Source: `302-normas-especificas-...__documento-302.txt:L40-L45`)
- Carta defines *administrative package* for anteproyecto submission (forms + approvals). (Source: `Carta PY ID MARZO 26.txt:L50-L67`)

Ambiguity:
- It is unclear (from extracted sources) whether the anteproyecto must be a monograph-like document strictly following 302, or whether 302/303 constraints apply mainly to final delivery (and anteproyecto is mostly forms + description).

### 2.3 Missing referenced documents (306/307)
Status: **Referenced but not present in local mirror**.
Evidence:
- Carta: “Documentos 302-FI, 303, 304, 306 y 307”. (Source: `Carta PY ID MARZO 26.txt:L3-L4`)
- Local mirror inventory in `05_SOURCES.md` lists 302/303/304 but does **not** list 306 or 307. (Source: `05_SOURCES.md`)

Risk:
- Structural/content guidance may be incomplete (e.g., doc 306 “títulos/abstract/informes de corrección” is explicitly referenced in 302 too). (Source: `302-normas-especificas-...__documento-302.txt:L82-L83`)

---

## 3) Risk classification

### Structural risk (academic structure / template clarity)
**HIGH**
- Missing authoritative definition of “anteproyecto contents”.
- Ambiguity between monograph structure (302) and anteproyecto expectations.

### Administrative risk (artifacts / gating)
**MEDIUM**
- The administrative package is well enumerated (Carta), but currently all checklist items are TODO and artifacts are not yet linked in `05_SOURCES.md`.

### Content risk (academic justification / value / scope)
**HIGH**
- Explicit expectation of “valor académico” exists, but there’s no extracted rubric or template that ensures you cover it.
- Emprendedor track requires validation dimensions (técnica/mercado/económica/legal) but the anteproyecto content outline to demonstrate that is not specified in available sources.

---

## 4) Compliance % (content-focused)

Definition (content-focused, not format):
- Measures whether we have an authoritative content template + whether content-expectation items are *actionably covered*.

Result:
- **Compliance (content-focused): 35%**

Breakdown:
- 15% — We have SOT structure + placeholders in a single SOT doc. (Evidence: `ANTE_PROYECTO_SOT_V1.md` exists and is populated with headings)
- 10% — We extracted explicit content expectations (“valor académico”, “alcance”, “innovación”, emprendedor validation dimensions). (Evidence: `06_ACADEMIC_REQUIREMENTS_EXTRACTED.md`)
- 10% — Checklist items exist with evidence pointers (actionability), but all are TODO (no actual content drafted yet).
- -0% — Missing doc 306/307 reduces confidence but doesn’t prevent drafting.

(If you prefer a strict “done items / total content items” ratio, it would currently be **0%** because no checklist items are marked DONE.)

---

## 5) Top 3 unknowns (blockers)

1) **What must the anteproyecto contain academically (sections/criteria) beyond admin package?**
   - Evidence: Not specified in extracted sources; SOT section 9 is placeholder. (Source: `ANTE_PROYECTO_SOT_V1.md` section 9 comment)

2) **Do 302/303 formatting/structure constraints apply fully to the anteproyecto document, or mainly to final delivery?**
   - Evidence: Carta ties anteproyecto to admin package; 302/303 define TFDC monograph formatting. (Sources: `Carta PY ID MARZO 26.txt:L50-L67`; `302-normas-especificas-...__documento-302.txt:L40-L45`)

3) **Missing referenced docs 306/307 (and possibly 306 content referenced by 302).**
   - Evidence: referenced but absent in local mirror. (Sources: `Carta PY ID MARZO 26.txt:L3-L4`; `05_SOURCES.md` inventory)

---

## 6) Next actions (content-first, minimal)

1) Obtain docs **306/307** (or confirm they’re not needed for anteproyecto) and sync into `drive-pdfs/`.
2) Ask ORT/CIE (or tutor/lab) for the **anteproyecto evaluation criteria / expected outline** (even a 1-page template) and add it as an authoritative `.txt` source.
3) Once (2) exists, replace SOT section 9 placeholders with headings that are explicitly prescribed.
