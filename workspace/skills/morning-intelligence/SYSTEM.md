# Morning Intelligence — SYSTEM (Source of Truth)

This file contains the stable operating instructions for the `morning-intelligence` cron job.

**Rule:** The cron payload should stay minimal and MUST instruct the agent to read and follow this file.

---

Execute Morning Intelligence Workflow v2.3 — DISCORD DELIVERY FIXED. Timezone: America/Montevideo

OBJECTIVE: Deliver a high-signal, source-backed, analytical morning briefing to Discord.

━━━━━━━━━━━━━━━━━━━━━━
GLOBAL EXECUTION RULES
━━━━━━━━━━━━━━━━━━━━━━
- Execute exactly once.
- Use cost-efficient OpenRouter models.
- Do NOT use Codex.
- STRICT TIME BUDGET: complete within 8 minutes.
- DISCORD DELIVERY: ALL sends MUST include explicit channel_id. NO implicit delivery.

━━━━━━━━━━━━━━━━━━━━━━
DISCORD CHANNEL MAP (HARDCODED — NEVER CHANGE)
━━━━━━━━━━━━━━━━━━━━━━
general: 1475957499642380523
newsletters: 1475961125257351423
briefings: 1475961144416931931
to-dos: 1475961183533273249
music: 1475961199207251968
finance: 1475961220216520887
emails: 1475961329973199069

HARD RULE: FAIL FAST if any Discord send call does not include channel_id.
Use message tool with: action=send, channel=discord, to=<channel_id>

━━━━━━━━━━━━━━━━━━━━━━
DATA COLLECTION
━━━━━━━━━━━━━━━━━━━━━━
1) AI / Tech / Startup News (TIMING: log web_start/web_end)
MAX 2 web search queries. MAX 5 links total.
Requirements per item:
- Headline
- Source name
- Direct URL
- What happened (concise)
- Why it matters
Include 4–6 highest-impact items only.

2) Fetch GLOBAL SIGNALS (FILTERED) ONLY if impacting: Technology, Markets, Regulation, Macroeconomy (exclude generic world news)
Source + Link + 2-sentence analysis.

3) On This Day
- Event, Year, Why it mattered

4) Gmail (TIMING: log gmail_start/gmail_end)
GMAIL ACCOUNT (HARD RULE): Use ONLY tachipachi9797@gmail.com for any Gmail reads in this job. Do NOT attempt manuel.pacheco@qubika.com or any other account.
Max 5 emails. HEADERS/SNIPPETS ONLY — NO full body parsing.
Classify: Newsletters, Itaú finance
If Gmail fails: state clearly, continue.

5) Tasks
Read: /home/manpac/.openclaw/workspace/dashboard/personal_tasks.md
Max 5 tasks.

━━━━━━━━━━━━━━━━━━━━━━
NEWSLETTER PROCESSING
━━━━━━━━━━━━━━━━━━━━━━
Cluster into 2–3 macro themes max.
Extract: 1 strategic insight, 1 tactical opportunity.

━━━━━━━━━━━━━━━━━━━━━━
THESIS INTEL
━━━━━━━━━━━━━━━━━━━━━━
Goal: Produce daily thesis intelligence for Brokia/insurtech + AI using Research → Curate → Format → Deliver.

Output files (create directories if missing):
- Markdown: /home/manpac/.openclaw/workspace/memory/thesis-intel/YYYY-MM-DD.md
- Checkpoint JSON: /home/manpac/.openclaw/workspace/checkpoints/thesis/YYYY-MM-DD.json

Cache behavior:
- If today's checkpoint exists and contains findings, reuse it (skip re-research), then still format + deliver.
- If no cache exists, run fresh research.

Dedupe requirements:
- Before writing today's findings, read last 7 days of files in /home/manpac/.openclaw/workspace/memory/thesis-intel/ if present.
- Exclude repeated findings by normalized title and by overlapping primary URL domain+path.
- If uncertain about duplication, exclude.

Research topics (ongoing):
A) Document AI (scan/parse policies, PDFs, tables, RAG over docs, extraction eval)
B) Voice AI (voice cloning, custom TTS, voice agents for WhatsApp/Telegram, low-latency)
C) Insurtech globally (broker copilots, claims automation, underwriting, renewals)
D) Fraud & security (fraud detection docs/voice, anti-deepfake, watermarking)
E) Compliance & privacy (PII redaction, data residency, audit logs, secure RAG)
F) Infra/costs (private AI, on-prem/VPC, caching/batching, vector DB)

Source priority:
- Official docs, papers, top technical blogs, repos with stars, case studies.

Finding schema (6–10 findings):
1) Title
2) Why it matters for the thesis
3) Links (1–3)
4) Actionable idea for Brokia (feature / experiment / risk)

Markdown format:
# Thesis Intel — YYYY-MM-DD
## TL;DR (3 bullets)
## Hallazgos (6–10)
1) ...
## Ideas accionables para Brokia (3–5)
- ...

Discord delivery (mandatory):
- Send compact message with TL;DR + 6–10 findings to channel_id 1476311753305362564
- Use message tool with explicit channel_id: action=send, channel=discord, to=1476311753305362564
- If delivery fails, write error to today's checkpoint JSON under delivery_error; do NOT delete markdown.
Thesis Intel routing guard (HARD RULES):
- Thesis Intel findings MUST be sent ONLY to channel_id 1476311753305362564.
- Do NOT include Thesis Intel (TL;DR, findings, or ideas) in ANY other Discord messages.
- Specifically, keep the BRIEFINGS channel (1475961144416931931) content unchanged: ONLY Morning Intelligence sections.
- The final agent output (job stdout) must NOT paste Thesis Intel content (to avoid job-level delivery echo). Use a short status-only confirmation.


━━━━━━━━━━━━━━━━━━━━━━
DELIVERY GUARD (REAL DRY-RUN MODE)
━━━━━━━━━━━━━━━━━━━━━━
Compute DELIVERY_MODE = env OPENCLAW_DELIVERY_MODE (default: "live").
If DELIVERY_MODE == "dry-run":
- ABSOLUTE RULE: No external deliveries must occur.
- For EVERY would-be send, do BOTH:
  1) Write the exact message content to outbox:
     /home/manpac/.openclaw/workspace/outbox/morning-intelligence/YYYY-MM-DD/
     Files (only those that would have been sent):
     - 01-briefings.md
     - 02-newsletters.md
     - 03-finance.md (if applicable)
     - 04-music.md
     - 06-thesis-intel.md (ONLY thesis channel content)
     - 07-news-extension.md (ONLY News Extension block)
  2) If you still call the message tool for verification, you MUST set `dryRun: true` on every message tool call.
     (This ensures the platform does not send.)
- Still write checkpoints as usual (no changes to checkpoint logic).
- OUTPUT (stdout): confirm dry-run mode and list outbox file paths written.

━━━━━━━━━━━━━━━━━━━━━━
DISCORD DELIVERY ORDER (TIMING: log render_start/render_end, delivery_start/delivery_end)
━━━━━━━━━━━━━━━━━━━━━━
\n1️⃣ BRIEFINGS CHANNEL (channel_id: 1475961144416931931) — MANDATORY
Send main briefing here. ALWAYS include channel_id: 1475961144416931931
# 🌅 Morning Intelligence — YYYY-MM-DD
## 🚀 AI / Tech — High Signal
[Structured format with sources + links]
## 🌍 Global Signals
[Only material macro impact]
## 📜 On This Day
[event + significance]
## 📝 Your Tasks
Pending: ...
## Strategic Opportunities Today
3–5 actions based on signals.

2️⃣ NEWSLETTERS CHANNEL (channel_id: 1475961125257351423)
Send newsletter intelligence here. channel_id: 1475961125257351423
# 📰 Newsletter Intelligence — YYYY-MM-DD
### Theme 1: [Summary]
- Strategic Insight
- Tactical Opportunity
### Theme 2: ...
Low-signal items to ignore: ...

3️⃣ FINANCE CHANNEL (channel_id: 1475961220216520887) — ONLY if Itaú emails exist
Send finance intelligence here. channel_id: 1475961220216520887
# 💳 Finance Intelligence — YYYY-MM-DD
- Notable changes
- Spending anomalies
- Required actions

4️⃣ TO-DOS CHANNEL (channel_id: 1475961183533273249) — Task summary
Send task summary here. channel_id: 1475961183533273249
# ✅ Tasks Summary — YYYY-MM-DD
- Pending
- In Progress

5️⃣ GENERAL CHANNEL (channel_id: 1475957499642380523) — Optional index/TOC
Send table of contents here if brief. channel_id: 1475957499642380523
# 📋 Daily Briefing Index
Briefings: #morning-intelligence
Newsletters: #newsletter-intelligence
Finance: #finance-intelligence (if applicable)

[MUSIC SECTION DISABLED — channel_id 1475961199207251968 reserved for future]
[EMAILS CHANNEL 1475961329973199069 reserved for email digest if separated]

━━━━━━━━━━━━━━━━━━━━━━
QUALITY FILTER
━━━━━━━━━━━━━━━━━━━━━━
No source/link/date = do NOT include.
Prioritize signal density.

━━━━━━━━━━━━━━━━━━━━━━
TIMING REQUIREMENT
━━━━━━━━━━━━━━━━━━━━━━
Log these timestamps in output (ms since epoch):
- gmail_start, gmail_end
- web_start, web_end
- render_start, render_end
- delivery_start, delivery_end
Include duration_ms per block in final summary.

━━━━━━━━━━━━━━━━━━━━━━
MORNING-INTELLIGENCE NEWS EXTENSION (APPEND AFTER CURRENT BRIEFING CONTENT)
━━━━━━━━━━━━━━━━━━━━━━
Add TWO new sections after the existing Morning Intelligence content:
1) Global News (Top 5)
GLOBAL NEWS SELECTION HARDENING (MANDATORY — TRUE WORLD TOP STORIES, NOT AI-HEAVY)

CATEGORY DIVERSITY QUOTA (MANDATORY FOR TOP 5):
- Build candidates grouped into categories:
  A) Geopolitics / conflict / security / diplomacy
  B) Economy / markets / energy
  C) Government / policy / courts (major countries / blocs)
  D) Climate / disasters / accidents
  E) Science / health / space (only if widely impactful)
  F) Tech / AI / business (allowed but capped)
- Global Top 5 must include:
  - At least 1 from A (Geopolitics/conflict/security) IF any major event exists in last 48h
  - At least 1 from B or C
  - At most 1 from F (Tech/AI/business) unless 3+ top outlets treat it as the lead story globally

MAJOR EVENT OVERRIDE (MANDATORY CHECK):
- Before finalizing Top 5, explicitly check if there was a major armed conflict escalation / strike / attack / ceasefire / coup / major sanctions action in the last 48h.
- If yes, at least ONE of the Top 5 must cover it (category A), even if not tech-related.

MAJOR EVENT POSITIVE CRITERIA (DETERMINISTIC):
- Consider “major event exists” TRUE only if the same event is reported by at least 2 of: Reuters, AP, BBC, FT within the last 48h.

ENFORCED REPLACEMENT RULE (MANDATORY):
- After ranking, if major event exists == TRUE and no category A item is in the final Global Top 5:
  - Replace the lowest-scoring item in the Top 5 with the highest-scoring category A candidate.
  - Keep the Top 5 size constant.

QUERY STRATEGY (REPLACE / EXPAND QUERIES):
- Use SearXNG wrapper as before, but run a diversified set of focused queries (8–10 results each) and merge:
  - "top world news today Reuters"
  - "breaking news world today AP"
  - "BBC world news latest major"
  - "major geopolitical escalation attack strike ceasefire sanctions last 48 hours"
  - "global markets energy oil gas OPEC latest"
  - "earthquake flood wildfire crash major incident latest"
  - (Optional, do NOT let it dominate): existing tech/AI query

RANKING TWEAK (DE-BIAS FROM AI) — Global News impact rubric:
- Keep the same deterministic scoring, but set impact=4 ONLY if it involves:
  - military action/conflict escalation, major diplomatic rupture
  - large market/energy shock
  - major disaster with large casualties/disruption
  - major elections/court ruling affecting millions
- Tech/AI stories should only score 4 if they are clearly dominating global headlines across multiple top outlets.

OUTPUT REQUIREMENT (GLOBAL NEWS):
- For each Global News item, include 1 line indicating its category tag, e.g.: [Geopolitics], [Markets], [Disaster], [Policy], [Science], [Tech/AI]
- This category tag is used to enforce the quota.

2) Uruguay News (Top 5)
Optional: What to watch (24–72h) ONLY when concrete upcoming dates/events are found.

Execution pattern (MANDATORY): Research → Curate → Format → Deliver

DEDUPE PRECHECK (MANDATORY):
- If file exists: /home/manpac/.openclaw/workspace/checkpoints/morning-intelligence/news-{YYYY-MM-DD}.json and it contains "stage": "ok" => SKIP: searxng searches and SKIP: posting; log "News Extension skipped (already posted today)."

Research (MANDATORY SOURCE PREFERENCE):
- Prefer local SearXNG wrapper first:
  /home/manpac/.openclaw/workspace/skills/searxng-search/scripts/searxng_search.sh
- Base URL: http://127.0.0.1:8088
- Use 8–10 results per query; run multiple focused queries and merge results.
- Avoid re-fetch loops; cache and dedupe aggressively during run.

Ranking (DETERMINISTIC):
score = source_quality(0-3) + recency(0-3) + impact(0-4)

Rubric:
- source_quality:
  - 3 = Reuters/AP/FT
  - 2 = BBC
  - 1 = other reputable outlets
  - 0 = unknown/low-confidence
- recency:
  - <12h = 3
  - <24h = 2
  - <48h = 1
  - else = 0
- impact:
  - 4 = major policy/market/security/geopolitical shift with broad consequences
  - 3 = significant national/regional effect
  - 2 = meaningful sector impact
  - 1 = minor relevance
  - 0 = low signal

Uruguay-specific impact priority:
- Direct Uruguay impact > regional LATAM impact > global impact.
- A global story may be included in Uruguay Top 5 only if direct Uruguay impact is clear, and must be summarized from the Uruguay angle.

Dedupe rules:
- Collapse same event across multiple sources.
- Keep best source as primary + optional one backup link.

Formatting (Discord Markdown, keep concise):
- Keep the whole NEW addition under ~450–650 words.
- Use exactly:
---
## 🌍 Global News (Top 5)
1) Title (source, timestamp/date)
   - what happened
   - why it matters
   - Link(s)
...
## 🇺🇾 Uruguay (Top 5)
1) Title (source, timestamp/date)
   - what happened
   - why it matters (Uruguay angle)
   - Link(s)
...
## 👀 What to watch (24–72h)
- Only include if concrete upcoming dated events are found.

Checkpoint (MANDATORY):
- Write JSON checkpoint to:
  /home/manpac/.openclaw/workspace/checkpoints/morning-intelligence/news-{YYYY-MM-DD}.json
- Schema:
  {
    "date": "YYYY-MM-DD",
    "stage": "ok",
    "sections": {"global": [...], "uruguay": [...], "watch": [...]},
    "sources_count": <number>,
    "generated_at": "ISO-8601 UTC"
  }
- ALWAYS include stage:
  - On success the checkpoint JSON must include: "stage": "ok"
  - On failure it must include: "stage": "error", "message": "<delivery error>"

DELIVERY CONSTRAINT (CRITICAL):
─────────────────────────────
HARD ENFORCEMENT (MANDATORY):
- Build the News Extension as a standalone string variable (do NOT append it inside Channel 1 briefings).
- Perform a separate Discord send action that targets ONLY channel_id 1477319018992898171.
- If send fails: retry ONCE with the SAME channel_id; if it still fails, stop and record checkpoint stage=error.
- Do NOT include the News Extension in the final “confirm delivery to all channels” message content.
─────────────────────────────

- Send ONLY this new Global+Uruguay(+watch) block to Discord channel_id 1477319018992898171.
- Do NOT send this new block to any other Discord/Slack/Telegram destination.
- If send fails, retry ONCE with the SAME channel_id 1477319018992898171.
- Do NOT modify routing for existing Morning Intelligence deliveries/channels.

