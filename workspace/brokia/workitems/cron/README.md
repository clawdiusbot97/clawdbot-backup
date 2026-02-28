# Cron Examples - Brokia Work-Items

Este directorio contiene ejemplos de cómo configurar tareas automáticas para el sistema de work-items.

## ⚠️ Reglas de Seguridad para Cron/Triggers

1. **Triggers SOLO pueden ejecutar:**
   - `wi-pipeline.sh --step research`
   - `wi-pipeline.sh --step validate`
   - `wi-pipeline.sh --step report`
   - `wi-pipeline.sh --step index`
   - `wi-report.sh`
   - `wi-index.sh`

2. **PROHIBIDO en triggers automáticos:**
   - ❌ `wi-move.sh --to BUILDING`
   - ❌ `wi-pipeline.sh --step build`
   - ❌ Cualquier transición a estado BUILDING

3. **BUILDING solo puede ser ejecutado manualmente por un humano.**

---

## Ejemplo 1: Regenerar Dashboard cada hora

**Archivo:** `/etc/cron.d/brokia-dashboard`

```cron
# Brokia Work-Items Dashboard - Regenerar cada hora
0 * * * * manpac cd /home/manpac/.openclaw/workspace/brokia/workitems && ./scripts/wi-index.sh --format dashboard > /tmp/brokia-dashboard.txt 2>&1
```

O usando el watch en modo one-shot:

```cron
# Ejecutar index cada hora
0 * * * * manpac cd /home/manpac/.openclaw/workspace/brokia/workitems && ./scripts/wi-watch.sh --action index --one-shot >> /var/log/brokia-cron.log 2>&1
```

---

## Ejemplo 2: Notificaciones diarias con timestamp

**Archivo:** `/etc/cron.d/brokia-notify`

```cron
# Brokia Work-Items - Reporte diario a las 9 AM
0 9 * * * manpac cd /home/manpac/.openclaw/workspace/brokia/workitems && ./scripts/wi-notify.sh --stale-days 7 > reports/daily-report-$(date +\%Y\%m\%d).md 2>&1
```

**Script alternativo (con copia a backup):**

```bash
#!/bin/bash
# /home/manpac/.openclaw/workspace/brokia/workitems/cron/daily-report.sh

set -e
cd /home/manpac/.openclaw/workspace/brokia/workitems

DATE=$(date +%Y%m%d)
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Crear reporte
./scripts/wi-notify.sh --stale-days 7 > "reports/daily-report-${DATE}.md"

# Log
logger -t brokia-workitems "Daily report generated: daily-report-${DATE}.md"

echo "Report saved: reports/daily-report-${DATE}.md"
```

**Crontab:**
```cron
0 9 * * * /home/manpac/.openclaw/workspace/brokia/workitems/cron/daily-report.sh
```

---

## Ejemplo 3: Auto-research con wi-watch (loop corto)

### Opción A: Cron cada minuto (simple)

```cron
# Ejecutar wi-watch cada minuto en modo one-shot
* * * * * manpac cd /home/manpac/.openclaw/workspace/brokia/workitems && timeout 55 ./scripts/wi-watch.sh --action research --one-shot >> /var/log/brokia-watch.log 2>&1
```

### Opción B: Systemd Service (recomendado para producción)

**Archivo:** `~/.config/systemd/user/brokia-watch.service`

```ini
[Unit]
Description=Brokia Work-Items Watch
After=network.target

[Service]
Type=simple
WorkingDirectory=/home/manpac/.openclaw/workspace/brokia/workitems
ExecStart=/home/manpac/.openclaw/workspace/brokia/workitems/scripts/wi-watch.sh --interval-seconds 60 --action research
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=default.target
```

**Comandos:**
```bash
systemctl --user daemon-reload
systemctl --user enable brokia-watch.service
systemctl --user start brokia-watch.service
systemctl --user status brokia-watch.service
```

**Pros de systemd:**
- ✅ Auto-restart si falla
- ✅ Logging integrado (`journalctl --user -u brokia-watch`)
- ✅ Control fino de recursos
- ✅ No depende de cron

**Cons:**
- ⚠️ Más complejo de configurar inicialmente
- ⚠️ Requiere systemd (no disponible en todos los entornos)

### Opción C: Loop simple con nohup (desarrollo)

```bash
# Terminal 1: Iniciar watch
nohup ./scripts/wi-watch.sh --interval-seconds 30 --action research > /tmp/brokia-watch.log 2>&1 &

# Ver logs
tail -f /tmp/brokia-watch.log

# Matar
echo "Ver procesos: ps aux | grep wi-watch"
echo "Matar: kill <PID>"
```

**Pros:**
- ✅ Simple, sin configuración
- ✅ Visible en tiempo real

**Cons:**
- ⚠️ No auto-restart
- ⚠️ Se muere al reiniciar
- ⚠️ No logs estructurados

---

## Ejemplo 4: Combinación completa (Master Cron)

**Archivo:** `/etc/cron.d/brokia-master`

```cron
# Brokia Work-Items - Master Schedule

# Cada 5 minutos: Auto-research de nuevos items
*/5 * * * * manpac cd /home/manpac/.openclaw/workspace/brokia/workitems && timeout 240 ./scripts/wi-watch.sh --action research --one-shot >> /var/log/brokia-watch.log 2>&1

# Cada hora: Dashboard
0 * * * * manpac cd /home/manpac/.openclaw/workspace/brokia/workitems && ./scripts/wi-index.sh --format dashboard > /tmp/brokia-dashboard.txt 2>&1

# Cada día 9 AM: Notificación de stale items
0 9 * * * manpac cd /home/manpac/.openclaw/workspace/brokia/workitems && ./scripts/wi-notify.sh --stale-days 7 > "reports/daily-$(date +\%Y\%m\%d).md" 2>&1

# Cada semana (lunes 8 AM): Reporte completo
0 8 * * 1 manpac cd /home/manpac/.openclaw/workspace/brokia/workitems && ./scripts/wi-index.sh --format table > "reports/weekly-$(date +\%Y\%m\%d).md" 2>&1
```

---

## Logs y Monitoreo

### Ver logs de cron

```bash
# Ubuntu/Debian
sudo tail -f /var/log/syslog | grep brokia

# CentOS/RHEL
sudo tail -f /var/log/cron

# Systemd journal
journalctl --user -u brokia-watch -f
```

### Archivos de log sugeridos

```bash
# Crear directorio de logs
mkdir -p /home/manpac/.openclaw/workspace/brokia/workitems/logs

# Rotación de logs (logrotate)
# Archivo: /etc/logrotate.d/brokia-workitems
```

---

## Testing

Antes de activar en producción, probar:

```bash
# Test manual (one-shot)
cd /home/manpac/.openclaw/workspace/brokia/workitems
./scripts/wi-watch.sh --action research --one-shot

# Test notify
./scripts/wi-notify.sh --stale-days 7

# Test completo
./scripts/wi-selftest-triggers.sh
```

---

## Troubleshooting

### "No se encuentran items"
Verificar que `inbox/` tenga archivos `.md` con `status: NEW`

### "Permission denied"
Asegurar que los scripts sean ejecutables:
```bash
chmod +x /home/manpac/.openclaw/workspace/brokia/workitems/scripts/*.sh
```

### "Procesa el mismo item múltiples veces"
El archivo `.wi-watch-processed` debe ser escribible por el usuario de cron.

### "Cron no ejecuta"
Verificar que el usuario tenga PATH correcto:
```cron
PATH=/usr/local/bin:/usr/bin:/bin
```
