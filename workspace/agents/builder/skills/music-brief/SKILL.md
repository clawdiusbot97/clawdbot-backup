# Music Brief Skill

## Purpose
Create, validate, and manage music generation briefs.

## Input Schema (Brief)
```yaml
required:
  - genre
  - bpm
  - mood

fields:
  genre: "electronic | rock | reggaeton"
  subgenre: string
  bpm: int (range: 60-200)
  mood: string
  energy: int (1-10)
  groove: string (optional)
  instrumentation: [] (optional)
  structure: {} (optional)
  reference_artists: [] (optional)
  experimentation_level: float (0-1, default: 0.3)
  notes: string (optional)
```

## Processing
```yaml
1. Validate required fields
2. Normalize bpm to valid range
3. Map mood to canonical values
4. Set defaults: energy(5), experimentation_level(0.3)
5. Generate brief_id: BRIEF-YYYYMMDD-XX
6. Save to music/briefs/{brief_id}.md
7. Write checkpoint: music/checkpoints/brief_{brief_id}.json
8. Trigger hook: brief-created -> enqueue-generation
```

## Output Format (Brief File)
```markdown
---
brief_id: BRIEF-20260219-01
created_at: 2026-02-19T03:32:00Z
genre: electronic
subgenre: synthwave
bpm: 110
mood: dark
energy: 7
groove: driving
instrumentation: [synth-lead, bass-808, gated-drums]
structure:
  intro: 8
  verse1: 16
  chorus: 16
  verse2: 16
  chorus: 16
  bridge: 8
  outro: 8
reference_artists: [perturbator, gunship, the-midnight]
experimentation_level: 0.4
notes: "Focus on 80s nostalgia with modern production"
---

# BRIEF-20260219-01

## Parameters
| Field | Value |
|-------|-------|
| Genre | electronic / synthwave |
| BPM | 110 |
| Mood | dark |
| Energy | 7/10 |
| Experimentation | 0.4 |

## Notes
Focus on 80s nostalgia with modern production
```

## Commands
```
create_brief(params) -> brief_id
get_brief(brief_id) -> brief
list_briefs() -> [brief_id]
validate_brief(params) -> {valid, errors}
```

## Brief Naming Convention
```
BRIEF-YYYYMMDD-XX
- YYYYMMDD: creation date
- XX: sequential counter (01-99)
```

## Default Values
```
energy: 5
experimentation_level: 0.3
instrumentation: [] (agent-selected)
structure: default template by genre
```