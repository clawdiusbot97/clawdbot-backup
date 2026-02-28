# Skill: itau_parser

**Purpose:** Parse Itaú credit card emails (monthly statements & purchase approvals) into structured transaction records.

## Inputs
- **Email objects** from `gmail_fetch_labeled` skill (JSON array)
- **Checkpoint** of already‑processed emails (optional, for idempotence)

## Outputs
- **Transaction records** (JSON array) with schema:
```json
[
  {
    "date": "2026-02-15",
    "merchant": "Supermercado Disco",
    "amount": 1250.50,
    "currency": "UYU",
    "installments": {"current": 1, "total": 1},
    "category": "food",
    "source": "statement",
    "status": "cleared",
    "raw_ref": "msg:abc123, page:2"
  }
]
```
- **Parsing statistics** (counts per email type, failures)
- **Checkpoint update** with last processed email IDs

## Email Type Detection

### 1. Monthly Statement (`estado de cuenta`)
- **Subject contains:** `"estado de cuenta"` (case‑insensitive)
- **Format:** PDF attachment (primary) + HTML body (fallback)
- **Parsing targets:**
  - Transaction table (date, merchant, amount, installments)
  - Statement period (month/year)
  - Card number (last 4 digits)

### 2. Purchase Approval (`Aviso de consumo`)
- **Subject contains:** `"Aviso de consumo"` or `"consumo"`
- **Format:** Plain text or HTML body (no PDF)
- **Parsing targets:**
  - Merchant name
  - Amount
  - Date (often missing → use email received date)
  - Approval status

## Parsing Strategies

### PDF Statement Parsing
**Tools:** `pdftotext` (poppler‑utils) preferred; fallback to Python PDF libraries.

**Steps:**
1. Convert PDF to text: `pdftotext -layout statement.pdf -`
2. Locate transaction table (look for headers: `Fecha`, `Comercio`, `Importe`, `Cuotas`)
3. Extract rows using regex patterns:
   - Date: `\d{2}/\d{2}/\d{4}`
   - Merchant: `[A-Za-zÁÉÍÓÚáéíóúÑñ\s\.\-]+`
   - Amount: `[\d\.,]+` (with thousand separators)
   - Installments: `(\d+)\s+de\s+(\d+)` or `\d+/\d+`
4. Normalize:
   - Convert date to ISO: `DD/MM/YYYY` → `YYYY‑MM‑DD`
   - Remove extra whitespace from merchant
   - Convert amount string to float: `1.250,50` → `1250.50`

### HTML Statement Parsing (fallback)
1. Extract HTML tables via BeautifulSoup (Python) or regex.
2. Same normalization as PDF.

### Approval Email Parsing
**Pattern examples:**
- `"En SUPERMERCADO DISCO por $ 1.250,50"`
- `"Consumo por UYU 1.250,50 en SUPERMERCADO DISCO"`
- `"Aviso de consumo: UYU 1.250,50 - SUPERMERCADO DISCO"`

**Regex:**
```regex
(?i)(?:en|por|en\s+)\s*([A-Za-zÁÉÍÓÚáéíóúÑñ\s\.\-]+)\s+(?:por|\$|UYU)\s*([\d\.,]+)
```

## Field Mapping

| Source Field         | Destination       | Notes |
|----------------------|-------------------|-------|
| `Fecha`              | `date`            | Convert to ISO |
| `Comercio`           | `merchant`        | Trim, title‑case |
| `Importe`            | `amount`          | Parse locale‑aware |
| `Cuotas`             | `installments`    | `current/total` |
| Email currency hint  | `currency`        | Default `UYU` |
| Email type           | `source`          | `statement` / `approval` |
| Approval email       | `status`          | `pending` (later merged) |

## Deduplication Logic
- **Unique key:** `(date, merchant, amount, currency)`
- **Merge rule:** If a statement includes an approval‑already‑seen:
  - Update `source` → `merged`
  - Update `status` → `cleared`
  - Fill missing fields (date, installments)
- **Implementation:** Keep in‑memory set of processed keys; skip duplicates.

## Error Handling
- **PDF parsing fails:** Try HTML; if both fail, log error, skip email.
- **Malformed amount:** Use regex fallback, log warning.
- **Missing date:** Use email received date (for approvals).
- **Unsupported currency:** Default to `UYU`, log.

## Dependencies
- **Python packages:** `pdfplumber`, `beautifulsoup4`, `lxml`
- **System tools:** `pdftotext` (recommended)
- **OpenClaw tools:** `exec` (for pdftotext), file I/O

## Configuration
```json
{
  "skills": {
    "itau_parser": {
      "date_format": "%d/%m/%Y",
      "default_currency": "UYU",
      "installment_pattern": "(\\d+)\\s+de\\s+(\\d+)",
      "amount_decimal_separator": ",",
      "amount_thousand_separator": "."
    }
  }
}
```

## Example Usage
```bash
sessions_spawn agentId=builder task="Parse Itaú emails from JSON file /tmp/emails.json using itau_parser skill. Output transactions JSON and stats."
```

## Related Skills
- `gmail_fetch_labeled` – upstream provider
- `spend_categorizer` – downstream consumer

---
*Skill version: 1.0 | Last updated: 2026‑02‑18*