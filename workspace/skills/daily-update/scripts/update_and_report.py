#!/usr/bin/env python3
"""
Daily OpenClaw update and maintenance routine.
Runs openclaw update, restarts gateway, reports results to Telegram.
"""

import subprocess
import sys
import os
from datetime import datetime, timezone

def run_command(cmd, timeout=1200):
    """Run command and capture stdout, stderr, returncode."""
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=True,
            text=True,
            timeout=timeout,
            env={**os.environ, 'PATH': '/home/manpac/.npm-global/bin:' + os.environ.get('PATH', '')}
        )
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return -1, "", f"Command timed out after {timeout}s"
    except Exception as e:
        return -2, "", str(e)

def main():
    # Step 1: Check current version before update
    print("Checking current OpenClaw version...", file=sys.stderr)
    rc, out, err = run_command("/home/manpac/.npm-global/bin/openclaw update status")
    pre_status = out if out else err
    print("Pre-update status:", file=sys.stderr)
    print(pre_status, file=sys.stderr)
    
    # Step 2: Run update
    print("\nRunning openclaw update...", file=sys.stderr)
    # Use --yes to skip confirmation, no --no-restart to allow restart
    rc, out, err = run_command("/home/manpac/.npm-global/bin/openclaw update --yes")
    
    # Step 3: Check post-update status
    print("\nChecking post-update status...", file=sys.stderr)
    rc_post, out_post, err_post = run_command("/home/manpac/.npm-global/bin/openclaw update status")
    post_status = out_post if out_post else err_post
    
    # Step 4: Format report
    lines = []
    lines.append("🦞 OpenClaw Daily Update Report")
    lines.append(f"*{datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}*")
    lines.append("")
    
    # Update result
    if rc == 0:
        lines.append("✅ **Update succeeded**")
        if "updated to" in out or "Update complete" in out:
            # Extract version info
            for line in out.split('\n'):
                if "updated to" in line or "Update complete" in line:
                    lines.append(f"   {line.strip()}")
        else:
            lines.append("   (No version change detected)")
    else:
        lines.append("❌ **Update failed**")
        lines.append(f"   Exit code: {rc}")
        if err:
            lines.append(f"   Error: {err[:200]}")
        else:
            lines.append("   (No error output)")
    
    lines.append("")
    
    # Before/after status
    lines.append("📊 **Status before:**")
    for line in pre_status.split('\n')[:5]:
        if line.strip():
            lines.append(f"   {line}")
    
    lines.append("")
    lines.append("📊 **Status after:**")
    for line in post_status.split('\n')[:5]:
        if line.strip():
            lines.append(f"   {line}")
    
    lines.append("")
    
    # Gateway restart status
    if rc == 0:
        lines.append("🔄 **Gateway restart:** Update process includes restart.")
    else:
        lines.append("🔄 **Gateway restart:** Not performed due to update failure.")
    
    lines.append("")
    lines.append("🔧 **Next steps:**")
    if rc != 0:
        lines.append("   - Check logs at ~/.openclaw/logs/gateway.log")
        lines.append("   - Manual intervention may be needed")
    else:
        lines.append("   - System is up to date")
    
    # Output report for Telegram
    report = "\n".join(lines)
    print(report)
    
    # Also print to stderr for logging
    print("\n--- Full update output ---", file=sys.stderr)
    print(out, file=sys.stderr)
    if err:
        print("\n--- Errors ---", file=sys.stderr)
        print(err, file=sys.stderr)
    
    # Exit with same code as update
    sys.exit(rc if rc != -1 else 1)

if __name__ == "__main__":
    main()