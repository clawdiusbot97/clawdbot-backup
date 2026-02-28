# Music Automations

## Hooks

### feedback-received
**Trigger**: New feedback submitted via `feedback()` skill
**Action**: Update user_profile.json with new preferences
**Condition**: replay_score >= 2

### brief-created
**Trigger**: New brief saved via `create_brief()`
**Action**: Enqueue generation task to orchestrator
**Condition**: brief.valid == true

### track-generated
**Trigger**: Orchestrator completes output consolidation
**Action**: Request user rating via notification
**Condition**: output.generation_complete == true

## Cron Jobs

### music-digest (Daily)
**Schedule**: `0 9 * * *` (9:00 UTC daily)
**Trigger Condition**: At scheduled time
**Action**:
```
1. Query library for tracks generated in last 24h
2. Summarize: count by genre, avg energy, new artists
3. Send digest to user
```

### music-explore (Weekly)
**Schedule**: `0 10 * * 1` (10:00 UTC Monday, weekly)
**Trigger Condition**: At scheduled time (80/20 exploit/explore)
**Action**:
```
1. EXPLORE (20%): Random genre/subgenre not in top_genres
2. EXPLOIT (80%): Top-performing genre + slight variation
3. Generate brief for each
4. Enqueue generation
5. Report: "Generated 5 tracks (4 exploit, 1 explore)"
```

## Cron Spec Examples

```bash
# Daily digest at 9 AM UTC
0 9 * * * cd /home/manpac/.openclaw/workspace/agents/builder && python -m automations.music_digest

# Weekly explore at 10 AM Monday
0 10 * * 1 cd /home/manpac/.openclaw/workspace/agents/builder && python -m automations.music_explore
```

## Event-Driven Triggers

| Event | Hook | Automation |
|-------|------|------------|
| feedback.submit | feedback-received | update-profile |
| brief.create | brief-created | enqueue-generation |
| track.complete | track-generated | request-rating |

## Automation Scripts Location
```
automations/
  music_digest.py
  music_explore.py
  hooks/
    feedback_hook.py
    brief_hook.py
    track_hook.py
```

## Error Handling
- Log failures to `music/checkpoints/automation_errors.log`
- Retry up to 3 times with exponential backoff
- Alert on persistent failures