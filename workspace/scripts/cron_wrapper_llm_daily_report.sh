#!/usr/bin/env bash
#
# cron_wrapper_llm_daily_report.sh
# Executes daily LLM metrics report and sends to Telegram
# STRICT LOCAL: Uses only bash + jq, 0 LLM calls
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Telegram destination (explicit - Manu's personal chat)
TELEGRAM_CHAT="2017549847"

# Run report (stdout = Telegram message, NO LLM used)
TELEGRAM_MSG=$("$SCRIPT_DIR/metrics_report.sh" 2>/dev/null)

# Send to Telegram using openclaw message tool (if available)
if command -v openclaw >/dev/null 2>&1; then
  echo "$TELEGRAM_MSG" | openclaw message send --channel telegram --to "$TELEGRAM_CHAT" --stdin 2>/dev/null || {
    # Fallback: log to file if send fails
    echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Failed to send Telegram, logged locally" >> /home/manpac/.openclaw/workspace/.openclaw/reports/telegram-failures.log
  }
fi

# Always log completion
echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Daily metrics report sent to Telegram:$TELEGRAM_CHAT" >> /home/manpac/.openclaw/workspace/.openclaw/reports/cron.log
