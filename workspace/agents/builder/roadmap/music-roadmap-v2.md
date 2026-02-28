# Music Electronic System Roadmap V2

## Overview

Phase-based implementation plan for underground electronic music producer-level specialization system. V2 introduces subgenre technical precision, taxonomy expansion, and producer workflow integration.

## Schema Version: 2.0

## Phased Implementation

### Phase 1: Core Infrastructure
**Status**: Completed
- Taxonomy schema V2 defined
- Agent routing boundaries established
- Output normalization contracts implemented

**Deliverables**:
- [x] `music/taxonomy.json` - Subgenre definitions with technical attributes
- [x] `agents/music-electronic/AGENT.md` - Specialist role definition
- [x] `skills/electronic-tagging/SKILL.md` - Tagging skill specification
- [x] `skills/electronic-generate-brief/SKILL.md` - Brief generation specification

### Phase 2: User Profile Extension
**Status**: Completed
- Extended profile schema with underground preferences

**Deliverables**:
- [x] `music/user_profile.json` - Extended fields:
  - `preferred_subgenres`: Array of subgenre preferences
  - `preferred_groove_types`: Groove style preferences
  - `preferred_low_end_profile`: Bass character preferences
  - `dancefloor_bias`: 0.0-1.0 scale preference
  - `experimentation_tolerance`: safe|medium|high

### Phase 3: Integration Layer
**Status**: Planned Q2 2026
- Library.jsonl schema update
- Brief export format for DAW integration
- Cross-agent communication protocols

**Milestones**:
1. library.jsonl schema V2 migration path
2. Ableton Live clip template export
3. Brief-to-DAW workflow validation

### Phase 4: Advanced Features
**Status**: Planned Q3 2026
- Subgenre trend analysis
- Producer workflow recommendations
- Underground scene intelligence

## Backward Compatibility

### V1 to V2 Migration

| Component | V1 Schema | V2 Schema | Migration Path |
|-----------|-----------|-----------|----------------|
| taxonomy.json | Basic genres | Subgenre taxonomy | Extend, don't replace |
| user_profile.json | Basic fields | Extended fields | Add nullable fields |
| library.jsonl | V1 format | V2 format | Schema version tag |
| briefs.jsonl | N/A | New format | Create new file |

### Compatibility Rules

1. **Taxonomy**: V2 adds subgenres without removing V1 entries
2. **User Profile**: New fields nullable, existing fields unchanged
3. **Library**: Schema version required, V1 records remain readable
4. **Briefs**: New file (briefs.jsonl), no migration needed

## Testing Strategy

### Unit Tests
- Subgenre detection accuracy >90%
- BPM range validation
- Groove type classification

### Integration Tests
- Tag-to-brief workflow
- Profile-based recommendation
- DAW export validation

### End-to-End Tests
- Complete producer workflow
- Cross-agent communication
- Library consistency

## Token Cost Guidelines

| Operation | Target Tokens | Priority |
|-----------|---------------|----------|
| Tagging analysis | <2K | Performance |
| Brief generation | <4K | Quality |
| Taxonomy lookup | <200 | Cache-first |
| Profile updates | <500 | Infrequent |

## File Inventory

```
music/
├── taxonomy.json          # V2: Subgenre definitions
├── user_profile.json      # V2: Extended profile fields
└── library.jsonl          # V2: Append-compatible entries

agents/
└── music-electronic/
    └── AGENT.md           # V2: Specialist role

skills/
├── electronic-tagging/
│   └── SKILL.md           # V2: Tagging specification
└── electronic-generate-brief/
    └── SKILL.md           # V2: Brief specification

roadmap/
└── music-roadmap-v2.md    # This file
```

## Release Notes

### V2.0 (Current)
- Complete taxonomy rebuild with technical attributes
- Three-variant brief generation (Conservative, Refined, Experimental)
- Underground-focused reference artist tiers
- Producer workflow integration points
- DAW export compatibility layer

### V1.0 (Deprecated)
- Basic genre classification
- Simple tagging output
- Generic workflow guidance
- Mainstream-oriented references
