#!/bin/bash
# Wrapper for exec tool that compacts large outputs
# Usage: exec_compact.sh "<command>"
# MVP version - no optional args for simplicity

set -euo pipefail

COMMAND="$1"

# Create artifacts directory
ARTIFACTS_DIR="/home/manpac/.openclaw/workspace/artifacts/raw/exec"
mkdir -p "$ARTIFACTS_DIR"

# Generate timestamp
TIMESTAMP=$(date -u +"%Y%m%d_%H%M%S_%N")
LOG_FILE="$ARTIFACTS_DIR/${TIMESTAMP}.log"

# Execute command and capture output
START_TIME=$(date +%s)
OUTPUT=$(bash -c "$COMMAND" 2>&1)
EXIT_CODE=$?
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

# Count lines and chars
LINE_COUNT=$(printf '%s\n' "$OUTPUT" | wc -l)
CHAR_COUNT=$(printf '%s' "$OUTPUT" | wc -c)

# Write raw output to log file
{
    echo "=== exec_compact log ==="
    echo "Timestamp: $(date -u -Iseconds)"
    echo "Command: $COMMAND"
    echo "Exit code: $EXIT_CODE"
    echo "Duration: ${DURATION}s"
    echo "Lines: $LINE_COUNT"
    echo "Chars: $CHAR_COUNT"
    echo ""
    echo "=== OUTPUT ==="
    echo "$OUTPUT"
} > "$LOG_FILE"

# Check threshold (150 lines OR 10000 chars)
THRESHOLD_LINES=150
THRESHOLD_CHARS=10000

# Remove whitespace from wc output
LINE_COUNT=$(echo "$LINE_COUNT" | tr -d '[:space:]')
CHAR_COUNT=$(echo "$CHAR_COUNT" | tr -d '[:space:]')

if [[ $LINE_COUNT -gt $THRESHOLD_LINES ]] || [[ $CHAR_COUNT -gt $THRESHOLD_CHARS ]]; then
    # Generate summary (≤300 tokens ≈ 450 chars)
    # Extract key lines
    FIRST=$(echo "$OUTPUT" | head -5)
    LAST=$(echo "$OUTPUT" | tail -5)
    ERRORS=$(echo "$OUTPUT" | grep -i -E "error|fail|warn|critical|fatal|exception" | head -5 || true)
    
    # Build summary
    echo "## exec_compact summary"
    echo "- Command: $COMMAND"
    echo "- Exit code: $EXIT_CODE"
    echo "- Duration: ${DURATION}s"
    echo "- Lines: $LINE_COUNT, Chars: $CHAR_COUNT"
    echo "- Raw output saved: $LOG_FILE"
    echo ""
    echo "### Preview:"

    if [[ $CHAR_COUNT -gt $THRESHOLD_CHARS ]]; then
        echo "(output is very long in chars; showing first/last 200 chars)"
        echo ""
        echo "First 200 chars:"
        printf '%s' "$OUTPUT" | head -c 200
        echo ""
        echo ""
        echo "Last 200 chars:"
        printf '%s' "$OUTPUT" | tail -c 200
        echo ""
    else
        echo "Key lines (first 5):"
        echo "$FIRST"
        echo ""
    if [[ -n "$ERRORS" ]]; then
        echo "Error/warning lines:"
        echo "$ERRORS"
        echo ""
    fi
        echo "Last 5 lines:"
        echo "$LAST"
    fi
else
    # Output full result
    echo "$OUTPUT"
fi

exit $EXIT_CODE