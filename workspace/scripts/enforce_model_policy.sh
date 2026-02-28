#!/usr/bin/env bash
#
# enforce_model_policy.sh — Model Policy Enforcement Wrapper
#
# Usage: enforce_model_policy.sh <agent_id> <requested_model>
# Exit: 0 = allowed (prints final model), 1 = denied (fallback applied)
#
# This script validates a requested model against the allowlist/denylist
# and returns a safe fallback if the model is blocked.
#

set -euo pipefail

POLICY_FILE="/home/manpac/.openclaw/workspace/.openclaw/model-policy.json"
METRICS_LOG="/home/manpac/.openclaw/workspace/.openclaw/metrics-policy-violations.jsonl"

AGENT_ID="${1:-unknown}"
REQUESTED_MODEL="${2:-}"

if [[ -z "$REQUESTED_MODEL" ]]; then
    echo "ERROR: No model requested" >&2
    exit 1
fi

# Check if policy file exists
if [[ ! -f "$POLICY_FILE" ]]; then
    echo "WARN: Policy file not found, allowing request" >&2
    echo "$REQUESTED_MODEL"
    exit 0
fi

# Function to check if model matches pattern
model_matches() {
    local model="$1"
    local pattern="$2"
    [[ "$model" == *"$pattern"* ]]
}

# Check denylist first (block :free models)
DENY_PATTERNS=$(jq -r '.denylist // [] | .[]' "$POLICY_FILE" 2>/dev/null || true)
for pattern in $DENY_PATTERNS; do
    if model_matches "$REQUESTED_MODEL" "$pattern"; then
        # Log violation
        echo "{\"ts\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"agent\":\"$AGENT_ID\",\"requested\":\"$REQUESTED_MODEL\",\"pattern\":\"$pattern\",\"action\":\"blocked\"}" >> "$METRICS_LOG"
        echo "POLICY_VIOLATION_BLOCKED:$pattern:$REQUESTED_MODEL" >&2
        
        # Get fallback for agent tier
        AGENT_TIER=$(jq -r ".agent_tiers.\"$AGENT_ID\" // \"default\"" "$POLICY_FILE" 2>/dev/null || echo "default")
        FALLBACK_MODEL=$(jq -r ".fallback_ladder.\"$AGENT_TIER\"[0] // \"openrouter/minimax/minimax-m2.1\"" "$POLICY_FILE" 2>/dev/null || echo "openrouter/minimax/minimax-m2.1")
        
        echo "FALLBACK_APPLIED:$FALLBACK_MODEL" >&2
        echo "$FALLBACK_MODEL"
        exit 1
    fi
done

# Check allowlist
ALLOWED_MODELS=$(jq -r '.allowlist // [] | .[]' "$POLICY_FILE" 2>/dev/null || true)
IS_ALLOWED=false
for allowed in $ALLOWED_MODELS; do
    if [[ "$REQUESTED_MODEL" == "$allowed" ]]; then
        IS_ALLOWED=true
        break
    fi
done

if [[ "$IS_ALLOWED" == "false" ]]; then
    # Model not in allowlist
    echo "{\"ts\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"agent\":\"$AGENT_ID\",\"requested\":\"$REQUESTED_MODEL\",\"action\":\"not_in_allowlist\"}" >> "$METRICS_LOG"
    echo "POLICY_VIOLATION_NOT_ALLOWED:$REQUESTED_MODEL" >&2
    
    AGENT_TIER=$(jq -r ".agent_tiers.\"$AGENT_ID\" // \"default\"" "$POLICY_FILE" 2>/dev/null || echo "default")
    FALLBACK_MODEL=$(jq -r ".fallback_ladder.\"$AGENT_TIER\"[0] // \"openrouter/minimax/minimax-m2.1\"" "$POLICY_FILE" 2>/dev/null || echo "openrouter/minimax/minimax-m2.1")
    
    echo "FALLBACK_APPLIED:$FALLBACK_MODEL" >&2
    echo "$FALLBACK_MODEL"
    exit 1
fi

# Model is allowed
echo "$REQUESTED_MODEL"
exit 0
