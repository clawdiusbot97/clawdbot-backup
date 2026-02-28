#!/bin/bash
# Stop Ollama server if it was started by us (owns the pidfile).

set -e

PIDFILE="/tmp/ollama_openclaw.pid"
HOST="127.0.0.1"
PORT="11434"

# No pidfile → nothing to stop
if [ ! -f "$PIDFILE" ]; then
    echo "⚠️  No pidfile found (server not started by this script)"
    exit 0
fi

pid=$(cat "$PIDFILE")

# Check if process still exists
if ! kill -0 "$pid" 2>/dev/null; then
    echo "⚠️  Process $pid not running (stale pidfile)"
    rm "$PIDFILE"
    exit 0
fi

# Stop the server
echo "🛑 Stopping Ollama server (pid $pid)..."
kill "$pid"

# Wait for process to exit
MAX_WAIT=10
for i in $(seq 1 $MAX_WAIT); do
    if ! kill -0 "$pid" 2>/dev/null; then
        echo "✅ Ollama server stopped"
        rm "$PIDFILE"
        exit 0
    fi
    sleep 1
done

# Force kill if still running
echo "⚠️  Force‑killing Ollama server (pid $pid)"
kill -9 "$pid" 2>/dev/null
rm "$PIDFILE"
echo "✅ Ollama server force‑stopped"

# Also unload model if possible (optional)
if command -v ollama >/dev/null 2>&1; then
    ollama rm phi3:mini 2>/dev/null || true
fi

exit 0
fi

exit 0