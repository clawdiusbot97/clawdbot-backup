#!/bin/bash
# Brokia Telegram Intake Polling Script
# Runs the intake.ts module via tsx

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_ROOT="$(dirname "$SCRIPT_DIR")"

# Load .env if exists
if [ -f "$SKILL_ROOT/.env" ]; then
  set -a
  source "$SKILL_ROOT/.env"
  set +a
fi

# Ensure state directory exists
mkdir -p "$SKILL_ROOT/state"

# Check Node.js availability
if ! command -v npx &> /dev/null; then
  echo "Error: npx not found"
  exit 1
fi

# Run the intake
cd "$SKILL_ROOT"
npx tsx src/intake.ts