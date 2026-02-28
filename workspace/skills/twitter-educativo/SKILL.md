---
name: twitter-educativo
description: 12‑hour Twitter RSS digest for tech, finance, and marketing accounts.
metadata:
  {
    "openclaw": {
      "emoji": "🐦",
      "tags": ["twitter", "rss", "digest", "automation"]
    }
  }
---

# twitter-educativo

Fetches latest tweets from configured Twitter accounts via Nitter RSS every 12 hours. Filters by relevance (tech, finance, marketing keywords) and delivers a digest to Slack and Telegram.

## Configured accounts (12)

- **iamfakhrealam** – tech/engineering
- **digitalix** – tech
- **quasarmarkets** – finance/investing
- **mikekhristo** – marketing
- **theonenicka** – marketing
- **siboptionpro** – finance
- **johnmventura** – marketing
- **shubh_dholakiya** – marketing
- **hashgraphonline** – tech (Hedera)
- **arceyul** – tech
- **marco_exito** – marketing/success
- **openclaw** – OpenClaw project updates

## RSS source

- Base URL: `https://nitter.net/{username}/rss`
- Returns last ~20 tweets per account
- Public, no API keys required

## Relevance keywords

- **Tech**: `ai`, `software`, `engineering`, `architecture`, `system design`, `devops`, `code`, `tech`, `openclaw`, `hedera`
- **Finance**: `investing`, `stocks`, `crypto`, `trading`, `finance`, `market`, `economy`
- **Marketing**: `marketing`, `growth`, `brand`, `social media`, `content`, `seo`, `conversion`

## Pipeline

### Step 1 – Fetch & parse
- **Script:** `scripts/twitter_rss.py`
- **Input:** `config/accounts.json` + last checkpoint state
- **Output:** Raw tweet data (JSON) in `data/tweets-{timestamp}.json`

### Step 2 – Filter & format
- Apply keyword matching (optional, configurable)
- Format digest markdown with:
  - Account name + timestamp
  - Tweet text (truncated if long)
  - Link to original tweet
- Output: `digests/digest-{timestamp}.md`

### Step 3 – Delivery
- **Slack:** Channel `#twitter-news` (to be created)
- **Telegram:** Group `twitter-news` (to be created)
- Uses `message` tool with appropriate channel targets

### Step 4 – Checkpoint update
- Store last processed tweet IDs per account in `checkpoints/last-state.json`
- Next run will only fetch tweets newer than last saved IDs

## Manual invocation

```bash
# Run now
sessions_spawn agentId=main task="Execute Twitter RSS digest pipeline. Fetch latest tweets from configured accounts, filter for relevance, produce markdown digest, and deliver to Slack and Telegram."

# Or trigger via cron
cron action=run jobId=<job-id>
```

## Cron schedule

- **Every 12 hours:** `0 */12 * * *` (UTC)
- **Montevideo times:** ~9 AM & 9 PM (UTC‑3)

## Configuration files

### `config/accounts.json`
```json
{
  "accounts": [
    { "username": "iamfakhrealam", "category": "tech" },
    { "username": "digitalix", "category": "tech" },
    { "username": "quasarmarkets", "category": "finance" },
    { "username": "mikekhristo", "category": "marketing" },
    { "username": "theonenicka", "category": "marketing" },
    { "username": "siboptionpro", "category": "finance" },
    { "username": "johnmventura", "category": "marketing" },
    { "username": "shubh_dholakiya", "category": "marketing" },
    { "username": "hashgraphonline", "category": "tech" },
    { "username": "arceyul", "category": "tech" },
    { "username": "marco_exito", "category": "marketing" },
    { "username": "openclaw", "category": "tech" }
  ],
  "keywords": {
    "tech": ["ai", "software", "engineering", "architecture", "system design", "devops", "code", "tech", "openclaw", "hedera"],
    "finance": ["investing", "stocks", "crypto", "trading", "finance", "market", "economy"],
    "marketing": ["marketing", "growth", "brand", "social media", "content", "seo", "conversion"]
  },
  "max_tweets_per_account": 5,
  "min_keyword_score": 1
}
```

### `config/channels.json`
```json
{
  "slack": "twitter-news",
  "telegram": "twitter-news"
}
```

## State file (`checkpoints/last-state.json`)

```json
{
  "last_run": "2026-02-18T12:00:00Z",
  "accounts": {
    "iamfakhrealam": "2023792588588016023",
    "digitalix": "2023434736291737624",
    ...
  }
}
```

## Error handling

- If Nitter RSS fails for an account, skip it and log warning.
- If Slack/Telegram delivery fails, keep digest file for manual retry.
- State file ensures no duplicate deliveries.

## Dependencies

- Python 3 with `feedparser`, `requests` (optional)
- OpenClaw `message` tool access to Slack & Telegram channels
- Internet connectivity to Nitter instances

## Related skills

- `newsletter‑digest` – similar pipeline pattern with checkpoints
- `searxng‑search` – web fetching patterns