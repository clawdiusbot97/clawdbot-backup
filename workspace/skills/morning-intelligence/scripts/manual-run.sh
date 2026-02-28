#!/bin/bash
# Morning Intelligence Workflow - Manual Trigger
# Usage: ./manual-run.sh
# Or: bash /home/manpac/.openclaw/workspace/skills/morning-intelligence/scripts/manual-run.sh

set -e

WORKSPACE="/home/manpac/.openclaw/workspace"
DATE=$(date +%Y-%m-%d)

echo "=========================================="
echo "Morning Intelligence Workflow - Manual Run"
echo "Date: $DATE"
echo "=========================================="
echo ""
echo "This workflow will:"
echo "1. Collect news (AI/Tech + Global Signals)"
echo "2. Read Gmail (newsletters + Itaú finance)"
echo "3. Read personal tasks"
echo "4. Generate music recommendations"
echo "5. Send to Discord channels"
echo ""
echo "Discord Channels:"
echo "  - Briefings: 1475961144416931931"
echo "  - Newsletters: 1475961125257351423"
echo "  - Finance: 1475961220216520887"
echo "  - Music: 1475961199207251968"
echo ""
echo "Files used:"
echo "  - $WORKSPACE/dashboard/personal_tasks.md"
echo "  - $WORKSPACE/dashboard/music_profile.md"
echo "  - $WORKSPACE/dashboard/music_history.jsonl"
echo ""
echo "To run via OpenClaw agent, use:"
echo "  sessions_spawn with label 'morning-intel'"
echo ""
echo "Or trigger via:"
echo "  openclaw sessions:spawn --task 'Run Morning Intelligence Workflow' --label morning-intel"
echo ""
