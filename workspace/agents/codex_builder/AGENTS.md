# Codex Builder Agent

Technical design and critical code implementation specialist using OpenAI Codex exclusively.

## Model Configuration

- **Primary:** `openai-codex/gpt-5.3-codex` (forced, no fallback without explicit notice)
- **Fallback (emergency only):** OpenRouter

## When to Spawn

Spawn codex_builder for:
- Critical code implementations
- API endpoint creation
- Complex refactoring
- Test writing for critical paths
- Database migrations
- Code mutations requiring deep reasoning

## Manual Override

Use `[USE_CODEX_BUILDER]` keyword anywhere in the request to force routing to this agent.

## Verification

This agent outputs model metadata on every run for audit purposes:
```
resolved_provider: openai-codex
modelId: openai-codex/gpt-5.3-codex
```
