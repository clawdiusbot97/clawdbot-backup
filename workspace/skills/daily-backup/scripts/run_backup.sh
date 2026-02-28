#!/bin/bash
# Wrapper for daily backup script

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"
CONFIG_FILE="$HOME/.openclaw/backup.env"

# Load environment variables
if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
else
    echo "ERROR: Config file $CONFIG_FILE not found." >&2
    echo "Create it with BACKUP_GITHUB_REPO and BACKUP_GITHUB_TOKEN." >&2
    exit 1
fi

# Check required variables
if [ -z "$BACKUP_GITHUB_REPO" ]; then
    echo "ERROR: BACKUP_GITHUB_REPO not set." >&2
    exit 1
fi

# Run Python script
cd "$SKILL_DIR"
python3 scripts/backup.py