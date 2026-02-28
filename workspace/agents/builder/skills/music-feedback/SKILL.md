# Music Feedback Skill

## Purpose
Process user feedback on generated tracks and update user profile accordingly.

## Input
```
- track_id: string
- replay_score: 0-3 (required)
- comments: string (optional)
- mood_tags: [] (optional)
- skip_patterns: [] (optional)
```

## Processing
```yaml
1. Validate replay_score (0-3)
2. Read user_profile from music/user_profile.json
3. Calculate profile updates:
   - If replay_score >= 2: add genre/subgenre to top lists
   - Extract mood from comments if present
   - If replay_score == 0: add to negative_patterns
4. Update user_profile fields:
   - top_genres: sorted list
   - top_subgenres: sorted list
   - preferred_bpm_range: [min, max] (inferred from liked tracks)
   - energy_preference: average energy of high-score tracks
   - mood_bias: weighted mood frequencies
   - negative_patterns: tracks/patterns to avoid
   - last_updated: ISO8601
5. Write updated profile
6. Trigger hook: feedback-received -> update-profile
```

## Commands
```
feedback(track_id, replay_score, comments?) -> profile_updated
get_profile() -> user_profile
get_negative_patterns() -> []
```

## Profile Schema
```json
{
  "user_id": "default",
  "top_genres": ["electronic", "rock"],
  "top_subgenres": ["synthwave", "alternative-rock"],
  "preferred_bpm_range": [100, 140],
  "energy_preference": 7.5,
  "mood_bias": {"dark": 0.4, "energetic": 0.6},
  "negative_patterns": ["excessive-bleeps", "too-fast-drums"],
  "last_updated": "2026-02-19T03:32:00Z"
}
```

## Replay Score Semantics
```
0: Dislike, never play again
1: Skip, not preferred
2: Okay, occasional play
3: Love, high replay value
```