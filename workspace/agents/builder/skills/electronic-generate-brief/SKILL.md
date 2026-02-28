# Electronic Generate Brief Skill

Produces producer-level track briefs for electronic music generation. Generates three variants per request: Conservative, Refined, and Experimental Edge. Designed for DAW workflow integration and underground production standards.

## Input Specification

```json
{
  "request": {
    "subgenre": "string",  // e.g., "Deep House", "Minimal Techno"
    "bpm_target": int,     // Optional: overrides genre default
    "key": "string",       // Optional: e.g., "Am", "Gmaj7"
    "duration_min": int,   // Default: 6-8 minutes
    "energy_level": int,   // 1-10, default: 6
    "vocals": boolean,     // Include vocal elements
    "reference_tracks": ["string"]  // Optional inspiration
  },
  "constraints": {
    "output_format": "brief|detailed",  // Default: brief
    "experimentation_axis": "auto" | "safe" | "hybrid" | "boundary-pushing"
  }
}
```

## Output Specification

Returns three variants with shared metadata and per-variant specifications.

### Brief Structure

| Field | Type | Description |
|-------|------|-------------|
| `subgenre` | string | Exact subgenre classification |
| `bpm` | integer | Precise BPM value |
| `groove_micro` | string | Micro-groove description |
| `drum_architecture` | object | Kick, clap, percussion specs |
| `bassline_pattern` | string | Bass concept description |
| `harmonic_minimalism` | float | 0.0-1.0 scale |
| `texture_layers` | array | Layer strategy (3-5 items) |
| `arrangement_flow` | object | Minute-by-minute breakdown |
| `energy_curve` | array | 7-point energy progression |
| `reference_artists` | array | Underground references (3-5) |
| `dj_usability` | string | DJ transition notes |
| `experimentation_axis` | enum | `safe` \| `refined` \| `experimental` |

### Drum Architecture Spec

```json
{
  "kick": {
    "type": "rounded 909-ish|tight 808|processed analog|layered",
    "transient": "soft|medium|hard",
    "distortion": "none|light|medium|heavy"
  },
  "clap": {
    "placement": "onbeat|offbeat|syncopated",
    "processing": "reverb|tape|compressed|sidechained"
  },
  "percs": {
    "primary": "shaker|tambourine|claps|rim",
    "secondary": ["hat pattern", "layered"],
    "density": 1-5
  }
}
```

### Arrangement Flow Structure

```json
{
  "0:00-0:30": "intro: filtered groove, minimal elements",
  "0:30-1:00": "build: layer addition, subtle elevation",
  "1:00-2:00": "development: groove establishment",
  "2:00-3:30": "peak: full arrangement, energy max",
  "3:30-4:30": "variation: motif shift, texture change",
  "4:30-5:30": " Outro: element reduction, fade"
}
```

### Energy Curve Format

7-point array representing energy at standardized markers:
```
[0:00, 0:30, 1:00, 2:00, 3:30, 4:30, 5:30]
Values: 0.0-1.0 scale (intensity)
```

## Variant Specifications

### Conservative Variant
- Genre conventions strictly followed
- Standard drum patterns
- Predictable arrangement
- Safe transitions
- Target audience: Mainstream crossover

### Refined Variant
- Genre traditions with subtle innovation
- Polished production
- Careful balance of familiar/novel
- DJ-friendly structure
- Target audience: Underground purists

### Experimental Edge Variant
- Boundary-pushing elements
- Unconventional choices
- Genre-blending moments
- Processing emphasis
- Target audience: Avant-garde producers

## Usage Examples

### Minimal Techno Generation

```json
{
  "subgenre": "Minimal Techno",
  "bpm": 128,
  "groove_micro": "tight 16th轧hr quantization, 10% swing on hats only",
  "drum_architecture": {
    "kick": { "type": "tight 808", "transient": "hard", "distortion": "light" },
    "clap": { "placement": "offbeat", "processing": "compressed" },
    "percs": { "primary": "rim", "secondary": ["closed hats 1/8"], "density": 2 }
  },
  "bassline_pattern": "filtered saw, slow filter movement, 1-bar repetition",
  "harmonic_minimalism": 0.9,
  "texture_layers": ["reese pad", "white noise sweep", "field recording"],
  "arrangement_flow": {
    "0:00-1:00": "intro: kick only, filter sweep",
    "1:00-2:00": "build: bass enter, hat pattern",
    "2:00-4:00": "groove: full elements, subtle variation",
    "4:00-5:00": " Outro: elements strip, filter close"
  },
  "energy_curve": [0.3, 0.4, 0.5, 0.6, 0.6, 0.5, 0.3],
  "reference_artists": ["Richie Hawtin", "Robert Hood", "DVS1"],
  "dj_usability": "PM-friendly, keyless, seamless mixing zone",
  "experimentation_axis": "refined"
}
```

### Afro House Generation

```json
{
  "subgenre": "Afro House",
  "bpm": 124,
  "groove_micro": "laid-back 4th轧hr, 20% swing, delayed clap",
  "drum_architecture": {
    "kick": { "type": "rounded 909-ish", "transient": "medium", "distortion": "none" },
    "clap": { "placement": "onbeat", "processing": "reverb" },
    "percs": { "primary": "conga", "secondary": ["shaker", "cowbell"], "density": 4 }
  },
  "bassline_pattern": "slap bass, syncopated 1/8 pattern, chord stabs",
  "harmonic_minimalism": 0.6,
  "texture_layers": ["djembe", "vocal chop", "organ pad", "talking drum"],
  "arrangement_flow": {
    "0:00-0:45": "intro: percussion build, vocal whisper",
    "0:45-1:30": "establish: kick enter, bass groove",
    "1:30-3:00": "development: layers accumulate, energy rise",
    "3:00-4:30": "peak: full arrangement, percussion solo",
    "4:30-5:30": "outro: strip to percussion"
  },
  "energy_curve": [0.2, 0.3, 0.5, 0.7, 0.85, 0.6, 0.3],
  "reference_artists": ["Black Coffee", "Culoe De Song", "Da Capo"],
  "dj_usability": "key-compatible (Am/G), bpm-locked mix zone",
  "experimentation_axis": "conservative"
}
```

## Underground Reference Standards

Reference artists must be:
- Active in underground scene
- Known for technical production
- Subgenre-authentic (not crossover acts)

### Reference Tier System

| Tier | Criteria | Examples |
|------|----------|----------|
| Tier 1 | Scene pioneers, label heads | Ricardo Villalobos, Surgeon |
| Tier 2 | Established underground | Luigi Tozzi, Farseer |
| Tier 3 | Emerging producers | Nesa Azadegan, Job Jobse |

## Token Optimization

- Compact descriptions
- Abbreviated genre terms when clear
- Omit null fields
- Cache reference lookups
- Reuse patterns across variants (inherit + override)

## DAW Integration Notes

Briefs designed for:
- Ableton Live (clip/groove templates)
- Logic Pro X (pattern/step inputs)
- FL Studio (piano roll reference)
- Bitwig (modular patch guidance)

## Experimentation Axis Guidelines

| Axis | Risk Level | Innovation Focus |
|------|------------|------------------|
| `safe` | Low | Genre classic approaches |
| `refined` | Medium | Polished variations |
| `experimental` | High | Genre boundaries, processing |

## Backward Compatibility

- Schema version 2.0
- Fields added are nullable
- Output can be appended to briefs.jsonl
- Version tag required for all outputs