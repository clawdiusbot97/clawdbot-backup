# Mission Control — Evolution Log

## v1.3.1 — Hardening Layer

### Contexto
Sistema base funcionando pero con vulnerabilidades de seguridad y robustez. Código pre-v1.3.1 no validaba IDs ni paths; RUNNING.json podía quedar huérfano.

### Problema detectado
1. Path traversal: `id=../../etc/passwd` podía escapar de `logs/<ID>/`
2. Zombie RUNNING: crash de proceso dejaba lock permanente
3. IDs mal formados llegaban al filesystem sin validación

### Decisión tomada
Implementar triple-capa de hardening:
1. **ID Validation**: `validateWorkItemId()` con strict/fallback regex + rechazo de traversal chars
2. **Path Safety**: `safeResolve()` garantiza paths dentro de base
3. **TTL RUNNING**: `lastHeartbeatAt` + detección de stale

### Alternativas consideradas
- Sanitización simple (menos robusta)
- Base de datos para locks (overkill)
- Proceso watchdog independiente (complejidad innecesaria)

### Riesgos mitigados
- R01 Path traversal → Validación + safeResolve
- R02 Zombie RUNNING → TTL detection
- R06 HTTP divergence → Contrato estándar con guardrails

### Riesgos introducidos
- False positive TTL si proceso legítimo > 10 min
- Complejidad adicional en cada file operation

### Impacto arquitectónico
- Nuevo archivo: `src/server/validate.ts`
- Cambios en: `runs.ts`, `logs.ts`, todos los endpoints
- Additive-only: contratos preservados

### Impacto académico
Demuestra aplicación de defense-in-depth en sistemas multiagente. Cada capa (API, server, filesystem) tiene validación.

### Lección aprendida
Validación debe ocurrir en boundary Y core. No confiar en que "el cliente ya validó".

---

## v1.3.2 — Logs Index (O(1) Recents)

### Contexto
`getRecentLogs(limit)` escaneaba todos los directorios de workitems. Con 1000 items y 20 logs cada uno → 20,000 operaciones de filesystem para obtener 50 recientes.

### Problema detectado
Complejidad O(n×m) no escala. Latencia lineal con volumen de datos. Operación frecuente (dashboard, polling) se vuelve costosa.

### Decisión tomada
Implementar índice incremental:
- **Path**: `logs/index/recent.json`
- **Trigger**: Cada vez que `runScript` finaliza, append al índice
- **Atomicidad**: Write a tmp + rename
- **Cap**: Trim a N=100 entries
- **Fallback**: Si ausente/corrupto → scan + rebuild

### Alternativas consideradas
- SQLite local (añade dependencia)
- Redis externo (infraestructura adicional)
- Always-scan (aceptar latencia creciente)

### Riesgos mitigados
- R04 Performance O(n×m) → O(1) index
- R07 Corrupción index → Atomic writes

### Riesgos introducidos
- Desincronización index vs reality (mitigado: rebuild)
- Límite de 100 entries (configurable vía env)

### Impacto arquitectónico
- Nuevo archivo: `src/server/recentIndex.ts`
- Cambios en: `runScript.ts`, `logs.ts`
- Dual-mode: `getRecentLogs()` intenta index primero

### Impacto académico
Demuestra técnica de optimización incremental con fallback seguro. No "big-bang refactor"; 
mantener compatibilidad total.

### Lección aprendida
Optimizaciones deben tener fallback automático. Index no debe ser single point of failure.

---

## v1.3.3 — Observability Layer

### Contexto
Hardening e index funcionan, pero faltan mecanismos de observación para debug y audit. No se sabe si IDs son STRICT vs FALLBACK. Stale detection es silencioso.

### Problema detectado
1. Opacidad: ¿Qué validación usó cada request?
2. Audit gap: ¿Cuándo se detectó stale exactamente?
3. Debuggability: Reproducir issues requiere adivinar estado

### Decisión tomada
1. **id_validation propagation**: Agregar campo `id_validation?: 'strict'|'fallback'` a logs estructurados, index, y responses
2. **run_stale_detected event**: Escribir `logs/<ID>/<ts>_run_stale_detected.json` con metadata completa
3. **Idempotencia**: Evitar flood de stale events (ventana 5-min)

### Alternativas consideradas
- Logging centralizado externo (ELK, etc.) → Overkill para tesis
- Métricas Prometheus/Grafana → Scope fuera de MVP
- Solo debug logs stderr → No estructurado, difícil parsear

### Riesgos mitigados
- R08 Flood de stale events → Idempotencia 5-min
- R03 Spec drift → Observabilidad mejora trazabilidad

### Riesgos introducidos
- Más archivos en filesystem (overhead de I/O)
- Races en dedupe de stale events (aceptable para MVP)

### Impacto arquitectónico
- Nuevo archivo: `src/server/staleRuns.ts`
- Cambios en: types, recentIndex, runScript, runs, actions endpoints
- Additive-only: nuevo campo opcional

### Impacto académico
Demuestra diseño de observabilidad distribuida en sistema multiagente. Cada componente emite eventos estructurados; orquestador no es único punto de conocimiento.

### Lección aprendida
Observabilidad debe ser first-class citizen, no afterthought. Diseñar eventos estructurados desde el inicio.

---

## Comparativa de versiones

| Aspecto | v1.3.0 (base) | v1.3.1 (hardening) | v1.3.2 (index) | v1.3.3 (observability) |
|---------|---------------|-------------------|----------------|----------------------|
| Seguridad | Baja | Alta | Alta | Alta |
| Performance recent | O(n×m) | O(n×m) | O(1) | O(1) |
| TTL stale | No | Detección | Detección | Eventos estructurados |
| Path safety | No | Validación doble | Validación doble | Validación doble |
| id_validation audit | No | No | No | Sí |
| Breaking changes | — | 0 | 0 | 0 |

## Línea de evolución prevista

- **v1.4.x**: Test suite automatizado (mitigar R05)
- **v1.5.x**: Rate limiting + quotas (para habilitar research endpoint)
- **v1.6.x**: WebSocket para notificaciones push de RUNNING/staleness
- **v2.x**: Considerar migración index a SQLite si filesystem escala mal
