---
name: searxng-search
description: Use local/self-hosted SearXNG as web search provider via script wrapper. Trigger when the user asks to search web with SearXNG, wants privacy-first search, asks for custom/local search backend, or wants alternatives to Brave/Perplexity/Grok provider limits.
---

# SearXNG Search

Use this skill to run web searches against a self-hosted SearXNG instance.

## Quick start

Run:

```bash
SEARXNG_BASE_URL="http://127.0.0.1:8088" \
/home/manpac/.openclaw/workspace/skills/searxng-search/scripts/searxng_search.sh "<query>" 5
```

Output is compact JSON with:
- `query`
- `number_of_results`
- `results[]` with `title`, `url`, `snippet`

## Workflow

1. Resolve base URL
   - Prefer `SEARXNG_BASE_URL` env var.
   - Default to `http://127.0.0.1:8088`.
   - If Docker mapping is `127.0.0.1:8088->8080`, use `8088` from host.

2. Execute search script
   - Command:
     ```bash
     /home/manpac/.openclaw/workspace/skills/searxng-search/scripts/searxng_search.sh "<query>" <count>
     ```
   - `count` default is `5`.

3. Return clean results
   - If JSON is available + `jq` installed, return normalized compact JSON.
   - If `jq` is missing, return raw JSON response.

## Troubleshooting

- `curl: (7) Failed to connect`
  - Check container is up and port mapping is correct.
  - Example check:
    ```bash
    docker ps | grep searxng
    ```

- Empty/weak results
  - Retry with different keywords.
  - Validate SearXNG instance health in browser:
    - `http://127.0.0.1:8088`

## scripts/

- `scripts/searxng_search.sh`: SearXNG query wrapper (`curl` + optional `jq` normalization).
