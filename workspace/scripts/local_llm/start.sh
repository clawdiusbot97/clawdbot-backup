#!/bin/bash
# Start Ollama server in background if not already running.
# Creates a pidfile to track ownership.

set -e

PIDFILE="/tmp/ollama_openclaw.pid"
LOG="/tmp/ollama_openclaw.log"
HOST="127.0.0.1"
PORT="11434"

# Check if Ollama is installed
if ! command -v ollama >/dev/null 2>&1; then
    echo "❌ Ollama not installed. Please install with: curl -fsSL https://ollama.com/install.sh | sh" >&2
    exit 1
fi

# Check if server is already reachable
if curl -s "http://$HOST:$PORT/api/tags" >/dev/null 2>&1; then
    echo "✅ Ollama server already running on $HOST:$PORT"
    exit 0
fi

# Check if another instance is already running (by pidfile)
if [ -f "$PIDFILE" ]; then
    pid=$(cat "$PIDFILE")
    if kill -0 "$pid" 2>/dev/null; then
        echo "⚠️  Ollama already running (pid $pid), but not responding on port $PORT"
        exit 0
    else
        # Stale pidfile
        rm "$PIDFILE"
    fi
fi

# Start Ollama server in background
echo "🚀 Starting Ollama server..."
nohup ollama serve > "$LOG" 2>&1 &
SERVER_PID=$!

# Save pid
echo "$SERVER_PID" > "$PIDFILE"
echo "✅ Started Ollama server (pid $SERVER_PID, log: $LOG)"

# Wait for server to be ready
MAX_WAIT=30
for i in $(seq 1 $MAX_WAIT); do
    if curl -s "http://$HOST:$PORT/api/tags" >/dev/null 2>&1; then
        echo "✅ Ollama server ready on $HOST:$PORT"
        exit 0
    fi
    sleep 1
done

# Timeout
echo "❌ Timeout waiting for Ollama server to start" >&2
kill "$SERVER_PID" 2>/dev/null
rm "$PIDFILE"
exit 1