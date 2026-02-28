#!/bin/bash
# Morning Intelligence Workflow - Cron Entry Point
# Triggered by: openclaw cron at 08:00 America/Montevideo

# This script spawns the morning-intel subagent to execute the full workflow

WORKSPACE="/home/manpac/.openclaw/workspace"
DATE=$(date +%Y-%m-%d)

echo "[$DATE] Triggering Morning Intelligence Workflow..."

# The actual work is done by spawning a subagent session
# The subagent will:
# 1. Collect news and email data
# 2. Generate music recommendations
# 3. Send Discord messages
# 4. Append to music history

# Log trigger
echo "[$DATE $(date +%H:%M:%S)] Cron triggered for Morning Intelligence" >> "$WORKSPACE/logs/morning-intel.log"

# Exit - the actual implementation runs via sessions_spawn from the cron payload
