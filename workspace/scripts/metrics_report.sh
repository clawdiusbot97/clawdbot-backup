#!/usr/bin/env bash
#
# metrics_report.sh — Daily LLM Metrics Report (STRICT LOCAL - NO LLM CALLS)
# Generates report using only bash + jq, zero LLM tokens consumed.
#

set -euo pipefail

METRICS_FILE="/home/manpac/.openclaw/workspace/.openclaw/metrics.jsonl"
REPORTS_DIR="/home/manpac/.openclaw/workspace/.openclaw/reports"
DATE_LABEL="$(date -u +%Y-%m-%d)"
REPORT_FILE="$REPORTS_DIR/$DATE_LABEL-llm-metrics.txt"
SINCE="$(date -u -d '24 hours ago' +%Y-%m-%dT%H:%M:%SZ)"

mkdir -p "$REPORTS_DIR"

# Check if metrics file exists and has data
if [ ! -s "$METRICS_FILE" ]; then
  cat > "$REPORT_FILE" << EOF
LLM Daily Report — $DATE_LABEL UTC
=====================================
No metrics data available yet.
Metrics file: $METRICS_FILE
EOF
  echo "📊 <b>LLM Daily Report — $DATE_LABEL</b>"
  echo "💰 Total: <b>$0.00</b> (0 calls)"
  echo "📄 <code>$REPORT_FILE</code>"
  exit 0
fi

# Filter last 24h
TMP="$(mktemp)"
jq -r "select(.ts >= \"$SINCE\")" "$METRICS_FILE" > "$TMP" 2>/dev/null || cat "$METRICS_FILE" > "$TMP"

if [ ! -s "$TMP" ]; then
  cp "$METRICS_FILE" "$TMP"
fi

# Calculate metrics using jq only (NO LLM)
TOTAL_COST=$(jq -s 'map(.cost_est_usd) | add // 0' "$TMP")
TOTAL_CALLS=$(jq -s 'length' "$TMP")
TOTAL_INPUT=$(jq -s 'map(.input_tokens) | add // 0' "$TMP")
TOTAL_OUTPUT=$(jq -s 'map(.output_tokens) | add // 0' "$TMP")
TOTAL_TOKENS=$((TOTAL_INPUT + TOTAL_OUTPUT))

# Top agent (using jq only)
TOP_AGENT=$(jq -r -s '
  group_by(.agent_id) 
  | map({agent: .[0].agent_id, cost: (map(.cost_est_usd)|add), calls: length}) 
  | sort_by(-.cost) 
  | if length > 0 then .[0] else {agent:"N/A",cost:0,calls:0} end
  | "\(.agent) ($\(.cost), \(.calls) calls)"
' "$TMP")

# Top model (using jq only)
TOP_MODEL=$(jq -r -s '
  group_by(.model) 
  | map({model: .[0].model, cost: (map(.cost_est_usd)|add), calls: length}) 
  | sort_by(-.cost) 
  | if length > 0 then .[0] else {model:"N/A",cost:0,calls:0} end
  | "\(.model) ($\(.cost), \(.calls) calls)"
' "$TMP")

# Premium ratio (costs > $0.01 per request estimate)
PREMIUM_CALLS=$(jq -r -s '[.[] | select(.cost_est_usd > 0.01)] | length' "$TMP")
if [ "$TOTAL_CALLS" -gt 0 ]; then
  PREMIUM_RATIO=$(awk "BEGIN {printf \"%.1f\", ($PREMIUM_CALLS / $TOTAL_CALLS) * 100}")
else
  PREMIUM_RATIO="0.0"
fi

# Format cost for display (awk for precision)
COST_FMT=$(awk "BEGIN {printf \"%.4f\", $TOTAL_COST}")

# Generate report file
cat > "$REPORT_FILE" << EOF
LLM Daily Report — $DATE_LABEL UTC
=====================================
Total Cost:         $${COST_FMT}
Total Calls:        ${TOTAL_CALLS}
Total Tokens:       ${TOTAL_TOKENS} (${TOTAL_INPUT} in + ${TOTAL_OUTPUT} out)
Top Agent:          ${TOP_AGENT}
Top Model:          ${TOP_MODEL}
Premium Ratio:      ${PREMIUM_RATIO}%

COST BY AGENT
-------------
$(jq -s 'group_by(.agent_id) | map({agent: .[0].agent_id, calls: length, cost_usd: (map(.cost_est_usd)|add)}) | sort_by(-.cost_usd) | .[] | "- \(.agent): $\(.cost_usd) (\(.calls) calls)"' "$TMP" 2>/dev/null || echo "  No data")

COST BY MODEL
-------------
$(jq -s 'group_by(.model) | map({model: .[0].model, calls: length, cost_usd: (map(.cost_est_usd)|add)}) | sort_by(-.cost_usd) | .[] | "- \(.model): $\(.cost_usd) (\(.calls) calls)"' "$TMP" 2>/dev/null || echo "  No data")

TOP 10 EXPENSIVE REQUESTS
-------------------------
$(jq -s 'sort_by(-.cost_est_usd) | .[:10] | .[] | "- [\(.ts)] \(.agent_id)/\(.model): $\(.cost_est_usd) (\(.request_id))"' "$TMP" 2>/dev/null || echo "  No data")

METADATA
--------
Report generated: $(date -u +%Y-%m-%dT%H:%M:%SZ) UTC
Metrics source: $METRICS_FILE
Report file: $REPORT_FILE
LLM calls used: 0
Token consumption: 0
EOF

# Telegram message (stdout only, no LLM)
echo "📊 <b>LLM Daily Report — $DATE_LABEL</b>"
echo "💰 Total: <b>\$${COST_FMT}</b> (${TOTAL_CALLS} calls, ${TOTAL_TOKENS} tokens)"
echo "🏆 Top Agent: <b>${TOP_AGENT}</b>"
echo "🤖 Top Model: <b>${TOP_MODEL}</b>"
echo "📈 Premium: <b>${PREMIUM_RATIO}%</b> | 📄 <code>$REPORT_FILE</code>"
echo "🔒 <i>0 LLM calls / 0 tokens</i>"

rm -f "$TMP"
