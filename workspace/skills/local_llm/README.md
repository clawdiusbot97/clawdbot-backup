# Skill: local_llm

On‑demand local LLM inference for OpenClaw workflows.  
Uses Ollama (preferred) or llama‑cpp‑python as backend, starts the model only when needed, and stops it after the job completes—keeping RAM free when idle.

## Features

- **On‑demand:** Model loaded at job start, unloaded at finish (no persistent RAM consumption).
- **Cache:** Responses cached with TTL (default 24h) to avoid redundant inference.
- **Fallback:** If local LLM fails, returns structured error and suggests keyword‑based fallback.
- **Multi‑backend:** Tries Ollama first, falls back to llama.cpp if needed.
- **Resource‑aware:** Configurable context size (≤2048), token limit, timeout.

## Installation

### 1. Backend selection

#### Option A: Ollama (recommended for simplicity)
```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull phi3:mini  # ~2.2 GB, q4_K_M quantization
```

#### Option B: llama‑cpp‑python (if Ollama not available)
```bash
pip install llama-cpp-python --break-system-packages
# Download model manually:
wget https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf/resolve/main/Phi-3-mini-4k-instruct-q4_k_m.gguf \
     -P ~/.cache/llama/
```

### 2. Environment variables
Set in OpenClaw config or `.env`:

```bash
LOCAL_LLM_BACKEND=ollama           # ollama | llama.cpp | disabled
LOCAL_LLM_MODEL=phi3:mini          # Ollama model name
LOCAL_LLM_MODEL_PATH=~/.cache/llama/Phi-3-mini-4k-instruct-q4_k_m.gguf  # llama.cpp path
LOCAL_LLM_HOST=http://localhost:11434  # Ollama API endpoint
LOCAL_LLM_CACHE_TTL=86400          # Cache TTL in seconds (24h)
LOCAL_LLM_MAX_TOKENS=256
LOCAL_LLM_CONTEXT=2048
LOCAL_LLM_TEMPERATURE=0.2
LOCAL_LLM_TIMEOUT=30               # seconds per request
```

## Usage

### From Python
```python
from skills.local_llm.run import LocalLLM

llm = LocalLLM()
response = llm.infer("Categorize 'Uber Trip' into: food, transport, shopping, health, services, entertainment, other")
# -> {"text": "transport", "cached": false, "backend": "ollama"}
```

### From command line (testing)
```bash
cd /home/manpac/.openclaw/workspace
python3 -m skills.local_llm.run "Categorize this merchant"
```

### From OpenClaw agent
```bash
sessions_spawn agentId=researcher task="Use local_llm to cluster these 30 news snippets into top 5 trends."
```

## API

### `LocalLLM.infer(prompt, max_tokens=None, temperature=None, timeout=None)`
- `prompt` (str): Input text.
- `max_tokens` (int): Override default limit.
- `temperature` (float): Override default sampling temperature.
- `timeout` (int): Override request timeout.
- **Returns:** dict with keys:
  - `text` (str): Generated response.
  - `cached` (bool): True if served from cache.
  - `backend` (str): `ollama`, `llama.cpp`, or `error`.
  - `error` (str): Present if inference failed.

### Cache location
`data/cache/local_llm/{sha256(prompt)}.json`
```json
{
  "prompt": "...",
  "response": "...",
  "backend": "ollama",
  "timestamp": "2026-02-19T00:00:00Z",
  "ttl": 86400
}
```

## Fallback behavior
If local LLM fails (model not installed, timeout, out‑of‑memory), the skill returns:
```json
{
  "text": "",
  "cached": false,
  "backend": "error",
  "error": "Ollama not available; fallback to keyword‑based categorization.",
  "fallback_suggestion": "Use keyword matching for categories: food, transport, shopping..."
}
```

Workflows should check for `error` and switch to rule‑based logic.

## Resource limits
- **Context window:** 2048 tokens (configurable).
- **Max tokens per call:** 256 (prevents long generations).
- **Timeout:** 30 seconds per request.
- **Memory:** Model loaded only during job execution; unloaded afterwards.

## Monitoring & logs
- **Log file:** `logs/local_llm.log` (rotated daily).
- **Metrics:** Counts of requests, cache hits, errors.
- **Health check:** `curl -s http://localhost:11434/api/tags` (Ollama) or check llama.cpp process.

## Integration example (spend_categorizer)
```python
def categorize_with_llm(merchant):
    llm = LocalLLM()
    prompt = f"Categorize '{merchant}' into: food, transport, shopping, health, services, entertainment, other. Reply with only the category name."
    result = llm.infer(prompt)
    if result.get("error"):
        return fallback_keyword_categorization(merchant)
    return result["text"].strip().lower()
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `ollama: command not found` | Install Ollama or switch to llama‑cpp‑python |
| `Model not found` | `ollama pull phi3:mini` or download GGUF manually |
| `Out of memory` | Reduce context size (set `LOCAL_LLM_CONTEXT=1024`) |
| `Timeout` | Increase `LOCAL_LLM_TIMEOUT` or check server status |
| Cache not updating | Delete `data/cache/local_llm/` or reduce TTL |

## Related skills
- `spend_categorizer` – uses local LLM for merchant categorization
- `trends_digest` – clusters news items with local LLM
- `keyword_fallback` – rule‑based fallback when LLM unavailable

---
*Version: 1.0 | Last updated: 2026‑02‑19*