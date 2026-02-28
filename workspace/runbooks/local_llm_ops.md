# Local LLM Operations Runbook

Quick guide to install, operate, and troubleshoot the on‑demand local LLM.

## Quick Start

### 1. Install Ollama (recommended)
```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull phi3:mini  # ~2.2 GB, q4_K_M quantization
```

### 2. Verify installation
```bash
ollama --version
ollama list
```

### 3. Start the server (manual, for testing)
```bash
ollama serve &
# Wait a few seconds, then test:
curl http://localhost:11434/api/tags
```

### 4. Configure OpenClaw
Add to `~/.openclaw/openclaw.json`:
```json
{
  "skills": {
    "local_llm": {
      "backend": "ollama",
      "model": "phi3:mini",
      "host": "http://localhost:11434",
      "max_tokens": 256,
      "context": 2048,
      "temperature": 0.2
    }
  }
}
```

## Automatic Start/Stop Scripts

The workflow uses two scripts to manage the Ollama server lifecycle:

**`scripts/local_llm/start.sh`** – Starts Ollama server if not already running.
**`scripts/local_llm/stop.sh`** – Stops the server if it was started by us.

### Usage in cron jobs
```bash
# In your cron job wrapper:
scripts/local_llm/start.sh
python3 workflows/trends_digest/run.py
scripts/local_llm/stop.sh
```

## Model Management

### Available models (fit 8GB RAM)
| Model | Size (q4_K_M) | RAM usage | Notes |
|-------|---------------|-----------|-------|
| `phi3:mini` | 2.2 GB | ~3 GB | Recommended, good quality |
| `gemma:2b` | 1.6 GB | ~2.5 GB | Faster, less capable |
| `llama2:7b` | 4.3 GB | ~6 GB | Too large for 8GB RAM |

### Pull a new model
```bash
ollama pull gemma:2b
```

### Unload model from memory
```bash
ollama rm phi3:mini
```

### List downloaded models
```bash
ollama list
```

## Monitoring

### Check server health
```bash
curl -s http://localhost:11434/api/tags | jq .
```

### View logs
```bash
# Ollama server logs
tail -f /tmp/ollama_openclaw.log

# OpenClaw LLM logs
tail -f ~/.openclaw/workspace/logs/local_llm.log

# Trends digest logs
tail -f ~/.openclaw/workspace/logs/trends_digest.log
```

### Metrics
- **Cache hits:** Check `data/cache/local_llm/` file count.
- **Request latency:** Logs show inference time.
- **Error rate:** Look for `ERROR` entries in logs.

## Troubleshooting

### Problem: `ollama: command not found`
**Solution:** Install Ollama as above, or switch to llama‑cpp‑python backend.

### Problem: `Out of memory`
**Solution:**
1. Reduce context size: set `LOCAL_LLM_CONTEXT=1024`.
2. Use a smaller model: `gemma:2b`.
3. Ensure no other memory‑heavy processes are running.

### Problem: Server not starting (port 11434 in use)
**Solution:**
```bash
# Kill existing Ollama processes
pkill -f ollama
# Wait, then restart
scripts/local_llm/start.sh
```

### Problem: LLM responses are slow (>30s)
**Solution:**
- Reduce `max_tokens` (default 256).
- Lower `temperature` (default 0.2).
- Ensure model is already loaded (first request loads model).

### Problem: Cache not working
**Solution:**
- Check write permissions in `data/cache/local_llm/`.
- Reduce `LOCAL_LLM_CACHE_TTL` if too short.
- Manually clear cache: `rm -rf data/cache/local_llm/*`.

## Fallback Procedures

### When local LLM is unavailable
1. **Spend categorizer** → uses keyword‑based categorization.
2. **Trends digest** → uses source‑based grouping.
3. **No critical workflows break** – all pipelines designed for graceful degradation.

### Manual bypass
Set environment variable:
```bash
export LOCAL_LLM_BACKEND=disabled
```
This will force all workflows to use fallback logic.

## Backup & Recovery

### Backup model files
```bash
# Ollama models are stored in ~/.ollama
tar -czf ollama_backup.tar.gz ~/.ollama/models/
```

### Restore
```bash
tar -xzf ollama_backup.tar.gz -C ~/
```

## Performance Tuning

### For 8GB RAM systems
```bash
export LOCAL_LLM_CONTEXT=1024
export LOCAL_LLM_MAX_TOKENS=128
export OLLAMA_NUM_PARALLEL=1
```

### Reduce CPU usage
```bash
export OLLAMA_NUM_THREADS=2  # limit CPU cores
```

## Security Notes

- **Local only:** The LLM runs entirely on‑prem, no data leaves your VPS.
- **Network binding:** By default Ollama listens on `127.0.0.1:11434` (localhost only).
- **No authentication:** Ensure firewall blocks external access to port 11434.
- **Cache contains prompts/responses:** Located in `data/cache/local_llm/` – ensure directory permissions are restrictive.

## Upgrades

### Upgrade Ollama
```bash
# Remove old version
sudo rm -f $(which ollama)
# Reinstall
curl -fsSL https://ollama.com/install.sh | sh
```

### Upgrade models
```bash
ollama pull phi3:mini  # re‑pulls latest version
```

## Emergency Shutdown
```bash
# Kill Ollama server and all related processes
pkill -f ollama
rm -f /tmp/ollama_openclaw.pid
```

## Contact & Help
- **Ollama docs:** https://ollama.com
- **OpenClaw logs:** `~/.openclaw/workspace/logs/`
- **Issue tracker:** [your internal issue tracker]

---
*Last updated: 2026‑02‑19*