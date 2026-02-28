#!/bin/bash
# Wrapper for read tool that compacts large outputs
# Usage: read_compact.sh <file_path> [offset] [limit]
# MVP version - no optional args for simplicity

set -euo pipefail

FILE="$1"
OFFSET="${2:-1}"
LIMIT="${3:-}"

# Validate file exists
if [[ ! -f "$FILE" ]]; then
    echo "Error: File not found: $FILE" >&2
    exit 1
fi

# Create artifacts directory
ARTIFACTS_DIR="/home/manpac/.openclaw/workspace/artifacts/raw/read"
mkdir -p "$ARTIFACTS_DIR"

# Generate timestamp
TIMESTAMP=$(date -u +"%Y%m%d_%H%M%S_%N")
LOG_FILE="$ARTIFACTS_DIR/${TIMESTAMP}.txt"

# Read file with offset/limit
START_TIME=$(date +%s)
if [[ -n "$LIMIT" ]]; then
    # Use tail +offset, then head -n limit
    OUTPUT=$(tail -n +"$OFFSET" "$FILE" | head -n "$LIMIT")
else
    # No limit, read from offset to end
    OUTPUT=$(tail -n +"$OFFSET" "$FILE")
fi
EXIT_CODE=$?
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

# Count lines and chars
LINE_COUNT=$(printf '%s\n' "$OUTPUT" | wc -l)
CHAR_COUNT=$(printf '%s' "$OUTPUT" | wc -c)

# Write raw output to log file
{
    echo "=== read_compact log ==="
    echo "Timestamp: $(date -u -Iseconds)"
    echo "File: $FILE"
    echo "Offset: $OFFSET"
    echo "Limit: $LIMIT"
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
    FIRST=$(echo "$OUTPUT" | head -8)
    LAST=$(echo "$OUTPUT" | tail -7)
    ERRORS=$(echo "$OUTPUT" | grep -i -E "error|fail|warn|critical|fatal|exception" | head -5 || true)
    
    # Build summary
    echo "## read_compact summary"
    echo "- File: $FILE"
    echo "- Offset: $OFFSET"
    echo "- Limit: $LIMIT"
    echo "- Lines: $LINE_COUNT, Chars: $CHAR_COUNT"
    echo "- Raw output saved: $LOG_FILE"
    echo ""
    echo "### Preview (first 8 lines + last 7 lines):"

    if [[ $LINE_COUNT -eq 1 && $CHAR_COUNT -gt $THRESHOLD_CHARS ]]; then
        echo "(single huge line; showing first/last 200 chars)"
        echo ""
        echo "First 200 chars:"
        printf '%s' "$OUTPUT" | head -c 200
        echo ""
        echo ""
        echo "Last 200 chars:"
        printf '%s' "$OUTPUT" | tail -c 200
        echo ""
    else
        echo "First 8 lines:"
        echo "$FIRST"
        echo ""
        if [[ -n "$ERRORS" ]]; then
            echo "Error/warning lines (max 5):"
            echo "$ERRORS"
            echo ""
        fi
        echo "Last 7 lines:"
        echo "$LAST"
    fi
else
    # Output full result
    echo "$OUTPUT"
fi

exit $EXIT_CODE