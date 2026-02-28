# Skill: cron-middleware

System-wide middleware layer for OpenClaw cron job execution. Adds observability, misfire protection, and auditing without modifying individual job configurations.

## Features

- **Misfire Protection**: 10-minute debounce prevents duplicate executions
- **Telemetry Collection**: Records duration, tokens, model usage, cost estimates
- **Audit Logging**: JSONL format, append-only, atomically written
- **Metadata Blocks**: Appends execution metadata to every output
- **Usage CLI**: `openclaw audit usage --last 24h` for cost analysis

## Installation

1. Make scripts executable:
```bash
chmod +x /home/manpac/.openclaw/workspace/skills/cron-middleware/middleware.py
chmod +x /home/manpac/.openclaw/workspace/skills/cron-middleware/wrapper.sh
```

2. Install Python dependencies:
```bash
pip3 install jq  # for JSON processing in wrapper
```

## Usage

### Automatic Integration (All Cron Jobs)

The middleware wraps cron execution at the scheduler level. To activate, modify `/home/manpac/.openclaw/cron/jobs.json` to use the `cron_launcher` payload type:

```json
{
  "payload": {
    "kind": "cron_launcher",
    "script": "/home/manpac/.openclaw/workspace/skills/cron-middleware/wrapper.sh",
    "target_job": "<job_id>"
  }
}
```

### Manual Wrapper Usage

```bash
# Execute job with middleware
./wrapper.sh <job_id> openclaw cron run <job_id>
```

### Audit Usage

```bash
# View last 24h of cron usage
python3 middleware.py audit --last 24

# Output example:
📊 Cron Usage Audit — Last 24h
====================================================================================================
Job ID                                          Runs     Input     Output      Total   Cost USD      %
----------------------------------------------------------------------------------------------------
b8ea6237-5df6-41cf-af52-988abd5dd906               7   1610000      13300    1623300 $1.1500   78.2%
075106a5-eb3c-40dd-875f-fd2229927ddd               1     54300       2700      57000 $0.0180    7.6%
...
TOTAL                                                                                      $1.2000  100%
```

## Telemetry Schema

Each execution appends to `~/.openclaw/audit/cron-usage-YYYY-MM-DD.jsonl`:

```json
{
  "job_id": "uuid",
  "agent": "main",
  "model": "deepseek-v3.2",
  "fallback_model": null,
  "input_tokens": 12345,
  "output_tokens": 678,
  "total_tokens": 13023,
  "duration_ms": 45000,
  "retry_count": 0,
  "timestamp": "2026-02-23T02:56:00Z",
  "cost_estimate_usd": 0.00412
}
```

## Pricing Table (Embedded)

| Model | Input / 1M | Output / 1M |
|-------|------------|-------------|
| kimi-k2.5 | $0.50 | $1.50 |
| deepseek-v3.2 | $0.30 | $0.60 |
| minimax-m2.1 | $0.15 | $0.30 |

## State Files

- `~/.openclaw/audit/cron-last-run.json`: Last execution timestamps for misfire protection
- `~/.openclaw/audit/cron-usage-YYYY-MM-DD.jsonl`: Daily telemetry logs

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│  OpenClaw       │────▶│  Middleware      │────▶│  Original   │
│  Scheduler      │     │  (wrapper.sh)    │     │  Job Exec   │
└─────────────────┘     └──────────────────┘     └─────────────┘
                               │
                               ▼
                        ┌──────────────┐
                        │  Telemetry   │
                        │  + Audit Log │
                        └──────────────┘
```

## Next Steps

To complete integration with OpenClaw core:
1. Add `cron_launcher` payload kind to OpenClaw scheduler
2. Register middleware as system-wide hook
3. Enable by default for all cron jobs

*Version: 1.0 | Last updated: 2026-02-23*