#!/usr/bin/env bash
#
# metrics_spike_check.sh — Hourly LLM Cost Spike Detection (STRICT LOCAL - NO LLM CALLS)
# Exit codes: 0 = OK (silent), 1 = Error, 2 = ALERT (triggers notification)
#

set -uo pipefail

METRICS_FILE="/home/manpac/.openclaw/workspace/.openclaw/metrics.jsonl"
SINCE_HOUR="$(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%SZ)"
SINCE_DAY="$(date -u -d '24 hours ago' +%Y-%m-%dT%H:%M:%SZ)"

# Thresholds (multiply by 10000 for integer arithmetic)
COST_THRESHOLD_INT=10000        # $1.00
COST_RATIO_THRESHOLD_INT=5000   # 50% = 0.5
LATENCY_THRESHOLD=10000         # ms
ERROR_THRESHOLD=3

# Check if metrics file exists
if [ ! -s "$METRICS_FILE" ]; then
  exit 0  # Silent OK if no data
fi

TMP_HOUR="$(mktemp)"
TMP_DAY="$(mktemp)"

# Filter data using jq only
cp "$METRICS_FILE" "$TMP_DAY"
jq -r "select(.ts >= \"$SINCE_HOUR\")" "$METRICS_FILE" 2>/dev/null | head -1000 > "$TMP_HOUR" || true

# If no data in last hour, exit OK (silent)
if [ ! -s "$TMP_HOUR" ]; then
  rm -f "$TMP_HOUR" "$TMP_DAY"
  exit 0
fi

# Calculate metrics using jq only (NO LLM)
HOUR_COST=$(jq -s 'map(.cost_est_usd) | add // 0' "$TMP_HOUR")
HOUR_CALLS=$(jq -s 'length' "$TMP_HOUR")
DAY_COST=$(jq -s 'map(.cost_est_usd) | add // 0' "$TMP_DAY" 2>/dev/null || echo "0")
HOUR_ERRORS=$(jq -r -s '[.[] | select(.status != "ok")] | length' "$TMP_HOUR")
AVG_LATENCY=$(jq -s 'if length > 0 then (map(.latency_ms) | add / length) else 0 end' "$TMP_HOUR")

# Convert to integers for comparison
HOUR_COST_INT=$(awk 'BEGIN {printf "%.0f", ARGV[1]*10000}' "$HOUR_COST" 2>/dev/null || echo "0")
DAY_COST_INT=$(awk 'BEGIN {printf "%.0f", ARGV[1]*10000}' "$DAY_COST" 2>/dev/null || echo "1")
AVG_LATENCY_INT=$(awk 'BEGIN {printf "%.0f", ARGV[1]}' "$AVG_LATENCY" 2>/dev/null || echo "0")

# Calculate ratio
RATIO_INT=$(awk "BEGIN {printf \"%.0f\", ($HOUR_COST_INT / $DAY_COST_INT) * 10000}" 2>/dev/null || echo "0")

# Collect alerts
ALERT_MSG=""
alert_count=0

# Check cost threshold
if [ "$HOUR_COST_INT" -gt "$COST_THRESHOLD_INT" ]; then
  alert_count=$((alert_count + 1))
  HOUR_FMT=$(awk 'BEGIN {printf "%.2f", ARGV[1]}' "$HOUR_COST" 2>/dev/null || echo "$HOUR_COST")
  ALERT_MSG="${ALERT_MSG}Cost spike: \$${HOUR_FMT} in last hour (threshold: \$1.00)\n"
fi

# Check ratio threshold
if [ "$RATIO_INT" -gt "$COST_RATIO_THRESHOLD_INT" ] && [ "$DAY_COST_INT" -gt "$COST_THRESHOLD_INT" ]; then
  alert_count=$((alert_count + 1))
  RATIO_PCT=$(awk "BEGIN {printf \"%.1f\", ($RATIO_INT / 100)}")
  ALERT_MSG="${ALERT_MSG}Hourly ratio spike: ${RATIO_PCT}% of daily cost in last hour\n"
fi

# Check latency
if [ "$AVG_LATENCY_INT" -gt "$LATENCY_THRESHOLD" ]; then
  alert_count=$((alert_count + 1))
  ALERT_MSG="${ALERT_MSG}High latency: ${AVG_LATENCY_INT}ms avg\n"
fi

# Check errors
if [ "$HOUR_ERRORS" -gt "$ERROR_THRESHOLD" ]; then
  alert_count=$((alert_count + 1))
  ALERT_MSG="${ALERT_MSG}Error spike: $HOUR_ERRORS errors in last hour\n"
fi

# Generate alert if needed
if [ $alert_count -gt 0 ]; then
  HOUR_FMT=$(awk 'BEGIN {printf "%.2f", ARGV[1]}' "$HOUR_COST" 2>/dev/null || echo "$HOUR_COST")
  DAY_FMT=$(awk 'BEGIN {printf "%.2f", ARGV[1]}' "$DAY_COST" 2>/dev/null || echo "$DAY_COST")
  
  TOP3=$(jq -r -s 'sort_by(-.cost_est_usd) | .[:3] | map("\(.request_id)[\(.cost_est_usd)]") | join(", ")' "$TMP_HOUR" 2>/dev/null || echo "N/A")
  TOPA=$(jq -r -s 'group_by(.agent_id) | map({a: .[0].agent_id, c: (map(.cost_est_usd)|add)}) | sort_by(-.c) | .[0] | "\(.a) ($\(.c))"' "$TMP_HOUR" 2>/dev/null || echo "N/A")
  TOPM=$(jq -r -s 'group_by(.model) | map({m: .[0].model, c: (map(.cost_est_usd)|add)}) | sort_by(-.c) | .[0] | "\(.m) ($\(.c))"' "$TMP_HOUR" 2>/dev/null || echo "N/A")
  
  echo "🚨 <b>LLM SPIKE ALERT</b> — $(TZ=America/Montevideo date +%H:%M) America/Montevideo"
  echo ""
  printf '%b' "$ALERT_MSG"
  echo ""
  echo "📊 Hour: \$${HOUR_FMT} / ${HOUR_CALLS} calls | Day: \$${DAY_FMT}"
  echo "🏆 Agent: <b>${TOPA}</b>"
  echo "🤖 Model: <b>${TOPM}</b>"
  echo "🔥 Top3: <code>${TOP3}</code>"
  echo "🔒 <i>0 LLM calls / 0 tokens</i>"
  
  rm -f "$TMP_HOUR" "$TMP_DAY"
  exit 2  # ALERT
fi

# Silent OK
rm -f "$TMP_HOUR" "$TMP_DAY"
exit 0
