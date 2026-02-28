#!/usr/bin/env bash
# forget.sh - Remove rules matching a pattern from all memory files
# Usage: ./forget.sh <pattern>
#   Use with caution - shows what will be deleted before confirming
# STRICT LOCAL - no LLM calls

set -euo pipefail

WORKSPACE="${WORKSPACE:-/home/manpac/.openclaw/workspace}"
PATTERN="${1:-}"

if [[ -z "$PATTERN" ]]; then
    echo "Usage: $0 <pattern>" >&2
    echo "  Use 'forget everything' with caution - wipes all memory files" >&2
    exit 1
fi

# Special case: forget everything
if [[ "$PATTERN" == "everything" ]]; then
    echo "⚠️  WARNING: This will WIPE all memory files and keep only empty scaffold." >&2
    read -p "Type 'yes' to confirm: " CONFIRM
    if [[ "$CONFIRM" != "yes" ]]; then
        echo "Aborted."
        exit 0
    fi
    
    # Backup first
    BACKUP_DIR="$WORKSPACE/memory/.backup-$(date +%s)"
    mkdir -p "$BACKUP_DIR"
    cp -r "$WORKSPACE/memory/"* "$BACKUP_DIR/" 2>/dev/null || true
    echo "Backup saved to: $BACKUP_DIR"
    
    # Keep only scaffold
    rm -rf "$WORKSPACE/contexts"/*.md 2>/dev/null || true
    rm -rf "$WORKSPACE/archive"/*.md 2>/dev/null || true
    rm -f "$WORKSPACE/corrections.jsonl"
    rm -f "$WORKSPACE/corrections_index.json"
    
    # Recreate empty scaffold
    echo "# HOT Memory - Always Loaded" > "$WORKSPACE/memory/HOT.md"
    echo "{}" > "$WORKSPACE/memory/corrections_index.json"
    touch "$WORKSPACE/memory/corrections.jsonl"
    
    echo "Memory wiped. Scaffold recreated."
    exit 0
fi

echo "Searching for pattern: $PATTERN"
echo ""

# Find matches in all memory files
MATCHES=$(grep -rn "$PATTERN" "$WORKSPACE/memory/" --include="*.md" --include="*.json" --include="*.jsonl" 2>/dev/null || true)

if [[ -z "$MATCHES" ]]; then
    echo "No matches found."
    exit 0
fi

echo "Matches found:"
echo "$MATCHES"
echo ""
read -p "Delete these lines? (yes/no): " CONFIRM

if [[ "$CONFIRM" != "yes" ]]; then
    echo "Aborted."
    exit 0
fi

# Delete matching lines from .md files
grep -rl "$PATTERN" "$WORKSPACE/memory/" --include="*.md" 2>/dev/null | while read -r file; do
    sed -i "/$PATTERN/d" "$file"
    echo "Updated: $file"
done

# Remove matching entries from corrections.jsonl
if grep -q "$PATTERN" "$WORKSPACE/memory/corrections.jsonl" 2>/dev/null; then
    grep -v "$PATTERN" "$WORKSPACE/memory/corrections.jsonl" > "$WORKSPACE/memory/corrections.jsonl.tmp"
    mv "$WORKSPACE/memory/corrections.jsonl.tmp" "$WORKSPACE/memory/corrections.jsonl"
    echo "Updated: corrections.jsonl"
fi

echo "Done."
