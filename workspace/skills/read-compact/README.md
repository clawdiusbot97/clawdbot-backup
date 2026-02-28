# read‑compact

Wrapper script for `read` tool that compacts large file outputs to save LLM context tokens.

## Usage

```bash
# Read entire file
./scripts/read_compact.sh /path/to/file

# Read with offset (starting line) and limit (max lines)
./scripts/read_compact.sh /path/to/file 10 5
```

## Integration

Use via `exec` tool in OpenClaw agents when you expect large file reads.

Example agent workflow:

```bash
# Instead of using the read tool directly, use:
OUTPUT=$(exec "/home/manpac/.openclaw/workspace/skills/read-compact/scripts/read_compact.sh /home/manpac/.openclaw/workspace/some-large.log")
```

## Thresholds

- **150 lines** OR **10,000 characters** trigger compaction.
- Raw output saved to `artifacts/raw/read/<timestamp>.txt`.
- Summary includes first 8 lines, last 7 lines, and any error/warning lines.

## Test

Run the test suite:

```bash
cd /home/manpac/.openclaw/workspace/skills/read-compact
./scripts/test_read_compact.sh
```

## See Also

- [exec‑compact](../exec-compact) – similar wrapper for `exec` tool.
- [SKILL.md](SKILL.md) – skill metadata and detailed documentation.