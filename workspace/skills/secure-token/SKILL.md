---
name: secure-token
description: Handle sensitive tokens and credentials without exposing them to LLM prompts.
metadata:
  {
    "openclaw": {
      "emoji": "🔐",
      "tags": ["security", "credentials", "git", "github"]
    }
  }
---

# secure-token

**Goal:** Keep tokens, API keys, and passwords out of LLM prompts and chat history. Use local files, environment variables, or git credential helpers.

## Why

- LLM providers may log prompts for debugging/improvement.
- Chat transcripts may be stored and later reviewed.
- Tokens in plain text can be accidentally shared.
- **Rule:** Never type a token directly into a chat message.

## Safe patterns

### 1. **Temporary files** (recommended for one‑time setup)

```bash
# User creates a temporary file
echo "ghp_..." > /tmp/github-token.txt
chmod 600 /tmp/github-token.txt

# Assistant reads it without echoing
TOKEN=$(cat /tmp/github-token.txt)
rm /tmp/github-token.txt

# Use token in git credentials
git config --global credential.helper store
echo "[PRIVATE_URL_WITH_CREDENTIALS] >> ~/.git-credentials
```

**Pros:** Simple, ephemeral, no env var persistence.  
**Cons:** File remains on disk until deleted.

### 2. **Environment variables** (for repeated use)

```bash
# Set in shell before starting OpenClaw
export GITHUB_TOKEN="ghp_..."

# In OpenClaw session, use without echoing
exec command:"git clone [PRIVATE_URL_WITH_CREDENTIALS]
```

**Pros:** No file left on disk.  
**Cons:** Must be set per shell session; risk of exposure via `ps`.

### 3. **Git credential helper** (best for Git)

```bash
# Store token once
git config --global credential.helper store
echo "[PRIVATE_URL_WITH_CREDENTIALS] >> ~/.git-credentials

# Then git commands work transparently
git clone https://github.com/user/repo.git
```

**Pros:** Native, secure, automatic.  
**Cons:** Only for Git.

### 4. **gh CLI with token** (GitHub CLI)

```bash
# Login with token from file
gh auth login --with-token < /tmp/github-token.txt
```

**Pros:** Integrated with GitHub API, token stored in `~/.config/gh/hosts.yml`.  
**Cons:** Requires `gh` installed.

### 5. **OpenClaw tool wrappers** (future)

```bash
# Hypothetical secure tool
secure_token action:read from:/tmp/token.txt use:github
```

Not yet implemented; today use patterns 1–4.

## Common workflows

### GitHub token setup

```bash
# 1. User creates token file
echo "YOUR_TOKEN" > /tmp/token.txt

# 2. Assistant reads and configures
TOKEN=$(cat /tmp/token.txt)
git config --global credential.helper store
echo "[PRIVATE_URL_WITH_CREDENTIALS] >> ~/.git-credentials
rm /tmp/token.txt

# 3. Test
git ls-remote https://github.com/clawdiusbot97/test-repo 2>&1 | head -5
```

### API key for external service

```bash
# Store in env var before session
export OPENROUTER_API_KEY="sk-or-..."

# Use in tool calls without echoing
exec command:"curl -H 'Authorization: Bearer ${OPENROUTER_API_KEY}' ..."
```

### SSH keys

```bash
# Already file‑based; just ensure path is correct
exec command:"ssh -i /path/to/private_key user@host"
```

## What NOT to do

❌ **Never paste token in chat:**  
`Here's my token: ghp_abcdef...`

❌ **Never embed in prompt:**  
`Please use token ghp_... to clone the repo.`

❌ **Never log token in output:**  
`echo "Token is ${TOKEN}"` (even if hidden, might leak via tool output).

❌ **Never commit tokens to git:**  
Add `.git-credentials`, `*.token`, `*.key` to `.gitignore`.

## Emergency cleanup

If a token was accidentally exposed:

1. **Revoke it immediately** (GitHub → Settings → Tokens).
2. **Rotate** any related credentials.
3. **Check logs** for unintended persistence.
4. **Notify** if shared in group chat.

## Related skills

- `git` – for credential‑helper usage.
- `gh` – GitHub CLI with token auth.
- `gog` – Google OAuth (uses OAuth flow, not raw tokens).