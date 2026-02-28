# Skill: gmail_fetch_labeled

**Purpose:** Fetch Gmail emails by predefined labels, download attachments (PDFs), and return structured data for downstream parsing.

## Inputs
- **Account:** `tachipachi9797@gmail.com` (or configurable)
- **Labels:** `ITAU/EstadoDeCuenta`, `ITAU/AvisosConsumo`
- **Since:** Timestamp of last successful run (ISO 8601)
- **Limit:** Max 50 emails per label (configurable)

## Outputs
- **List of email objects** (JSON) containing:
  - `id` (Gmail message ID)
  - `subject`
  - `from`
  - `date` (received timestamp)
  - `body` (plain text + HTML if available)
  - `attachments`: array of `{filename, mimeType, contentBase64}`
  - `labels` (applied labels)
  - `snippet` (first 200 chars)

## Dependencies
- **`gog` CLI** with Gmail plugin enabled
- **Gmail API access** (OAuth2 credentials configured in `gog`)

## How It Works

### 1. Query Construction
Build Gmail search query:
```
label:ITAU/EstadoDeCuenta OR label:ITAU/AvisosConsumo after:2026/02/17
```
- `after:` uses date from checkpoint file.
- Combine with `OR` to fetch both label types.

### 2. Fetch via `gog gmail`
```bash
gog gmail list \
  --account tachipachi9797@gmail.com \
  --query "label:ITAU/EstadoDeCuenta OR label:ITAU/AvisosConsumo after:2026/02/17" \
  --limit 50 \
  --json
```

### 3. Download Full Message & Attachments
For each message ID:
```bash
# Get full message
gog gmail get <messageId> --account tachipachi9797@gmail.com --json

# Download attachments (if any)
gog gmail attachments get <messageId> <attachmentId> --account ... --output /tmp/
```

### 4. Parse & Structure
- Decode base64 body parts.
- Identify MIME type: `text/plain`, `text/html`, `application/pdf`.
- For PDFs: store base64 content (or save to temp file for later parsing).

## Checkpointing
After successful fetch, update checkpoint file:
```json
{
  "last_run": "2026-02-18T08:30:00Z",
  "last_message_id": "abcdef123456",
  "labels_processed": ["ITAU/EstadoDeCuenta", "ITAU/AvisosConsumo"]
}
```

**Checkpoint location:** `data/finance/itau/checkpoint.json`

## Error Handling
- **No new emails:** Return empty array, still update checkpoint.
- **Label missing:** Create label via `gog gmail labels create ...` (idempotent).
- **API quota exceeded:** Exponential backoff, log warning.
- **Attachment download fail:** Skip that attachment, continue.

## Configuration
Set in OpenClaw config or environment:
```json
{
  "skills": {
    "gmail_fetch_labeled": {
      "account": "tachipachi9797@gmail.com",
      "labels": ["ITAU/EstadoDeCuenta", "ITAU/AvisosConsumo"],
      "limit": 50,
      "checkpoint_path": "data/finance/itau/checkpoint.json"
    }
  }
}
```

## Example Usage (Manual)
```bash
sessions_spawn agentId=researcher task="Run gmail_fetch_labeled skill. Fetch all new emails under labels ITAU/EstadoDeCuenta and ITAU/AvisosConsumo since yesterday. Return structured JSON."
```

## Related Skills
- `itau_parser` – consumes output of this skill.
- `spend_categorizer` – uses parsed transactions.

---
*Skill version: 1.0 | Last updated: 2026‑02‑18*