---
name: read-compact
description: Tool output compaction wrapper for read tool. Use when reading files that may produce large output (>150 lines or >10k chars). Saves raw output to artifacts/raw/read/ and injects only summary into LLM context.
metadata:
  {
    "openclaw": {
      "emoji": "📄",
      "tags": ["optimization", "cost", "read", "wrapper"]
    }
  }
---

# read‑compact

**MVP Tool Output Compaction** – Wraps the `read` tool to drastically reduce context growth and LLM costs.

## Problem

Large file reads (logs, configs, data dumps) bloat the LLM context, increasing token costs and reducing effective context window.

## Solution

A bash wrapper that:
1. Reads the file exactly as `read` would (supports offset/limit)
2. If output exceeds **150 lines OR 10 000 characters**:
   - Saves raw output to `artifacts/raw/read/<timestamp>.txt`
   - Generates a compact summary ≤ 300 tokens
   - Returns **only the summary** to the LLM
3. If below threshold: returns full output unchanged

## Quick start

```bash
# Direct invocation (for testing)
/home/manpac/.openclaw/workspace/skills/read-compact/scripts/read_compact.sh "/path/to/file"
/home/manpac/.openclaw/workspace/skills/read-compact/scripts/read_compact.sh "/path/to/file" 10 5  # offset=10, limit=5
```

## Integration into agent workflow

**For manual adoption** (current MVP):

When you need to read a file that might be large:

1. **Instead of** using the `read` tool directly…
2. **Use** the wrapper script via `exec`:

```bash
# Capture wrapper output
WRAPPER_OUTPUT=$(/home/manpac/.openclaw/workspace/skills/read-compact/scripts/read_compact.sh "/path/to/file")

# Then process WRAPPER_OUTPUT (it will be either full output or summary)
```

**For automatic adoption** (future):

Modify the agent's behavior to intercept all `read` calls and route them through this wrapper. This requires changes to the agent's tool‑calling logic (outside current MVP scope).

## Wrapper details

### Script location

```
/home/manpac/.openclaw/workspace/skills/read-compact/scripts/read_compact.sh
```

### Arguments

- First argument: **file path** (required)
- Second argument: **offset** (optional, default: 1)
- Third argument: **limit** (optional, default: all lines after offset)

### Output format

**Below threshold:**
```
<full file content>
```

**Above threshold:**
```
## read_compact summary
- File: <path>
- Offset: <offset>
- Limit: <limit>
- Lines: <N>, Chars: <M>
- Raw output saved: /home/manpac/.openclaw/workspace/artifacts/raw/read/<timestamp>.txt

### Preview (first 8 lines + last 7 lines):
<lines>

### Error/warning lines (max 5):
<lines> (if any)
```

If the file is a single huge line (no newlines), show first 200 chars + last 200 chars.

### Artifact log format

Each `.txt` file contains:

```
=== read_compact log ===
Timestamp: 2026‑02‑21T19:50:00Z
File: /path/to/file
Offset: 1
Limit: (none)
Lines: 45
Chars: 2890

=== OUTPUT ===
<raw content>
```

## Testing

Run the test suite:

```bash
cd /home/manpac/.openclaw/workspace/skills/read-compact
./scripts/test_read_compact.sh
```

**Test cases:**
1. Small file → full output
2. Large file (lines) → summary only
3. Large file (chars) → summary only
4. File not found → error message
5. Offset/limit handling

## Metrics

**Before/after comparison** (to be collected):

| Metric | Before (raw read) | After (read‑compact) |
|--------|-------------------|----------------------|
| Avg tokens/msg | ~30 k | Target: <8 k |
| Context growth rate | High | Reduced 70‑80% |
| Artifact storage | 0 | ~1‑5 MB/day |

## Limitations (MVP)

1. **Only wraps `read`** – `exec`, `process`, `cron` not yet covered.
2. **Manual adoption** – Agent must choose to use wrapper.
3. **Bash‑only** – Uses `cat`, `head`, `tail`.
4. **Simple summary heuristic** – First/last/error lines; no semantic analysis.

## Roadmap

1. ✅ Create MVP wrapper for `read`
2. 🔄 Automate interception (agent behavior modification)
3. 🔄 Extend to other tools
4. 🔄 Add semantic summarization (LLM‑based)
5. 🔄 Integrate with session rotation

## Files

- `SKILL.md` – This file
- `scripts/read_compact.sh` – Main wrapper script
- `scripts/test_read_compact.sh` – Test suite

## Related skills

- `exec‑compact` – Wrapper for exec tool
- `secure‑token` – Safe credential handling