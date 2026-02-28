#!/bin/bash
# Export script for work items - outputs canonical JSON to stdout
# This is a placeholder that reads from the local mock data

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKITEMS_FILE="${SCRIPT_DIR}/index/workitems.json"

if [ -f "$WORKITEMS_FILE" ]; then
    cat "$WORKITEMS_FILE"
    exit 0
else
    echo "Error: workitems.json not found at $WORKITEMS_FILE" >&2
    exit 1
fi