#!/usr/bin/env bash
#
# cron_wrapper_llm_spike_check.sh
# Executes hourly spike check and sends ALERT to Telegram if exit code 2
# STRICT LOCAL: Uses only bash + jq, 0 LLM calls
# ONLY sends notification on ALERT (exit 2), silent otherwise
#

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Telegram destination (explicit - Manu's personal chat)
TELEGRAM_CHAT="2017549847"

# Run spike check
ALERT_MSG=$("$SCRIPT_DIR/metrics_spike_check.sh" 2>/dev/null)
EXIT_CODE=$?

# Only send Telegram on ALERT (exit code 2)
if [ "$EXIT_CODE" -eq 2 ]; then
  if command -v openclaw >/dev/null 2>&1; then
    echo "$ALERT_MSG" | openclaw message send --channel telegram --to "$TELEGRAM_CHAT" --stdin 2>/dev/null || {
      echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Failed to send alert to Telegram" >> /home/manpac/.openclaw/workspace/.openclaw/reports/telegram-failures.log
    }
  fi
  echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] SPIKE ALERT sent to Telegram:$TELEGRAM_CHAT" >> /home/manpac/.openclaw/workspace/.openclaw/reports/cron.log
  exit 2
fi

# Exit 0 or 1 = silent (no notification, as required)
exit 0
