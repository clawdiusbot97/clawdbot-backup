#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
SEARCH_SH="$SCRIPT_DIR/search.sh"

usage() {
  echo "Uso: $(basename "$0") \"query\"" >&2
}

if [ "$#" -ne 1 ]; then
  usage
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "Error: jq no está instalado." >&2
  echo "Instálalo con tu gestor de paquetes, por ejemplo:" >&2
  echo "  Debian/Ubuntu: apt install jq" >&2
  echo "  Fedora: dnf install jq" >&2
  echo "  Arch: pacman -S jq" >&2
  exit 1
fi

query="$1"

"$SEARCH_SH" "$query" 5 | jq -r '
  if ((.results | length) == 0) then
    "Sin resultados."
  else
    .results[:5]
    | to_entries[]
    | . as $r
    | ($r.value.content // "")
      | gsub("\n"; " ")
      | if (length > 240) then .[0:240] + "..." else . end
      | "\($r.key + 1). \($r.value.title // "(sin titulo)")\n   URL: \($r.value.url // "(sin URL)")\n   Snippet: \(.)\n"
  end
'
