# Mission Control — Multiagent Framework

## Propósito

Este documento formaliza el **marco metodológico multiagente** utilizado en Mission Control. El objetivo no es “usar IA”, sino **diseñar un proceso reproducible** de desarrollo asistido por IA con control humano, evidencia, y gobernanza técnica.

> **Principio central:** la IA no reemplaza decisiones técnicas; las **instrumenta** con rigor y trazabilidad.

---

## Roles definidos

### 1) Orquestador (main)

**Responsabilidad:** coordinar el proceso, definir planes, validar restricciones y sintetizar resultados.

**Funciones clave:**
- Interpreta requerimientos y restricciones
- Genera plan de ejecución incremental
- Spawnea agentes especializados (builder/researcher)
- Valida evidencia (snippets, tests, smoke tests)
- Mantiene el contrato “no breaking”

**Criterio:** no delega si la tarea es simple; delega solo cuando hay riesgo técnico alto o cambios en código.

---

### 2) Builder (codex_builder)

**Responsabilidad:** ejecutar cambios de código con alta precisión y mínima desviación.

**Funciones clave:**
- Implementar tareas puntuales con constraints estrictas
- Escribir diffs mínimos
- Aportar evidencia: tree, snippets, comandos ejecutados
- Confirmar modelo (openai-codex/gpt-5.3-codex) antes de editar

**Criterio:** nunca decide scope; solo implementa lo especificado.

---

## STOP‑THE‑BLEED Protocol

Protocolo aplicado cuando se detecta riesgo crítico (seguridad, data loss, path traversal, locks zombies):

1. **Freeze scope**: no introducir features nuevos
2. **Patch minimalista**: corregir solo el vector crítico
3. **Evidence-based**: demostrar fix con smoke tests
4. **No breaking changes**: solo additive
5. **Documentación inmediata**: registrar en decision log + evolution log

**Ejemplo aplicado:** v1.3.1 hardening (validate + safeResolve + TTL)

---

## Scope Locking

Regla: **el scope se congela antes de tocar código**. Se prioriza:

- Claridad de objetivos
- Definición explícita de restricciones
- Aprobación del plan antes de ejecución

En Mission Control:
- “NO tocar engine” es una hard rule
- “No breaking API contract” es una hard rule

---

## Guardrails: Hard vs Soft

| Tipo | Definición | Ejemplo |
|------|-----------|---------|
| **Hard** | No se puede violar | “No modificar brokia/workitems/**” |
| **Soft** | Preferencia, negociable | “Minimizar cambios” |

**Aplicación:** cada request de implementación comienza con una sección de restricciones duras. Los agentes deben respetarlas explícitamente.

---

## Evidence‑based Implementation

Ningún cambio se considera válido sin evidencia explícita. La evidencia mínima incluye:

- Tree de archivos modificados
- Snippets representativos (≤80 líneas)
- Smoke tests relevantes
- `npx tsc --noEmit` clean

Esto convierte la implementación en un **proceso auditable**.

---

## Smoke Tests obligatorios

Los smoke tests son **parte del contrato**. No son opcionales.

Ejemplos:
- /api/logs traversal blocking
- /api/logs/recent O(1) index fallback
- RUNNING stale detection → event log

---

## No Big‑Bang Refactors

Toda evolución es incremental, con versiones pequeñas:

- v1.3.1: hardening
- v1.3.2: index O(1)
- v1.3.3: observability

Regla: **cambios pequeños + evidencia** superan refactors masivos.

---

## Versioning incremental

Cada versión tiene:

1. **Problema detectado**
2. **Decisión tomada**
3. **Alternativas consideradas**
4. **Riesgos mitigados**
5. **Evidencia**

Este formato permite rastrear la evolución del sistema como un **experimento académico**.

---

## Por qué este marco es académico (no ad‑hoc)

**Ad‑hoc IA**: prompts sueltos → cambios impredecibles → sin trazabilidad.

**Marco multiagente**:
- Roles definidos
- Gobernanza estricta
- Evidencia obligatoria
- Control humano de decisiones
- Evolución incremental documentada

**Resultado:** la IA se convierte en herramienta metodológica, no en reemplazo del diseño.

---

## Workflow Diagram (Mermaid)

```mermaid
flowchart TB
    subgraph Requirements["1. REQUIREMENTS"]
        R1[User Request]
        R2[Constraints\nHard + Soft]
        R3[Scope Definition]
    end

    subgraph Orchestrator["2. ORCHESTRATOR (main)"]
        O1[Parse Requirements]
        O2[Generate Plan\nIncremental + Versioned]
        O3[Validate Guardrails]
        O4{Delegate?}
    end

    subgraph Builder["3. BUILDER (codex_builder)"]
        B1[Confirm Model\nopenai-codex]
        B2[Implement Minimal Diffs]
        B3[Generate Evidence\ntree / snippets / smoke tests]
        B4[Return Results]
    end

    subgraph Evidence["4. EVIDENCE"]
        E1[Typecheck\nnpx tsc --noEmit]
        E2[Smoke Tests\ncurl + jq]
        E3[Tree + Snippets]
    end

    subgraph Decision["5. DECISION GATE"]
        D1{Evidence OK?}
        D2[Request Fix]
        D3[Approve Merge]
    end

    subgraph Deploy["6. DEPLOY + DOCS"]
        P1[Build + Restart]
        P2[Update Docs\nDecision Log / Evolution Log]
        P3[Version Tag\nv1.3.x]
    end

    R1 --> O1
    R2 --> O1
    O1 --> O2 --> O3 --> O4
    O4 -->|Yes| Builder
    O4 -->|No| O1
    
    B1 --> B2 --> B3 --> B4 --> Evidence
    
    E1 --> D1
    E2 --> D1
    E3 --> D1
    
    D1 -->|No| D2 --> Builder
    D1 -->|Yes| D3 --> Deploy
    
    P1 --> P2 --> P3

    style Orchestrator fill:#e1f5fe
    style Builder fill:#fff3e0
    style Evidence fill:#f3e5f5
    style Deploy fill:#e8f5e9
```

## Checklist operativo (resumen)

- [ ] Scope congelado y validado
- [ ] Guardrails hard confirmados
- [ ] Plan aprobado
- [ ] Builder implementa cambios mínimos
- [ ] Evidencia generada (tree/snippets/tests)
- [ ] Documentación actualizada
- [ ] Release versionada

---

## Conclusión

Mission Control demuestra que un enfoque multiagente **no es improvisación**, sino un proceso técnico riguroso. El valor académico proviene de la trazabilidad entre decisión → implementación → evidencia → evolución.
