#!/usr/bin/env bash
set -euo pipefail

BASE_URL="http://127.0.0.1:8088/search"

usage() {
  echo "Uso: $(basename "$0") \"query\" [n]" >&2
}

if [ "$#" -lt 1 ] || [ "$#" -gt 2 ]; then
  usage
  exit 1
fi

query="$1"
count="${2:-10}"

case "$count" in
  ''|*[!0-9]*)
    echo "Error: n debe ser un entero positivo." >&2
    exit 1
    ;;
esac

if [ "$count" -le 0 ]; then
  echo "Error: n debe ser mayor que 0." >&2
  exit 1
fi

curl --silent --show-error --fail --get "$BASE_URL" \
  --data-urlencode "q=$query" \
  --data "format=json" \
  --data "language=auto" \
  --data "safesearch=0" \
  --data "pageno=1" \
  --data "count=$count"
