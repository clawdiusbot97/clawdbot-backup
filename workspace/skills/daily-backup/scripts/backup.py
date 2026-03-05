#!/usr/bin/env python3
"""
Daily OpenClaw backup with secret scanning and GitHub push.
"""

import os
import sys
import json
import shutil
import subprocess
import tempfile
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Dict, Set, Tuple

# --- Configuration ---
OPENCLAW_HOME = Path("/home/manpac/.openclaw")
WORKSPACE = OPENCLAW_HOME / "workspace"
CONFIG_FILE = OPENCLAW_HOME / "backup.env"

def load_config():
    """Load configuration from environment and config file."""
    config = {}
    # Try config file
    if CONFIG_FILE.exists():
        with open(CONFIG_FILE, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    config[key.strip()] = value.strip()
    # Environment variables override
    for key in ['BACKUP_GITHUB_REPO', 'BACKUP_GITHUB_TOKEN']:
        env_val = os.getenv(key)
        if env_val is not None:
            config[key] = env_val
    return config

config = load_config()
BACKUP_REPO_URL = config.get('BACKUP_GITHUB_REPO')
BACKUP_TOKEN = config.get('BACKUP_GITHUB_TOKEN')
TELEGRAM_GROUP_ID = "-5130387079"  # Clawdius - Backups

# Patterns to exclude from backup
EXCLUDE_PATTERNS = [
    "**/__pycache__",
    "**/.git",
    "**/.git/**",  # exclude nested git dirs (submodules, vendored repos)
    "**/node_modules",
    "**/venv",
    "**/.venv",
    "**/tmp",
    "**/temp",
    "**/logs",
    "**/*.log",
    "**/*.pid",
    "**/*.lock",
    "**/media/**",
    "**/credentials/**",
    "**/devices/**",
    "**/canvas/**",
    "**/completions/**",
    "**/delivery-queue/**",
    "**/subagents/**",
    "**/telegram/**",
    "**/venvs/**",
    "**/.DS_Store",
    "**/thumbs.db",
]

# Secret patterns (regex)
SECRET_PATTERNS = {
    # API keys (common patterns)
    r'(?i)api[_-]?key["\']?\s*[:=]\s*["\']?([a-zA-Z0-9_\-]{20,})["\']?': '[API_KEY]',
    r'(?i)token["\']?\s*[:=]\s*["\']?([a-zA-Z0-9_\-\.]{20,})["\']?': '[TOKEN]',
    r'(?i)secret["\']?\s*[:=]\s*["\']?([a-zA-Z0-9_\-]{20,})["\']?': '[SECRET]',
    r'(?i)password["\']?\s*[:=]\s*["\']?([^\s"\']{8,})["\']?': '[PASSWORD]',
    r'(?i)pass["\']?\s*[:=]\s*["\']?([^\s"\']{8,})["\']?': '[PASSWORD]',
    # GitHub tokens
    r'gh[pousr]_[a-zA-Z0-9_\-]{36}': '[GITHUB_TOKEN]',
    # Slack tokens
    r'xox[baprs]-[0-9a-zA-Z\-]{10,48}': '[SLACK_TOKEN]',
    # AWS keys
    r'(?i)aws[_-]?access[_-]?key[_-]?id["\']?\s*[:=]\s*["\']?(AKIA[0-9A-Z]{16})["\']?': '[AWS_ACCESS_KEY_ID]',
    r'(?i)aws[_-]?secret[_-]?access[_-]?key["\']?\s*[:=]\s*["\']?([a-zA-Z0-9/+]{40})["\']?': '[AWS_SECRET_ACCESS_KEY]',
    # Encryption keys (hex)
    r'(?i)key["\']?\s*[:=]\s*["\']?([0-9a-f]{64})["\']?': '[ENCRYPTION_KEY]',
    # Private URLs with credentials
    r'https?://[^:]+:[^@]+@[^\s]+': '[PRIVATE_URL_WITH_CREDENTIALS]',
}

# Known safe patterns to skip (e.g., hex strings that are not secrets)
SAFE_PATTERNS = [
    r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',  # UUID
    r'^[0-9a-f]{32}$',  # MD5
    r'^[0-9a-f]{40}$',  # SHA1
    r'^[0-9a-f]{64}$',  # SHA256 (but also could be key; we treat as secret above)
]

# --- Helper functions ---
def log(msg: str, level="INFO"):
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    print(f"[{timestamp}] {level}: {msg}", file=sys.stderr)

def run_command(cmd: List[str], cwd=None, env=None, timeout=300):
    """Run command and return (success, stdout, stderr)."""
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            cwd=cwd,
            env=env,
            timeout=timeout
        )
        return result.returncode == 0, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return False, "", f"Command timed out after {timeout}s"
    except Exception as e:
        return False, "", str(e)

def scan_and_sanitize(content: str, filepath: Path) -> Tuple[str, List[str]]:
    """
    Scan content for secrets, replace with placeholders.
    Returns (sanitized_content, list_of_secrets_found).
    """
    secrets_found = []
    
    # First, check for safe patterns; if entire line matches safe, skip.
    lines = content.split('\n')
    sanitized_lines = []
    
    for line_num, line in enumerate(lines, 1):
        original_line = line
        modified = False
        
        # Skip lines that are obviously safe (like UUIDs)
        skip = False
        for pattern in SAFE_PATTERNS:
            if re.search(pattern, line):
                skip = True
                break
        if skip:
            sanitized_lines.append(line)
            continue
        
        # Apply secret patterns
        for pattern, placeholder in SECRET_PATTERNS.items():
            matches = list(re.finditer(pattern, line))
            for match in matches:
                secret = match.group(1) if match.groups() else match.group(0)
                # Replace the secret part only
                start, end = match.span(1) if match.groups() else match.span()
                line = line[:start] + placeholder + line[end:]
                secrets_found.append(f"{filepath}:{line_num}:{placeholder}")
                modified = True
        
        sanitized_lines.append(line)
    
    return '\n'.join(sanitized_lines), secrets_found

def copy_and_sanitize(src: Path, dst: Path) -> List[str]:
    """Copy file while sanitizing secrets. Returns list of secrets found."""
    secrets = []
    try:
        if src.suffix.lower() in ['.png', '.jpg', '.jpeg', '.gif', '.pdf', '.zip', '.tar', '.gz']:
            # Binary files: copy as-is
            shutil.copy2(src, dst)
            return []
        
        # Text file: read, sanitize, write
        with open(src, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        sanitized, found = scan_and_sanitize(content, src)
        secrets.extend(found)
        
        with open(dst, 'w', encoding='utf-8') as f:
            f.write(sanitized)
        
        return secrets
    except Exception as e:
        log(f"Failed to process {src}: {e}", "ERROR")
        return []

def collect_critical_files(temp_dir: Path) -> Tuple[List[Path], List[str]]:
    """Copy all critical files to temp_dir. Returns (file_list, secrets)."""
    all_secrets = []
    copied_files = []
    
    # 1. Workspace directory (excluding large caches)
    log(f"Collecting workspace from {WORKSPACE}")
    for item in WORKSPACE.rglob("*"):
        if item.is_dir():
            continue
        
        # Check exclude patterns
        rel_path = item.relative_to(WORKSPACE)

        # Hard guard: never include nested git metadata (Path.match is sometimes
        # surprising across Python versions / edge-cases like .git files).
        if ".git" in rel_path.parts:
            continue

        skip = False
        for pattern in EXCLUDE_PATTERNS:
            if rel_path.match(pattern):
                skip = True
                break
        if skip:
            continue
        
        # Create destination path
        dst = temp_dir / "workspace" / rel_path
        dst.parent.mkdir(parents=True, exist_ok=True)
        
        secrets = copy_and_sanitize(item, dst)
        all_secrets.extend(secrets)
        copied_files.append(dst)
    
    # 2. Main config file
    config_file = OPENCLAW_HOME / "openclaw.json"
    if config_file.exists():
        dst = temp_dir / "config" / "openclaw.json"
        dst.parent.mkdir(parents=True, exist_ok=True)
        secrets = copy_and_sanitize(config_file, dst)
        all_secrets.extend(secrets)
        copied_files.append(dst)
    
    # 3. Memory directory
    memory_dir = OPENCLAW_HOME / "memory"
    if memory_dir.exists():
        for item in memory_dir.rglob("*"):
            if item.is_file():
                rel = item.relative_to(memory_dir)
                dst = temp_dir / "memory" / rel
                dst.parent.mkdir(parents=True, exist_ok=True)
                secrets = copy_and_sanitize(item, dst)
                all_secrets.extend(secrets)
                copied_files.append(dst)
    
    # 4. Cron jobs
    cron_file = OPENCLAW_HOME / "cron" / "jobs.json"
    if cron_file.exists():
        dst = temp_dir / "cron" / "jobs.json"
        dst.parent.mkdir(parents=True, exist_ok=True)
        secrets = copy_and_sanitize(cron_file, dst)
        all_secrets.extend(secrets)
        copied_files.append(dst)
    
    # 5. Agents' SOUL files
    agents_dir = OPENCLAW_HOME / "agents"
    if agents_dir.exists():
        for agent_dir in agents_dir.iterdir():
            if agent_dir.is_dir():
                soul_file = agent_dir / "SOUL.md"
                if soul_file.exists():
                    dst = temp_dir / "agents" / agent_dir.name / "SOUL.md"
                    dst.parent.mkdir(parents=True, exist_ok=True)
                    secrets = copy_and_sanitize(soul_file, dst)
                    all_secrets.extend(secrets)
                    copied_files.append(dst)
    
    return copied_files, all_secrets

def git_push(repo_dir: Path, commit_message: str) -> bool:
    """Commit and push changes to remote repo."""
    # Check if repo exists
    git_dir = repo_dir / ".git"
    if not git_dir.exists():
        log("Git repository not initialized", "ERROR")
        return False
    
    # Add all files
    success, out, err = run_command(["git", "add", "."], cwd=repo_dir)
    if not success:
        log(f"git add failed: {err}", "ERROR")
        return False
    
    # Commit
    success, out, err = run_command(["git", "commit", "-m", commit_message], cwd=repo_dir)
    if not success:
        if "nothing to commit" in err.lower():
            log("No changes to commit", "INFO")
            return True  # No changes is okay
        log(f"git commit failed: {err}", "ERROR")
        return False
    
    # Push
    success, out, err = run_command(["git", "push"], cwd=repo_dir)
    if not success:
        log(f"git push failed: {err}", "ERROR")
        return False
    
    log(f"Pushed commit: {out}", "INFO")
    return True

def main():
    log("Starting daily OpenClaw backup")
    
    # Validate environment
    if not BACKUP_REPO_URL:
        log("BACKUP_GITHUB_REPO not set. Set it in environment or in ~/.openclaw/backup.env", "ERROR")
        log("Example backup.env:", "ERROR")
        log("BACKUP_GITHUB_REPO=https://github.com/yourusername/openclaw-backup.git", "ERROR")
        log("BACKUP_GITHUB_TOKEN=ghp_...", "ERROR")
        sys.exit(1)
    
    # Create temporary directory
    temp_root = Path(os.getenv("BACKUP_TEMP_DIR", "/tmp/openclaw-backup"))
    temp_root.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    temp_dir = temp_root / f"backup-{timestamp}"
    temp_dir.mkdir(parents=True, exist_ok=True)
    
    try:
        # Step 1: Collect and sanitize files
        log("Collecting critical files...")
        copied_files, secrets = collect_critical_files(temp_dir)
        log(f"Copied {len(copied_files)} files, found {len(secrets)} potential secrets")
        
        if secrets:
            log("Secrets found (replaced with placeholders):")
            for secret in secrets[:10]:  # Limit output
                log(f"  {secret}")
            if len(secrets) > 10:
                log(f"  ... and {len(secrets) - 10} more")
        
        # Step 2: Prepare git repository
        repo_dir = temp_root / "repo"
        if not (repo_dir / ".git").exists():
            log(f"Cloning repository {BACKUP_REPO_URL}")
            # Use token in URL if provided
            repo_url = BACKUP_REPO_URL
            if BACKUP_TOKEN:
                # Insert token into URL
                if repo_url.startswith("https://"):
                    repo_url = repo_url.replace("[PRIVATE_URL_WITH_CREDENTIALS]
                elif repo_url.startswith("git@"):
                    # SSH URL, token not applicable
                    pass
            
            success, out, err = run_command(["git", "clone", repo_url, str(repo_dir)])
            if not success:
                log(f"Failed to clone repository: {err}", "ERROR")
                sys.exit(1)
        else:
            log("Pulling latest changes")
            success, out, err = run_command(["git", "pull"], cwd=repo_dir)
            if not success:
                log(f"Failed to pull: {err}", "WARN")
                # Continue anyway
        
        # Step 3: Copy sanitized files into repo
        log("Copying files to repository")
        # Clear existing content (except .git)
        for item in repo_dir.iterdir():
            if item.name == ".git":
                continue
            if item.is_file():
                item.unlink()
            else:
                shutil.rmtree(item)
        
        # Copy new content
        for item in temp_dir.iterdir():
            dest = repo_dir / item.name
            if item.is_file():
                shutil.copy2(item, dest)
            else:
                shutil.copytree(item, dest)
        
        # Step 4: Commit and push
        commit_msg = f"OpenClaw backup {timestamp}\n\n"
        commit_msg += f"Files: {len(copied_files)}\n"
        commit_msg += f"Secrets sanitized: {len(secrets)}\n"
        if secrets:
            commit_msg += "Secrets replaced: " + ", ".join(set(s.split(':')[-1] for s in secrets))
        
        log("Committing and pushing...")
        success = git_push(repo_dir, commit_msg)
        
        if success:
            # Send Telegram confirmation
            msg = f"✅ Backup completed: {len(copied_files)} files, {len(secrets)} secrets sanitized"
            # We'll rely on cron delivery to send to Telegram group
            print(f"TELEGRAM_CONFIRMATION: {msg}")
            log("Backup completed successfully")
        else:
            log("Backup failed during git operations", "ERROR")
            sys.exit(1)
        
    finally:
        # Cleanup temporary directory (optional)
        # shutil.rmtree(temp_dir, ignore_errors=True)
        pass

if __name__ == "__main__":
    main()