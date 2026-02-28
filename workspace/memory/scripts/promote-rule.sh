#!/usr/bin/env bash
# promote-rule.sh - Promote a correction to HOT.md or a context file
# Usage: ./promote-rule.sh <count_key> <target>
#   target: "hot" or "contexts/<name>" (e.g., "contexts/brokia")
# STRICT LOCAL - no LLM calls

set -euo pipefail

WORKSPACE="${WORKSPACE:-/home/manpac/.openclaw/workspace}"
CORRECTIONS_FILE="$WORKSPACE/memory/corrections.jsonl"

COUNT_KEY="${1:-}"
TARGET="${2:-}"

if [[ -z "$COUNT_KEY" || -z "$TARGET" ]]; then
    echo "Usage: $0 <count_key> <target>" >&2
    echo "  target: hot | contexts/<name>" >&2
    exit 1
fi

# Find the rule text from corrections (most recent match)
RULE_TEXT=$(jq -R 'fromjson?' "$CORRECTIONS_FILE" 2>/dev/null | jq -r --arg k "$COUNT_KEY" 'select(.count_key == $k) | .rule_text' | tail -1)

if [[ -z "$RULE_TEXT" ]]; then
    echo "ERROR: No correction found with key: $COUNT_KEY" >&2
    exit 1
fi

# Determine target file
if [[ "$TARGET" == "hot" ]]; then
    TARGET_FILE="$WORKSPACE/memory/HOT.md"
elif [[ "$TARGET" == contexts/* ]]; then
    TARGET_FILE="$WORKSPACE/memory/$TARGET.md"
else
    echo "ERROR: Invalid target. Use 'hot' or 'contexts/<name>'" >&2
    exit 1
fi

# Ensure target exists
if [[ ! -f "$TARGET_FILE" ]]; then
    echo "# Context: $(basename "$TARGET_FILE" .md)" > "$TARGET_FILE"
    echo "" >> "$TARGET_FILE"
fi

# Append rule (format: - rule text)
echo "- $RULE_TEXT" >> "$TARGET_FILE"

echo "Promoted to: $TARGET_FILE"
echo "Rule: $RULE_TEXT"

# Show line number for citation
LINE=$(wc -l < "$TARGET_FILE")
echo "Cite as: memory/$(realpath --relative-to="$WORKSPACE/memory" "$TARGET_FILE"):L$LINE"
