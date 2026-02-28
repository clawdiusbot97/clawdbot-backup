# ⚠️ SPEC MOVIDA

La especificación oficial vive en:

**👉 `brokia/workitems-spec.md`**

Este directorio (`workitems/`) contiene la implementación:
- `scripts/` — Scripts de automatización
- `templates/` — Templates YAML
- `inbox/`, `active/`, `archive/` — Work-items activos
- `reports/` — Reportes generados

---

## Flujo de Trabajo (Quick Reference)

### 1. Crear un Work-Item
```bash
./scripts/wi-create.sh --type idea --title "Nueva funcionalidad"
```

### 2. Pipeline de Procesamiento
```bash
# Para items que necesitan clarificación (type=idea,blocker,decision,risk)
./scripts/wi-pipeline.sh --id IDEA-20260225-001 --step clarify
./scripts/wi-confirm.sh --id IDEA-20260225-001 --plan A  # Requiere confirmación

# Una vez confirmado, continuar con el pipeline
./scripts/wi-pipeline.sh --id IDEA-20260225-001 --step research
./scripts/wi-pipeline.sh --id IDEA-20260225-001 --step validate
./scripts/wi-pipeline.sh --id IDEA-20260225-001 --step plan
```

### 3. Clarification Layer
Cuando `needs_clarification=true`:
- Los steps `research`, `validate`, `plan`, `build` están **bloqueados**
- Solo el step `clarify` está permitido
- Después de `clarify`, el jefe debe ejecutar `wi-confirm.sh --plan A|B|C`
- Una vez confirmado, el pipeline se desbloquea

### 4. Update Work-Items
```bash
# Agregar/eliminar tags
./scripts/wi-update.sh --id IDEA-20260225-001 --add-tag voice --add-tag ai
./scripts/wi-update.sh --id IDEA-20260225-001 --remove-tag deprecated

# Setear metadata
./scripts/wi-update.sh --id IDEA-20260225-001 --set-cost 500 --set-impact high
./scripts/wi-update.sh --id IDEA-20260225-001 --set-effort m --set-owner brokia

# Agregar links
./scripts/wi-update.sh --id IDEA-20260225-001 --append-link "https://example.com/ref"
```

### 5. Export JSON (Mission Control)
```bash
# Generar workitems.json con agregados
./scripts/wi-export.sh > index/workitems.json

# El JSON incluye:
# - Todos los work-items con metadata completa
# - Counts por status y type
# - Total cost_estimate_usd_month
# - Flags de reportes generados (tech, cost, product, arch)
```

### 6. Research Reports por Rol
El step `research` genera automáticamente 4 reportes:
- `reports/<ID>/tech.md` - Análisis técnico (Tech Researcher)
- `reports/<ID>/cost.md` - Análisis de costos (Cost Analyst)
- `reports/<ID>/product.md` - Estrategia de producto (Product Strategist)
- `reports/<ID>/arch.md` - Diseño de arquitectura (Architecture Lead)

### 7. Tag Triggers
Durante el research, los tags activan automáticamente:
- `#voice` → Alertas de integración TTS/voz
- `#whatsapp` → Requisitos de Meta Business
- `#security` → Obliga Security Review
- `#cost` → Requiere cost_estimate_usd_month
- `#ai` → Consideraciones de ML/APIs
- `#urgent` → Escalación automática

### 8. Demo End-to-End
```bash
# Ejecutar demo completo interactivo
./scripts/wi-demo-e2e.sh
```

---

## Scripts Disponibles

| Script | Función |
|--------|---------|
| `wi-create.sh` | Crear nuevo work-item |
| `wi-move.sh` | Mover entre estados |
| `wi-pipeline.sh` | Ejecutar steps (clarify, research, validate, plan, build, review) |
| `wi-confirm.sh` | Confirmar plan (A/B/C) |
| `wi-update.sh` | Actualizar tags, cost, impact, effort, owner, links |
| `wi-export.sh` | Exportar JSON canónico |
| `wi-index.sh` | Listar items (format: list/table/dashboard) |
| `wi-watch.sh` | Monitorear y procesar items automáticamente |
| `wi-notify.sh` | Generar reportes de notificación |
| `wi-demo-e2e.sh` | Demo interactivo end-to-end |

---

Para la especificación completa (schema, estados, types, reglas, ejemplos):
**Ver `../workitems-spec.md`**
