# Session: 2026-02-25 06:15:56 UTC

- **Session Key**: agent:main:main
- **Session ID**: f105673c-7dd5-43c2-8d77-2ee8d4666a42
- **Source**: webchat

## Conversation Summary

assistant: Ahora muestro la estructura final y comandos de prueba:

---

## ✅ FASE 4 COMPLETADA — Entregables

### 📁 Archivos Creados

| Archivo | Tamaño | Descripción |
|---------|--------|-------------|
| `brokia/workitems/scripts/wi-watch.sh` | 5.5KB | Trigger automático (polling) |
| `brokia/workitems/scripts/wi-notify.sh` | 6.7KB | Generador de notificaciones |
| `brokia/workitems/scripts/wi-selftest-triggers.sh` | 9.2KB | Test suite completo |
| `brokia/workitems/cron/README.md` | 6.1KB | Ejemplos de cron/systemd |

---

### 🔒 Reglas de Seguridad Implementadas

```bash
# Intentar BUILDING desde trigger → BLOQUEADO
$ ./scripts/wi-watch.sh --action build --one-shot
🛑 SEGURIDAD: Acción 'build' PROHIBIDA en triggers

# Solo permitido: research, validate, report, index
$ ./scripts/wi-watch.sh --action research --one-shot  # ✅ OK
```

---

### 🧪 Comandos Exactos para Probar

```bash
# 1. Ver help de wi-watch
cd brokia/workitems
./scripts/wi-watch.sh --help

# 2. Ejecutar one-shot research (procesa items NEW)
./scripts/wi-watch.sh --action research --one-shot

# 3. Solo procesar type específico
./scripts/wi-watch.sh --action research --one-shot --only-type idea

# 4. Modo continuo (polling cada 30s)
./scripts/wi-watch.sh --interval-seconds 30 --action research

# 5. Generar notificación de stale items
./scripts/wi-notify.sh --stale-days 7

# 6. Formato texto (para logs)
./scripts/wi-notify.sh --format text

# 7. Test completo de Fase 4
./scripts/wi-selftest-triggers.sh

# 8. Ver ejemplos de cron
cat cron/README.md
```

---

### 📋 Ejemplo de Salida Esperada

**`wi-watch.sh --action research --one-shot`:**
```
═══════════════════════════════════════════════════
  wi-watch.sh - Work-Items Auto-Trigger
═══════════════════════════════════════════════════
  Action: research | Status: NEW,RESEARCHING
═══════════════════════════════════════════════════
🔍 Scanning... (action: research)
05:40:05 | Encontrados: 1 items
05:40:05 | Procesando: RESEARCH-20260225-001 (research)
  → wi-pipeline.sh --id RESEARCH-20260225-001 --step research
    🔧 Pipeline Step: research
       ...
    ✅ Movido: RESEARCH-20260225-001
       Status: NEW → RESEARCHING
  ✅ Research iniciado
```

**`wi-notify.sh --stale-days 7`:**
```
# 📊 Work-Items Report

*Generado: 2026-02-25 05:39 UTC*

## 🔥 Top Priority (p0/p1)

| Priority | ID | Type | Status | Title |
|----------|------|------|--------|-------|
| p1 | IDEA-20260225-001 | idea | RESEARCHING | Automatizar cotización... |
```

---

### 📁 Estructura Final Completa

```
brokia/workitems/
├── active/
│   ├── researching/      ← Items RESEARCHING
│   ├── researched/       ← Items RESEARCHED  
│   ├── decided/          ← Items DECIDED
│   ├── planned/          ← Items PLANNED
│   └── building/         ← Items BUILDING
├── archive/
│   ├── done/             ← Items DONE
│   └── dropped/          ← Items DROPPED
├── inbox/                ← Items NEW
├── cron/
│   └── README.md         ← Ejemplos de cron/systemd
├── reports/
│   └── [ID]/              ← Reportes por item
├── scripts/
│   ├── wi-approve.sh     ← Aprobar implementación
│   ├── wi-create.sh      ← Crear item
│   ├── wi-guard.sh       ← Validar guardrails
│   ├── wi-index.sh       ← Listar/indexar
│   ├── wi-move.sh        ← Mover entre estados
│   ├── wi-notify.sh      ← 🆕 Notificaciones
│   ├── wi-pipeline.sh    ← Ejecutar pipeline steps
│   ├── wi-report.sh      ← Reportes consolidados
│   ├── wi-selftest-triggers.sh  ← 🆕 Self-test
│   └── wi-watch.sh       ← 🆕 Trigger automático
└── templates/            ← 8 templates (.md)
```

---

### ✅ Status

| Componente | Estado |
|------------|--------|
| wi-watch.sh | ✅ Funcional con guardrails de seguridad |
| wi-notify.sh | ✅ Markdown + text output |
| cron/README.md | ✅ Ejemplos completos |
| wi-selftest-triggers.sh | ✅ Test suite |
| Regla "NO BUILDING en triggers" | ✅ Aplicada |
| Idempotencia | ✅ Via `.wi-watch-processed` |

**Sistema Work-Items Fase 4 listo para producción.**
user: [Wed 2026-02-25 05:47 UTC] Nueva directiva: Antes de ejecutar cualquier pipeline real sobre un Work Item recién creado, quiero una etapa obligatoria de “COMPRENSIÓN + CLARIFICACIÓN” para darme control sobre cómo Brokia entendió el item y qué flujo propone. Objetivo práctico: Cuando se crea un work item, el sistema NO debe disparar research automáticamente. Primero debe: 1) Analizar el item, 2) Proponer categorización (si el usuario no la dio), 3) Generar preguntas críticas, 4) Proponer 2-3 planes posibles de acción, 5) Quedar esperando mi confirmación para ejecutar el plan. IMPORTANTE: - No romper Fase 4 (wi-watch.sh / wi-notify.sh / cron). - Mantener los 8 estados oficiales de la spec. NO agregar estados nuevos en esta etapa. - Implementar esto con un flag en frontmatter y un reporte de clarificación. DISEÑO (obligatorio): A) Agregar al frontmatter de TODOS los work-items estos campos (con defaults): - needs_clarification: true|false (default true al crear item) - clarification_status: PENDING|ASKED|CONFIRMED (default PENDING) - proposed_actions: [] (lista corta, se completa tras análisis) B) Nuevo reporte: - brokia/workitems/reports/<ID>/clarification.md El “Clarification Report” debe contener SIEMPRE: 1) Resumen en 5-10 líneas (sin inventar) 2) Re-categorización sugerida (type/tags/status) y por qué 3) Qué información falta (bullets) 4) 5-10 preguntas concretas para el Chief (para preguntarme a mí) 5) 3 planes sugeridos (A/B/C): - A: Research (subagentes) - B: Brainstorm (alternativas + trade-offs) - C: Convertir a requirements (si aplica) Para cada plan: objetivo + outputs esperados + costo/tiempo relativo (bajo/medio/alto) 6) Recomendación final (A/B/C) con justificación breve. C) Integración con watch/pipeline (regla dura): - wi-watch.sh: - Antes de ejecutar cualquier acción (research/validate/report/index) sobre items NEW: - Si needs_clarification=true o clarification_status!=CONFIRMED: - NO ejecutar pipeline - Generar/actualizar clarification.md - Marcar clarification_status=ASKED - Loggear: “SKIP: awaiting clarification” - wi-pipeline.sh: - Antes de ejecutar steps (research/validate/plan/build): - Si needs_clarification=true o clarification_status!=CONFIRMED: - Bloquear con mensaje claro, excepto si el step es “clarify”. - Agregar un step nuevo permitido: clarify - genera clarification.md - setea clarification_status=ASKED D) Confirmación (manual): Crear script: - brokia/workitems/scripts/wi-confirm.sh --id <ID> --plan A|B|C Que haga: - set needs_clarification=false - set clarification_status=CONFIRMED - set proposed_actions=[plan elegido] - append un pequeño “chief_note” opcional - updated_at E) No tocar guardrails existentes: - “NO BUILDING en triggers” se mantiene igual. - “BUILDING requiere implementation_approved=true” se mantiene igual. DELIVERABLES: 1) Actualizar templates para incluir los nuevos campos. 2) Actualizar wi-create.sh para setear defaults (needs_clarification=true, clarification_status=PENDING). 3) Implementar wi-clarify.sh o integrar en wi-pipeline.sh step “clarify”. 4) Implementar wi-confirm.sh. 5) Actualizar wi-watch.sh y wi-pipeline.sh con las reglas de bloqueo. 6) Actualizar wi-selftest-triggers.sh para cubrir: - crear item NEW -> watch no corre research, genera clarification.md, marca ASKED - correr wi-confirm.sh -> watch ahora sí corre research 7) Documentar en brokia/workitems/README.md el flujo: NEW -> Clarification -> Confirm -> Research ENTREGA: - lista de archivos tocados/creados con paths - comandos de prueba - ejemplo de salida (2-3 líneas) cuando watch “SKIP awaiting clarification” ADDENDUM (solo metadata, NO integración aún): En el Clarification Report y en el frontmatter, agregá estos campos para preparar delegación/model routing: Frontmatter (opcionales, con defaults razonables): - suggested_agents: ["tech-researcher","cost-analyst","product-strategist","architecture-lead"] - suggested_model_tier: "cheap"|"balanced"|"reasoning" - estimated_token_budget: "low"|"medium"|"high" En clarification.md incluir una sección: ## Delegación sugerida (sin ejecutar) - Subagentes propuestos y qué entregan - Tier de modelo recomendado por subagente (cheap/balanced/reasoning) - Justificación breve (1 línea c/u) Regla: - No spawnear subagentes aún. - No seleccionar modelos concretos aún. - Solo clasificar en tiers y roles.
assistant: ## 🔄 IMPLEMENTANDO: Etapa de COMPRENSIÓN + CLARIFICACIÓN
assistant: Ahora implemento los cambios. Primero actualizo templates:
assistant: Fix de rutas:
assistant: Ahora creo los scripts nuevos:
user: [Wed 2026-02-25 05:47 UTC] Nueva directiva: Antes de ejecutar cualquier pipeline real sobre un Work Item recién creado, quiero una etapa obligatoria de “COMPRENSIÓN + CLARIFICACIÓN” para darme control sobre cómo Brokia entendió el item y qué flujo propone. Objetivo práctico: Cuando se crea un work item, el sistema NO debe disparar research automáticamente. Primero debe: 1) Analizar el item, 2) Proponer categorización (si el usuario no la dio), 3) Generar preguntas críticas, 4) Proponer 2-3 planes posibles de acción, 5) Quedar esperando mi confirmación para ejecutar el plan. IMPORTANTE: - No romper Fase 4 (wi-watch.sh / wi-notify.sh / cron). - Mantener los 8 estados oficiales de la spec. NO agregar estados nuevos en esta etapa. - Implementar esto con un flag en frontmatter y un reporte de clarificación. DISEÑO (obligatorio): A) Agregar al frontmatter de TODOS los work-items estos campos (con defaults): - needs_clarification: true|false (default true al crear item) - clarification_status: PENDING|ASKED|CONFIRMED (default PENDING) - proposed_actions: [] (lista corta, se completa tras análisis) B) Nuevo reporte: - brokia/workitems/reports/<ID>/clarification.md El “Clarification Report” debe contener SIEMPRE: 1) Resumen en 5-10 líneas (sin inventar) 2) Re-categorización sugerida (type/tags/status) y por qué 3) Qué información falta (bullets) 4) 5-10 preguntas concretas para el Chief (para preguntarme a mí) 5) 3 planes sugeridos (A/B/C): - A: Research (subagentes) - B: Brainstorm (alternativas + trade-offs) - C: Convertir a requirements (si aplica) Para cada plan: objetivo + outputs esperados + costo/tiempo relativo (bajo/medio/alto) 6) Recomendación final (A/B/C) con justificación breve. C) Integración con watch/pipeline (regla dura): - wi-watch.sh: - Antes de ejecutar cualquier acción (research/validate/report/index) sobre items NEW: - Si needs_clarification=true o clarification_status!=CONFIRMED: - NO ejecutar pipeline - Generar/actualizar clarification.md - Marcar clarification_status=ASKED - Loggear: “SKIP: awaiting clarification” - wi-pipeline.sh: - Antes de ejecutar steps (research/validate/plan/build): - Si needs_clarification=true o clarification_status!=CONFIRMED: - Bloquear con mensaje claro, excepto si el step es “clarify”. - Agregar un step nuevo permitido: clarify - genera clarification.md - setea clarification_status=ASKED D) Confirmación (manual): Crear script: - brokia/workitems/scripts/wi-confirm.sh --id <ID> --plan A|B|C Que haga: - set needs_clarification=false - set clarification_status=CONFIRMED - set proposed_actions=[plan elegido] - append un pequeño “chief_note” opcional - updated_at E) No tocar guardrails existentes: - “NO BUILDING en triggers” se mantiene igual. - “BUILDING requiere implementation_approved=true” se mantiene igual. DELIVERABLES: 1) Actualizar templates para incluir los nuevos campos. 2) Actualizar wi-create.sh para setear defaults (needs_clarification=true, clarification_status=PENDING). 3) Implementar wi-clarify.sh o integrar en wi-pipeline.sh step “clarify”. 4) Implementar wi-confirm.sh. 5) Actualizar wi-watch.sh y wi-pipeline.sh con las reglas de bloqueo. 6) Actualizar wi-selftest-triggers.sh para cubrir: - crear item NEW -> watch no corre research, genera clarification.md, marca ASKED - correr wi-confirm.sh -> watch ahora sí corre research 7) Documentar en brokia/workitems/README.md el flujo: NEW -> Clarification -> Confirm -> Research ENTREGA: - lista de archivos tocados/creados con paths - comandos de prueba - ejemplo de salida (2-3 líneas) cuando watch “SKIP awaiting clarification” ADDENDUM (solo metadata, NO integración aún): En el Clarification Report y en el frontmatter, agregá estos campos para preparar delegación/model routing: Frontmatter (opcionales, con defaults razonables): - suggested_agents: ["tech-researcher","cost-analyst","product-strategist","architecture-lead"] - suggested_model_tier: "cheap"|"balanced"|"reasoning" - estimated_token_budget: "low"|"medium"|"high" En clarification.md incluir una sección: ## Delegación sugerida (sin ejecutar) - Subagentes propuestos y qué entregan - Tier de modelo recomendado por subagente (cheap/balanced/reasoning) - Justificación breve (1 línea c/u) Regla: - No spawnear subagentes aún. - No seleccionar modelos concretos aún. - Solo clasificar en tiers y roles.
user: [Wed 2026-02-25 06:02 UTC] terminaste de ejecutar? en que paso quedaste pasame status
assistant: ## 📊 STATUS ACTUAL — Etapa de COMPRENSIÓN + CLARIFICACIÓN

### ✅ Completado
1. **Templates actualizados** (8/8) — Todos los templates ahora incluyen:
   - `needs_clarification: true`
   - `clarification_status: PENDING`
   - `proposed_actions: []`
   - Campos de delegación: `suggested_agents`, `suggested_model_tier`, `estimated_token_budget`
   - Referencia al Clarification Report

### 🔄 En progreso (faltan estos entregables)

| # | Tarea | Estado |
|---|-------|--------|
| 2 | Crear `wi-clarify.sh` | ⏳ PENDIENTE |
| 3 | Crear `wi-confirm.sh` | ⏳ PENDIENTE |
| 4 | Actualizar `wi-create.sh` | ⏳ Verificar que genere clarification.md |
| 5 | Actualizar `wi-watch.sh` | ⏳ Agregar bloqueo por clarification |
| 6 | Actualizar `wi-pipeline.sh` | ⏳ Agregar step "clarify" + bloqueos |
| 7 | Actualizar `wi-selftest-triggers.sh` | ⏳ Tests del nuevo flujo |
| 8 | Actualizar `README.md` | ⏳ Documentar flujo NEW→Clarification→Confirm→Research |

---

### 🎯 Continúo ahora con los scripts

Procedo a crear los scripts faltantes:
assistant: Ahora actualizo `wi-watch.sh` con las reglas de bloqueo:
assistant:   
assistant: ⚠️ Error con rutas - verificando estado de archivos:
assistant: Bien, el archivo original está intacto. Ahoraactualizo `wi-watch.sh` con las reglas de clarificación:
user: [Wed 2026-02-25 06:02 UTC] terminaste de ejecutar? en que paso quedaste pasame status
assistant: ## 📊 STATUS ACTUAL — Implementación de Clarificación

### ✅ Completado (4/8)
1. **Templates actualizados** (8/8) — Todos con nuevos campos de clarificación
2. **wi-clarify.sh creado** — Genera reportes de clarificación con A/B/C planes
3. **wi-confirm.sh creado** — Confirma plan elegido por el jefe
4. **wi-watch.sh actualizado** — ✅ **JUSTO AHORA** — Agrega bloqueo por clarificación

### 🔄 En progreso (4/8)
| # | Tarea | Estado |
|---|-------|--------|
| 5 | Actualizar `wi-pipeline.sh` | ⏳ **PENDIENTE** — Agregar step "clarify" + bloqueos |
| 6 | Actualizar `wi-selftest-triggers.sh` | ⏳ **PENDIENTE** — Tests del nuevo flujo |
| 7 | Actualizar `README.md` | ⏳ **PENDIENTE** — Documentar flujo NEW→Clarification→Confirm→Research |
| 8 | Verificar `wi-create.sh` | ⏳ **PENDIENTE** — Ya está bien (usa templates actualizados) |

---

### 🎯 Próximos pasos inmediatos
1. **Terminar wi-pipeline.sh** — Agregar step "clarify" y bloquear research/validate si needs_clarification=true
2. **Crear tests** — Validar flujo completo
3. **Documentar** — Explicar cómo funciona el sistema

---

### 🚀 Demo del nuevo flujo
```bash
# 1. Crear item → tiene needs_clarification=true
./scripts/wi-create.sh --type idea --title "Demo clarificación"

# 2. wi-watch lo detecta → NO ejecuta research
./scripts/wi-watch.sh --action research --one-shot
# ⛔ SKIP: awaiting clarification

# 3. Genera reports/<ID>/clarification.md automáticamente

# 4. El jefe revisa y aprueba plan
./scripts/wi-confirm.sh --id IDEA-... --plan A

# 5. Ahora sí, wi-watch puede ejecutar research
./scripts/wi-watch.sh --action research --one-shot
# ✅ Research iniciado
```

**¿Continuo con wi-pipeline.sh ahora?**
