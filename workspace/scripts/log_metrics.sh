#!/usr/bin/env bash
set -euo pipefail

METRICS_FILE="/home/manpac/.openclaw/workspace/.openclaw/metrics.jsonl"

request_id="${1:-}"
session_id="${2:-}"
agent_id="${3:-}"
provider="${4:-}"
model="${5:-}"
tier="${6:-unknown}"
input_tokens="${7:-0}"
output_tokens="${8:-0}"
latency_ms="${9:-0}"
cost_est_usd="${10:-0}"
cache_hit="${11:-false}"
retry_count="${12:-0}"
status="${13:-ok}"
error_code="${14:-}"

# Routing fields (optional, for Step B1)
chosen_model="${15:-null}"
route_reason="${16:-null}"

ts="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

# Build JSON with optional routing fields
if [[ "$chosen_model" != "null" && -n "$chosen_model" ]]; then
  jq -c -n \
    --arg ts "$ts" \
    --arg request_id "$request_id" \
    --arg session_id "$session_id" \
    --arg agent_id "$agent_id" \
    --arg provider "$provider" \
    --arg model "$model" \
    --arg tier "$tier" \
    --arg status "$status" \
    --arg error_code "$error_code" \
    --arg chosen_model "$chosen_model" \
    --arg route_reason "$route_reason" \
    --argjson input_tokens "$input_tokens" \
    --argjson output_tokens "$output_tokens" \
    --argjson latency_ms "$latency_ms" \
    --argjson cost_est_usd "$cost_est_usd" \
    --argjson cache_hit "$cache_hit" \
    --argjson retry_count "$retry_count" \
    '{
      ts: $ts,
      request_id: $request_id,
      session_id: $session_id,
      agent_id: $agent_id,
      provider: $provider,
      model: $model,
      chosen_model: $chosen_model,
      route_reason: $route_reason,
      tier: $tier,
      input_tokens: $input_tokens,
      output_tokens: $output_tokens,
      latency_ms: $latency_ms,
      cost_est_usd: $cost_est_usd,
      cache_hit: $cache_hit,
      retry_count: $retry_count,
      status: $status,
      error_code: (if $error_code == "" then null else $error_code end)
    }' >> "$METRICS_FILE"
else
  # Without routing fields (backward compatible)
  jq -c -n \
    --arg ts "$ts" \
    --arg request_id "$request_id" \
    --arg session_id "$session_id" \
    --arg agent_id "$agent_id" \
    --arg provider "$provider" \
    --arg model "$model" \
    --arg tier "$tier" \
    --arg status "$status" \
    --arg error_code "$error_code" \
    --argjson input_tokens "$input_tokens" \
    --argjson output_tokens "$output_tokens" \
    --argjson latency_ms "$latency_ms" \
    --argjson cost_est_usd "$cost_est_usd" \
    --argjson cache_hit "$cache_hit" \
    --argjson retry_count "$retry_count" \
    '{
      ts: $ts,
      request_id: $request_id,
      session_id: $session_id,
      agent_id: $agent_id,
      provider: $provider,
      model: $model,
      tier: $tier,
      input_tokens: $input_tokens,
      output_tokens: $output_tokens,
      latency_ms: $latency_ms,
      cost_est_usd: $cost_est_usd,
      cache_hit: $cache_hit,
      retry_count: $retry_count,
      status: $status,
      error_code: (if $error_code == "" then null else $error_code end)
    }' >> "$METRICS_FILE"
fi
