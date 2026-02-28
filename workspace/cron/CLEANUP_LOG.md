# Cron Cleanup Log
Generated: 2026-02-22T00:22:01.744149Z

## Reasoning Summary
Jobs classified based on operational pipelines, duplicates, and failure states.

## Risk Assessment (What could break)
1. Disabling `briefing_sources_fetch` would break morning briefing freshness.
2. Disabling `daily-morning-briefing-telegram` would stop daily briefing delivery.
3. Disabling any nightly chain job could disrupt nightly reports.
4. Disabling `openclaw-healthcheck` would stop periodic gateway preflight checks.
5. Disabling `daily-openclaw-backup` would stop daily backups.
6. Disabling `daily-openclaw-update` would stop auto-updates.
7. Disabling `brokia-calendar-alerts-daily` would miss calendar alerts.
8. Disabling `qubika-daily-focus` would miss Qubika daily focus.

## Checklist: Verification of Outputs per Pipeline
### Newsletter Pipeline
- [ ] Daily Newsletter Digest runs at 9:00 UTC
- [ ] Sources: nytdirect@nytimes.com, news@thehustle.co, dan@tldrnewsletter.com, hello@historyfacts.com, newsletter@aisecret.us, newsletter@themarginalian.org, rw@peterc.org, node@cooperpress.com
- [ ] Output: newsletter‑digest‑YYYY‑MM‑DD.md
- [ ] Delivery: Telegram group -5295394319

### Twitter Pipeline
- [ ] Twitter RSS Digest runs every 12 hours (if enabled)
- [ ] Morning Twitter Briefing at 8:00 AM Montevideo
- [ ] Output: raw tweet data, formatted digest
- [ ] Delivery: Telegram group -5095009832

### Nightly Chain
- [ ] nightly_healthcheck at 2:00 AM
- [ ] nightly_cost_guard at 2:10
- [ ] nightly_backlog_groomer at 2:20
- [ ] nightly_trends_gate at 2:40
- [ ] nightly_inbox_triage at 3:10
- [ ] nightly_summary at 3:30
- [ ] Outputs: reports/nightly/*
- [ ] Delivery: only if critical (Telegram 2017549847)

### Brokia Pipeline
- [ ] brokia-calendar-alerts-daily at 7:10 AM
- [ ] brokia-doc-diario-sync at 9:30 PM
- [ ] brokia-doc-maestro-weekly-sync at 10:00 PM Sunday
- [ ] Outputs: bitácora diaria, Google Docs

### Qubika Pipeline
- [ ] qubika-daily-focus at 8:30 AM Monday/Thursday
- [ ] qubika-deadline-check at 5:30 PM Mon‑Fri

### Music Pipeline
- [ ] music-trends-scout-5am at 5:00 AM Mon/Wed/Fri
- [ ] music-radar-extended-weekly at 11:00 AM Sunday

### Maintenance Pipeline
- [ ] openclaw-healthcheck every 6 hours
- [ ] daily-openclaw-update at 4:00 AM
- [ ] daily-openclaw-backup at 4:30 AM

### Briefing Pipeline
- [ ] briefing_sources_fetch at 7:50 AM
- [ ] daily-morning-briefing-telegram at 8:00 AM

### Other
- [ ] Weekly Improvements Review at 0:00 UTC Monday
- [ ] life-story-daily-question at 2:30 PM Montevideo

## Notes
- Patch only disables jobs classified as PAUSE/REMOVE.
- No jobs deleted; enabled flag set to false.
- Review each pipeline after changes to ensure continuity.