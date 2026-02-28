#!/bin/bash
#
# brokia-heartbeat: NO-LLM health check for Brokia Google/Slack delivery
# Detects failures BEFORE the 08:00 brokia-deadline-alerts cron
#
# Constraints:
# - NO LLM/agent reasoning - pure shell only
# - Gateway message tool ONLY on failure (via cron/agentTurn)
# - Silent on success (no noise)
#

set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────────

ACCOUNT="tachipachi9797@gmail.com"
CHECKPOINT_DIR="/home/manpac/.openclaw/workspace/checkpoints/brokia"
ERROR_FILE="/tmp/brokia-heartbeat-error.txt"

# Timestamp for checkpoint filename (hourly granularity)
TIMESTAMP=$(date +%Y-%m-%dT%H)
CHECKPOINT_FILE="${CHECKPOINT_DIR}/heartbeat-${TIMESTAMP}.json"

# Ensure checkpoint directory exists
mkdir -p "$CHECKPOINT_DIR"

# ─────────────────────────────────────────────────────────────────────────────
# CHECKS
# ─────────────────────────────────────────────────────────────────────────────

AUTH_OK=false
CALENDAR_OK=false
ERROR_MSG=""
SUGGESTED_FIX=""

# Check 1: gog auth list contains calendar,gmail for the account
if gog auth list 2>/dev/null | grep -q "^${ACCOUNT}.*calendar,gmail"; then
    AUTH_OK=true
else
    ERROR_MSG="Auth check failed: ${ACCOUNT} missing calendar,gmail scopes"
    SUGGESTED_FIX="gog auth login --account ${ACCOUNT} && gog auth consent --account ${ACCOUNT} --scopes calendar,gmail"
fi

# Check 2: gog calendar events --today succeeds (only if auth passed)
if [[ "$AUTH_OK" == "true" ]]; then
    if gog calendar events --today -j -a "$ACCOUNT" >/dev/null 2>&1; then
        CALENDAR_OK=true
    else
        ERROR_MSG="Calendar API call failed: gog calendar events --today returned error"
        SUGGESTED_FIX="gog auth login --account ${ACCOUNT} (token may be expired)"
    fi
fi

# ─────────────────────────────────────────────────────────────────────────────
# DETERMINE OVERALL STATUS
# ─────────────────────────────────────────────────────────────────────────────

if [[ "$AUTH_OK" == "true" && "$CALENDAR_OK" == "true" ]]; then
    OK=true
else
    OK=false
fi

# ─────────────────────────────────────────────────────────────────────────────
# WRITE CHECKPOINT (always)
# ─────────────────────────────────────────────────────────────────────────────

if [[ "$OK" == "true" ]]; then
    cat > "$CHECKPOINT_FILE" << EOF
{
  "schema": "brokia-heartbeat-v1",
  "generated_at": "$(date -Iseconds)",
  "checks": {
    "auth": true,
    "calendar_call": true
  },
  "ok": true
}
EOF
else
    cat > "$CHECKPOINT_FILE" << EOF
{
  "schema": "brokia-heartbeat-v1",
  "generated_at": "$(date -Iseconds)",
  "checks": {
    "auth": $AUTH_OK,
    "calendar_call": $CALENDAR_OK
  },
  "ok": false,
  "error": "$ERROR_MSG",
  "suggested_fix": "$SUGGESTED_FIX"
}
EOF
fi

# ─────────────────────────────────────────────────────────────────────────────
# WRITE ERROR FILE + EXIT (on failure)
# ─────────────────────────────────────────────────────────────────────────────

if [[ "$OK" == "false" ]]; then
    cat > "$ERROR_FILE" << EOF
:rotating_light: Brokia Heartbeat FAILED

Check: gog auth + calendar API
Account: ${ACCOUNT}
Time: $(date -Iseconds)

Failure: ${ERROR_MSG}

Suggested fix:
  ${SUGGESTED_FIX}

Next deadline alert: 08:00 America/Montevideo
Checkpoint: ${CHECKPOINT_FILE}
EOF
    exit 1
fi

# Success - silent exit
exit 0
