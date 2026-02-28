# Mission Control — Decision Log

| Fecha | Decisión | Motivación | Alternativas | Impacto | Breaking? |
|-------|----------|------------|--------------|---------|-----------|
| 2026-02-25 | **v1.3.1** Introducir TTL en RUNNING | Evitar zombie locks si proceso crashea | Heartbeat externo, watch dog | Robustez ↑ | No. Campo `stale` additive |
| 2026-02-25 | **v1.3.1** `safeResolve` path validation | Prevenir path traversal en IDs | Whitelist manual de IDs | Seguridad ↑ | No. Cambio interno |
| 2026-02-25 | **v1.3.1** Doble regex ID (strict/fallback) | Validar formato canónico pero permitir legacy | Solo strict (rompería datos existentes) | Compatibilidad ↑ | No. `id_validation` additive |
| 2026-02-25 | **v1.3.2** Index O(1) `recent.json` | Escalabilidad: O(n×m) → O(1) para recientes | Scan completo persistente, DB SQLite | Performance ↑ Complejidad ↑ | No. Fallback a scan si ausente |
| 2026-02-25 | **v1.3.2** Atomic write (tmp+rename) | Prevenir corrupción de index concurrente | Write directo, file locking | Consistencia ↑ | No |
| 2026-02-25 | **v1.3.3** Propagar `id_validation` | Observabilidad: saber si ID es canónico | Logs de debug separados | Debuggability ↑ | No. Campo opcional additive |
| 2026-02-25 | **v1.3.3** `run_stale_detected` event | Audit trail de detecciones stale | Solo flag booleano | Observabilidad ↑ | No. Evento estructurado nuevo |
| 2026-02-25 | **v1.3.3** Idempotencia 5-min stale events | Evitar flood de logs si polleo repetido | Ventana configurable, dedupe en memoria | Robustez ↑ | No |

## Decisiones detalladas

### TTL en RUNNING (v1.3.1)

**Contexto**: `RUNNING.json` se escribe al inicio de acción y debería borrarse al terminar. Si el proceso crashea, queda huérfano marcando "running" para siempre.

**Decisión**: Agregar `lastHeartbeatAt` en RUNNING. `isRunning()` calcula delta vs TTL (default 10 min).

**Alternativas consideradas**:
- Heartbeat externo (más complejo, requiere proceso watchdog)
- Watchdog timer independiente (más recursos)

**Riesgos introducidos**: Posible false positive si proceso legítimo dura más que TTL.

**Mitigación**: TTL configurable vía env; heartbeat puede extenderse en futuras versiones.

---

### safeResolve + validateWorkItemId (v1.3.1)

**Contexto**: IDs vienen de query params y body JSON. `path.join(logsDir, id)` permite traversal si id = `../../etc/passwd`.

**Decisión**: 
1. Validar que ID no contenga `/`, `\`, `..`
2. Validar contra regex strict o fallback
3. Usar `safeResolve(base, ...parts)` que verifica `resolved.startsWith(base)`

**Alternativas**:
- Sanitización simple (menos robusta)
- Chroot/container (overkill para tesis)

---

### Index O(1) (v1.3.2)

**Contexto**: `getRecentLogs()` escaneaba todos los directorios de logs → O(n_items × avg_logs_per_item).

**Decisión**: Índice incremental actualizado al finalizar cada acción.

**Diseño del índice**:
- Path: `logs/index/recent.json`
- Max items: 100 (configurable)
- Atomic write: `.tmp.<rand>.json` → rename
- Fallback: si corrupto/ausente, scan + rebuild

**Trade-offs**:
- + Velocidad de query
- + Escalabilidad horizontal
- - Complejidad de mantenimiento
- - Riesgo de desincronización (mitigado: rebuild automático)

---

### id_validation propagation (v1.3.3)

**Contexto**: IDs legacy podrían no seguir STRICT regex. Saber qué modo se usó es crítico para debugging.

**Decisión**: Agregar `id_validation?: 'strict' | 'fallback'` en:
- Structured logs
- Recent index entries
- API responses

**Por qué no breaking**: Campo opcional; clientes antiguos lo ignoran.

---

### run_stale_detected event (v1.3.3)

**Contexto**: Detectar stale es útil; auditar cuándo y por qué es crítico para operaciones.

**Decisión**: Escribir `logs/<ID>/<ts>_run_stale_detected.json` con metadata completa.

**Idempotencia**: 
- Problema: Múltiples llamadas a `isRunning()` podrían generar N eventos
- Solución: Verificar si existe evento stale en últimos 5 min antes de escribir

**Estructura del evento**:
```typescript
{
  event: 'run_stale_detected',
  id: string,
  detectedAt: ISO_string,
  ttlMinutes: number,
  lastHeartbeatAt?: ISO_string,
  startedAt?: ISO_string,
  agent?: string
}
```

---

### Guardrails en research endpoint (a lo largo de versiones)

**Decisión mantenida**: El endpoint `/api/actions/research` permanece como STUB (HTTP 200, `blocked_by_guardrail: true`).

**Razón**: Spawn de agentes de investigación requiere gestión de costos/quotas no implementada.

**Implicación**: API contract no rompe; cliente recibe respuesta válida con flag de bloqueo.
