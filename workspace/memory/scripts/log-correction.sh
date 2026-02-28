#!/usr/bin/env bash
# log-correction.sh - Log an explicit correction for repetition tracking
# Usage: ./log-correction.sh "rule text" [context] [source_snippet]
# STRICT LOCAL - no LLM calls

set -euo pipefail

WORKSPACE="${WORKSPACE:-/home/manpac/.openclaw/workspace}"
CORRECTIONS_FILE="$WORKSPACE/memory/corrections.jsonl"
INDEX_FILE="$WORKSPACE/memory/corrections_index.json"

RULE_TEXT="${1:-}"
CONTEXT="${2:-general}"
SOURCE_SNIPPET="${3:-}"

if [[ -z "$RULE_TEXT" ]]; then
    echo "Usage: $0 'rule text' [context] [source_snippet]" >&2
    exit 1
fi

# Security: denylist check for secrets
denylist_regex='(password|token|key|secret|apikey|credential|passwd|pwd|auth)[:=\s]*[a-zA-Z0-9_\-]{8,}'
if echo "$RULE_TEXT $SOURCE_SNIPPET" | grep -qiE "$denylist_regex"; then
    echo "ERROR: Potential secret detected. Rejected for security." >&2
    exit 1
fi

# Generate count_key (simple lowercase, alphanumeric, hyphenated)
COUNT_KEY=$(echo "$RULE_TEXT" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9' '-')

TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Append to corrections.jsonl (compact format)
JSON_ENTRY=$(jq -n -c \
    --arg ts "$TS" \
    --arg context "$CONTEXT" \
    --arg rule_text "$RULE_TEXT" \
    --arg source_snippet "$SOURCE_SNIPPET" \
    --arg count_key "$COUNT_KEY" \
    '{ts: $ts, context: $context, rule_text: $rule_text, source_snippet: $source_snippet, count_key: $count_key}')

echo "$JSON_ENTRY" >> "$CORRECTIONS_FILE"

# Update index
if [[ -f "$INDEX_FILE" ]]; then
    INDEX=$(cat "$INDEX_FILE")
else
    INDEX='{"_meta":{"description":"Repetition tracking index","updated":""},"counts":{}}'
fi

NEW_COUNT=$(echo "$INDEX" | jq --arg k "$COUNT_KEY" '.counts[$k] // 0 | . + 1')
UPDATED_INDEX=$(echo "$INDEX" | jq --arg ts "$TS" --arg k "$COUNT_KEY" --argjson cnt "$NEW_COUNT" '
    ._meta.updated = $ts | .counts[$k] = $cnt
')

echo "$UPDATED_INDEX" > "$INDEX_FILE"

echo "Logged correction: key=$COUNT_KEY count=$NEW_COUNT"

# Alert if 3 strikes reached
if [[ "$NEW_COUNT" -ge 3 ]]; then
    echo ""
    echo "⚠️  3 STRIKES REACHED for: $RULE_TEXT"
    echo "   Promote to: HOT.md or contexts/<name>.md?"
    echo "   Run: ./promote-rule.sh '$COUNT_KEY' hot|contexts/<name>"
fi
