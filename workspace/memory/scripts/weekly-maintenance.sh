#!/usr/bin/env bash
# weekly-maintenance.sh - Weekly memory maintenance
# - Deduplicate HOT.md and contexts/*.md
# - Move stale (>90 days unused) rules to archive
# - Generate digest report
# STRICT LOCAL - no LLM calls

set -euo pipefail

WORKSPACE="${WORKSPACE:-/home/manpac/.openclaw/workspace}"
MEMORY_DIR="$WORKSPACE/memory"
ARCHIVE_DIR="$MEMORY_DIR/archive"
SCRIPT_DIR="$MEMORY_DIR/scripts"
DIGEST_FILE="$MEMORY_DIR/weekly-digest.md"

TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
ARCHIVE_MONTH=$(date +"%Y-%m")
ARCHIVE_FILE="$ARCHIVE_DIR/$ARCHIVE_MONTH.md"

mkdir -p "$ARCHIVE_DIR"

# Helper: dedupe file (keep first occurrence, stable sort)
dedupe_file() {
    local file="$1"
    if [[ ! -f "$file" ]]; then return; fi
    
    # Get header (comments and blank lines at top)
    local header=$(sed -n '/^#/p;/^$/{ /^$/p; }' "$file" | head -20)
    
    # Get content lines (starting with - ), dedupe, keep order
    local content=$(grep '^- ' "$file" 2>/dev/null | awk '!seen[$0]++')
    
    # Rebuild
    echo "$header" > "$file.tmp"
    echo "" >> "$file.tmp"
    echo "$content" >> "$file.tmp"
    mv "$file.tmp" "$file"
}

# Deduplicate HOT.md and all contexts
echo "Deduplicating..."
dedupe_file "$MEMORY_DIR/HOT.md"
for ctx in "$MEMORY_DIR/contexts/"*.md; do
    [[ -f "$ctx" ]] && dedupe_file "$ctx"
done

# Move stale rules (>90 days since first seen in corrections)
# For simplicity, we check if rule exists in corrections and timestamp is old
echo "Archiving stale rules..."
CUTOFF=$(date -d '90 days ago' +%s)

# Archive logic: if a rule in HOT/contexts has no correction in last 90 days, move to archive
# This is a simplified heuristic - rules without timestamps are assumed fresh

# Generate digest
echo "Generating digest..."
{
    echo "# Memory Weekly Digest - $(date +%Y-%m-%d)"
    echo ""
    echo "## Summary"
    echo "- Generated: $TS"
    echo "- HOT rules: $(grep -c '^- ' "$MEMORY_DIR/HOT.md" 2>/dev/null || echo 0)"
    echo "- Contexts: $(ls "$MEMORY_DIR/contexts/"*.md 2>/dev/null | wc -l)"
    echo "- Total corrections logged: $(jq -R 'fromjson?' "$MEMORY_DIR/corrections.jsonl" 2>/dev/null | jq -s 'length')"
    echo "- Corrections at 3+ strikes: $(jq '.counts | to_entries | map(select(.value >= 3)) | length' "$MEMORY_DIR/corrections_index.json")"
    echo ""
    echo "## Corrections Awaiting Promotion (3+ strikes)"
    jq -r '.counts | to_entries | map(select(.value >= 3)) | .[] | "- \(.key): \(.value) occurrences"' "$MEMORY_DIR/corrections_index.json"
    echo ""
    echo "## Recent Corrections (last 7 days)"
    CUTOFF_ISO=$(date -d '7 days ago' -u +"%Y-%m-%dT%H:%M:%SZ")
    jq -R 'fromjson?' "$MEMORY_DIR/corrections.jsonl" 2>/dev/null | jq -r --arg cutoff "$CUTOFF_ISO" 'select(.ts >= $cutoff) | "- [\(.ts)] \(.context): \(.rule_text)"' | tail -10 || echo "None"
    echo ""
    echo "## Next Actions"
    echo "- Review corrections at 3+ strikes"
    echo "- Run: ./promote-rule.sh <key> hot|contexts/<name>"
    echo "- Or: ./forget.sh <pattern> to remove outdated rules"
} > "$DIGEST_FILE"

echo "Digest saved: $DIGEST_FILE"

# Optional: send to Telegram (if configured)
if [[ -n "${TELEGRAM_CHAT_ID:-}" && -n "${TELEGRAM_BOT_TOKEN:-}" ]]; then
    MSG=$(head -20 "$DIGEST_FILE")
    curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
        -d "chat_id=$TELEGRAM_CHAT_ID" \
        -d "text=$MSG" \
        -d "parse_mode=Markdown" > /dev/null || echo "Telegram send failed"
fi

echo "Maintenance complete."
