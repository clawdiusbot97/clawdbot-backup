#!/usr/bin/env python3
import json
import sys

with open('/home/manpac/.openclaw/openclaw.json', 'r') as f:
    data = json.load(f)

# New agent entry
new_agent = {
    "id": "orchestrator-kimi",
    "name": "Orchestrator (Kimi K2.5)",
    "workspace": "/home/manpac/.openclaw/workspace/agents/orchestrator-kimi",
    "agentDir": "/home/manpac/.openclaw/agents/orchestrator-kimi/agent",
    "model": {
        "primary": "moonshotai/kimi-k2.5",
        "fallbacks": [
            "openrouter/deepseek/deepseek-v3.2",
            "openrouter/minimax/minimax-m2.1"
        ]
    }
}

# Insert after qubika (maintain order, but we'll append)
data['agents']['list'].append(new_agent)

# Write back
with open('/home/manpac/.openclaw/openclaw.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Agent added.")