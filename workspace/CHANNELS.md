# Telegram Groups – Notification Channels

Mapeo de grupos de Telegram creados para separar streams de notificaciones.

## Grupos

| Nombre | Telegram ID | Uso previsto |
|--------|-------------|--------------|
| Clawdius - Qubika | `-5218900004` | Alertas/updates de trabajo Qubika/Bancard |
| Calwdius - Newsletters | `-5295394319` | Daily newsletter digest |
| Calwdius - Finance | `-5042828486` | Análisis de gastos Itaú, alertas financieras |
| Calwdius - Twitter | `-5095009832` | Digest de Twitter RSS |
| Calwdius - Briefings | `-5248435389` | Briefing matutino, evening fallback |
| Calwdius - Music Radar | `-5291576044` | Alertas de música, trends, weekly radar |

## Slack (mantener para team-facing)

| Nombre | Slack ID / channel | Uso |
|--------|-------------------|-----|
| brokia-ai-alerts | `brokia-ai-alerts` | Alertas de calendario Brokia/ORT |
| ops-alerts | `C0AFK08BFR8` | Nightly healthcheck, security audit, update status |

## Jobs que necesitan migración

Por actualizar `delivery.channel` y `delivery.to`:

- `daily-morning-briefing` → `Calwdius - Briefings` (`-5248435389`)
- `Twitter RSS Digest` → `Calwdius - Twitter` (`-5095009832`)
- `Daily Newsletter Digest` → `Calwdius - Newsletters` (`-5295394319`)
- `music-trends-scout-5am` → `Calwdius - Music Radar` (`-5291576044`)
- `music-radar-extended-weekly` → `Calwdius - Music Radar` (`-5291576044`)
- `itau-daily-spend-analysis` → `Calwdius - Finance` (`-5042828486`)
- `weekly-newsletter-metrics` → `Calwdius - Newsletters` (`-5295394319`)
- `qubika-daily-focus` → `Clawdius - Qubika` (`-5218900004`)
- `qubika-deadline-check` → `Clawdius - Qubika` (`-5218900004`)
- `evening-fallback-briefing` → `Calwdius - Briefings` (`-5248435389`)
- `brokia-calendar-alerts-daily` → **Slack** (ya correcto)
- `nightly_healthcheck` → **Slack** (ya correcto)
- `nightly_summary` → **Slack** (ya correcto)

## Notas

- Los IDs de Telegram son **negativos** porque son grupos (no usuarios individuales).
- Slack channels se referencian por nombre (`brokia-ai-alerts`) o ID (`C0AFK08BFR8`).
- Algunos jobs pueden mantener delivery a DM personal si son críticos o si prefieres que lleguen directo.