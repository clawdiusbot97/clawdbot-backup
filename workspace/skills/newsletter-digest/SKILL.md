---
name: newsletter-digest
description: Daily newsletter curation pipeline with checkpoints.
metadata:
  {
    "openclaw": {
      "emoji": "📬",
      "tags": ["newsletter", "automation", "checkpoint"]
    }
  }
---

# newsletter-digest

Daily pipeline that fetches newsletters from configured email senders, filters by relevance, produces a polished digest, and delivers to Slack. Uses file‑based checkpoints to allow resumption and avoid duplicate work.

## Senders (configured)

- nytdirect@nytimes.com (NYT The World)
- news@thehustle.co (The Hustle)
- dan@tldrnewsletter.com (TLDR)
- hello@historyfacts.com (History Facts)
- newsletter@aisecret.us (AI Secret)
- newsletter@themarginalian.org (The Marginalian – art)
- rw@peterc.org (Ruby Weekly)
- node@cooperpress.com (Node Weekly)

## Relevance filter order

1. **Tech** (AI, software, engineering)
2. **History** (historical events, engineering stories)
3. **Art** (culture, design)
4. **News** (general news, business)

Skip promotional/spammy content. Keep 5–7 most substantive items per day.

## Pipeline steps (with checkpoints)

### Step 1 – Researcher
- **Tool:** `gog` CLI with OAuth to Gmail (`tachipachi9797@gmail.com`).
- **Command:** `gog gmail messages search "newer_than:1d from:{sender}" --max 20 --json`
- **Output:** `newsletter-analysis-{YYYY‑MM‑DD}.md` in workspace root.
- **Checkpoint:** File existence; also `checkpoints/newsletter/{date}.json` with `stage: analysis_done`.

### Step 2 – Writer
- **Input:** Analysis file from researcher.
- **Output:** `newsletter-digest-{YYYY‑MM‑DD}.md` – Slack‑ready markdown, 5–7 items, ~500 words.
- **Checkpoint:** File existence; state `stage: digest_done`.

### Step 3 – Delivery
- **Channel:** Slack `#newsletter-digest` (channel id configured in OpenClaw).
- **Tool:** `message` tool with `action=send`, `channel=slack`, `target=newsletter-digest`.
- **Checkpoint:** State `stage: delivered` with `messageId` and timestamp.

### Step 4 – Cleanup (optional)
- Move analysis/digest files to `archive/newsletter/` (if delivery succeeded).
- Keep state file for audit.

## Manual invocation

```bash
# Run now (today's date)
sessions_spawn agentId=main task="Execute newsletter digest pipeline for today. Follow checkpoint logic."

# Or run the cron job immediately
cron action=run jobId=fd9aeac4-275f-4b27-b051-39f10ea849cd
```

## Cron schedule

- **UTC:** `0 9 * * *` (9 AM UTC)
- **Montevideo:** 6 AM (UTC‑3)

## State file format (`checkpoints/newsletter/YYYY‑MM‑DD.json`)

```json
{
  "date": "2026‑02‑18",
  "stage": "delivered",
  "timestamps": {
    "analysis": "2026‑02‑18T11:45:00Z",
    "digest": "2026‑02‑18T11:50:00Z",
    "delivery": "2026‑02‑18T11:55:00Z"
  },
  "messageId": "1771418005.188329",
  "error": null
}
```

## Error handling

- If researcher fails (no Gmail access), stop and log error in state.
- If writer fails, keep analysis file; next run will skip researcher.
- If Slack delivery fails, keep digest file; retry manually.
- State file with `error` field indicates where pipeline halted.

## Related skills

- `gog` – Google Workspace CLI for email access.
- `brokia‑plan` – stage‑based planning pattern (similar checkpoint philosophy).