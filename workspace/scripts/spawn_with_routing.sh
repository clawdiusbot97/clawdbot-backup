#!/usr/bin/env bash
#
# spawn_with_routing.sh — Wrapper for sessions_spawn with cost routing integration
# This wraps agent spawning to enable LOCAL cost-based model selection.
#
# Usage: spawn_with_routing.sh <agent_id> "<task_description>" [additional_args...]
#
# Examples:
#   spawn_with_routing.sh researcher "Compare Redis vs RabbitMQ with benchmarks"
#   spawn_with_routing.sh builder "Fix bug in auth.rb stacktrace shows nil error"
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="/home/manpac/.openclaw/workspace"
ROUTING_FLAG="${WORKSPACE_DIR}/.openclaw/routing-enabled.flag"
METRICS_FILE="${WORKSPACE_DIR}/.openclaw/metrics.jsonl"

# Parse arguments
AGENT_ID="${1:-}"
TASK="${2:-}"

if [[ -z "$AGENT_ID" || -z "$TASK" ]]; then
  echo "Usage: spawn_with_routing.sh <agent_id> \"<task_description>\" [additional_args...]" >&2
  exit 1
fi

shift 2 || true
ADDITIONAL_ARGS="$@"

# Generate IDs
REQUEST_ID="req-$(date +%s)-$RANDOM"
SESSION_ID="sess-${AGENT_ID}-$(date +%s)"

# Check if routing is enabled
if [[ ! -f "$ROUTING_FLAG" ]]; then
  # Routing disabled - use default agent model
  echo "ROUTING_DISABLED: Using default model for $AGENT_ID" >&2
  MODEL=$(jq -r ".agents.list[] | select(.id==\"$AGENT_ID\") | .model.primary // \"openrouter/minimax/minimax-m2.1\"" "${WORKSPACE_DIR}/../openclaw.json" 2>/dev/null || echo "openrouter/minimax/minimax-m2.1")
  
  # Log passthrough
  TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  echo "{\"ts\":\"$TS\",\"type\":\"routing\",\"request_id\":\"$REQUEST_ID\",\"agent_id\":\"$AGENT_ID\",\"chosen_model\":\"$MODEL\",\"route_reason\":\"routing_disabled_passthrough\",\"llm_calls\":0}" >> "$METRICS_FILE"
  
  # Execute spawn with default model
  exec sessions_spawn agentId="$AGENT_ID" model="$MODEL" $ADDITIONAL_ARGS -- "$TASK"
fi

# === ROUTING ENABLED ===
# Call router to determine model (LOCAL, 0 LLM calls)
ROUTE_RESULT=$(python3 "$SCRIPT_DIR/route_request.py" "$AGENT_ID" "$TASK" 2>/dev/null) || {
  echo "ROUTER_FAILED: Falling back to default model for $AGENT_ID" >&2
  MODEL=$(jq -r ".agents.list[] | select(.id==\"$AGENT_ID\") | .model.primary // \"openrouter/minimax/minimax-m2.1\"" "${WORKSPACE_DIR}/../openclaw.json" 2>/dev/null || echo "openrouter/minimax/minimax-m2.1")
  
  TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  echo "{\"ts\":\"$TS\",\"type\":\"routing\",\"request_id\":\"$REQUEST_ID\",\"agent_id\":\"$AGENT_ID\",\"chosen_model\":\"$MODEL\",\"route_reason\":\"router_fallback\"}" >> "$METRICS_FILE"
  
  exec sessions_spawn agentId="$AGENT_ID" model="$MODEL" $ADDITIONAL_ARGS -- "$TASK"
}

# Extract routing decision
CHOSEN_MODEL=$(echo "$ROUTE_RESULT" | jq -r '.chosen_model')
ROUTE_REASON=$(echo "$ROUTE_RESULT" | jq -r '.route_reason')
REQUESTED_MODEL=$(echo "$ROUTE_RESULT" | jq -r '.requested_model // .chosen_model')

echo "ROUTE_DECISION: $AGENT_ID -> $CHOSEN_MODEL (reason: $ROUTE_REASON)" >&2

# Log routing decision
TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
ROUTING_LOG=$(jq -n \
  --arg ts "$TS" \
  --arg request_id "$REQUEST_ID" \
  --arg session_id "$SESSION_ID" \
  --arg agent_id "$AGENT_ID" \
  --arg chosen_model "$CHOSEN_MODEL" \
  --arg requested_model "$REQUESTED_MODEL" \
  --arg route_reason "$ROUTE_REASON" \
  '{ts: $ts, type: "routing", request_id: $request_id, session_id: $session_id, agent_id: $agent_id, chosen_model: $chosen_model, requested_model: $requested_model, route_reason: $route_reason, llm_calls: 0}')
echo "$ROUTING_LOG" >> "$METRICS_FILE"

# Set up post-execution logging for the actual model used
# We log what we intend to use; actual usage is logged by the agent itself

# Spawn the agent with explicit model override
echo "SPAWNING: $AGENT_ID with model $CHOSEN_MODEL" >&2
exec sessions_spawn agentId="$AGENT_ID" model="$CHOSEN_MODEL" $ADDITIONAL_ARGS -- "$TASK"
