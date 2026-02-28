---
name: gateway-preflight
description: Deterministic gateway health and pairing checks to prevent "pairing required / repair" failures in cron jobs that spawn sub‑agents or do delivery.
metadata:
  {
    "openclaw": {
      "emoji": "🛂",
      "tags": ["gateway", "healthcheck", "pairing", "cron", "guardrail"]
    }
  }
---

# gateway-preflight

Pre‑flight checks for OpenClaw gateway connectivity, device scopes, and pairing state. Runs without LLM (zero tokens) to catch `pairing required`, missing `operator.write` scope, or pending repair requests **before** cron jobs spawn sub‑agents or attempt Telegram delivery.

## Inputs

- **Gateway status**: via `openclaw status` or direct WebSocket ping.
- **Device pairing**: via `openclaw devices list`.
- **Log inspection**: `journalctl --user -u openclaw-gateway` for recent pairing‑related errors.
- **Config validation**: `~/.openclaw/openclaw.json` gateway/auth defaults.

## Outputs

- **Checkpoint JSON**: `checkpoints/health/preflight-YYYY-MM-DDTHHMM.json`
- **Exit code**: 0 (PASS) or non‑zero (FAIL)
- **Stdout**: One‑line summary (`PASS` or `FAIL: <signature>`)
- **Stderr**: Diagnostic details (for logs)

## Pipeline

1. **Gateway reachable**: Ping `ws://127.0.0.1:18789` (or config port) with timeout.
2. **Status parse**: Run `openclaw status` (if available), look for `pairing required` or `gateway connect failed`.
3. **Device scopes**: List paired devices, ensure each has `operator.write` scope.
4. **Pending requests**: Detect pending/repair pairing requests (`openclaw devices list`).
5. **Log tail**: Scan last 50 lines of gateway logs for `pairing required / repair / approval request`.
6. **Decision**:
   - **PASS**: All checks green → cron can proceed.
   - **FAIL**: Any critical issue → write checkpoint, notify, stop.

## Integration

Call this skill **before** any cron job that:

- Spawns sub‑agents (`sessions_spawn`)
- Sends Telegram/Slack delivery (`message` tool with delivery mode)
- Uses `sessions_list`, `sessions_send`, `subagents`, etc.

### Example wrapper
```bash
cd /home/manpac/.openclaw/workspace/skills/gateway-preflight
./scripts/preflight.sh || {
  echo "Pre‑flight FAILED; aborting cron job"
  exit 1
}
```

## Configuration

### Environment variables (optional)
- `GATEWAY_HOST`: Override host (default: `127.0.0.1`)
- `GATEWAY_PORT`: Override port (default: `18789`)
- `CHECKPOINT_DIR`: Where to write checkpoint JSON (default: `checkpoints/health/`)
- `DEBOUNCE_MINUTES`: Minimum minutes between same‑signature alerts (default: `60`)

## Runbook

See `runbooks/gateway-preflight.md` for:
- What each check means
- How to debug
- Remediation steps (approve pending, add scopes, restart gateway)
- Escalation to manual intervention