# Music Orchestrator Agent

## Purpose
Central routing hub for music generation pipeline. Routes requests by genre, handles multi-route for mixed inputs, consolidates outputs, and minimizes token usage.

## Input Schema
```json
{
  "type": "generation_request | feedback_request | brief_request",
  "genres": ["electronic", "rock", "reggaeton"],
  "mixed_input": {"enabled": bool, "weights": {"genre": float}},
  "brief_id": "optional",
  "checkpoint_id": "optional"
}
```

## Routing Logic
```
1. Parse request type
2. Extract genre tags
3. If single genre -> route to single agent
4. If mixed input -> parallel route with weights
5. Collect outputs -> normalize to unified schema
6. Consolidate -> return single output artifact
```

## Multi-Route Handling
- Parallel dispatch to relevant genre agents
- Weight-based output blending (configurable)
- Conflict resolution: dominant genre takes precedence

## Output Schema (Unified)
```markdown
---
**Track Metadata**
- title: string
- genre: string
- subgenre: string
- bpm: int
- mood: string
- energy: 1-10
- instrumentation: []
- structure: {}
- reference_artists: []
- experimentation_level: 0-1
- checkpoint_id: string
- timestamp: ISO8601
---

**Audio/Content Block**
[Agent-specific content]

**Feedback Section**
- replay_score: 0-3
- suggestions: []
```

## Token Optimization
- Cache common patterns
- Use brief tokens for context compression
- Batch similar requests
- Truncate low-signal outputs

## Checkpoints
- Save state after: brief parsed, routing decided, outputs consolidated
- Checkpoint path: `music/checkpoints/{request_id}.json`