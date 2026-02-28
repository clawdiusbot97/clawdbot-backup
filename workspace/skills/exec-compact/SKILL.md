---
name: exec-compact
description: Tool output compaction wrapper for exec tool. Use when executing commands that may produce large output (>150 lines or >10k chars). Saves raw output to artifacts/raw/exec/ and injects only summary into LLM context.
metadata:
  {
    "openclaw": {
      "emoji": "📦",
      "tags": ["optimization", "cost", "exec", "wrapper"]
    }
  }
---

# exec‑compact

**MVP Tool Output Compaction** – Wraps the `exec` tool to drastically reduce context growth and LLM costs.

## Problem

Large command outputs (logs, directory listings, API responses) bloat the LLM context, increasing token costs and reducing effective context window.

## Solution

A bash wrapper that:
1. Executes the command exactly as `exec` would
2. If output exceeds **150 lines OR 10 000 characters**:
   - Saves raw output to `artifacts/raw/exec/<timestamp>.log`
   - Generates a compact summary ≤ 300 tokens
   - Returns **only the summary** to the LLM
3. If below threshold: returns full output unchanged

## Quick start

```bash
# Direct invocation (for testing)
/home/manpac/.openclaw/workspace/skills/exec-compact/scripts/exec_compact.sh "ls -la /home/manpac"
```

## Integration into agent workflow

**For manual adoption** (current MVP):

When you need to run a command that might produce large output:

1. **Instead of** using the `exec` tool directly…
2. **Use** the wrapper script:

```bash
# Capture wrapper output
WRAPPER_OUTPUT=$(/home/manpac/.openclaw/workspace/skills/exec-compact/scripts/exec_compact.sh "<command>")

# Then process WRAPPER_OUTPUT (it will be either full output or summary)
```

**For automatic adoption** (future):

Modify the agent's behavior to intercept all `exec` calls and route them through this wrapper. This requires changes to the agent's tool‑calling logic (outside current MVP scope).

## Wrapper details

### Script location

```
/home/manpac/.openclaw/workspace/skills/exec-compact/scripts/exec_compact.sh
```

### Arguments

- First argument: **command** (quoted string)
- Optional flags:
  - `--workdir=<path>`: Change working directory
  - `--env=<VAR=value>`: Set environment variable (repeatable)

### Output format

**Below threshold:**
```
<full command output>
```

**Above threshold:**
```
## exec_compact summary
- Command: <command>
- Exit code: <code>
- Duration: <seconds>s
- Lines: <N>, Chars: <M>
- Raw output saved: /home/manpac/.openclaw/workspace/artifacts/raw/exec/<timestamp>.log

### Key lines (first 5):
<lines>

### Error/warning lines:
<lines> (if any)

### Last 5 lines:
<lines>
```

### Artifact log format

Each `.log` file contains:

```
=== exec_compact log ===
Timestamp: 2026‑02‑21T19:50:00Z
Command: ls -la /home/manpac
Workdir: /home/manpac
Env vars: 
Exit code: 0
Duration: 0.012s
Lines: 45
Chars: 2890

=== OUTPUT ===
<raw output>
```

## Testing

Run the test suite:

```bash
cd /home/manpac/.openclaw/workspace/skills/exec-compact
./scripts/test_exec_compact.sh
```

**Test cases:**
1. Small output (`echo "hello"`) → full output
2. Large output (`seq 1 200`) → summary only
3. Error output (`ls /nonexistent`) → summary with error lines
4. Mixed output with warnings/errors

## Metrics

**Before/after comparison** (to be collected):

| Metric | Before (raw exec) | After (exec‑compact) |
|--------|-------------------|----------------------|
| Avg tokens/msg | ~51 k | Target: <12 k |
| Context growth rate | High | Reduced 70‑80% |
| Artifact storage | 0 | ~1‑10 MB/day |

## Limitations (MVP)

1. **Only wraps `exec`** – `read`, `process`, `cron` not yet covered.
2. **Manual adoption** – Agent must choose to use wrapper.
3. **Bash‑only** – Uses `bash` to execute commands.
4. **Simple summary heuristic** – First/last/error lines; no semantic analysis.

## Roadmap

1. ✅ Create MVP wrapper for `exec`
2. 🔄 Automate interception (agent behavior modification)
3. 🔄 Extend to `read`, `process`, `cron`
4. 🔄 Add semantic summarization (LLM‑based)
5. 🔄 Integrate with session rotation

## Files

- `SKILL.md` – This file
- `scripts/exec_compact.sh` – Main wrapper script
- `scripts/test_exec_compact.sh` – Test suite (TODO)

## Related skills

- `secure‑token` – Safe credential handling
- `newsletter‑digest` – Example of heavy `exec` usage (`gog` commands)