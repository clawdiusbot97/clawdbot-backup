# Morning Intelligence Workflow

Daily briefing generator with Discord delivery.

## Schedule
- **Time:** 08:00 America/Montevideo
- **Frequency:** Daily
- **Delivery:** Discord only

## Discord Channels

| Purpose | Channel ID | Guild |
|---------|------------|-------|
| Briefings | 1475961144416931931 | 1475957498942062654 |
| Newsletters | 1475961125257351423 | 1475957498942062654 |
| Finance | 1475961220216520887 | 1475957498942062654 |
| Music | 1475961199207251968 | 1475957498942062654 |

## Files Used

| File | Path | Purpose |
|------|------|---------|
| Personal Tasks | `dashboard/personal_tasks.md` | Read-only for task section |
| Music Profile | `dashboard/music_profile.md` | Taste reference |
| Music History | `dashboard/music_history.jsonl` | De-duplication source |

## Workflow Steps

1. **Data Collection** (researcher subagent)
   - AI/Tech/Startup news
   - Global signals (tech/markets/regulation/macro only)
   - "On This Day" historical event
   - Gmail: unread or last 24h (max 10)
   - Parse inbox once only

2. **Classification**
   - Newsletters → newsletters channel
   - Itaú emails → finance channel (if present)

3. **Music Generation**
   - Read music_profile.md
   - Check music_history.jsonl for played artists/tracks
   - Generate 6-8 recommendations
   - Append to music_history.jsonl

4. **Discord Delivery** (in order)
   - Briefings
   - Newsletters
   - Finance (conditional)
   - Music

## Output Format

### Briefings
```
# 🌅 Morning Intel — YYYY-MM-DD

---

## 🚀 AI / Tech & Global Signals
[items with: what happened / why it matters / implications]

---

## 📜 On This Day
[event + significance]

---

## 📝 Your Tasks
### Pending ...
### In Progress ...

---

## 🤖 What I Can Execute Today
[3-5 concrete actions]
```

### Newsletters
```
# 📰 Newsletter Digest — YYYY-MM-DD
[synthesized insights]
```

### Finance (conditional)
```
# 💳 Finance Snapshot — YYYY-MM-DD
[visible totals / notable expenses / changes]
```

### Music
```
# 🎧 Music Radar — YYYY-MM-DD
[6-8 tracks with artist + reason + context]
```

## Model Rules

- DO NOT use Codex
- Prefer cost-efficient OpenRouter models
- Respect token caps

## Cron Job

Name: `morning-intelligence`
Schedule: `0 8 * * *` (08:00 America/Montevideo)
Command: See cron configuration

## Manual Trigger

```bash
openclaw sessions_spawn \
  --task "Run Morning Intelligence Workflow for $(date +%Y-%m-%d)" \
  --label morning-intel
```
