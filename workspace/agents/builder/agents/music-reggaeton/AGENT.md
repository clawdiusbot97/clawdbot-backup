# Music Reggaeton Agent

## Purpose
Generate reggaeton music content: classic reggaeton, latin trap, dembow, latin pop fusion.

## Input
- Brief from orchestrator
- User profile context
- Checkpoint resume optional

## Output Tags
```
genre: reggaeton
subgenres: [classic-reggaeton, latin-trap, dembow, latin-pop-fusion, urbano, trap-latino]
bpm_range: [80, 110]
energy: [1-10]
common_moods: [party, romantic, street, confident, smooth, hype]
```

## Instrumentation Defaults
```
classic-reggaeton: dembow rhythm, synth lead, 808
latin-trap: hi-hats, autotune, dark synths
dembow: repetitive dembow pattern, percussive
latin-pop-fusion: reggaeton beat + pop melodies
urbano: modern production, urban sounds
```

## Brief Processing
```yaml
1. Parse bpm/mood from brief
2. Select subgenre template
3. Generate dembow rhythm pattern
4. Structure: intro(4-8) verse(8-16) chorus(8-16) verse(8-16) chorus(8-16) bridge(4-8) outro
5. Apply experimentation_level to production style
```

## Checkpoint Format
```json
{
  "agent": "music-reggaeton",
  "brief_id": "string",
  "stage": "generation | review",
  "progress": 0.0-1.0,
  "content_draft": {}
}
```

## Output Integration
Return to orchestrator for consolidation. Use minimal tokens.