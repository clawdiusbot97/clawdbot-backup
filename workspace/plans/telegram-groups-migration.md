# Telegram Groups Migration Plan

## Groups Proposed (Manu to create, add bot, provide IDs)

| Group Name | Purpose | Cron Jobs |
|------------|---------|-----------|
| `Clawdbot - Qubika` | Deadlines and daily focus for Qubika/Bancard | `qubika-deadline-check`, `qubika-daily-focus` |
| `Clawdbot - Twitter` | Tech/finance/marketing tweet digest | `Twitter RSS Digest` |
| `Clawdbot - Newsletters` | Daily newsletter digest + weekly metrics | `Daily Newsletter Digest`, `weekly-newsletter-metrics` |
| `Clawdbot - Finance` | Itaú spend alerts, subscription changes | `itau-daily-spend-analysis` |
| `Clawdbot - Music Radar` | Daily music trends + weekly extended radar | `music-trends-scout-5am`, `music-radar-extended-weekly` |
| `Clawdbot - Briefings` | Morning and evening briefings | `daily-morning-briefing`, `evening-fallback-briefing` |

## Slack Channels (remain unchanged)

- `brokia-ai-alerts` → `brokia-calendar-alerts-daily`
- `C0AFK08BFR8` → `nightly_healthcheck`, `nightly_summary`, `healthcheck:security-audit`, `healthcheck:update-status`

## Steps

1. Manu creates groups in Telegram, adds `@OpenClawBot`.
2. Manu provides group IDs (negative numbers).
3. Update each cron job’s `delivery` field:
   ```json
   {
     "delivery": {
       "mode": "announce",
       "channel": "telegram",
       "to": "<GROUP_ID>"
     }
   }
   ```
4. Test with a manual run of each job after update.

## Status

- [x] Updated healthcheck jobs to Slack `C0AFK08BFR8`
- [ ] Awaiting Telegram group IDs
- [ ] Monitor Twitter Digest (next run 2026‑02‑19 08:21 UTC) – currently set to DM

## Notes

- Keep DM (`2017549847`) for critical alerts if desired (maybe `itau-daily-spend-analysis` stays in DM?).
- If context‑window errors persist (`401 User not found`), consider splitting heavy jobs (e.g., morning briefing) into stages with checkpoints.