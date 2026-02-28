---
name: brokia-deadline-alerts
description: T-7 deadline monitoring for Brokia thesis. Reads Google Calendar, posts Slack alerts, writes checkpoints.
metadata:
  {
    "openclaw": {
      "emoji": "⏰",
      "tags": ["brokia", "deadlines", "calendar", "alerts", "cron"],
      "requires": { "bins": ["gog", "openclaw"] }
    }
  }
---

# brokia-deadline-alerts

T-7 deadline alert system for Brokia thesis monitoring. Runs daily to detect events occurring exactly 7 days from now and posts formatted alerts to Slack.

## Purpose

- Monitor Google Calendar for upcoming Brokia/ORT deadlines
- Generate T-7 alerts (7 days before event)
- Prevent duplicate alerts via checkpoint dedupe
- Maintain audit trail in checkpoint files

## Behavior

1. **Read Calendar**: Query Google Calendar (tachipachi9797@gmail.com) for next 14 days
2. **Filter T-7**: Identify events occurring exactly 7 days from today
3. **Check Dedupe**: Verify if alert was already sent today (via checkpoint)
4. **Format Alert**: Generate Slack message in exact format:
   ```
   :pushpin: Alertas Brokia/ORT (T-7)
   Para el {DATE} tenés:
   • {Event Title} → Acción sugerida: {suggested_action}
   ```
5. **Send Alert**: Post to #brokia-ai-alerts if not already sent
6. **Write Checkpoint**: Record execution with dedupe data

## Suggested Actions

- If event description contains actionable text → extract first sentence
- If no description → "Confirmar detalles y preparar entregables."

## Checkpoint Schema

Location: `checkpoints/brokia/deadlines-YYYY-MM-DD.json`

```json
{
  "schema": "brokia-deadlines-v1",
  "generated_at": "2026-02-25T08:00:00-03:00",
  "query_range": {"start": "2026-02-25", "end": "2026-03-11"},
  "alerts_generated": [
    {
      "event_id": "cal_abc123",
      "summary": "Entrega borrador capítulo 3",
      "date": "2026-03-04",
      "days_until": 7,
      "suggested_action": "Revisar sección de validación con Rodrigo",
      "alert_sent": true,
      "slack_ts": "1234567890.123456"
    }
  ],
  "dedupe": {
    "key": "{event_id}:{YYYY-MM-DD}",
    "already_sent_today": false
  }
}
```

## Usage

### Manual run
```bash
/home/manpac/.openclaw/workspace/skills/brokia-deadline-alerts/scripts/run.sh
```

### Cron job
- Schedule: `0 8 * * *` (8:00 AM America/Montevideo)
- Initially disabled for testing

## Dependencies

- `gog` CLI with OAuth for tachipachi9797@gmail.com (calendar access)
- `openclaw` CLI for Slack messaging
- `jq` for JSON processing
- `date` command with GNU date extensions

## Slack Channel

- **Channel**: `#brokia-ai-alerts`
- **ID**: `C0AFK08BFR8`

## Files

- `SKILL.md` — This documentation
- `scripts/run.sh` — Main execution script
