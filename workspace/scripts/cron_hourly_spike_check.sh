#!/usr/bin/env bash
#
# cron_hourly_spike_check.sh — Hourly spike detection cron wrapper
# Runs metrics_spike_check.sh and sends ALERT to Telegram only if exit code 2
#

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ALERT_OUTPUT=$("$SCRIPT_DIR/metrics_spike_check.sh" 2>&1)
EXIT_CODE=$?

# Only notify if ALERT (exit code 2)
if [ "$EXIT_CODE" -eq 2 ]; then
  # Send to Telegram
  if command -v openclaw >/dev/null 2>&1; then
    echo "$ALERT_OUTPUT" | openclaw message send --channel telegram --stdin 2>/dev/null || true
  fi
  
  # Also log alert
  echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] SPIKE ALERT triggered"
  echo "$ALERT_OUTPUT"
  exit 2
fi

# Exit 0 or 1 = no notification (silent)
exit 0
