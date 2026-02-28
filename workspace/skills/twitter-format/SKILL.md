---
name: twitter-format
description: Format raw Twitter tweets into a curated digest (Writer role).
metadata:
  {
    "openclaw": {
      "emoji": "📝",
      "tags": ["twitter", "format", "digest", "writer"]
    }
  }
---

# twitter-format

Reads raw tweet JSON from `twitter-fetch`, filters by relevance using keyword matching, and produces a polished markdown digest ready for delivery.

## Inputs

- **Raw tweet data** (`data/tweets-raw-{timestamp}.json`): JSON file produced by `twitter-fetch`.
- **Keywords configuration** (`config/keywords.json`): Expanded keyword lists for tech, finance, marketing.
- **Optional checkpoint** (`checkpoints/last-digest.json`): Timestamp of last digest (for deduplication).

## Outputs

- **Formatted digest** (`digests/digest-{timestamp}.md`): Markdown digest grouped by category, filtered by relevance.
- **Checkpoint update** (`checkpoints/last-digest.json`): Timestamp of this digest.
- **Delivery-ready text**: Digest printed to stdout for OpenClaw to send via Slack/Telegram.

## Filtering logic

1. **Keyword scoring**: Each tweet gets a score based on keyword matches in its category.
2. **Minimum threshold**: Only tweets with score ≥ `min_keyword_score` (configurable) are included.
3. **Category grouping**: Tweets grouped by category (tech, finance, marketing).
4. **Truncation**: Long tweets truncated to ~280 characters with ellipsis.
5. **Formatting**: Clean markdown with account display name, text, and original tweet link.

## Configuration

### `config/keywords.json`
```json
{
  "keywords": {
    "tech": ["ai", "software", "engineering", "architecture", "system design", "devops", "code", "tech", "openclaw", "hedera", "grpc", "kafka", "rabbitmq", "pulsar", "database", "microservices", "cloud", "kubernetes", "docker", "ruby", "rails", "jruby", "rspec", "tdd", "mysql", "redis", "postgresql", "auth", "authentication", "oauth", "jwt", "payments", "gateways", "stripe", "mercadopago", "notifications", "email", "sms", "push", "apis", "rest", "graphql", "testing", "quality", "reliability", "monitoring", "logs"],
    "finance": ["investing", "stocks", "crypto", "trading", "finance", "market", "economy", "portfolio", "risk", "asset", "wealth", "money", "investment", "stock", "bitcoin", "ethereum", "longterm", "dividends", "etf", "index", "diversification", "rebalancing", "compound", "retirement", "financial_independence"],
    "marketing": ["marketing", "growth", "brand", "social media", "content", "seo", "conversion", "audience", "engagement", "strategy", "campaign", "analytics", "digital", "advertising", "sales", "lead", "customer", "growth_hacking", "conversion_rate", "retention", "product_market_fit", "mvp", "validation", "customer_acquisition", "lifetime_value"]
  },
  "min_keyword_score": 1,
  "max_tweets_per_category": 10,
  "truncate_length": 280
}
```

## Usage

### Manual invocation (with raw data path)
```bash
sessions_spawn agentId=writer task="Execute twitter-format on raw data file /path/to/tweets-raw-{timestamp}.json. Filter by keywords, produce markdown digest, and output for delivery."
```

### As part of pipeline
The `twitter-fetch` skill outputs `RAW_DATA_PATH={path}`. This can be captured and passed to `twitter-format`.

## Delivery

The digest is printed to stdout in markdown format. OpenClaw can capture it and send via:
- **Slack**: `message(action=send, channel=slack, target=twitter-news, message=digest)`
- **Telegram**: `message(action=send, channel=telegram, target=twitter-news-group-id, message=digest)`

## Related skills

- `twitter-fetch` (Researcher role) – produces the raw JSON input.
- `newsletter-digest` – similar formatting/delivery pattern.