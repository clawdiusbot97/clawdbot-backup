#!/usr/bin/env bash
#
# llm_call_wrapper.sh — Combined Policy Enforcement + Metrics Logging
#
# This is a convenience wrapper that calls enforce_model_policy.sh
# and logs metrics in one shot. Use this in cron jobs or agent scripts.
#
# Usage: llm_call_wrapper.sh <agent_id> <requested_model> <provider> <tier>
#        Then pipe your LLM call through it or source it.
#
# For direct usage, set these env vars before calling:
#   LLM_REQUEST_ID, LLM_SESSION_ID, LLM_INPUT_TOKENS, etc.
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AGENT_ID="${1:-main}"
REQUESTED_MODEL="${2:-}"
PROVIDER="${3:-openrouter}"
TIER="${4:-default}"

if [[ -z "$REQUESTED_MODEL" ]]; then
    echo "ERROR: No model requested" >&2
    exit 1
fi

# Enforce policy
FINAL_MODEL=$("$SCRIPT_DIR/enforce_model_policy.sh" "$AGENT_ID" "$REQUESTED_MODEL" 2>/dev/null) || {
    # Fallback was applied
    echo "Model blocked, fallback applied: $FINAL_MODEL" >&2
}

# Generate request ID if not set
REQUEST_ID="${LLM_REQUEST_ID:-req-$(date +%s)-$RANDOM}"
SESSION_ID="${LLM_SESSION_ID:-sess-$AGENT_ID-$(date +%s)}"

# Log the call attempt (pre-call)
"$SCRIPT_DIR/log_metrics.sh" \
    "$REQUEST_ID" \
    "$SESSION_ID" \
    "$AGENT_ID" \
    "$PROVIDER" \
    "$FINAL_MODEL" \
    "$TIER" \
    "${LLM_INPUT_TOKENS:-0}" \
    "${LLM_OUTPUT_TOKENS:-0}" \
    "${LLM_LATENCY_MS:-0}" \
    "${LLM_COST_EST_USD:-0}" \
    "${LLM_CACHE_HIT:-false}" \
    "${LLM_RETRY_COUNT:-0}" \
    "initiated" \
    2>/dev/null || true

# Output the final model for downstream use
echo "$FINAL_MODEL"
