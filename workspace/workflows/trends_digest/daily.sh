#!/bin/bash
# Daily Trends Digest wrapper – starts local LLM server, runs digest, stops server.

set -e

WORKSPACE="/home/manpac/.openclaw/workspace"
cd "$WORKSPACE"

LOG="$WORKSPACE/logs/trends_digest_cron.log"
exec > >(tee -a "$LOG") 2>&1

echo "=== Trends Digest – $(date) ==="

# 1. Start local LLM server if configured
if [ -f "$WORKSPACE/scripts/local_llm/start.sh" ]; then
    echo "Starting local LLM server..."
    "$WORKSPACE/scripts/local_llm/start.sh"
else
    echo "⚠️  No start script found, assuming LLM server already running or using fallback."
fi

# 2. Run the trends digest pipeline
echo "Running trends digest..."
python3 -m workflows.trends_digest.run

# 3. Stop local LLM server (only if we started it)
if [ -f "$WORKSPACE/scripts/local_llm/stop.sh" ]; then
    echo "Stopping local LLM server..."
    "$WORKSPACE/scripts/local_llm/stop.sh"
fi

echo "✅ Trends Digest completed – $(date)"
exit 0