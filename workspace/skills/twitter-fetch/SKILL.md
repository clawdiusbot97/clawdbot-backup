---
name: twitter-fetch
description: Fetch latest tweets from configured Twitter accounts via Nitter RSS (Researcher role).
metadata:
  {
    "openclaw": {
      "emoji": "🔍",
      "tags": ["twitter", "rss", "fetch", "researcher"]
    }
  }
---

# twitter-fetch

Fetches latest tweets from configured Twitter accounts via Nitter RSS. Acts as the **Researcher** in the pipeline: downloads raw data, extracts new tweets, saves JSON, and updates checkpoint state.

## Inputs

- **Accounts configuration** (`config/accounts.json`): List of Twitter usernames, categories, display names.
- **Checkpoint state** (`checkpoints/last-state.json`): Last processed tweet IDs per account (prevents duplicates).

## Outputs

- **Raw tweet data** (`data/tweets-raw-{timestamp}.json`): Full JSON with all fetched tweets.
- **Updated checkpoint** (`checkpoints/last-state.json`): New last IDs for next run.
- **Summary stats** (stdout): Counts per account, errors, etc.

## Usage

### Manual invocation
```bash
sessions_spawn agentId=researcher task="Execute twitter-fetch pipeline. Fetch latest tweets from configured accounts, save raw JSON, update checkpoint."
```

### As part of cron pipeline
```bash
sessions_spawn agentId=main task="Orchestrate Twitter RSS pipeline: 1) Spawn researcher to fetch tweets, 2) Spawn writer to format digest, 3) Deliver to Slack and Telegram."
```

## Checkpoint logic

The skill reads `checkpoints/last-state.json` which stores:
```json
{
  "last_run": "2026-02-18T16:59:00Z",
  "accounts": {
    "iamfakhrealam": "2023795873877291463",
    "digitalix": "2023872082875199731",
    ...
  }
}
```

For each account:
1. Fetch RSS (last ~20 tweets)
2. Stop when reaching last saved ID (already processed)
3. Save new tweets to JSON
4. Update last ID to most recent new tweet

## Error handling

- **Nitter down**: Skip account, log warning, continue.
- **RSS parsing fail**: Skip account, log error.
- **No new tweets**: Log info, update checkpoint anyway.

## Related skills

- `twitter-format` (Writer role) – consumes the raw JSON and produces digest.
- `newsletter-digest` – similar checkpointing pattern.