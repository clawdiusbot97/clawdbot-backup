#!/usr/bin/env python3
"""
Nightly Healthcheck – no LLM.
Checks systemd services, CPU/RAM/Disk, error logs.
If gateway down, exits early.
"""

import os
import sys
import subprocess
import json
import logging
from pathlib import Path
from datetime import datetime, timedelta

# Add workspace to path
workspace = Path(__file__).parent.parent.parent
sys.path.insert(0, str(workspace))

import logging
logger = logging.getLogger(__name__)

def check_systemd(service_name):
    """Check if a systemd service is active."""
    commands = (
        ["systemctl", "--user", "is-active", "--quiet", service_name],
        ["systemctl", "is-active", "--quiet", service_name],
    )
    for cmd in commands:
        try:
            result = subprocess.run(cmd, capture_output=True, timeout=10)
            if result.returncode == 0:
                return True
        except subprocess.TimeoutExpired:
            logger.warning(f"Timeout checking {service_name} with {' '.join(cmd)}")
        except Exception as e:
            logger.debug(f"Error checking {service_name} with {' '.join(cmd)}: {e}")
    return False

def unit_exists(service_name):
    """Check whether a systemd unit exists in user or system scope."""
    commands = (
        ["systemctl", "--user", "status", service_name],
        ["systemctl", "status", service_name],
    )
    for cmd in commands:
        try:
            result = subprocess.run(
                cmd,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                timeout=10
            )
            # 0=active/loaded, 3=inactive/dead but unit exists
            if result.returncode in (0, 3):
                return True
        except subprocess.TimeoutExpired:
            logger.warning(f"Timeout checking unit existence for {service_name}")
        except Exception as e:
            logger.debug(f"Error checking unit existence for {service_name}: {e}")
    return False

def check_openclaw_gateway():
    """Check if OpenClaw gateway is reachable."""
    try:
        result = subprocess.run(
            ["openclaw", "status"],
            capture_output=True,
            text=True,
            timeout=30
        )
        return result.returncode == 0 and "reachable" in result.stdout.lower()
    except Exception as e:
        logger.error(f"OpenClaw gateway check failed: {e}")
        return False

def check_disk_usage(threshold=85):
    """Check disk usage percentage."""
    try:
        result = subprocess.run(
            ["df", "/home", "--output=pcent"],
            capture_output=True,
            text=True,
            timeout=10
        )
        lines = result.stdout.strip().split("\n")
        if len(lines) > 1:
            pct = int(lines[1].strip().replace("%", ""))
            return pct < threshold, pct
        return True, 0
    except Exception as e:
        logger.error(f"Disk check failed: {e}")
        return False, 100

def check_error_logs(log_path, max_errors=10):
    """Scan recent error logs for critical patterns."""
    error_keywords = ["ERROR", "CRITICAL", "failed", "exception", "panic"]
    errors = []
    
    if not log_path.exists():
        logger.warning(f"Log file not found: {log_path}")
        return errors
    
    try:
        # Read last ~1000 lines
        with open(log_path, "r", encoding="utf-8", errors="ignore") as f:
            lines = f.readlines()[-1000:]
        
        for line in lines:
            if any(kw in line.upper() for kw in error_keywords):
                errors.append(line.strip())
                if len(errors) >= max_errors:
                    break
    except Exception as e:
        logger.error(f"Error reading logs {log_path}: {e}")
    
    return errors

def resolve_log_path():
    """Return the first existing log path from candidates."""
    candidates = [
        workspace / "logs" / "openclaw.log",
        Path("/var/log/openclaw-gateway.log"),
        Path("/var/log/openclaw.log"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return None

def generate_report(checks):
    """Generate healthcheck report markdown."""
    date = datetime.now().strftime("%Y-%m-%d")
    report_dir = workspace / "reports" / "nightly"
    report_dir.mkdir(parents=True, exist_ok=True)
    
    report_path = report_dir / f"health_{date}.md"
    
    lines = []
    lines.append(f"# Nightly Healthcheck – {date}")
    lines.append(f"*Generated at {datetime.now().isoformat()}*")
    lines.append("")
    
    # Summary table
    lines.append("## Summary")
    lines.append("")
    lines.append("| Check | Status | Details |")
    lines.append("|-------|--------|---------|")
    
    for check in checks:
        status = "✅" if check["ok"] else "❌"
        lines.append(f"| {check['name']} | {status} | {check.get('details', '')} |")
    
    lines.append("")
    
    # Error logs section
    errors = next(
        (c.get("errors", []) for c in checks if c["name"].startswith("Error Logs")),
        []
    )
    if errors:
        lines.append("## Recent Errors")
        lines.append("")
        for err in errors[:5]:  # Show top 5
            lines.append(f"- `{err}`")
        lines.append("")
    
    # Recommendations
    lines.append("## Recommendations")
    lines.append("")
    failed = [c for c in checks if not c["ok"]]
    if not failed:
        lines.append("- All systems nominal.")
    else:
        for check in failed:
            lines.append(f"- **{check['name']}**: {check.get('recommendation', 'Investigate')}")
    
    lines.append("")
    lines.append("---")
    
    report_content = "\n".join(lines)
    
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report_content)
    
    logger.info(f"Healthcheck report saved to {report_path}")
    return report_path

def main():
    logger.info("Starting nightly healthcheck")
    
    checks = []
    
    # 1. OpenClaw gateway
    gateway_ok = check_openclaw_gateway()
    checks.append({
        "name": "OpenClaw Gateway",
        "ok": gateway_ok,
        "details": "Reachable" if gateway_ok else "Not responding",
        "recommendation": "Restart openclaw-gateway service"
    })
    
    if not gateway_ok:
        logger.critical("OpenClaw gateway down")
        # Exit with error code to stop pipeline
        sys.exit(1)
    
    # 2. Systemd services (required)
    services = ["openclaw-gateway"]
    for svc in services:
        ok = check_systemd(svc)
        checks.append({
            "name": f"Systemd: {svc}",
            "ok": ok,
            "details": "Active" if ok else "Inactive",
            "recommendation": f"systemctl restart {svc}"
        })

    # Optional systemd units: skip if unit does not exist.
    optional_services = ["cron"]
    for svc in optional_services:
        if not unit_exists(svc):
            checks.append({
                "name": f"Systemd: {svc}",
                "ok": True,
                "details": "SKIPPED (unit not found)",
                "recommendation": ""
            })
            continue

        ok = check_systemd(svc)
        checks.append({
            "name": f"Systemd: {svc}",
            "ok": ok,
            "details": "Active" if ok else "Inactive",
            "recommendation": f"systemctl restart {svc}"
        })
    
    # 3. Disk usage
    disk_ok, disk_pct = check_disk_usage(threshold=90)
    checks.append({
        "name": "Disk Usage",
        "ok": disk_ok,
        "details": f"{disk_pct}% used",
        "recommendation": "Clean up old logs or increase storage"
    })
    
    if disk_pct > 95:
        logger.critical(f"Disk usage critical: {disk_pct}%")
    
    # 4. Error logs
    log_path = resolve_log_path()
    if log_path is None:
        checks.append({
            "name": "Error Logs (last 24h)",
            "ok": True,
            "details": "SKIPPED (no log file found)",
            "errors": [],
            "recommendation": "Ensure at least one expected log file is available"
        })
    else:
        errors = check_error_logs(log_path, max_errors=10)
        checks.append({
            "name": "Error Logs (last 24h)",
            "ok": len(errors) == 0,
            "details": f"{len(errors)} errors found" if errors else "No critical errors",
            "errors": errors,
            "recommendation": "Review logs for recurring issues"
        })
    
    # Generate report
    report_path = generate_report(checks)
    
    # Count failures
    failures = sum(1 for c in checks if not c["ok"])
    logger.info(f"Healthcheck completed: {failures} failures")
    
    # Exit with appropriate code (0 = OK, 1 = issues but not critical)
    if failures == 0:
        logger.info("Healthcheck: all systems nominal")
        sys.exit(0)
    else:
        logger.warning(f"Healthcheck: {failures} non‑critical issues")
        sys.exit(0)  # Continue pipeline

if __name__ == "__main__":
    main()