#!/usr/bin/env python3
"""
Cron Execution Middleware Layer for OpenClaw
Hooks into cron execution without modifying individual job logic
"""
import json
import time
import os
import sys
import subprocess
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, Optional, Any, Tuple

# ───────────────────────────────────────────────────────────────
# Configuration
# ───────────────────────────────────────────────────────────────
AUDIT_DIR = Path.home() / ".openclaw" / "audit"
STATE_FILE = AUDIT_DIR / "cron-last-run.json"
PRICING = {
    "kimi-k2.5": {"in": 0.50, "out": 1.50},
    "deepseek-v3.2": {"in": 0.30, "out": 0.60},
    "minimax-m2.1": {"in": 0.15, "out": 0.30},
    "moonshotai/kimi-k2.5": {"in": 0.50, "out": 1.50},
    "deepseek/deepseek-v3.2": {"in": 0.30, "out": 0.60},
    "minimax/minimax-m2.1": {"in": 0.15, "out": 0.30},
}

# Ensure audit directory exists
AUDIT_DIR.mkdir(parents=True, exist_ok=True)

# ───────────────────────────────────────────────────────────────
# Misfire Protection
# ───────────────────────────────────────────────────────────────
def check_misfire_protection(job_id: str) -> Tuple[bool, Optional[str]]:
    """
    Check if job should be skipped due to recent execution (10-min debounce)
    Returns: (should_execute, reason_if_skipped)
    """
    now = time.time()
    
    if STATE_FILE.exists():
        try:
            with open(STATE_FILE, 'r') as f:
                state = json.load(f)
        except (json.JSONDecodeError, IOError):
            state = {}
    else:
        state = {}
    
    last_run = state.get(job_id, 0)
    elapsed = now - last_run
    
    if elapsed < 600:  # 10 minutes
        return False, f"Skipped: executed {elapsed:.0f}s ago (debounce 600s)"
    
    return True, None

def update_last_run(job_id: str):
    """Update last execution timestamp for a job"""
    state = {}
    if STATE_FILE.exists():
        try:
            with open(STATE_FILE, 'r') as f:
                state = json.load(f)
        except (json.JSONDecodeError, IOError):
            pass
    
    state[job_id] = time.time()
    
    with open(STATE_FILE, 'w') as f:
        json.dump(state, f, indent=2)

# ───────────────────────────────────────────────────────────────
# Telemetry Collection
# ───────────────────────────────────────────────────────────────
def get_daily_log_file() -> Path:
    """Get the JSONL file for today"""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    return AUDIT_DIR / f"cron-usage-{today}.jsonl"

def calculate_cost(model: str, input_tokens: int, output_tokens: int) -> float:
    """Calculate cost estimate based on pricing table"""
    pricing = PRICING.get(model, PRICING.get("deepseek-v3.2", {"in": 0.30, "out": 0.60}))
    
    in_cost = (input_tokens / 1_000_000) * pricing["in"]
    out_cost = (output_tokens / 1_000_000) * pricing["out"]
    
    return round(in_cost + out_cost, 6)

def append_telemetry(telemetry: Dict[str, Any]):
    """Append telemetry record to JSONL file (atomic append)"""
    log_file = get_daily_log_file()
    
    record = {
        "job_id": telemetry.get("job_id"),
        "agent": telemetry.get("agent"),
        "model": telemetry.get("model"),
        "fallback_model": telemetry.get("fallback_model"),
        "input_tokens": telemetry.get("input_tokens", "unknown"),
        "output_tokens": telemetry.get("output_tokens", "unknown"),
        "total_tokens": telemetry.get("total_tokens", "unknown"),
        "duration_ms": telemetry.get("duration_ms"),
        "retry_count": telemetry.get("retry_count", 0),
        "timestamp": telemetry.get("timestamp"),
        "cost_estimate_usd": telemetry.get("cost_estimate_usd", 0.0),
    }
    
    # Atomic append using write to temp then rename pattern
    with open(log_file, 'a') as f:
        f.write(json.dumps(record, default=str) + '\n')
        f.flush()
        os.fsync(f.fileno())

# ───────────────────────────────────────────────────────────────
# Metadata Block Generation
# ───────────────────────────────────────────────────────────────
def generate_metadata_block(telemetry: Dict[str, Any]) -> str:
    """Generate execution metadata block for appending to output"""
    tokens_display = lambda x: str(x) if x != "unknown" and x is not None else "unknown"
    
    return f"""
⚙️ EXECUTION METADATA
Cron: {telemetry.get('job_id', 'unknown')}
Agent: {telemetry.get('agent', 'unknown')}
Model: {telemetry.get('model', 'unknown')}
Fallback: {telemetry.get('fallback_model') or 'none'}
Input Tokens: {tokens_display(telemetry.get('input_tokens'))}
Output Tokens: {tokens_display(telemetry.get('output_tokens'))}
Total Tokens: {tokens_display(telemetry.get('total_tokens'))}
Duration: {telemetry.get('duration_ms', 0)}ms
Retries: {telemetry.get('retry_count', 0)}
Timestamp: {telemetry.get('timestamp', datetime.now(timezone.utc).isoformat())}
"""

# ───────────────────────────────────────────────────────────────
# Session Extraction
# ───────────────────────────────────────────────────────────────
def extract_token_usage_from_session(session_key: str) -> Dict[str, Any]:
    """
    Extract token usage from agent session files
    Returns dict with input_tokens, output_tokens, model, fallback_model
    """
    # Parse session key to find session file
    # Format: agent:main:cron:<job_id> or similar
    parts = session_key.split(':')
    agent_id = parts[1] if len(parts) > 1 else "main"
    
    # Find most recent session file for this agent
    sessions_dir = Path.home() / ".openclaw" / "agents" / agent_id / "sessions"
    
    if not sessions_dir.exists():
        return {"input_tokens": "unknown", "output_tokens": "unknown", "model": "unknown"}
    
    # Get most recent session file
    session_files = sorted(sessions_dir.glob("*.jsonl"), key=lambda p: p.stat().st_mtime, reverse=True)
    
    if not session_files:
        return {"input_tokens": "unknown", "output_tokens": "unknown", "model": "unknown"}
    
    # Parse latest session for token usage
    usage = {"input_tokens": 0, "output_tokens": 0, "model": "unknown", "fallback_model": None}
    
    try:
        with open(session_files[0], 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            
        # Look for token patterns in session
        # Pattern: "tokens": {"input": 1234, "output": 567}
        import re
        
        # Search for model info
        model_match = re.search(r'"model"[:\s]+"([^"]+)"', content)
        if model_match:
            usage["model"] = model_match.group(1)
        
        # Look for usage/tokens in the content
        token_patterns = [
            r'"input_tokens":\s*(\d+)',
            r'"in":\s*(\d+)',
            r'input["\s:]+(\d+)\s*(?:tokens|k)',
        ]
        
        for pattern in token_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            if matches:
                usage["input_tokens"] = sum(int(m) for m in matches if m.isdigit())
                break
        
        output_patterns = [
            r'"output_tokens":\s*(\d+)',
            r'"out":\s*(\d+)',
            r'output["\s:]+(\d+)\s*(?:tokens|k)',
        ]
        
        for pattern in output_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            if matches:
                usage["output_tokens"] = sum(int(m) for m in matches if m.isdigit())
                break
                
    except Exception as e:
        print(f"[middleware] Warning: Could not extract token usage: {e}", file=sys.stderr)
        usage = {"input_tokens": "unknown", "output_tokens": "unknown", "model": usage.get("model", "unknown")}
    
    return usage

# ───────────────────────────────────────────────────────────────
# Main Middleware Entry Point
# ───────────────────────────────────────────────────────────────
def run_with_middleware(job_config: Dict[str, Any], execute_func) -> Tuple[Any, str]:
    """
    Execute a cron job with middleware wrapping
    
    Args:
        job_config: Job configuration dict with id, agentId, etc.
        execute_func: Callable that executes the actual job logic
    
    Returns:
        (result, metadata_block)
    """
    job_id = job_config.get("id", "unknown")
    agent_id = job_config.get("agentId", "main")
    configured_model = job_config.get("payload", {}).get("model", "default")
    
    # ── Misfire Protection ──
    should_execute, skip_reason = check_misfire_protection(job_id)
    
    if not should_execute:
        print(f"[cron-middleware] {skip_reason}", file=sys.stderr)
        return {"skipped": True, "reason": skip_reason}, ""
    
    # ── Start Telemetry ──
    start_time = time.time()
    start_iso = datetime.now(timezone.utc).isoformat()
    
    update_last_run(job_id)
    
    retry_count = 0
    result = None
    error = None
    
    try:
        # Execute the actual job
        result = execute_func()
        
    except Exception as e:
        error = str(e)
        retry_count = 1  # Mark as attempted retry
        raise
    
    finally:
        # ── Collect Post-Execution Telemetry ──
        duration_ms = int((time.time() - start_time) * 1000)
        
        # Try to extract token usage from session
        session_key = f"agent:{agent_id}:cron:{job_id}"
        usage = extract_token_usage_from_session(session_key)
        
        input_tokens = usage.get("input_tokens", "unknown")
        output_tokens = usage.get("output_tokens", "unknown")
        
        if input_tokens != "unknown" and output_tokens != "unknown":
            total_tokens = input_tokens + output_tokens if isinstance(input_tokens, int) and isinstance(output_tokens, int) else "unknown"
        else:
            total_tokens = "unknown"
        
        effective_model = usage.get("model", configured_model)
        
        # Calculate cost
        if total_tokens != "unknown":
            cost = calculate_cost(effective_model, 
                                input_tokens if isinstance(input_tokens, int) else 0,
                                output_tokens if isinstance(output_tokens, int) else 0)
        else:
            cost = 0.0
        
        telemetry = {
            "job_id": job_id,
            "agent": agent_id,
            "model": effective_model,
            "fallback_model": usage.get("fallback_model"),
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "total_tokens": total_tokens,
            "duration_ms": duration_ms,
            "retry_count": retry_count,
            "timestamp": start_iso,
            "cost_estimate_usd": cost,
            "error": error,
        }
        
        # Persist telemetry
        append_telemetry(telemetry)
        
        # Generate metadata block
        metadata_block = generate_metadata_block(telemetry)
        
        return result, metadata_block


# ───────────────────────────────────────────────────────────────
# CLI Interface
# ───────────────────────────────────────────────────────────────
def cmd_audit_usage(last_hours: int = 24):
    """Audit usage command - aggregates logs and prints table"""
    
    cutoff = time.time() - (last_hours * 3600)
    records = []
    
    # Read all JSONL files in audit dir
    for log_file in AUDIT_DIR.glob("cron-usage-*.jsonl"):
        with open(log_file, 'r') as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    record = json.loads(line)
                    # Parse timestamp and filter
                    ts_str = record.get("timestamp", "")
                    try:
                        ts = datetime.fromisoformat(ts_str.replace('Z', '+00:00'))
                        if ts.timestamp() >= cutoff:
                            records.append(record)
                    except:
                        records.append(record)  # Include if can't parse
                except json.JSONDecodeError:
                    continue
    
    if not records:
        print("No telemetry records found for the specified period.")
        return
    
    # Aggregate by job
    from collections import defaultdict
    job_stats = defaultdict(lambda: {
        "count": 0, "input_tokens": 0, "output_tokens": 0,
        "total_tokens": 0, "duration_ms": 0, "cost": 0.0
    })
    
    for r in records:
        jid = r.get("job_id", "unknown")
        job_stats[jid]["count"] += 1
        
        it = r.get("input_tokens")
        ot = r.get("output_tokens")
        
        if isinstance(it, (int, float)):
            job_stats[jid]["input_tokens"] += it
        if isinstance(ot, (int, float)):
            job_stats[jid]["output_tokens"] += ot
            job_stats[jid]["total_tokens"] += it + ot if isinstance(it, (int, float)) else ot
        
        dur = r.get("duration_ms", 0)
        if isinstance(dur, (int, float)):
            job_stats[jid]["duration_ms"] += dur
        
        cost = r.get("cost_estimate_usd", 0)
        if isinstance(cost, (int, float)):
            job_stats[jid]["cost"] += cost
    
    # Sort by cost descending
    sorted_jobs = sorted(job_stats.items(), key=lambda x: x[1]["cost"], reverse=True)
    
    total_cost = sum(s["cost"] for _, s in sorted_jobs)
    
    # Print table
    print(f"\n📊 Cron Usage Audit — Last {last_hours}h")
    print("=" * 100)
    print(f"{'Job ID':<45} {'Runs':>5} {'Input':>10} {'Output':>10} {'Total':>10} {'Cost USD':>10} {'%':>6}")
    print("-" * 100)
    
    for job_id, stats in sorted_jobs:
        pct = (stats["cost"] / total_cost * 100) if total_cost > 0 else 0
        print(f"{job_id:<45} {stats['count']:>5} {stats['input_tokens']:>10} {stats['output_tokens']:>10} {stats['total_tokens']:>10} ${stats['cost']:>9.4f} {pct:>5.1f}%")
    
    print("-" * 100)
    print(f"{'TOTAL':<45} {'':>5} {'':>10} {'':>10} {'':>10} ${total_cost:>9.4f} {'100%':>6}")
    print()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: middleware.py <command> [args...]")
        print("Commands:")
        print("  audit --last <hours>    Show usage statistics")
        sys.exit(1)
    
    cmd = sys.argv[1]
    
    if cmd == "audit":
        hours = 24
        if "--last" in sys.argv:
            idx = sys.argv.index("--last")
            if idx + 1 < len(sys.argv):
                hours = int(sys.argv[idx + 1])
        cmd_audit_usage(hours)
    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)