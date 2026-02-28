#!/bin/bash
# Morning Intelligence Workflow v1.0
# Runs daily at 08:00 America/Montevideo
# Discord delivery only

set -e

WORKSPACE="/home/manpac/.openclaw/workspace"
DATE=$(date +%Y-%m-%d)
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# Discord Channel IDs
BRIEFING_CHANNEL="1475961144416931931"
NEWSLETTERS_CHANNEL="1475961125257351423"
FINANCE_CHANNEL="1475961220216520887"
MUSIC_CHANNEL="1475961199207251968"
GUILD_ID="1475957498942062654"

# File paths
TASKS_FILE="$WORKSPACE/dashboard/personal_tasks.md"
MUSIC_PROFILE="$WORKSPACE/dashboard/music_profile.md"
MUSIC_HISTORY="$WORKSPACE/dashboard/music_history.jsonl"

# Temp files
TMP_DIR=$(mktemp -d)
trap "rm -rf $TMP_DIR" EXIT

echo "[$(date)] Morning Intelligence Workflow starting..."
echo "Date: $DATE"
echo "Timezone: America/Montevideo (08:00)"

# ============================================
# STEP 1: Data Collection (via subagent)
# ============================================
echo "[$(date)] Step 1: Collecting data..."

# Note: The actual data collection is done by spawning a researcher subagent
# This script expects the subagent to return structured data
# For cron purposes, we'll use the sessions_spawn mechanism

echo "[$(date)] Workflow setup complete."
echo ""
echo "To complete implementation:"
echo "1. Ensure Gmail auth is active: gog auth status"
echo "2. Verify Discord channels are accessible"
echo "3. Test run: openclaw sessions_spawn with morning-intel payload"
