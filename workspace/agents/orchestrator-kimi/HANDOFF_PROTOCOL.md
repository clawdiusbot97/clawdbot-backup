# Protocolo de Handoff Estándar

> Todos los agentes deben seguir este formato de output para habilitar transiciones limpias.

---

## Estructura Obligatoria de Output

Cada entregable debe incluir estas secciones:

```markdown
## TL;DR
Una línea con la decisión/entrega principal.

## Output
[El contenido propiamente dicho]

## Assumptions
- Lista de supuestos hechos durante el trabajo
- Lo que se asumió por falta de datos

## Confidence
Alto | Medio | Bajo — con una frase de justificación.

## Next
- [ ] Paso siguiente recomendado
- [ ] Agente recomendado para cada paso

## Blockers
- Lista de bloqueos identificados (o "Ninguno")
```

---

## Reglas de Transición

| Desde | Hacia | Condición |
|-------|-------|-----------|
| researcher | chief | Cuando hay datos suficientes para decidir |
| researcher | writer | Cuando se necesita documentar hallazgos sin planificación |
| chief | builder/qubika | Cuando el plan está claro y priorizado |
| chief | ops | Cuando hay cambios que afectan infraestructura |
| brokia | researcher | Cuando se necesita validar una hipótesis |
| builder/qubika | ops | Antes de deploy a cualquier ambiente |
| Cualquiera | writer | Cuando se necesita entregable final legible |

---

## Modos de Operación

### Startup Mode (default)
- **Velocidad > Perfección**
- Hipótesis claras, validación rápida
- Scope mínimo viable
- Agente referente: mentalidad brokia

### Enterprise Mode (explícito)
- **Calidad > Velocidad**
- Trazabilidad completa
- Migraciones planificadas
- Agente referente: mentalidad qubika

**Para activar Enterprise Mode:** El usuario debe decir explícitamente "modo enterprise" o "esto es para producción/cliente".

---

## Metadatos de Contexto

Cada handoff debe incluir:

```
[CONTEXT]
Modo: startup | enterprise
Proyecto: [nombre]
Iteración: [número]
Padre: [agente anterior]
```

---

## Anti-Patterns Prohibidos

❌ Output sin sección ## Next
❌ "Parece que..." sin confidence level
❌ Supuestos no documentados
❌ Transferir sin verificar bloqueadores

---

## Ejemplo Completo

```markdown
## TL;DR
Reducir costos de LLM en 40% mediante caching y model downgrading estratégico.

## Output
[Estrategia detallada...]

## Assumptions
- Los tokens de caching no cuentan para límites de rate
- El usuario acepta degradación de calidad en tareas no críticas

## Confidence
Medio — los precios de OpenRouter pueden cambiar.

## Next
- [ ] Validar impacto real con métricas (researcher)
- [ ] Implementar POC de caching (builder)
- [ ] Documentar runbook de monitoreo (writer)

## Blockers
- Necesitamos acceso a métricas actuales de uso
```
