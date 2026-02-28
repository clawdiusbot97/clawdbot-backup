#!/bin/bash
# OpenClaw Daily Backup - deterministic, no LLM, secret sanitization
set -euo pipefail

# --- Configuration ---
OPENCLAW_HOME="/home/manpac/.openclaw"
BACKUP_REPO="git@github.com:clawdiusbot97/clawdbot-backup.git"
BACKUP_DIR="/tmp/openclaw-backup-$(date +%Y%m%d-%H%M%S)"
CLONE_DIR="/tmp/openclaw-backup-repo"
TELEGRAM_GROUP="-5130387079"
LOG_FILE="/tmp/openclaw-backup-$(date +%Y%m%d).log"

# Secret patterns (regex) - replace with placeholders
declare -A SECRET_PATTERNS=(
    ["sk-[a-zA-Z0-9]{48}"]="[OPENAI_API_KEY]"
    ["xoxb-[0-9a-zA-Z-]{10,48}"]="[SLACK_BOT_TOKEN]"
    ["xapp-[0-9a-zA-Z-]{10,48}"]="[SLACK_APP_TOKEN]"
    ["gh[pousr]_[a-zA-Z0-9_]{36}"]="[GITHUB_TOKEN]"
    ["AKIA[0-9A-Z]{16}"]="[AWS_ACCESS_KEY_ID]"
    ["[0-9a-zA-Z/+]{40}"]="[AWS_SECRET_ACCESS_KEY]"
    ["Bearer [a-zA-Z0-9._-]{100,}"]="[BEARER_TOKEN]"
    ["PRIVATE_KEY[[:space:]]*=[[:space:]]*['\"][^'\"]+['\"]"]="[PRIVATE_KEY]"
    ["SECRET[[:space:]]*=[[:space:]]*['\"][^'\"]+['\"]"]="[SECRET]"
    ["TOKEN[[:space:]]*=[[:space:]]*['\"][^'\"]+['\"]"]="[TOKEN]"
    ["PASSWORD[[:space:]]*=[[:space:]]*['\"][^'\"]+['\"]"]="[PASSWORD]"
    ["https?://[^:]+:[^@]+@[^[:space:]]+"]="[PRIVATE_URL_WITH_CREDENTIALS]"
)

# Files/directories to backup
BACKUP_PATHS=(
    "$OPENCLAW_HOME/workspace"
    "$OPENCLAW_HOME/skills"
    "$OPENCLAW_HOME/cron/jobs.json"
    "$OPENCLAW_HOME/openclaw.json"
    "$OPENCLAW_HOME/memory"
    "$OPENCLAW_HOME/agents"
    "$OPENCLAW_HOME/models.json"
)

# Exclude patterns
EXCLUDE_PATTERNS=(
    "__pycache__"
    ".git"
    "node_modules"
    "venv"
    ".venv"
    "*.log"
    "*.pid"
    "*.lock"
    "media"
    "credentials"
    "devices"
    "canvas"
    "completions"
    "delivery-queue"
    "subagents"
    "telegram"
    "venvs"
    ".DS_Store"
    "thumbs.db"
)

# --- Helper functions ---
log() {
    echo "[$(date -u +'%Y-%m-%d %H:%M:%S UTC')] $*" | tee -a "$LOG_FILE"
}

error() {
    log "❌ $*"
    exit 1
}

sanitize_file() {
    local file="$1"
    local temp_file="${file}.sanitized"
    
    if [[ ! -f "$file" ]] || file -b --mime-encoding "$file" | grep -q binary; then
        # Skip binary files
        cp "$file" "$temp_file"
        return
    fi
    
    # Initial copy
    cp "$file" "$temp_file"
    
    # Apply each secret pattern
    for pattern in "${!SECRET_PATTERNS[@]}"; do
        local placeholder="${SECRET_PATTERNS[$pattern]}"
        # Use sed with extended regex
        sed -E -i "s|$pattern|$placeholder|g" "$temp_file" 2>/dev/null || true
    done
    
    # Additional generic secret patterns
    sed -E -i 's|["'"'"']?[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}["'"'"']?|[EMAIL_ADDRESS]|g' "$temp_file"
    sed -E -i 's|\b[0-9]{4}[ -]?[0-9]{4}[ -]?[0-9]{4}[ -]?[0-9]{4}\b|[CREDIT_CARD]|g' "$temp_file"
    
    # Replace the original with sanitized version
    mv "$temp_file" "$file"
}

should_exclude() {
    local path="$1"
    for pattern in "${EXCLUDE_PATTERNS[@]}"; do
        if [[ "$path" == *"$pattern"* ]]; then
            return 0
        fi
    done
    return 1
}

# --- Main backup process ---
main() {
    log "Starting OpenClaw backup to $BACKUP_REPO"
    
    # 1. Create temporary directories
    mkdir -p "$BACKUP_DIR"
    mkdir -p "$(dirname "$LOG_FILE")"
    
    # 2. Collect all files for backup
    log "Collecting files from $OPENCLAW_HOME"
    
    for item in "${BACKUP_PATHS[@]}"; do
        if [[ ! -e "$item" ]]; then
            log "⚠️  Path does not exist: $item"
            continue
        fi
        
        local rel_path="${item#$OPENCLAW_HOME/}"
        local dest="$BACKUP_DIR/$rel_path"
        
        if [[ -d "$item" ]]; then
            # Copy directory with rsync for better exclude handling
            rsync -av --exclude-from=<(printf "%s\n" "${EXCLUDE_PATTERNS[@]}") "$item/" "$dest/" 2>/dev/null || true
        else
            # Copy single file
            mkdir -p "$(dirname "$dest")"
            cp "$item" "$dest"
        fi
    done
    
    # 3. Find and copy SOUL.md, MEMORY.md files
    find "$OPENCLAW_HOME" -name "SOUL.md" -o -name "MEMORY.md" -o -name "*.soul" -o -name "*.memory" | while read -r file; do
        if should_exclude "$file"; then
            continue
        fi
        local rel_path="${file#$OPENCLAW_HOME/}"
        local dest="$BACKUP_DIR/$rel_path"
        mkdir -p "$(dirname "$dest")"
        cp "$file" "$dest"
    done
    
    # 4. Find and copy gateway config
    find "$OPENCLAW_HOME" -name "*gateway*" -type f \( -name "*.json" -o -name "*.yaml" -o -name "*.yml" \) | while read -r file; do
        if should_exclude "$file"; then
            continue
        fi
        local rel_path="${file#$OPENCLAW_HOME/}"
        local dest="$BACKUP_DIR/$rel_path"
        mkdir -p "$(dirname "$dest")"
        cp "$file" "$dest"
    done
    
    # 5. Sanitize secrets in all text files
    log "Sanitizing secrets in backup files..."
    find "$BACKUP_DIR" -type f \( -name "*.json" -o -name "*.yaml" -o -name "*.yml" -o -name "*.md" -o -name "*.txt" -o -name "*.py" -o -name "*.sh" -o -name "*.js" -o -name "*.ts" \) | while read -r file; do
        sanitize_file "$file"
    done
    
    # 6. Clone or update backup repo
    if [[ -d "$CLONE_DIR/.git" ]]; then
        log "Updating existing repository..."
        cd "$CLONE_DIR"
        git pull --rebase || error "Failed to pull from repository"
    else
        log "Cloning repository..."
        git clone "$BACKUP_REPO" "$CLONE_DIR" || error "Failed to clone repository"
        cd "$CLONE_DIR"
    fi
    
    # 7. Clear existing content (except .git) and copy new backup
    log "Copying sanitized backup to repository..."
    find "$CLONE_DIR" -mindepth 1 -maxdepth 1 -not -name ".git" -exec rm -rf {} \;
    cp -r "$BACKUP_DIR"/* "$CLONE_DIR/" 2>/dev/null || true
    
    # 8. Generate commit message
    local changes_summary=""
    if git status --porcelain | grep -q "."; then
        changes_summary=$(git status --porcelain | head -5 | sed 's/^/  /' | tr '\n' ';' | cut -c1-100)
    else
        changes_summary="no file changes"
    fi
    
    local commit_msg="backup $(date +%Y-%m-%d) – $changes_summary"
    
    # 9. Commit and push
    log "Committing changes..."
    git add -A
    if git diff --cached --quiet; then
        log "No changes to commit"
        echo "✅ OpenClaw backup completed – $(date +%Y-%m-%d) (no changes)" | tee -a "$LOG_FILE"
        return 0
    fi
    
    git commit -m "$commit_msg" || error "Failed to commit"
    
    log "Pushing to repository..."
    git push || error "Failed to push to repository"
    
    # 10. Cleanup
    log "Cleaning up temporary files..."
    rm -rf "$BACKUP_DIR"
    
    # 11. Success message
    local success_msg="✅ OpenClaw backup completed – $(date +%Y-%m-%d)"
    log "$success_msg"
    echo "$success_msg"
    
    return 0
}

# --- Telegram notification wrapper ---
notify_telegram() {
    local message="$1"
    # This would need proper Telegram bot integration
    # For now, just log it
    log "Telegram notification: $message"
    echo "$message"
}

# --- Execute with error handling ---
if main; then
    notify_telegram "✅ OpenClaw backup completed – $(date +%Y-%m-%d)"
    exit 0
else
    notify_telegram "❌ OpenClaw backup FAILED – $(tail -n 5 "$LOG_FILE" 2>/dev/null || echo "unknown error")"
    exit 1
fi