#!/bin/bash
#
# Cron Middleware Wrapper
# Usage: wrapper.sh <job_id> [original_openclaw_command...]
#
# This wrapper intercepts cron job execution to add:
# - Telemetry collection
# - Misfire protection (10-min debounce)
# - Audit logging
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MIDDLEWARE="$SCRIPT_DIR/middleware.py"
JOB_ID="${1:-unknown}"
shift || true

# Timestamp for this execution
START_TIME=$(date +%s%N | cut -b1-13)
START_ISO=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Audit directory
AUDIT_DIR="$HOME/.openclaw/audit"
mkdir -p "$AUDIT_DIR"

# ───────────────────────────────────────────────────────────────
# Misfire Protection - Check last execution
# ───────────────────────────────────────────────────────────────
STATE_FILE="$AUDIT_DIR/cron-last-run.json"

if [[ -f "$STATE_FILE" ]]; then
    LAST_RUN=$(jq -r ".[\"$JOB_ID\"] // 0" "$STATE_FILE" 2>/dev/null || echo "0")
    NOW=$(date +%s)
    ELAPSED=$((NOW - LAST_RUN))
    
    if [[ $ELAPSED -lt 600 ]]; then
        echo "⚠️  [cron-middleware] SKIP: Job '$JOB_ID' executed ${ELAPSED}s ago (debounce: 600s)"
        exit 0
    fi
fi

# Update last run timestamp
if [[ -f "$STATE_FILE" ]]; then
    jq ".[\"$JOB_ID\"] = $(date +%s)" "$STATE_FILE" > "$STATE_FILE.tmp" && mv "$STATE_FILE.tmp" "$STATE_FILE"
else
    echo "{\"$JOB_ID\": $(date +%s)}" > "$STATE_FILE"
fi

echo "🔄 [cron-middleware] Executing: $JOB_ID at $START_ISO"

# ───────────────────────────────────────────────────────────────
# Execute original command
# ───────────────────────────────────────────────────────────────
EXIT_CODE=0
OUTPUT=""

if [[ $# -gt 0 ]]; then
    # Execute provided command and capture output
    if ! OUTPUT=$("$@" 2>&1); then
        EXIT_CODE=$?
    fi
else
    # Default: call openclaw cron run
    if ! OUTPUT=$(openclaw cron run "$JOB_ID" 2>&1); then
        EXIT_CODE=$?
    fi
fi

# ───────────────────────────────────────────────────────────────
# Capture telemetry
# ───────────────────────────────────────────────────────────────
END_TIME=$(date +%s%N | cut -b1-13)
DURATION_MS=$((END_TIME - START_TIME))

# Extract token info from output if available
INPUT_TOKENS=$(echo "$OUTPUT" | grep -oE '[0-9]+(?=\s*(tokens|in))' | head -1 || echo "unknown")
OUTPUT_TOKENS=$(echo "$OUTPUT" | grep -oE '(?<=out\s*)[0-9]+' | head -1 || echo "unknown")

# Get model from job config (simplified)
MODEL=$(jq -r ".jobs[] | select(.id==\"$JOB_ID\") | .payload.model // \"unknown\"" "$HOME/.openclaw/cron/jobs.json" 2>/dev/null || echo "unknown")
AGENT=$(jq -r ".jobs[] | select(.id==\"$JOB_ID\") | .agentId // \"main\"" "$HOME/.openclaw/cron/jobs.json" 2>/dev/null || echo "main")

# ───────────────────────────────────────────────────────────────
# Calculate cost estimate
# ───────────────────────────────────────────────────────────────
COST_USD="0.0"
if [[ "$INPUT_TOKENS" != "unknown" && "$OUTPUT_TOKENS" != "unknown" ]]; then
    # Pricing lookup (simplified - embedded in wrapper)
    case "$MODEL" in
        *kimi*)
            COST_USD=$(echo "scale=6; ($INPUT_TOKENS/1000000*0.50) + ($OUTPUT_TOKENS/1000000*1.50)" | 2>/dev/null bc || echo "0.0")
            ;;
        *minimax*)
            COST_USD=$(echo "scale=6; ($INPUT_TOKENS/1000000*0.15) + ($OUTPUT_TOKENS/1000000*0.30)" | 2>/dev/null bc || echo "0.0")
            ;;
        *)
            COST_USD=$(echo "scale=6; ($INPUT_TOKENS/1000000*0.30) + ($OUTPUT_TOKENS/1000000*0.60)" | 2>/dev/null bc || echo "0.0")
            ;;
    esac
fi

# ───────────────────────────────────────────────────────────────
# Persist telemetry to JSONL
# ───────────────────────────────────────────────────────────────
LOG_FILE="$AUDIT_DIR/cron-usage-$(date -u +%Y-%m-%d).jsonl"

RECORD=$(jq -n \
    --arg job_id "$JOB_ID" \
    --arg agent "$AGENT" \
    --arg model "$MODEL" \
    --arg input_tokens "$INPUT_TOKENS" \
    --arg output_tokens "$OUTPUT_TOKENS" \
    --arg duration_ms "$DURATION_MS" \
    --arg timestamp "$START_ISO" \
    --arg cost "$COST_USD" \
    --argjson exit_code "$EXIT_CODE" \
    '{
        job_id: $job_id,
        agent: $agent,
        model: $model,
        fallback_model: null,
        input_tokens: (if $input_tokens == "unknown" then "unknown" else ($input_tokens | tonumber) end),
        output_tokens: (if $output_tokens == "unknown" then "unknown" else ($output_tokens | tonumber) end),
        total_tokens: (if $input_tokens == "unknown" or $output_tokens == "unknown" then "unknown" else (($input_tokens | tonumber) + ($output_tokens | tonumber)) end),
        duration_ms: ($duration_ms | tonumber),
        retry_count: (if $exit_code != 0 then 1 else 0 end),
        timestamp: $timestamp,
        cost_estimate_usd: ($cost | tonumber),
        exit_code: $exit_code
    }')

echo "$RECORD" >> "$LOG_FILE"

# ───────────────────────────────────────────────────────────────
# Generate and append metadata block
# ───────────────────────────────────────────────────────────────
METADATA_BLOCK="
⚙️ EXECUTION METADATA
Cron: $JOB_ID
Agent: $AGENT
Model: $MODEL
Fallback: none
Input Tokens: $INPUT_TOKENS
Output Tokens: $OUTPUT_TOKENS
Total Tokens: $(if [[ "$INPUT_TOKENS" != "unknown" && "$OUTPUT_TOKENS" != "unknown" ]]; then echo $((INPUT_TOKENS + OUTPUT_TOKENS)); else echo "unknown"; fi)
Duration: ${DURATION_MS}ms
Retries: $(if [[ $EXIT_CODE -ne 0 ]]; then echo 1; else echo 0; fi)
Timestamp: $START_ISO
"

# Output original result + metadata
if [[ $# -gt 0 ]]; then
    # If we captured command output, print it
    echo "$OUTPUT"
else
    # Original behavior already printed by openclaw
    :
fi

echo "$METADATA_BLOCK"

exit $EXIT_CODE