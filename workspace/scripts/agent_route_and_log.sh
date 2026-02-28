#!/usr/bin/env bash
#
# agent_route_and_log.sh — Minimal integration: route + log + execute
# This is the hook point for agent dispatches (replaces direct LLM calls)
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
METRICS_FILE="/home/manpac/.openclaw/workspace/.openclaw/metrics.jsonl"
ROUTING_ENABLED="/home/manpac/.openclaw/workspace/.openclaw/routing-enabled.flag"

# Arguments
AGENT_ID="${1:-}"
shift || true
PROMPT="${*}"
REQUEST_ID="req-$(date +%s)-$RANDOM"
SESSION_ID="${SESSION_ID:-sess-$AGENT_ID-$(date +%s)}"

if [[ -z "$AGENT_ID" || -z "$PROMPT" ]]; then
  echo "Usage: agent_route_and_log.sh <agent_id> <prompt...>" >&2
  exit 1
fi

# Check if routing is enabled
if [[ ! -f "$ROUTING_ENABLED" ]]; then
  # Routing disabled - passthrough to default behavior
  echo "ROUTING_DISABLED:$AGENT_ID" >&2
  # Return default model from config
  jq -r ".agents.list[] | select(.id==\"$AGENT_ID\") | .model.primary" /home/manpac/.openclaw/openclaw.json 2>/dev/null || echo "openrouter/deepseek/deepseek-v3.2"
  exit 0
fi

# === ROUTING (LOCAL, 0 LLM calls) ===
ROUTE_RESULT=$(python3 "$SCRIPT_DIR/route_request.py" "$AGENT_ID" "$PROMPT" 2>/dev/null)
CHOSEN_MODEL=$(echo "$ROUTE_RESULT" | jq -r '.chosen_model')
ROUTE_REASON=$(echo "$ROUTE_RESULT" | jq -r '.route_reason')
REQUESTED_MODEL=$(echo "$ROUTE_RESULT" | jq -r '.requested_model')

# === LOG ROUTING DECISION ===
TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
ROUTING_LOG_LINE=$(printf '{"ts":"%s","type":"routing","request_id":"%s","session_id":"%s","agent_id":"%s","chosen_model":"%s","requested_model":"%s","route_reason":"%s","llm_calls":0}' \
  "$TS" "$REQUEST_ID" "$SESSION_ID" "$AGENT_ID" "$CHOSEN_MODEL" "$REQUESTED_MODEL" "$ROUTE_REASON")
echo "$ROUTING_LOG_LINE" >> "$METRICS_FILE"

echo "ROUTE:$AGENT_ID:$ROUTE_REASON:$CHOSEN_MODEL" >&2

# Output the chosen model for downstream
printf '%s' "$CHOSEN_MODEL"
