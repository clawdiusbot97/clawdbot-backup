# Itaú Credit Card Spend Analyzer – Workflow Design

## Overview
Automated daily analysis of Itaú credit card spending via forwarded emails (monthly statements + purchase approvals). The system parses, categorizes, detects patterns, and produces actionable insights—without per‑transaction notifications.

**Trigger:** Daily cron at 08:30 Montevideo (UTC‑3).

## Data Sources & Scope
- **Email source:** `tachipachi9797@gmail.com`
- **Labels required:** `ITAU/EstadoDeCuenta`, `ITAU/AvisosConsumo`
- **Email types:**
  1. Monthly statement (`estado de cuenta`) – PDF/HTML with full transaction list
  2. Purchase approval (`Aviso de consumo`) – real‑time notifications
- **Exclusive:** Only emails under these labels are read; all other emails ignored.

## Architecture
```mermaid
flowchart TD
    A[Daily Cron 08:30] --> B[Gmail Fetch<br/>labeled emails since last run]
    B --> C{Parser}
    C --> D[Monthly Statement PDF/HTML]
    C --> E[Purchase Approval]
    D --> F[Extract transactions<br/>date, merchant, amount, currency,<br/>installments, category, card]
    E --> G[Mark as pending/instant<br/>merge later with statement]
    F --> H[Deduplicate & Merge<br/>(prefer statement as source of truth)]
    G --> H
    H --> I[Store to SQLite<br/>transactions table]
    I --> J[Compute metrics<br/>7d/30d spend, categories, trends]
    J --> K[Detect patterns<br/>recurring charges, unusual spend, spikes]
    K --> L[Generate markdown reports<br/>daily + update rolling summaries]
    L --> M{Any meaningful change?}
    M -->|No| N[NO_REPLY]
    M -->|Yes| O[Send single Slack alert]
```

## Storage Schema
**Database:** SQLite (`data/finance/itau/transactions.sqlite`)

**Table `transactions`:**
```sql
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,                -- Transaction date
    merchant TEXT NOT NULL,            -- Merchant name
    amount REAL NOT NULL,              -- Amount in original currency
    currency TEXT DEFAULT 'UYU',       -- Currency (UYU, USD)
    category TEXT,                     -- Auto‑categorized (food, transport, etc.)
    source TEXT NOT NULL,              -- 'statement' | 'approval' | 'merged'
    status TEXT DEFAULT 'cleared',     -- 'cleared' | 'pending' | 'refunded'
    raw_ref TEXT,                      -- Reference to email/PDF snippet
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, merchant, amount, currency) ON CONFLICT IGNORE
);

-- For faster lookups
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_merchant ON transactions(merchant);
CREATE INDEX idx_transactions_category ON transactions(category);
```

**Alternative CSV fallback:** `data/finance/itau/transactions.csv` (same columns).

## Processing Pipeline (Daily)

### Step 1 – Fetch New Emails
- **Skill:** `gmail_fetch_labeled`
- **Input:** Labels `ITAU/EstadoDeCuenta`, `ITAU/AvisosConsumo`
- **Since:** Last successful run timestamp (stored in checkpoint).
- **Output:** List of email objects with body, attachments (PDFs), metadata.

### Step 2 – Parse According to Type
- **Skill:** `itau_parser`
- **Monthly statement:**
  - Extract PDF text (via `pdftotext` or PDF.js fallback).
  - Parse HTML tables (if email contains HTML version).
  - Normalize merchant names (remove extra whitespace, standardize).
  - Detect installments: `3 de 6` → `current=3, total=6`.
- **Purchase approval:**
  - Extract merchant, amount, date (often missing, use email date).
  - Mark as `status='pending'` (will be merged later).

### Step 3 – Deduplicate & Merge
- **Rule:** If a statement later includes an already‑seen approval, update:
  - `source='merged'`, `status='cleared'`
  - Fill missing fields (date, installments).
- **Uniqueness:** `(date, merchant, amount, currency)` – ignore duplicates.

### Step 4 – Categorization
- **Skill:** `spend_categorizer`
- **Method:** Rule‑based + merchant keyword mapping.
- **Categories:**
  - `food` (restaurants, delivery, supermarkets)
  - `transport` (taxi, Uber, petrol, tolls)
  - `shopping` (clothing, electronics, online)
  - `entertainment` (cinema, streaming, hobbies)
  - `health` (pharmacy, doctor, insurance)
  - `services` (utilities, subscriptions, maintenance)
  - `other`

### Step 5 – Insights Generation
- **Skill:** `insights_generator`
- **Compute:**
  1. **Last 7d / 30d spend** (trend vs previous period).
  2. **Top categories** (by amount) for 7d/30d.
  3. **Biggest merchants** (single highest amounts).
  4. **Recurring charges** (same merchant ±5% amount, monthly cadence).
  5. **Unusual detection:**
     - Spend spike: `amount > 2× 30‑day rolling average`
     - New merchant: not seen in last 90 days
     - Duplicate charge: same merchant + similar amount within 48h
  6. **Installments summary**: total monthly committed from future installments.
- **Score each unusual detection** (low/medium/high).

### Step 6 – Report Output
**Daily report:** `reports/finance/itau/daily/YYYY‑MM‑DD.md`
```markdown
# Itaú Spend Analysis – 2026‑02‑18

## 📊 Summary
- Last 7 days: $X (▲Y% vs previous 7d)
- Last 30 days: $Z (▲W% vs previous 30d)

## 🏷️ Top Categories (7d)
1. Food: $A (X%)
2. Transport: $B (Y%)
...

## 🔄 Recurring Charges
- Spotify: $9.99/month (next charge ~2026‑03‑15)
- Netflix: $15.99/month
...

## ⚠️ Unusual Activity
- **High:** $450 at “ElectroShop” (2.3× average for merchant)
- **Medium:** New merchant “TechGadgets” ($120)
```

**Rolling summaries:**
- `reports/finance/itau/weekly/latest.md` – updated daily with 7d rolling window.
- `reports/finance/itau/monthly/YYYY‑MM.md` – created/updated when month changes or statement arrives.

### Step 7 – Notification Policy
- **No** per‑transaction alerts.
- **Send one Slack message if:**
  1. Unusual detection score = HIGH
  2. New monthly statement arrived (summary of statement)
  3. Subscription increased >20% from previous month
- **Otherwise:** `NO_REPLY`.

## Environment & Configuration
**Required env vars (set in `.env` or OpenClaw config):**
```bash
ITAU_GMAIL_ACCOUNT=tachipachi9797@gmail.com
ITAU_GMAIL_LABELS=ITAU/EstadoDeCuenta,ITAU/AvisosConsumo
ITAU_SLACK_CHANNEL=#finance-alerts  # or channel ID
ITAU_UNUSUAL_THRESHOLD=2.0          # 2× average = spike
ITAU_SUBSCRIPTION_INCREASE_PCT=20   # alert if >20%
```

**Label setup (run once):**
```bash
gog gmail labels create --account tachipachi9797@gmail.com "ITAU/EstadoDeCuenta"
gog gmail labels create --account tachipachi9797@gmail.com "ITAU/AvisosConsumo"
```

## Cron Definition
```yaml
# cron/finance_itau_daily.yaml
name: "Itaú Daily Spend Analysis"
schedule:
  kind: "cron"
  expr: "30 8 * * 1-5"               # 08:30 Montevideo, Mon‑Fri
  tz: "America/Montevideo"
payload:
  kind: "agentTurn"
  message: |
    Execute Itaú spend analysis pipeline:
    1. Fetch new labeled emails since last checkpoint.
    2. Parse statements & approvals.
    3. Deduplicate and store to SQLite.
    4. Compute metrics and generate daily report.
    5. Update weekly/monthly summaries.
    6. If conditions met, send single Slack alert.
  timeoutSeconds: 600
sessionTarget: "isolated"
delivery:
  mode: "announce"
  channel: "slack"
  to: "C0AFK08BFR8"                  # brokia‑ai‑alerts or dedicated channel
```

## Skills to Implement
1. **`gmail_fetch_labeled`** – fetch emails by label, handle attachments.
2. **`itau_parser`** – parse PDF/HTML statements & approval emails.
3. **`spend_categorizer`** – categorize transactions via merchant keywords.
4. **`insights_generator`** – compute metrics, detect patterns.

## Assumptions & Edge Cases
- **Currency:** Primarily UYU; handle USD conversions if present.
- **Missing dates:** Use email received date for approvals.
- **Partial installments:** Track `installment_current / installment_total`.
- **Refunds:** Detect negative amounts, mark as `status='refunded'`.
- **Email forwarding:** All relevant emails must be properly labeled (manual or filter).
- **PDF parsing fallback:** If PDF parsing fails, try HTML; if both fail, log error and skip.

## Success Metrics
- ✅ Daily report generated without human intervention.
- ✅ No false‑positive notifications (only meaningful alerts).
- ✅ Accurate categorization (≥85% match manual review).
- ✅ All transactions stored with complete fields.

---
*Document version: 1.0 | Last updated: 2026‑02‑18*