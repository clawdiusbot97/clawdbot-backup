# Agent Dashboard — Models

Source of truth: `/home/manpac/.openclaw/openclaw.json`

## Cost Plan v1 (active)
- **main**: `openai-codex/gpt-5.3-codex` (quality-critical orchestration)
- **builder**: `openai-codex/gpt-5.3-codex` (technical depth)
- **researcher**: `openai-codex/gpt-5.1-codex` (cost-optimized research)
- **writer**: `openai-codex/gpt-5.1-codex` (cost-optimized drafting)
- **chief**: `openai-codex/gpt-5.1-codex` (planning/tracking)
- **ops**: `openai-codex/gpt-5.1-codex` (ops checks)
- **brokia**: `openai-codex/gpt-5.1-codex` (domain support)

## Sub-agent cost safety policy
- default sub-agent model: `openai-codex/gpt-5.1-codex`
- default sub-agent thinking: `low`
- default sub-agent max concurrent: `4`
- escalation rule: use `gpt-5.3-codex` only for final architecture/critical decisions.

## How to change
1. Edit `openclaw.json` under `agents.list[]` model override.
2. Restart gateway.
3. Verify with `openclaw agents list --json`.
