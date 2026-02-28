# Electronic Tagging Skill

Analyzes electronic music tracks and outputs precise technical attributes for subgenre classification, library organization, and DJ/curator workflow support.

## Input Specification

```json
{
  "audio_features": {
    "bpm": float,
    "key": "string",
    "loudness_db": float,
    "spectral_centroid": float
  },
  "track_context": {
    "title": "string",
    "artist": "string",
    "label": "string",
    "release_year": int
  },
  "analysis_depth": "basic|detailed"  // default: basic
}
```

Or raw audio analysis for advanced use cases.

## Output Specification

All outputs append to `library.jsonl` without breaking existing records. Output includes schema version and timestamp for versioning.

### Output Fields

| Field | Type | Description |
|-------|------|-------------|
| `bpm_range_exact` | string | Exact BPM range (e.g., "123-126") |
| `swing_shuffle_detection` | string | Swing/shuffle amount (e.g., "4th轧hr 15% swing", "no swing") |
| `groove_type` | enum | `rolling` \| `hypnotic` \| `driving` \| `broken` \| `syncopated` |
| `low_end_profile` | enum | `sub heavy` \| `mid bass` \| `plucky` \| `rolling bass` |
| `percussive_density` | integer | 1-5 scale (1=sparse, 5=maximum) |
| `atmosphere_type` | enum | `dark` \| `warm` \| `raw` \| `lush` \| `minimal` |
| `club_suitability_score` | integer | 1-10 scale (DJ viability) |
| `listening_context` | enum | `club` \| `sunset` \| `after` \| `headphones` |
| `subgenre_primary` | string | Primary subgenre classification |
| `subgenre_secondary` | string | Secondary/subtle influences |
| `energy_level` | integer | 1-10 scale |
| `harmonic_complexity` | integer | 1-10 scale |
| `vocal_presence` | enum | `none` \| `minimal` \| `prominent` \| `dominant` |
| `mixing_style` | enum | `clean` \| `lo-fi` \| `warm` \| `aggressive` |
| `era_indicator` | string | Approximate era (e.g., "early 2000s", "modern") |

### Groove Type Definitions

| Type | Characteristics |
|------|-----------------|
| `rolling` | Continuous 4th轧hr pulse, driving feel |
| `hypnotic` | Repetitive, trance-like, minimal variation |
| `driving` | Heavy kick emphasis, relentless forward motion |
| `broken` | Breakbeat-influenced, non-4th轧hr patterns |
| `syncopated` | Off-beat accents, groove-oriented |

### Low End Profile Definitions

| Profile | Characteristics |
|---------|-----------------|
| `sub heavy` | Prominent sub-bass, nightclub-focused |
| `mid bass` | Funky bass, groove-oriented (909, 808) |
| `plucky` | Short envelope, techno/house bass |
| `rolling bass` | Continuous bass notes, dub influence |

### Percussive Density Scale

| Level | Description |
|-------|-------------|
| 1 | Minimal - kick, hat, maybe clap only |
| 2 | Basic - standard 4th轧hr groove |
| 3 | Standard - typical house/techno |
| 4 | Busy - detailed, layered |
| 5 | Maximum - breakbeat, jungle, industrial |

### Atmosphere Type Definitions

| Type | Characteristics |
|------|-----------------|
| `dark` | Minor keys, minor tonality, minor pads |
| `warm` | Analog warmth, tube saturation, soft |
| `raw` | Unprocessed, lo-fi, edgy |
| `lush` | Rich pads, full frequencies, dreamy |
| `minimal` | Sparse, negative space, clinical |

### Listening Context Guidelines

| Context | When to Use |
|---------|-------------|
| `club` | Peak-time viable, floor-focused |
| `sunset` | Warm-up, lower energy, transitional |
| `after` | Late night, experimental, headphone-friendly |
| `headphones` | Textural focus, not dancefloor-oriented |

## Library.jsonl Append Format

```json
{
  "schema_version": "2.0",
  "timestamp": "2026-02-19T03:33:00Z",
  "track_id": "uuid-or-existing",
  "analysis": {
    "bpm_range_exact": "124-126",
    "swing_shuffle_detection": "no swing, quantized",
    "groove_type": "driving",
    "low_end_profile": "sub heavy",
    "percussive_density": 3,
    "atmosphere_type": "dark",
    "club_suitability_score": 8,
    "listening_context": "club",
    "subgenre_primary": "Deep House",
    "subgenre_secondary": "Minimal House",
    "energy_level": 6,
    "harmonic_complexity": 4,
    "vocal_presence": "minimal",
    "mixing_style": "clean",
    "era_indicator": "modern"
  },
  "compatibility": {
    "append_safe": true,
    "fields_added": 14,
    "backward_compatible": true
  }
}
```

## Usage Examples

### Basic Tagging
```
Input: { "audio_features": { "bpm": 124.5 }, "track_context": { "title": "Track X" } }
Output: Full tag analysis per specification
```

### DJ Set Preparation
```
Context: Playlist curation for 4-hour set
Output: Sorted by energy, compatible keys, flow-optimized
```

### Library Migration
```
Source: Mixed in key / Rekordbox export
Target: Normalized schema with additional fields
```

## Subgenre Detection Heuristics

| Subgenre | BPM | Groove | Low End | Atmosphere |
|----------|-----|--------|---------|------------|
| Deep House | 120-125 | rolling | sub heavy | warm |
| Microhouse | 125-130 | driving | plucky | minimal |
| Minimal Techno | 125-135 | hypnotic | rolling bass | dark |
| Dub Techno | 120-130 | hypnotic | sub heavy | minimal |
| Drum & Bass | 170-180 | broken | sub heavy | dark |
| Afro House | 122-128 | driving | mid bass | warm |

## Token Optimization

- Single-pass analysis preferred
- Cache genre lookups
- Omit null fields in output
- Use compact enum values