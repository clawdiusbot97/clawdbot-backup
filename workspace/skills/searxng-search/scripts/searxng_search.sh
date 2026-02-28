#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   searxng_search.sh "query" [count]
# Env:
#   SEARXNG_BASE_URL (default: http://127.0.0.1:8088)
#   SEARXNG_LANG (default: all)
#   SEARXNG_FORMAT (default: json)

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 \"query\" [count]" >&2
  exit 2
fi

QUERY="$1"
COUNT="${2:-5}"
BASE_URL="${SEARXNG_BASE_URL:-http://127.0.0.1:8088}"
LANG="${SEARXNG_LANG:-all}"
FORMAT="${SEARXNG_FORMAT:-json}"

# Normalize base URL (remove trailing slash)
BASE_URL="${BASE_URL%/}"

URL="${BASE_URL}/search?q=$(python3 - <<'PY' "$QUERY"
import sys, urllib.parse
print(urllib.parse.quote_plus(sys.argv[1]))
PY
)&format=${FORMAT}&language=${LANG}"

RAW="$(curl -fsSL "$URL")"

if [[ "$FORMAT" != "json" ]]; then
  echo "$RAW"
  exit 0
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "$RAW"
  exit 0
fi

# Emit compact JSON similar to web_search shape
jq -c --argjson count "$COUNT" '{
  query: .query,
  number_of_results: (.number_of_results // 0),
  results: ((.results // [])[:$count] | map({
    title: (.title // ""),
    url: (.url // ""),
    snippet: (.content // "")
  }))
}' <<<"$RAW"
