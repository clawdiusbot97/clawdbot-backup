# Gateway Pre‑flight Runbook

## Purpose

Detect and prevent `pairing required / repair` and missing `operator.write` scope failures before cron jobs spawn sub‑agents or attempt Telegram delivery.

## Checks performed (deterministic, 0 tokens)

### 1. Gateway reachable
- **Method**: `curl http://127.0.0.1:18789/` (timeout 5s)
- **Failure**: Gateway not listening; systemd service may be stopped.
- **Remediation**:
  ```bash
  systemctl --user status openclaw-gateway
  systemctl --user restart openclaw-gateway
  ```

### 2. Gateway status (no pairing required)
- **Method**: `openclaw status` → grep for `pairing required`, `gateway connect failed`, `closed.*1008`.
- **Failure**: Gateway reports pairing required for connections.
- **Remediation**:
  ```bash
  openclaw devices list                # Check pending requests
  openclaw devices approve <requestId> # Approve repair
  # Verify scopes include operator.write (see below)
  ```

### 3. Device scopes (operator.write present)
- **Method**: `openclaw devices list` → grep for `operator.write` in each paired device.
- **Failure**: No paired device has `operator.write` scope; sub‑agent spawning and direct announce will fail.
- **Remediation**:
  ```bash
  # Edit paired devices file
  vim ~/.openclaw/devices/paired.json
  # Add "operator.write" to scopes array for each device
  # Also add to tokens.operator.scopes
  # Restart gateway
  systemctl --user restart openclaw-gateway
  ```

### 4. Pending/repair requests
- **Method**: `openclaw devices list` → grep for `Pending` or `repair`.
- **Failure**: Unapproved pairing request blocking new connections.
- **Remediation**:
  ```bash
  openclaw devices list                # Show pending request ID
  openclaw devices approve <requestId> # Approve it
  ```

### 5. Recent log errors
- **Method**: `journalctl --user -u openclaw-gateway -n 50` → grep for `pairing required`, `repair`, `approval request`, `requestId`.
- **Failure**: Recent errors indicate recurring issue.
- **Remediation**: Investigate root cause (scope mismatch, token rotation, etc.)

## Integration points

### Cron jobs that MUST call pre‑flight
1. **Daily Newsletter Digest** (`fd9aeac4‑…`) – before spawning `researcher` sub‑agent.
2. **Morning Twitter Briefing** (`db0fe015‑…`) – before delivery to Telegram.
3. **nightly_summary** (`6ed083c2‑…`) – before delivery to Telegram.
4. **Any cron with `sessionTarget: isolated`** that uses `sessions_spawn` or `delivery.mode: announce`.

### How to integrate
Add at the start of the cron’s agentTurn message:
```bash
# Pre‑flight check
cd /home/manpac/.openclaw/workspace/skills/gateway‑preflight
./scripts/preflight.sh || {
  echo "Pre‑flight FAILED; aborting cron job"
  exit 1
}
```

Or embed in the skill’s pipeline script (recommended):
```python
# In newsletter‑digest’s pipeline script
subprocess.run([“/home/manpac/.openclaw/workspace/skills/gateway‑preflight/scripts/preflight.sh”], check=True)
```

## Alerting and debounce

- **Checkpoint**: JSON written to `checkpoints/health/preflight‑YYYY‑MM‑DDTHHMM.json`.
- **Debounce**: Same failure signature within 60 minutes → suppress alert (exit 0, not 1).
- **Signature**: e.g., `pairing_required|missing_operator_write|pending_requests`

### When to notify
- **FAIL with new signature** → cron job stops (exit 1); error appears in cron logs.
- **FAIL debounced** → cron continues (exit 0) but checkpoint still written.
- **PASS** → normal execution.

## Debugging workflow

### Step 1: Check latest checkpoint
```bash
cd /home/manpac/.openclaw/workspace/skills/gateway‑preflight
ls -lt checkpoints/health/ | head -5
jq . checkpoints/health/preflight-*.json | tail -100
```

### Step 2: Manual verification
```bash
openclaw status
openclaw devices list
journalctl --user -u openclaw-gateway -n 100 | grep -i -E “pair|repair|approve|request”
```

### Step 3: Remediation
1. **Approve pending request** (if any).
2. **Add missing scopes** to `~/.openclaw/devices/paired.json`.
3. **Restart gateway**: `systemctl --user restart openclaw-gateway`.
4. **Test**: Run `./scripts/preflight.sh` manually.

### Step 4: Verify cron integration
```bash
# Dry‑run a cron job
openclaw cron run <jobId> --dry-run
```

## Prevention checklist

- [ ] All paired devices have `operator.write` scope (CLI + webchat).
- [ ] No pending pairing requests older than 5 minutes.
- [ ] Gateway logs show no `pairing required` errors in last hour.
- [ ] `openclaw status` shows `reachable` and no pairing warnings.
- [ ] Cron jobs that spawn sub‑agents call pre‑flight before spawning.

## Escalation

If failures persist after remediation:
1. Check gateway config (`~/.openclaw/openclaw.json`) for `gateway.auth.defaultScopes`.
2. Consider rotating device tokens: `openclaw devices rotate <deviceId> operator`.
3. Clear all pairings and re‑pair (nuclear option):
   ```bash
   openclaw devices clear
   # Restart gateway, then re‑pair CLI and webchat
   ```

---

*Last updated: 2026‑02‑21*  
*Maintainer: OpenClaw ops*