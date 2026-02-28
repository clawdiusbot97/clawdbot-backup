#!/usr/bin/env bash
#
# cron_daily_metrics_report.sh — Daily metrics report cron wrapper
# Runs metrics_report.sh and sends compact summary to Telegram
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPORT_OUTPUT=$("$SCRIPT_DIR/metrics_report.sh" 2>/dev/null)
REPORT_FILE=$("$SCRIPT_DIR/metrics_report.sh" 2>&1 >/dev/null | grep "REPORT_SAVED:" | cut -d: -f2- || echo "reports/metrics/daily-$(date -u +%Y-%m-%d).md")

# Send to Telegram using openclaw message tool
# Assumes telegram channel is configured
if command -v openclaw >/dev/null 2>&1; then
  echo "$REPORT_OUTPUT" | openclaw message send --channel telegram --stdin 2>/dev/null || true
fi

# Also log completion
echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Daily metrics report sent. Report: $REPORT_FILE"
