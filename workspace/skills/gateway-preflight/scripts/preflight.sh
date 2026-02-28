#!/bin/bash
# gateway-preflight: deterministic checks to prevent pairing/scope failures.
# Exit codes: 0 = PASS, 1 = FAIL (critical), 2 = FAIL (warning), 3 = internal error

set -euo pipefail

# --- Configuration ---
: "${GATEWAY_HOST:=127.0.0.1}"
: "${GATEWAY_PORT:=18789}"
: "${CHECKPOINT_DIR:=$(dirname "$0")/../checkpoints/health}"
: "${DEBOUNCE_MINUTES:=60}"
: "${OPENCLAW_CMD:=/home/manpac/.npm-global/bin/openclaw}"
: "${JOURNALCTL_CMD:=journalctl --user -u openclaw-gateway}"
: "${CURL_TIMEOUT:=3}"
: "${OPENCLAW_TIMEOUT:=8}"

TIMESTAMP=$(date -u +"%Y-%m-%dT%H%M%SZ")
CHECKPOINT_FILE="${CHECKPOINT_DIR}/preflight-${TIMESTAMP}.json"
mkdir -p "${CHECKPOINT_DIR}"

# --- Helper functions ---
log() {
  echo "[$(date -u +'%Y-%m-%d %H:%M:%S UTC')] $*" >&2
}

run_timeout() {
  local timeout=$1
  shift
  timeout "${timeout}" "$@"
}

# --- Initialize results ---
STATUS="PASS"
FAIL_SIGNATURE=""
declare -A CHECKS
declare -A EVIDENCE
declare -A DETAILS
NEXT_STEPS=()

# --- 1. Gateway reachable (WebSocket ping) ---
log "Checking gateway WebSocket reachability..."
if run_timeout "${CURL_TIMEOUT}" curl -s -f "http://${GATEWAY_HOST}:${GATEWAY_PORT}/" >/dev/null 2>&1; then
  CHECKS[gateway_reachable]="pass"
  EVIDENCE[gateway_reachable]="curl succeeded"
else
  CHECKS[gateway_reachable]="fail"
  EVIDENCE[gateway_reachable]="curl failed or timed out"
  STATUS="FAIL"
  FAIL_SIGNATURE="${FAIL_SIGNATURE}gateway_unreachable|"
  NEXT_STEPS+=("Check gateway service: systemctl --user status openclaw-gateway")
  NEXT_STEPS+=("Restart gateway: systemctl --user restart openclaw-gateway")
fi

# --- 2. Gateway status (parse openclaw status) ---
log "Checking openclaw status..."
STATUS_OUTPUT=""
if STATUS_OUTPUT=$(run_timeout "${OPENCLAW_TIMEOUT}" "${OPENCLAW_CMD}" status 2>&1); then
  DETAILS[status_excerpt]=$(echo "${STATUS_OUTPUT}" | head -30 | tr '\n' ' ' | cut -c1-500)
  if echo "${STATUS_OUTPUT}" | grep -qi "pairing required\|gateway connect failed\|closed.*1008"; then
    CHECKS[gateway_status]="fail"
    EVIDENCE[gateway_status]="status contains pairing required or gateway connect failed"
    STATUS="FAIL"
    FAIL_SIGNATURE="${FAIL_SIGNATURE}pairing_required|"
    NEXT_STEPS+=("Run: openclaw status --deep")
    NEXT_STEPS+=("Check logs: journalctl --user -u openclaw-gateway -n 100")
  else
    CHECKS[gateway_status]="pass"
    EVIDENCE[gateway_status]="status clean"
  fi
else
  CHECKS[gateway_status]="warn"
  EVIDENCE[gateway_status]="openclaw status timed out or failed (non-critical)"
  [[ "${STATUS}" == "FAIL" ]] || STATUS="WARN"
  FAIL_SIGNATURE="${FAIL_SIGNATURE}status_timeout|"
  NEXT_STEPS+=("Gateway/CLI slow: rerun 'openclaw status --deep' manually")
fi

# --- 3. Device scopes (operator.write) ---
log "Checking paired devices for operator.write scope..."
DEVICES_OUTPUT=""
if DEVICES_OUTPUT=$(run_timeout "${OPENCLAW_TIMEOUT}" "${OPENCLAW_CMD}" devices list 2>&1); then
  DETAILS[devices_excerpt]=$(echo "${DEVICES_OUTPUT}" | grep -E "Paired|operator\." | head -10 | tr '\n' ';' | cut -c1-500)
  if echo "${DEVICES_OUTPUT}" | grep -q "operator.write"; then
    CHECKS[device_scopes]="pass"
    PAIRED_COUNT=$(echo "${DEVICES_OUTPUT}" | grep -c "operator.write" || true)
    EVIDENCE[device_scopes]="${PAIRED_COUNT} paired device(s) have operator.write scope"
  else
    CHECKS[device_scopes]="fail"
    EVIDENCE[device_scopes]="no paired device has operator.write scope"
    STATUS="FAIL"
    FAIL_SIGNATURE="${FAIL_SIGNATURE}missing_operator_write|"
    NEXT_STEPS+=("Add operator.write scope to paired devices in ~/.openclaw/devices/paired.json")
    NEXT_STEPS+=("Restart gateway after editing")
  fi
else
  CHECKS[device_scopes]="warn"
  EVIDENCE[device_scopes]="openclaw devices list timed out or failed (non-critical)"
  [[ "${STATUS}" == "FAIL" ]] || STATUS="WARN"
  FAIL_SIGNATURE="${FAIL_SIGNATURE}devices_timeout|"
  NEXT_STEPS+=("Gateway/CLI slow: rerun 'openclaw devices list' manually")
  DETAILS[devices_excerpt]="command failed"
fi

# --- 4. Pending/repair requests ---
log "Checking for pending pairing/repair requests..."
PENDING_OUTPUT=""
# Use cached DEVICES_OUTPUT if available
if [[ -z "${DEVICES_OUTPUT}" ]]; then
  if PENDING_OUTPUT=$(run_timeout "${OPENCLAW_TIMEOUT}" "${OPENCLAW_CMD}" devices list 2>&1); then
    DETAILS[pending_excerpt]=$(echo "${PENDING_OUTPUT}" | grep -A2 -B2 "Pending\|repair" | head -10 | tr '\n' ';' | cut -c1-500)
    if echo "${PENDING_OUTPUT}" | grep -q "Pending\|repair"; then
      CHECKS[pending_requests]="fail"
      PENDING_COUNT=$(echo "${PENDING_OUTPUT}" | grep -c "Pending\|repair" || true)
      EVIDENCE[pending_requests]="${PENDING_COUNT} pending/repair request(s) found"
      STATUS="FAIL"
      FAIL_SIGNATURE="${FAIL_SIGNATURE}pending_requests|"
      NEXT_STEPS+=("Approve pending request: openclaw devices approve <requestId>")
      NEXT_STEPS+=("List pending: openclaw devices list")
    else
      CHECKS[pending_requests]="pass"
      EVIDENCE[pending_requests]="no pending/repair requests"
    fi
  else
    CHECKS[pending_requests]="warn"
    EVIDENCE[pending_requests]="could not check pending requests (non-critical)"
    [[ "${STATUS}" == "FAIL" ]] || STATUS="WARN"
    FAIL_SIGNATURE="${FAIL_SIGNATURE}pending_timeout|"
    NEXT_STEPS+=("Gateway/CLI slow: rerun 'openclaw devices list' manually to confirm no pending approvals")
  fi
else
  # Reuse DEVICES_OUTPUT
  DETAILS[pending_excerpt]=$(echo "${DEVICES_OUTPUT}" | grep -A2 -B2 -E "Pending|repair" | head -10 | tr '\n' ';' | cut -c1-500 || true)
  if echo "${DEVICES_OUTPUT}" | grep -qE "Pending|repair"; then
    CHECKS[pending_requests]="fail"
    PENDING_COUNT=$(echo "${DEVICES_OUTPUT}" | grep -c "Pending\|repair" || true)
    EVIDENCE[pending_requests]="${PENDING_COUNT} pending/repair request(s) found"
    STATUS="FAIL"
    FAIL_SIGNATURE="${FAIL_SIGNATURE}pending_requests|"
    NEXT_STEPS+=("Approve pending request: openclaw devices approve <requestId>")
    NEXT_STEPS+=("List pending: openclaw devices list")
  else
    CHECKS[pending_requests]="pass"
    EVIDENCE[pending_requests]="no pending/repair requests"
  fi
fi

# --- 5. Recent log errors ---
log "Scanning gateway logs for pairing errors..."
if LOG_OUTPUT=$(run_timeout 10 ${JOURNALCTL_CMD} -n 50 2>&1); then
  ERROR_LINES=$(echo "${LOG_OUTPUT}" | grep -i "pairing required\|repair\|approval request\|requestId" | tail -5 || true)
  if [[ -n "${ERROR_LINES}" ]]; then
    CHECKS[log_errors]="warn"
    ERROR_COUNT=$(echo "${ERROR_LINES}" | wc -l)
    EVIDENCE[log_errors]="${ERROR_COUNT} recent log entries with pairing/repair keywords"
    DETAILS[log_excerpt]=$(echo "${ERROR_LINES}" | tr '\n' ';' | cut -c1-500)
  else
    CHECKS[log_errors]="pass"
    EVIDENCE[log_errors]="no recent pairing errors in logs"
  fi
else
  CHECKS[log_errors]="warn"
  EVIDENCE[log_errors]="journalctl not available (permissions) — skipping"
fi

# --- Debounce: check previous checkpoint for same signature ---
FAIL_SIGNATURE="${FAIL_SIGNATURE%|}"  # Remove trailing |
DEBOUNCED=false
if [[ -n "${FAIL_SIGNATURE}" ]]; then
  log "Failure signature: ${FAIL_SIGNATURE}"
  # Look for recent checkpoint with same signature
  for f in "${CHECKPOINT_DIR}"/preflight-*.json; do
    [[ -f "$f" ]] || continue
    if [[ $(stat -c %Y "$f") -gt $(date -d "${DEBOUNCE_MINUTES} minutes ago" +%s) ]]; then
      if jq -e --arg sig "${FAIL_SIGNATURE}" '.signature == $sig' "$f" >/dev/null 2>&1; then
        DEBOUNCED=true
        break
      fi
    fi
  done
  if [[ "${DEBOUNCED}" == "true" ]]; then
    log "Same failure signature within last ${DEBOUNCE_MINUTES} minutes; suppressing alert."
  fi
fi

# --- Write checkpoint JSON ---
if [[ ${#NEXT_STEPS[@]} -eq 0 ]]; then
  NEXT_STEPS+=("All checks passed; no action needed.")
fi

# Build JSON with jq
JSON_PAYLOAD=$(jq -n \
  --arg skill "gateway-preflight" \
  --arg timestamp "$(date -u +'%Y-%m-%dT%H:%M:%SZ')" \
  --arg status "${STATUS}" \
  --arg signature "${FAIL_SIGNATURE:-null}" \
  --argjson debounced "${DEBOUNCED}" \
  --argjson next_steps "$(printf '%s\n' "${NEXT_STEPS[@]}" | jq -R . | jq -s .)" \
  '{
    skill: $skill,
    timestamp: $timestamp,
    status: $status,
    signature: $signature,
    debounced: $debounced,
    checks: {},
    evidence: {},
    details: {},
    next_steps: $next_steps
  }')

# Add checks, evidence, details
TMP_FILE=$(mktemp)
echo "${JSON_PAYLOAD}" > "${TMP_FILE}"

for key in "${!CHECKS[@]}"; do
  jq --arg k "${key}" --arg v "${CHECKS[$key]}" '.checks[$k] = $v' "${TMP_FILE}" > "${TMP_FILE}.tmp" && mv "${TMP_FILE}.tmp" "${TMP_FILE}"
done

for key in "${!EVIDENCE[@]}"; do
  jq --arg k "${key}" --arg v "${EVIDENCE[$key]}" '.evidence[$k] = $v' "${TMP_FILE}" > "${TMP_FILE}.tmp" && mv "${TMP_FILE}.tmp" "${TMP_FILE}"
done

for key in "${!DETAILS[@]}"; do
  jq --arg k "${key}" --arg v "${DETAILS[$key]}" '.details[$k] = $v' "${TMP_FILE}" > "${TMP_FILE}.tmp" && mv "${TMP_FILE}.tmp" "${TMP_FILE}"
done

JSON_PAYLOAD=$(cat "${TMP_FILE}")
rm "${TMP_FILE}"

echo "${JSON_PAYLOAD}" > "${CHECKPOINT_FILE}"
log "Checkpoint written: ${CHECKPOINT_FILE}"

# --- Final output ---
if [[ "${STATUS}" == "FAIL" ]]; then
  if [[ "${DEBOUNCED}" == "true" ]]; then
    echo "FAIL: ${FAIL_SIGNATURE} (debounced)"
    exit 2  # Debounced failure: don't stop pipeline, but mark as WARN
  else
    echo "FAIL: ${FAIL_SIGNATURE}"
    exit 1
  fi
elif [[ "${STATUS}" == "WARN" ]]; then
  echo "WARN: ${FAIL_SIGNATURE:-soft_check_failed}"
  exit 2
else
  echo "PASS"
  exit 0
fi