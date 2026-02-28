---
name: twitter-morning-briefing
description: Morning briefing pipeline from Twitter/X: fetch, score, select top tweets by category, generate markdown for Obsidian and short summary for Telegram/Slack.
metadata:
  {
    "openclaw": {
      "emoji": "🌅",
      "tags": ["twitter", "briefing", "morning", "obsidian", "telegram"]
    }
  }
---

# twitter-morning-briefing

Morning briefing pipeline from Twitter/X. Fetches latest tweets from configured accounts, scores them by relevance, selects top tweets per category, and produces:

1. **Obsidian markdown** – detailed briefing with categorized tweets, summaries, and video ideas.
2. **Telegram/Slack summary** – short bullet points with key highlights.

## Inputs

- **Accounts configuration** (`config/accounts.json`): Organized by category (tech_ai, tech_news, finance_macro, etc.).
- **Keywords/interests** (`config/keywords.json`): Weighted keywords for scoring.
- **Checkpoint state** (`checkpoints/last-briefing.json`): Last processed tweet IDs per account.

## Outputs

- **Briefing markdown** (`briefings/YYYY-MM-DD/briefing.md`): Full structured briefing for Obsidian.
- **Telegram summary** (stdout): Short bullet summary for delivery.
- **Checkpoint update** (`checkpoints/last-briefing.json`): Updated last IDs.

## Pipeline

1. **Fetch**: Get latest ~100 tweets per account via Nitter RSS.
2. **Filter**: Remove irrelevant replies, promotional noise.
3. **Score**: Assign 1–5 score based on interest match, strategic impact, concrete data, educational value.
4. **Select**: Pick top N per category (top 3 tech_ai, top 2 tech_news, etc.).
5. **Format**:
   - Obsidian: full markdown with sections, summaries, links, "why it matters".
   - Telegram: 3 key highlights, 1 macro insight, 1 suggested action (if any).
6. **Deliver**: Save to Obsidian vault, send summary to Telegram channel.

## Configuration

### `config/accounts.json`
```json
{
  "tech_ai": ["@karpathy", "@swyx", "@paulg", "@rauchg", "@AravSrinivas"],
  "tech_news": ["@theinformation", "@TechCrunch", "@semafor", "@benthompson", "@CaseyNewton"],
  "finance_macro": ["@LynAldenContact", "@KobeissiLetter", "@RaoulGMI", "@MebFaber", "@charliebilello"],
  "history_ideas": ["@HardcoreHistory", "@nfergus", "@peterfrankopan", "@HistoryInPics", "@themarginalian"],
  "uruguay_news": ["@ObservadorUY", "@elpaisuy", "@BUSQUEDAonline", "@portalmvd", "@ladiaria"],
  "uruguay_macro": ["@BancoCentral_Uy", "@ExanteUruguay"],
  "uruguay_politics": ["@LuisLacallePou", "@OrsiYamandu", "@CosseCarolina", "@AndresOjedaOk"]
}
```

### `config/keywords.json`
```json
{
  "weights": {
    "tech_ai": ["ai", "ml", "llm", "transformer", "openai", "anthropic", "developer tools", "startups", "indie hacking", "tech business"],
    "tech_news": ["tech news", "startup", "funding", "acquisition", "regulation", "product launch"],
    "finance_macro": ["macroeconomics", "investing", "long-term", "financial regulation", "interest rates", "inflation", "portfolio", "asset allocation"],
    "history_ideas": ["history", "medieval", "geopolitics", "strategy", "historical lessons", "applied history"],
    "uruguay": ["Uruguay", "economy", "politics", "regulation", "BCU", "export", "dollar", "inflation"]
  },
  "scoring": {
    "interest_match": 2,
    "strategic_impact": 3,
    "concrete_data": 2,
    "educational_thread": 1,
    "promotional_penalty": -2,
    "controversy_penalty": -1
  }
}
```

## Usage

### Manual invocation
```bash
sessions_spawn agentId=researcher task="Run morning briefing pipeline: fetch tweets from configured accounts, score, select top per category, generate Obsidian markdown and Telegram summary."
```

### As cron job
Schedule daily at 8:00 AM America/Montevideo.

## Related skills

- `twitter-fetch` – underlying RSS fetcher.
- `twitter-format` – formatting logic.
- `newsletter-digest` – similar curation pattern.