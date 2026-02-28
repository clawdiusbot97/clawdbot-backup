# Validación Post-Normalización de Modelos

## ✅ Checks Manuales (ejecutar ahora)

- [ ] Verificar config_lock_check.py ejecuta sin errores:
  ```bash
  python3 /home/manpac/.openclaw/workspace/scripts/config_lock_check.py
  # Expected: CONFIG_LOCK_OK
  ```

- [ ] Verificar drift_alert_check.py ejecuta sin falsos positivos:
  ```bash
  python3 /home/manpac/.openclaw/workspace/scripts/drift_alert_check.py
  # Expected: NO_DRIFT
  ```

- [ ] Confirmar openclaw.json tiene estructura válida:
  ```bash
  python3 -c "import json; json.load(open('/home/manpac/.openclaw/openclaw.json'))"
  # Expected: No output (success)
  ```

- [ ] Verificar timer activo:
  ```bash
  systemctl --user status openclaw-rotate.timer
  # Expected: active (waiting)
  ```

## ✅ Checks de Runtime (próximas 24-48h)

- [ ] Subagent researcher usa minimax-m2.1
- [ ] Subagent writer usa step-3.5-flash:free  
- [ ] Subagent builder usa deepseek-v3.2 (no codex)
- [ ] Subagent chief/ops/brokia/qubika usan deepseek-v3.2
- [ ] Drift alert NO envía falsos positivos a Telegram
- [ ] Config lock NO falla silenciosamente

## ⚠️ Rollback Plan

Si algo falla, revertir cambios en openclaw.json:
```bash
cd /home/manpac/.openclaw
git diff HEAD openclaw.json  # ver cambios
git checkout HEAD -- openclaw.json  # revertir
```

## 📊 Métricas a Monitorear

| Métrica | Baseline | Target |
|---------|----------|--------|
| Costo diario agents | ~$X | ~0.3-0.4X |
| Latencia p95 subagents | ~Y | Similar o mejor |
| Errores de modelo | Z | <= Z |
