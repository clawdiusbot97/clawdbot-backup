#!/bin/bash
#
# brokia-deadline-alerts: T-7 Deadline Monitoring Engine (Producer-only)
# Reads Google Calendar, formats alerts, writes checkpoints.
# Slack delivery is performed by the caller (cron/agentTurn).
#

set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────────

ACCOUNT="tachipachi9797@gmail.com"
CHECKPOINT_DIR="/home/manpac/.openclaw/workspace/checkpoints/brokia"
TODAY=$(date +%Y-%m-%d)
CHECKPOINT_FILE="${CHECKPOINT_DIR}/deadlines-${TODAY}.json"
ALERT_FILE="/tmp/brokia-alert-${TODAY}.txt"

# Ensure checkpoint directory exists
mkdir -p "$CHECKPOINT_DIR"

# ─────────────────────────────────────────────────────────────────────────────
# LOGGING
# ─────────────────────────────────────────────────────────────────────────────

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >&2
}

# ─────────────────────────────────────────────────────────────────────────────
# PREFLIGHT CHECKS
# ─────────────────────────────────────────────────────────────────────────────

log "Running preflight checks..."

PREFLIGHT_ERRORS=()

# 1. Check auth list contains calendar,gmail for account
if ! gog auth list 2>/dev/null | grep -q "^${ACCOUNT}.*calendar,gmail"; then
    PREFLIGHT_ERRORS+=("Auth check failed: ${ACCOUNT} missing calendar,gmail scopes")
fi

# 2. Check calendar calendars succeeds
if ! gog calendar calendars -a "$ACCOUNT" >/dev/null 2>&1; then
    PREFLIGHT_ERRORS+=("Calendar list failed: gog calendar calendars error")
fi

# 3. Check events list succeeds (using correct syntax)
if ! gog calendar events --today -a "$ACCOUNT" >/dev/null 2>&1; then
    PREFLIGHT_ERRORS+=("Events list failed: gog calendar events --today error")
fi

# If preflight failed, write error checkpoint and exit
if [[ ${#PREFLIGHT_ERRORS[@]} -gt 0 ]]; then
    log "PREFLIGHT FAILED: ${#PREFLIGHT_ERRORS[@]} error(s)"
    
    # Build error details
    error_details=""
    for err in "${PREFLIGHT_ERRORS[@]}"; do
        log "  - $err"
        error_details+="  - $err\n"
    done
    
    # Write checkpoint with error
    cat > "$CHECKPOINT_FILE" << EOF
{
  "schema": "brokia-deadlines-v1",
  "generated_at": "$(date -Iseconds)",
  "query_range": {"start": "", "end": ""},
  "alerts_generated": [],
  "error": "Preflight failed: ${#PREFLIGHT_ERRORS[@]} error(s)",
  "error_details": $(echo -e "$error_details" | jq -Rs .),
  "suggested_fix": [
    "gog auth login --account ${ACCOUNT}",
    "gog auth consent --account ${ACCOUNT} --scopes calendar,gmail",
    "gog calendar events --today"
  ],
  "dedupe": {"already_sent_today": false}
}
EOF
    
    # Write error summary to alert file for pickup
    cat > "$ALERT_FILE" << EOF
:warning: Brokia Deadline Alerts - PREFLIGHT FAILED

Errors detected:
$(echo -e "$error_details" | sed 's/^/  /')

Suggested fix:
  1. gog auth login --account ${ACCOUNT}
  2. gog auth consent --account ${ACCOUNT} --scopes calendar,gmail
  3. gog calendar events --today

Checkpoint: ${CHECKPOINT_FILE}
EOF
    
    log "Preflight error checkpoint written to: $CHECKPOINT_FILE"
    exit 1
fi

log "Preflight checks passed"

# ─────────────────────────────────────────────────────────────────────────────
# DATE CALCULATIONS
# ─────────────────────────────────────────────────────────────────────────────

TODAY_ISO=$(date +%Y-%m-%d)
PLUS_7=$(date -d "+7 days" +%Y-%m-%d 2>/dev/null || date -v+7d +%Y-%m-%d)
PLUS_14_START=$(date -d "+1 days" +%Y-%m-%d 2>/dev/null || date -v+1d +%Y-%m-%d)
PLUS_14_END=$(date -d "+14 days" +%Y-%m-%d 2>/dev/null || date -v+14d +%Y-%m-%d)

log "Today: $TODAY_ISO"
log "T-7 target date: $PLUS_7"
log "Query range: $PLUS_14_START to $PLUS_14_END"

# ─────────────────────────────────────────────────────────────────────────────
# CHECK FOR EXISTING CHECKPOINT (Dedupe)
# ─────────────────────────────────────────────────────────────────────────────

declare -A ALREADY_SENT

if [[ -f "$CHECKPOINT_FILE" ]]; then
    log "Found existing checkpoint: $CHECKPOINT_FILE"
    # Load already sent event IDs (only if alert_sent=true)
    while IFS= read -r event_id; do
        if [[ -n "$event_id" ]]; then
            ALREADY_SENT["$event_id"]=1
            log "Event already sent today: $event_id"
        fi
    done < <(jq -r '.alerts_generated[]? | select(.alert_sent == true) | .event_id' "$CHECKPOINT_FILE" 2>/dev/null || true)
fi

# ─────────────────────────────────────────────────────────────────────────────
# FETCH CALENDAR EVENTS
# ─────────────────────────────────────────────────────────────────────────────

log "Fetching calendar events from gog..."

# Use correct gog syntax: gog calendar events --from ... --to ... -j
events_json=$(gog calendar events --from "$PLUS_14_START" --to "$PLUS_14_END" -j -a "$ACCOUNT" 2>/dev/null) || {
    log "ERROR: Failed to fetch calendar events"
    
    # Write error checkpoint
    cat > "$CHECKPOINT_FILE" << EOF
{
  "schema": "brokia-deadlines-v1",
  "generated_at": "$(date -Iseconds)",
  "query_range": {"start": "$PLUS_14_START", "end": "$PLUS_14_END"},
  "alerts_generated": [],
  "error": "Failed to fetch calendar events",
  "dedupe": {"already_sent_today": false}
}
EOF
    exit 1
}

# ─────────────────────────────────────────────────────────────────────────────
# PROCESS EVENTS (Filter T-7)
# ─────────────────────────────────────────────────────────────────────────────

log "Processing events for T-7 filter..."

t7_events=()
alerts_generated=()
alerts_to_send=()

# Parse events and filter for exactly 7 days from now
while IFS=$'\t' read -r event_id summary start_date description; do
    # Skip if missing critical fields
    [[ -z "$event_id" || -z "$summary" || -z "$start_date" ]] && continue
    
    # Normalize date (handle both date-only and datetime formats)
    event_date="${start_date:0:10}"
    
    # Check if exactly 7 days from today
    if [[ "$event_date" == "$PLUS_7" ]]; then
        log "Found T-7 event: $summary on $event_date"
        
        # Determine suggested action
        if [[ -n "$description" && "$description" != "null" ]]; then
            # Extract first sentence or first 100 chars
            suggested=$(echo "$description" | head -1 | cut -c1-100)
            [[ "$suggested" == *.* ]] && suggested="${suggested%%.*}."
        else
            suggested="Confirmar detalles y preparar entregables."
        fi
        
        # Check dedupe
        if [[ -n "${ALREADY_SENT[$event_id]:-}" ]]; then
            log "Skipping (already sent): $event_id"
            already_sent_flag="true"
        else
            alerts_to_send+=("$event_id|$summary|$event_date|$suggested")
            already_sent_flag="false"
        fi
        
        # Add to generated list (alert_sent=false initially, caller updates on success)
        alerts_generated+=("$event_id|$summary|$event_date|$suggested|$already_sent_flag")
    fi
done < <(echo "$events_json" | jq -r '.events[] | [.id, .summary, .start.date // .start.dateTime, .description // ""] | @tsv' 2>/dev/null || true)

log "Found ${#alerts_to_send[@]} new T-7 alerts to send"

# ─────────────────────────────────────────────────────────────────────────────
# WRITE SLACK MESSAGE FILE (if there are alerts to send)
# ─────────────────────────────────────────────────────────────────────────────

# Clear any existing alert file
rm -f "$ALERT_FILE"

if [[ ${#alerts_to_send[@]} -gt 0 ]]; then
    # Build formatted message
    formatted_date=$(date -d "$PLUS_7" +"%d de %B" 2>/dev/null || date -v+7d +"%d de %B")
    
    message=":pushpin: Alertas Brokia/ORT (T-7)
Para el $formatted_date tenés:"
    
    for alert in "${alerts_to_send[@]}"; do
        IFS='|' read -r _ summary _ suggested <<< "$alert"
        message+="
• $summary → Acción sugerida: $suggested"
    done
    
    # Write message to file for caller pickup
    echo "$message" > "$ALERT_FILE"
    log "Alert message written to: $ALERT_FILE"
else
    log "No new T-7 alerts to send"
fi

# ─────────────────────────────────────────────────────────────────────────────
# WRITE CHECKPOINT
# ─────────────────────────────────────────────────────────────────────────────

log "Writing checkpoint: $CHECKPOINT_FILE"

# Build alerts_generated JSON array (alert_sent=false initially)
alerts_json="["
first=true
for alert in "${alerts_generated[@]}"; do
    IFS='|' read -r event_id summary event_date suggested already_sent <<< "$alert"
    
    [[ "$first" == "true" ]] || alerts_json+=","
    first=false
    
    alerts_json+="
    {
      \"event_id\": \"$event_id\",
      \"summary\": \"$(echo "$summary" | sed 's/"/\\"/g')\",
      \"date\": \"$event_date\",
      \"days_until\": 7,
      \"suggested_action\": \"$(echo "$suggested" | sed 's/"/\\"/g')\",
      \"alert_sent\": false,
      \"slack_ts\": null
    }"
done
alerts_json+="
  ]"

# Write checkpoint (no error field on success, alert_sent=false initially)
# Caller updates alert_sent=true after successful Slack delivery
cat > "$CHECKPOINT_FILE" << EOF
{
  "schema": "brokia-deadlines-v1",
  "generated_at": "$(date -Iseconds)",
  "query_range": {
    "start": "$PLUS_14_START",
    "end": "$PLUS_14_END"
  },
  "alerts_generated": ${alerts_json:-[]},
  "dedupe": {
    "key": "{event_id}:{YYYY-MM-DD}",
    "already_sent_today": false
  }
}
EOF

log "Checkpoint written successfully"
log "Done. Found ${#alerts_generated[@]} T-7 events, prepared ${#alerts_to_send[@]} alerts for delivery."

# Output summary for caller
echo "{"
echo "  \"status\": \"success\","
echo "  \"checkpoint_file\": \"$CHECKPOINT_FILE\","
echo "  \"alert_file\": \"$ALERT_FILE\","
echo "  \"events_found\": ${#alerts_generated[@]},"
echo "  \"alerts_pending\": ${#alerts_to_send[@]},"
echo "  \"t7_date\": \"$PLUS_7\""
echo "}"
