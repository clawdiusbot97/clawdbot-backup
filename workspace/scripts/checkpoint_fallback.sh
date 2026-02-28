#!/bin/bash
# Checkpoint-based fallback for evening briefing.
# Returns exit code 0 if fallback should NOT run, 1 if fallback should run.

set -euo pipefail

OPENCLAW_HOME="/home/manpac/.openclaw"
CHECKPOINT_DIR="$OPENCLAW_HOME/workspace/checkpoints"
mkdir -p "$CHECKPOINT_DIR"

# Current date in Montevideo time (America/Montevideo)
DATE=$(TZ="America/Montevideo" date +%Y-%m-%d)
HOUR=$(TZ="America/Montevideo" date +%H)

# Checkpoint file that morning briefing should create
CHECKPOINT_FILE="$CHECKPOINT_DIR/briefing-success-$DATE.json"

log() {
    echo "[$(date -u +'%Y-%m-%d %H:%M:%S UTC')] $*" >&2
}

# --- Decision logic ---
if [[ -f "$CHECKPOINT_FILE" ]]; then
    log "Morning briefing checkpoint exists: $CHECKPOINT_FILE"
    log "Fallback NOT needed (morning briefing succeeded)."
    exit 0
fi

log "No morning briefing checkpoint found."

# Only run fallback after 14:00 Montevideo (2 PM)
if [[ "$HOUR" -lt 14 ]]; then
    log "Too early for fallback (current hour: $HOUR < 14 Montevideo)."
    exit 0
fi

log "Fallback CONDITIONS MET: no checkpoint, hour >= 14 Montevideo."
log "Proceeding with evening fallback briefing."
exit 1