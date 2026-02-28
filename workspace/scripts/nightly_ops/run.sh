#!/bin/bash
# Nightly Ops wrapper – runs the entire pipeline with cost control.

set -e

WORKSPACE="/home/manpac/.openclaw/workspace"
cd "$WORKSPACE"

LOG="$WORKSPACE/logs/nightly_ops.log"
exec > >(tee -a "$LOG") 2>&1

echo "=== Nightly Ops – $(date) ==="

# -------------------------------------------------------------------
# 1. Healthcheck (02:00)
# -------------------------------------------------------------------
echo "## Healthcheck"
python3 -m workflows.nightly_ops.healthcheck
HEALTH_EXIT=$?
if [ $HEALTH_EXIT -ne 0 ]; then
    echo "❌ Healthcheck failed – stopping pipeline"
    exit 1
fi

# -------------------------------------------------------------------
# 2. Cost Guard (02:10)
# -------------------------------------------------------------------
echo "## Cost Guard"
python3 -m workflows.nightly_ops.cost_guard
COST_EXIT=$?
if [ $COST_EXIT -eq 2 ]; then
    echo "⚠️ Cost spike detected – continuing but will alert"
fi

# -------------------------------------------------------------------
# 3. Backlog Groomer (02:20)
# -------------------------------------------------------------------
echo "## Backlog Groomer"
python3 -m workflows.nightly_ops.backlog_groomer

# -------------------------------------------------------------------
# 4. Trends Digest (02:40) – conditional
# -------------------------------------------------------------------
echo "## Trends Digest (conditional)"
python3 -m workflows.nightly_ops.trends_conditional

# -------------------------------------------------------------------
# 5. Inbox Triage (03:10) – conditional
# -------------------------------------------------------------------
echo "## Inbox Triage (conditional)"
python3 -m workflows.nightly_ops.inbox_conditional

# -------------------------------------------------------------------
# 6. Final Summary (03:30)
# -------------------------------------------------------------------
echo "## Final Summary"
python3 -m workflows.nightly_ops.final_summary

echo "✅ Nightly Ops completed – $(date)"
exit 0