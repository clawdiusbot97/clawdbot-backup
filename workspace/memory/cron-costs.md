# Cron Jobs Cost Monitoring

*Created 2026‑02‑20*  
*Goal: track approximate token consumption and cost per job to identify optimization opportunities.*

## Methodology

- **Duration**: Use `lastDurationMs` from successful runs (`lastStatus: "ok"`).
- **Token rate estimate** (tokens/second):
  - `deepseek‑v3.2`: 30 t/s
  - `minimax‑m2.1`: 20 t/s  
  - `openai‑codex/gpt‑5.2‑codex`: 50 t/s
- **Price per million tokens** (OpenRouter, USD):
  - deepseek‑v3.2: $0.14
  - minimax‑m2.1: $0.10
  - codex‑5.2‑codex: $0.30
- **Estimated cost per run** = (duration_sec × token_rate × price_per_token).

*Note: These are rough estimates; actual tokens vary with prompt size and output length.*

## Top Cost Jobs (based on last successful run)

| Job | Model | Duration (s) | Est. tokens | Est. cost (USD) | Status | Action |
|-----|-------|--------------|-------------|-----------------|--------|--------|
| `nightly_backlog_groomer` | deepseek‑v3.2 | 466 | 13 980 | $0.00196 | ok | Keep |
| `music‑trends‑scout‑5am` | deepseek‑v3.2 | 337 | 10 110 | $0.00142 | ok | Keep |
| `nightly_cost_guard` | deepseek‑v3.2 | 270 | 8 100 | $0.00113 | ok | Keep |
| `nightly_summary` | deepseek‑v3.2 | 152 | 4 560 | $0.00064 | ok | Keep |
| `nightly_trends_gate` | deepseek‑v3.2 | 76 | 2 280 | $0.00032 | ok | Keep |
| `nightly_inbox_triage` | deepseek‑v3.2 | 118 | 3 540 | $0.00050 | ok | Keep |
| `nightly_healthcheck` | deepseek‑v3.2 | 40 | 1 200 | $0.00017 | ok | Keep |
| `daily‑research‑scout` | deepseek‑v3.2 | 234 | 7 020 | $0.00098 | ok | Keep |
| `evening‑fallback‑briefing` | deepseek‑v3.2 | 21 | 630 | $0.00009 | ok | Keep |
| `daily‑morning‑briefing` | minimax‑m2.1 | 182 | 3 640 | $0.00036 | error | Fix delivery |
| `Daily Newsletter Digest` | minimax‑m2.1 | 600 (timeout) | – | – | error | Reduce timeout, optimize stages |
| `itau‑daily‑spend‑analysis` | codex‑5.2‑codex | 600 (timeout) | – | – | error | Reduce timeout, simplify |
| `Twitter RSS Digest` | deepseek‑v3.2 | 20 | 600 | $0.00008 | error | Fix delivery |

## Cost Summary (per day)

Assuming each job runs once per scheduled interval:

| Model | Runs/day | Est. tokens/day | Est. cost/day |
|-------|----------|-----------------|---------------|
| deepseek‑v3.2 | ~12 | ~45 000 | $0.0063 |
| minimax‑m2.1 | ~2 | ~7 000 | $0.0007 |
| codex‑5.2‑codex | ~2 | ~10 000 | $0.0030 |

**Total estimated daily cost: ~$0.0100** (1 cent USD).

## Optimization Priorities

1. **Fix delivery errors** – `daily‑morning‑briefing`, `Twitter RSS Digest`, `Daily Newsletter Digest`, `itau‑daily‑spend‑analysis`.
2. **Reduce timeouts** – Newsletter and Itaú jobs already optimized (timeout reduced to 300 s and 240 s).
3. **Consider reducing frequency** for high‑cost, low‑value jobs (e.g., `nightly_backlog_groomer` could run weekly instead of daily).
4. **Switch models** – Where possible, use cheaper models (minimax‑m2.1 for text, deepseek‑v3.2 for planning, codex only for structured analysis).

## Next Review

Update this file weekly (Monday) after `Weekly Improvements Review` job runs.