# Brokia Work-Items System — Especificación Oficial v1.0

## 1. Ubicación

**Source of truth:** `brokia/workitems-spec.md`  
**Referencia interna:** `workitems/` contiene implementación (scripts, templates, items). Para la especificación ver este archivo.

---

## 2. ID Format

**Convención:** `<TYPE>-<YYYYMMDD>-<NNN>`

- `TYPE`: Prefijo del tipo (ver tabla abajo)
- `YYYYMMDD`: Fecha de creación
- `NNN`: Incremental por tipo (001, 002, 003...)

**Prefijos por tipo:**

| Type | Prefijo | Ejemplo |
|------|---------|---------|
| idea | IDEA | IDEA-20260225-001 |
| requirement | REQ | REQ-20260225-001 |
| feature | FEAT | FEAT-20260225-001 |
| blocker | BLOCK | BLOCK-20260225-001 |
| decision | DEC | DEC-20260225-001 |
| risk | RISK | RISK-20260225-001 |
| research | RES | RES-20260225-001 |
| solution | SOL | SOL-20260225-001 |

**Regla del NNN:** El contador `NNN` es independiente por tipo. REQ-20260225-001 y FEAT-20260225-001 pueden coexistir.

---

## 3. Types Permitidos

Types exactos (8 total):

1. **idea** — Proposición de valor, problema a resolver, oportunidad identificada
2. **requirement** — Necesidad documentada de usuario/negocio
3. **feature** — Funcionalidad a desarrollar (producto)
4. **blocker** — Impedimento activo que detiene progreso
5. **decision** — Decisión arquitectónica o de negocio pendiente
6. **risk** — Riesgo identificado con plan de mitigación
7. **research** — Investigación técnica o de dominio (spike)
8. **solution** — Solución técnica documentada post-research

---

## 4. Estados Oficiales

Estados exactos del frontmatter (8 total):

| Estado | Significado |
|--------|-------------|
| **NEW** | Creado, sin clasificar en pipeline |
| **RESEARCHING** | En investigación/análisis |
| **RESEARCHED** | Investigación completada, esperando decisión |
| **DECIDED** | Decisión tomada, listo para planificar |
| **PLANNED** | Planificado, listo para construir |
| **BUILDING** | En implementación activa |
| **DONE** | Completado y validado |
| **DROPPED** | Descartado/cancelado |

**Mapping a carpetas (implementación interna):**
- NEW → `inbox/`
- RESEARCHING → `active/researching/`
- RESEARCHED → `active/researched/`
- DECIDED → `active/decided/`
- PLANNED → `active/planned/`
- BUILDING → `active/building/`
- DONE → `archive/done/`
- DROPPED → `archive/dropped/`

---

## 5. Tags

### Regla: Type-tag obligatorio

Todo work-item DEBE incluir su type como tag:
- `#idea` para type: idea
- `#requirement` para type: requirement
- etc.

### Estándar de Normalización

**Almacenamiento:** Los tags se almacenan en el YAML **sin #** (ej: `  - idea`, `  - voice`).

**Notación visual:** El prefijo `#` se usa solo en documentación y UI para distinguir tags de texto plano.

**Normalización automática:**
- `wi-update.sh --add-tag #voice` → almacena como `  - voice`
- `wi-export.sh` → exporta como `"voice"` (sin #)
- Los Tag Triggers comparan contra nombres normalizados (sin #)

### Tags de dominio (ejemplos)

| Categoría | Ejemplos |
|-----------|----------|
| Canal | `#whatsapp`, `#email`, `#voice`, `#web` |
| Funcionalidad | `#cotizacion`, `#renovacion`, `#siniestros`, `#pagos` |
| Negocio | `#pricing`, `#comisiones`, `#compliance` |
| Técnico | `#ocr`, `#ai`, `#integration`, `#ui`, `#api` |
| Prioridad | `#urgent`, `#quickwin`, `#techdebt` |
| Stakeholder | `#juan-manuel`, `#rodrigo`, `#cliente` |

---

## 6. Frontmatter YAML

### Campos Obligatorios

```yaml
---
id: IDEA-20260225-001              # Format: TYPE-YYYYMMDD-NNN
type: idea                          # Debe ser uno de los 8 types oficiales
title: "Título claro y descriptivo"
description: |
  Descripción detallada del work-item.
  Puede ocupar múltiples líneas.
status: NEW                        # Debe ser uno de los 8 estados oficiales
tags:
  - idea                           # Type-tag obligatorio
  - cotizacion                     # Tags de dominio
  - ai
owner: brokia                     # Quien tiene la bola
priority: p1                      # p0 | p1 | p2 | p3
implementation_approved: false    # ⚠️ CRÍTICO: default false
legacy_id: ""                     # Opcional: para trazabilidad migraciones
created_at: 2026-02-25T05:00:00Z
updated_at: 2026-02-25T05:00:00Z
---
```

### Campos Optativos

```yaml
parent_id: ""           # ID del item padre (para jerarquías)
requirement_id: ""      # Para features: link al REQ padre
due_date: ""            # Fecha límite estimada
stakeholders: []        # Lista de personas a consultar
---
```

### Campo implementation_approved

**Regla CRÍTICA:**

- `implementation_approved: false` (default para todos los types)
- Solo puede cambiarse a `true` si el usuario escribe **literalmente**:
  - `"APROBAR IMPLEMENTACIÓN"`
  - `"HACER MVP"`

**Aplicación del guardrail:**

| Type | Puede pasar a BUILDING sin aprobación? |
|------|----------------------------------------|
| idea | ❌ **NUNCA** — Requiere aprobación explícita |
| requirement | ✅ Sí (ya es requerimiento aprobado) |
| feature | ✅ Sí (viene de requirement o idea aprobada) |
| blocker | ✅ Sí (es fix urgente) |
| decision | N/A (no tiene fase BUILDING) |
| risk | ✅ Sí (mitigación es fix) |
| research | N/A (no tiene fase BUILDING) |
| solution | N/A (documentación, no código) |

**Regla "Idea ≠ Implementación":**

> Una `idea` NUNCA se implementa directamente. El flujo obligatorio es:
> 1. Idea pasa por pipeline: RESEARCHING → RESEARCHED
> 2. Se valida con stakeholders (Juan Manuel, Rodrigo)
> 3. **SOLO** si el usuario escribe `"APROBAR IMPLEMENTACIÓN"` o `"HACER MVP"`, se puede:
>    - Convertir la idea en `type: feature`, o
>    - Crear un `requirement` derivado, o
>    - Marcar `implementation_approved: true` (si se mantiene como idea documentada)

---

## 7. Estructura Mínima por Type

### type: idea

```markdown
---
# frontmatter
---

## Contexto
<!-- De dónde surge la idea -->

## Hipótesis
<!-- Qué creemos que es verdad -->

## Validación Pendiente
<!-- Qué necesitamos confirmar -->

## Notas de Investigación
<!-- Se completa en fase RESEARCHING -->

## Resultado de Validación
<!-- Se completa post-validación -->
- Validado: Sí / No / Parcial
- Próximo paso: 
```

### type: requirement

```markdown
---
# frontmatter
---

## Contexto de Negocio
<!-- Por qué se necesita -->

## Criterios de Aceptación
- [ ] Criterio 1
- [ ] Criterio 2

## Notas Técnicas
<!-- Análisis de viabilidad -->

## Dependencias
<!-- Qué necesitamos primero -->
```

### type: feature

```markdown
---
# frontmatter
---

## Alcance
<!-- Qué incluye y qué NO -->

## Tareas Técnicas
- [ ] Task 1
- [ ] Task 2

## QA / Testing
- [ ] Tests unitarios
- [ ] Validación con usuario
```

### type: blocker

```markdown
---
# frontmatter
---

## Impacto
<!-- Qué está bloqueando -->

## Causa Raíz
<!-- Análisis del problema -->

## Mitigación
<!-- Acciones para resolver -->
```

### type: decision

```markdown
---
# frontmatter
---

## Contexto
<!-- Qué decidimos -->

## Opciones
<!-- Alternativas consideradas -->

## Decisión
<!-- Opción elegida y por qué -->

## Implicaciones
<!-- Qué cambia -->
```

### type: risk

```markdown
---
# frontmatter
---

## Descripción
<!-- Qué puede salir mal -->

## Probabilidad / Impacto
<!-- Alta/Media/Baja -->

## Mitigación
<!-- Plan de contingencia -->
```

### type: research

```markdown
---
# frontmatter
---

## Pregunta de Investigación
<!-- Qué queremos saber -->

## Hallazgos
<!-- Resultados del research -->

## Recomendación
<!-- Conclusión y próximo paso -->
```

### type: solution

```markdown
---
# frontmatter
---

## Problema Resuelto
<!-- Link al research/decision -->

## Solución Técnica
<!-- Cómo se implementa -->

## Diagramas / Código
<!-- Referencias -->
```

---

## 8. Ejemplos Completos

### Ejemplo 1: Idea (no aprobada para implementación)

**Archivo:** `workitems/inbox/IDEA-20260225-001.md`

```markdown
---
id: IDEA-20260225-001
type: idea
title: "Cotización automática desde foto de documento de vehículo"
description: |
  Permitir al cliente sacar foto a su libreta de conducir o documento
  de matrícula y recibir cotizaciones de múltiples aseguradoras
  en segundos, sin tipear datos manualmente.
status: NEW
tags:
  - idea
  - cotizacion
  - ocr
  - ai
  - whatsapp
  - juan-manuel
owner: brokia
priority: p1
implementation_approved: false
legacy_id: "WI-2026-001"
created_at: 2026-02-25T05:00:00Z
updated_at: 2026-02-25T05:00:00Z
---

## Contexto

Juan Manuel mencionó que el 80% del tiempo de cotización se pierde
en tipear datos que ya están en documentos. Si pudiéramos extraerlos
automáticamente, reduciríamos el proceso de 15 min a 2 min.

## Hipótesis

1. Los clientes tienen a mano su libreta de conducir
2. La tecnología OCR es suficientemente precisa para documentos uruguayos
3. Las aseguradoras aceptarían recibir datos estructurados por API

## Validación Pendiente

- [ ] ¿Los clientes usarían esta funcionalidad?
- [ ] ¿Qué precisión de OCR necesitamos?
- [ ] ¿Qué aseguradoras tienen APIs disponibles?
- [ ] ¿Costo/beneficio de implementación?

## Notas de Investigación

<!-- Completar en fase RESEARCHING -->

## Resultado de Validación

<!-- Completar post-validación -->
- Validado: (pendiente)
- Próximo paso: (pendiente aprobación para implementar)
```

### Ejemplo 2: Requirement (aprobado)

**Archivo:** `workitems/inbox/REQ-20260225-001.md`

```markdown
---
id: REQ-20260225-001
type: requirement
title: "Almacenar historial de cotizaciones por cliente"
description: |
  Sistema debe guardar historial de todas las cotizaciones realizadas
  por cada cliente, permitiendo consultar versiones anteriores y
  comparar cambios en precios/coberturas a lo largo del tiempo.
status: NEW
tags:
  - requirement
  - cotizacion
  - data
  - juan-manuel
owner: brokia
priority: p0
implementation_approved: true
legacy_id: ""
created_at: 2026-02-25T05:10:00Z
updated_at: 2026-02-25T05:10:00Z
---

## Contexto de Negocio

Actualmente cuando un cliente llama a los 11 meses para renovar,
Juan Manuel debe reconstruir manualmente qué cobertura eligió,
qué zona declaró, qué beneficios adicionales pidió. Pierde 10-15
minutos por cliente y hay riesgo de error.

## Criterios de Aceptación

- [ ] Cada cotización queda guardada con timestamp y datos completos
- [ ] Se puede buscar historial por cédula del cliente
- [ ] Se puede comparar cotización actual vs anterior
- [ ] Se puede ver evolución de precios por aseguradora
- [ ] Exportable a PDF para el cliente

## Notas Técnicas

- Modelo: `QuoteHistory` con relación a `Client`
- Retención: 7 años (normativa)
- Backup: incluir en política existente

## Dependencias

- Ninguna (puede implementarse standalone)
```

---

## 9. Reglas de Negocio

### Regla 1: Idea ≠ Implementación

```
IF type == "idea" AND implementation_approved == false:
  → NO permitir pasar a BUILDING
  → NO permitir crear código/feature
  → Permitir solo: RESEARCHING, RESEARCHED, DECIDED, DROPPED
  
IF type == "idea" AND (user_says == "APROBAR IMPLEMENTACIÓN" OR user_says == "HACER MVP"):
  → SET implementation_approved = true
  → AHORA sí permitir PLANNED → BUILDING
```

### Regla 2: Type-tag obligatorio

```
FOR cada work-item:
  ASSERT tags CONTAIN type
  EJ: type: "idea" → tags DEBE incluir "idea"
```

### Regla 3: ID inmutable

```
UNA VEZ CREADO el archivo, el campo id NUNCA cambia.
Para correcciones: crear nuevo item + legacy_id apuntando al anterior.
```

### Regla 4: Transiciones válidas

```
NEW → RESEARCHING → RESEARCHED → DECIDED → PLANNED → BUILDING → DONE
                         ↓            ↓
                       DROPPED      DROPPED
```

Transiciones inválidas (prohibidas):
- NEW → BUILDING (sin pasar por research)
- IDEA → BUILDING (sin implementation_approved)
- DONE → cualquier otro (usar nuevo item si hay regresión)

---

## 10. Tag Triggers

Los tags en los work-items activan automáticamente consideraciones y acciones durante el pipeline de research.

### Triggers Implementados

| Tag | Trigger | Acción Automática |
|-----|---------|-------------------|
| `#voice` | 🔊 Voice Integration | Alerta sobre WhatsApp Business API, TTS, compliance de grabaciones |
| `#whatsapp` | 💬 WhatsApp Channel | Requerir Meta Business Verification, plantillas aprobadas, costo por conversación |
| `#security` | 🔒 Security Review | Requerir Security Review antes de BUILDING, Threat Model, compliance check |
| `#cost` | 💰 Cost Analysis | Requerir `cost_estimate_usd_month` en frontmatter, validar ROI |
| `#ai` | 🤖 AI/ML Feature | Evaluar costo de APIs, data privacy, fallback planning |
| `#urgent` | 🚨 Escalation | Notificar owner/stakeholders, considerar standup dedicado |
| `#p0` | 🔥 Critical Priority | Fast-track por chief, daily updates obligatorios |
| `#techdebt` | ⚠️ Debt Alert | Documentar impacto, plan de refactor obligatorio |

### Ejemplo de Output de Triggers

```
🏷️  Tags detectados: idea voice ai whatsapp

🏷️  Evaluando Tag Triggers...
   🔊 TRIGGER: Tag 'voice' detectado
      → Considerar: Integración con WhatsApp Business API
      → Considerar: Text-to-Speech para respuestas
      → Revisar compliance de grabaciones
   🤖 TRIGGER: Tag 'ai' detectado
      → Evaluar: Costo de API (OpenAI/etc)
      → Considerar: Data privacy y retención
   💬 TRIGGER: Tag 'whatsapp' detectado
      → Requerir: Meta Business Verification
```

### Reglas de Tag Triggers

1. **Triggers son informativos:** No bloquean el pipeline, solo alertan
2. **Múltiples triggers:** Un item puede tener múltiples tags y activar múltiples triggers
3. **Type-tag obligatorio:** Siempre se incluye el tag del tipo (e.g., `#idea` para type: idea)
4. **Documentación:** Los triggers se ejecutan en el step `research` de `wi-pipeline.sh`

---

## 11. Referencias

- Implementación: `brokia/workitems/`
- Scripts: `brokia/workitems/scripts/`
- Templates: `brokia/workitems/templates/`

---

*Especificación v1.0 — Brokia Work-Items System*
