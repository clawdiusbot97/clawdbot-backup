#!/bin/bash
set -e
WS="/home/manpac/.openclaw/workspace"
cd "$WS"
mkdir -p reports/nightly reports/trends/daily logs

python3 -m workflows.nightly_ops.healthcheck || true
python3 -m workflows.nightly_ops.cost_guard || true
python3 -m workflows.nightly_ops.backlog_groomer || true
python3 -m workflows.nightly_ops.trends_conditional || true
python3 -m workflows.nightly_ops.inbox_conditional || true
python3 -m workflows.nightly_ops.final_summary || true

echo "Smoke test done. Check reports/nightly/*.md"
