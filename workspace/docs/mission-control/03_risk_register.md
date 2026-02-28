# Mission Control — Risk Register

| ID | Riesgo | Severidad | Probabilidad | Mitigación | Estado | Introducido |
|----|--------|-----------|--------------|------------|--------|-------------|
| R01 | Path traversal via ID | Alta | Media | `validateWorkItemId` + `safeResolve` | **Mitigado** v1.3.1 |
| R02 | Zombie RUNNING.json | Alta | Media | TTL detection + stale events | **Mitigado** v1.3.1 |
| R03 | Spec drift (API vs engine) | Media | Alta | Validación additive-only, contratos versionados | **Mitigando** |
| R04 | Performance O(n×m) en recent logs | Media | Alta | Index O(1) con fallback | **Mitigado** v1.3.2 |
| R05 | Ausencia de tests unitarios | Alta | Media | Smoke tests obligatorios, typecheck estricto | **Aceptado** |
| R06 | Divergencia HTTP semantics | Media | Baja | Contrato estándar estricto, additive-only | **Mitigado** |
| R07 | Corrupción de recent.json | Media | Baja | Atomic writes (tmp+rename) | **Mitigado** v1.3.2 |
| R08 | Flood de stale events | Baja | Media | Idempotencia 5-min | **Mitigado** v1.3.3 |
| R09 | Dependencia de filesystem | Media | Alta | Engine diseñado sobre fs; Mission Control lo respeta | **Aceptado** |
| R10 | Escalabilidad horizontal limitada | Media | Baja | Índice local, no distribuido | **Aceptado** |

## Descripción de riesgos

### R01: Path traversal via ID

**Vector**: Usuario proporciona `id=../../etc/passwd` en query param o body.

**Impacto**: Lectura/escritura fuera de `logs/<ID>/` o `reports/<ID>/`.

**Mitigación v1.3.1**:
- Rechazo explícito de strings con `/`, `\`, `..`
- `safeResolve()` verifica que path resuelto esté dentro de base
- Doble layer: validation en API boundary + core

**Evidencia de mitigación**:
```bash
curl "http://localhost:3000/api/logs?id=../../etc/passwd"
# → blocked_by_guardrail: true
```

---

### R02: Zombie RUNNING.json

**Vector**: Proceso crash entre `writeRunningFile` y `removeRunningFile`.

**Impacto**: Workitem marcado como running indefinidamente; bloquea nuevas acciones.

**Mitigación v1.3.1**:
- Campo `lastHeartbeatAt` en RUNNING
- `isRunning()` calcula TTL delta
- Si TTL expirado → `running: false, stale: true`
- Evento estructurado `run_stale_detected` para audit

---

### R03: Spec drift (API vs engine)

**Vector**: Engine workitems evoluciona; API Mission Control queda desync.

**Impacto**: Cambios en scripts rompen API; debugging difícil.

**Mitigación**:
- Engine OFF LIMITS (regla estricta)
- Contratos TypeScript en `src/types/workitem.ts`
- Export engine (`workitems.json`) es fuente de verdad
- Smoke tests obligatorios post-cambio

---

### R04: Performance O(n×m) en recent logs

**Vector**: `getRecentLogs()` escanea N directorios × M archivos.

**Impacto**: Latencia lineal con volumen; inaceptable para operaciones.

**Mitigación v1.3.2**:
- Índice incremental `logs/index/recent.json`
- Hot path: O(1) lectura de index
- Fallback: scan + rebuild si index corrupto

**Trade-off**: Complejidad adicional por performance.

---

### R05: Ausencia de tests unitarios

**Vector**: Lógica core sin cobertura de tests automatizados.

**Impacto**: Regresiones silenciosas; refactors arriesgados.

**Mitigación actual**:
- `npx tsc --noEmit` full codebase
- Smoke tests manuales obligatorios en spec
- Cambios incrementales pequeños (no big-bang)

**Deuda técnica**: Desarrollar test suite para v1.4.x.

---

### R06: Divergencia HTTP semantics

**Vector**: Inconsistencia en status codes, error handling entre endpoints.

**Impacto**: Cliente no puede manejar errores consistentemente.

**Mitigación**:
- `StandardApiResponse<T>` interface compartido
- Campos obligatorios: `success`, `action`, `id`, `message`, `blocked_by_guardrail`
- Cambios additive-only; nunca quitar campos

---

### R07: Corrupción de recent.json

**Vector**: Write concurrente o crash durante write de índice.

**Impacto**: Index corrupto; queries recientes fallan.

**Mitigación v1.3.2**:
- Atomic write: tmp file + rename
- Si corrupto/ausente → fallback a scan + rebuild
- No hay estado "cascado" irreparable

---

### R08: Flood de stale events

**Vector**: Múltiples llamadas a `isRunning()` sobre item stale.

**Impacto**: N archivos `_run_stale_detected.json` para mismo evento.

**Mitigación v1.3.3**:
- Check idempotente: ¿existe evento stale en últimos 5 min?
- Si sí → skip
- Si no → write + continuar

---

### R09: Dependencia de filesystem

**Vector**: Mission Control usa filesystem como datastore.

**Impacto**: No distribuible horizontalmente; limitado por FS del host.

**Razón de aceptación**: 
- Engine workitems ya depende de FS
- Scope de tesis: demostrar marco multiagente, no construir DB distribuida
- Escalabilidad vertical suficiente para MVP

---

### R10: Escalabilidad horizontal limitada

**Vector**: Index `recent.json` es local a instancia.

**Impacto**: Múltiples instancias de Mission Control no comparten índice.

**Razón de aceptación**:
- Arquitectura objetivo: single-instance
- Si se necesita scale-out: externalizar index a Redis/DB (scope futuro)
