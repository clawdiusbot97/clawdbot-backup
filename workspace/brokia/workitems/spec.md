# Work-Items System Spec - Brokia

## Overview
Sistema file-based de gestión de work-items con pipelines automáticos multi-agente.

## Core Schema (YAML Frontmatter)

```yaml
---
id: WI-2025-XXX
# Format: WI-YYYY-NNN (NNN = autoincrement)

type: idea | requirement | feature | blocker | decision | risk
# idea: investigación + opciones + validación (NO implementación)
# requirement: requerimiento de producto
# feature: funcionalidad a desarrollar
# blocker: impedimento/detractor
# decision: decisión arquitectónica o de negocio
# risk: riesgo identificado con mitigación

title: "Título claro y descriptivo"

description: |
  Descripción detallada del item.
  Puede ser multilinea.

tags:
  - brokia
  - mvp
  - validacion
  # Tags libres para clustering y filtros

status: inbox | research | validation | ready | implementation | review | done | cancelled
# inbox: recién creado, sin clasificar
# research: en investigación (solo para idea/requirement)
# validation: en validación con usuarios/stakeholders
# ready: aprobado para implementación
# implementation: en desarrollo
# review: en revisión/QA
# done: completado
# cancelled: descartado

owner: brokia | researcher | builder | chief | user
# Quien tiene la bola en este momento

priority: p0 | p1 | p2 | p3
# p0: crítico/blocker
# p1: alto valor, corto plazo
# p2: medio
# p3: bajo/nice-to-have

created_at: 2025-02-25T04:30:00Z
updated_at: 2025-02-25T04:30:00Z
---

## Cuerpo del item (markdown libre)

Más detalles, notas, links, etc.
"""

## Pipelines por Type

### Type: idea
**Fases automáticas:**
1. `research` → Agente researcher investiga el dominio, competidores, tecnologías
2. `validation` → Validación con usuarios/stakeholders (Juan Manuel, Rodrigo)
3. `ready` → Si pasa validación, espera aprobación explícita para implementar

**Regla clave:** Idea NUNCA se implementa directamente. Requiere:
- Validación exitosa + usuario escriba: "APROBAR IMPLEMENTACIÓN" o "HACER MVP"

### Type: requirement
**Fases:**
1. `research` → Análisis de viabilidad técnica
2. `ready` → Estimación de esfuerzo
3. `implementation` → Desarrollo

### Type: feature
**Fases:**
1. `ready` → Breakdown en tareas técnicas
2. `implementation` → Desarrollo
3. `review` → QA/Revisión

### Type: blocker
**Fases:**
1. `research` → Análisis de causa raíz
2. `implementation` → Acciones de mitigación/resolución
3. `done` → Resuelto

### Type: decision
**Fases:**
1. `research` → Opciones + análisis
2. `ready` → Decisión documentada
3. `done` → Implementada/decidida

### Type: risk
**Fases:**
1. `research` → Impacto + probabilidad
2. `ready` → Plan de mitigación
3. `implementation` → Acciones de mitigación

## Estructura de Directorios

```
brokia/workitems/
├── README.md                 # Este documento
├── spec.md                   # Especificación técnica
├── inbox/                    # Items nuevos sin clasificar
│   └── WI-2025-001.md
├── active/                   # Items en progreso (por pipeline)
│   ├── research/
│   ├── validation/
│   ├── implementation/
│   └── review/
├── archive/                  # Items completados/cancelados
│   └── done/                 # WI-2025-XXX/
│       └── final-report.md
├── templates/                # Templates por type
│   ├── idea.md
│   ├── requirement.md
│   ├── feature.md
│   ├── blocker.md
│   ├── decision.md
│   └── risk.md
├── scripts/                  # Scripts de automatización
│   ├── wi-create.sh          # Crear nuevo item
│   ├── wi-index.sh           # Listar/indexar items
│   ├── wi-move.sh            # Mover entre carpetas
│   ├── wi-pipeline.sh        # Ejecutar pipeline step
│   └── wi-report.sh          # Generar reporte por ID
└── reports/                  # Reportes generados
    └── WI-2025-001/
        ├── summary.md
        ├── research.md
        ├── validation.md
        └── final.md
```

## Scripts

### wi-create.sh
```bash
./scripts/wi-create.sh --type idea --title "Automatizar cotización"
# Crea: inbox/WI-2025-042.md con template correspondiente
```

### wi-index.sh
```bash
./scripts/wi-index.sh --status active --type idea
# Lista todos los items idea en status active
```

### wi-pipeline.sh
```bash
./scripts/wi-pipeline.sh --id WI-2025-001 --step research
# Ejecuta el step research del pipeline para ese item
# Mueve archivo a active/research/ si aplica
# Genera reporte en reports/WI-2025-001/research.md
```

## Mission Control Center (Futuro)

Vista agregada que muestra:
- Items por status/pipeline
- Items por owner
- Items por tag
- Items bloqueados (>7 días sin movimiento)
- Burn-down por sprint/quarter

Implementación inicial: `wi-index.sh --format dashboard`
