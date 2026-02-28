#!/usr/bin/env python3
from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path
from zoneinfo import ZoneInfo

TZ = ZoneInfo("America/Montevideo")
CHECKLIST_PATH = Path("/home/manpac/.openclaw/workspace/brokia/thesis-hub/02_ACADEMIC_CHECKLIST.md")
CHANNELS_PATH = Path("/home/manpac/.openclaw/workspace/CHANNELS.md")
CHECKPOINT_DIR = Path("/home/manpac/.openclaw/workspace/checkpoints/brokia")
SLACK_TARGET = "brokia-ai-alerts"

LINE_RE = re.compile(r"^\s*-\s*\[(VALID|EXCLUDED_MAL)\]\s*(\d{2})/(\d{2})/(\d{4})(?:\s+(\d{2}:\d{2}))?\s*-\s*(.+?)\s*$")

@dataclass
class Deadline:
    status: str
    date: dt.date
    time_raw: str | None
    title: str


def parse_deadlines(md_text: str) -> list[Deadline]:
    rows: list[Deadline] = []
    for line in md_text.splitlines():
        m = LINE_RE.match(line)
        if not m:
            continue
        status, dd, mm, yyyy, hhmm, title = m.groups()
        rows.append(Deadline(
            status=status,
            date=dt.date(int(yyyy), int(mm), int(dd)),
            time_raw=hhmm,
            title=title.strip(),
        ))
    return rows


def ensure_channel_mapping() -> None:
    text = CHANNELS_PATH.read_text(encoding="utf-8")
    if "brokia-ai-alerts" not in text:
        raise RuntimeError("Channel mapping brokia-ai-alerts not found in CHANNELS.md")


def send_slack(message: str) -> tuple[bool, str]:
    cmd = [
        "openclaw", "message", "send",
        "--channel", "slack",
        "--target", SLACK_TARGET,
        "--message", message,
    ]
    p = subprocess.run(cmd, capture_output=True, text=True)
    out = (p.stdout or "") + (p.stderr or "")
    return (p.returncode == 0, out.strip())


def main() -> int:
    ap = argparse.ArgumentParser(description="Brokia thesis checklist T-7 alerts")
    ap.add_argument("--dry-run", action="store_true", help="Do not send Slack message")
    args = ap.parse_args()

    ensure_channel_mapping()
    md = CHECKLIST_PATH.read_text(encoding="utf-8")
    deadlines = parse_deadlines(md)

    valid = [d for d in deadlines if d.status == "VALID"]
    excluded = [d for d in deadlines if d.status == "EXCLUDED_MAL"]

    now = dt.datetime.now(TZ)
    today = now.date()

    CHECKPOINT_DIR.mkdir(parents=True, exist_ok=True)
    checkpoint = CHECKPOINT_DIR / f"deadlines-{today.isoformat()}.json"
    existing = {}
    sent_keys = set()
    if checkpoint.exists():
        try:
            existing = json.loads(checkpoint.read_text(encoding="utf-8"))
            for a in existing.get("alerts_generated", []):
                if a.get("dedupe_key"):
                    sent_keys.add(a["dedupe_key"])
        except Exception:
            existing = {}

    alerts_generated = []
    for d in valid:
        days = (d.date - today).days
        if days != 7:
            continue
        dedupe_key = f"{d.date.isoformat()}:{d.title}"
        if dedupe_key in sent_keys:
            alerts_generated.append({
                "dedupe_key": dedupe_key,
                "summary": d.title,
                "date": d.date.isoformat(),
                "days_until": days,
                "alert_sent": False,
                "reason": "already_sent_today",
            })
            continue

        pretty_date = d.date.strftime("%d/%m/%Y") + (f" {d.time_raw}" if d.time_raw else "")
        body = (
            ":pushpin: Alertas Brokia/ORT (T-7)\n"
            f"Para el {pretty_date} tenés:\n"
            f"• {d.title} → Acción sugerida: Confirmar detalles y preparar entregables."
        )

        sent = False
        send_output = "dry-run"
        if not args.dry_run:
            sent, send_output = send_slack(body)

        alerts_generated.append({
            "dedupe_key": dedupe_key,
            "summary": d.title,
            "date": d.date.isoformat(),
            "days_until": days,
            "alert_sent": bool(sent or args.dry_run),
            "slack_result": send_output,
        })

    payload = {
        "schema": "brokia-deadlines-v1",
        "generated_at": now.isoformat(),
        "tz": "America/Montevideo",
        "source_checklist": str(CHECKLIST_PATH),
        "excluded_mal": [
            {
                "date": d.date.isoformat(),
                "summary": d.title,
            }
            for d in excluded
        ],
        "alerts_generated": alerts_generated,
        "dedupe": {
            "checkpoint_file": str(checkpoint),
            "keys_seen": sorted(sent_keys),
        },
    }
    checkpoint.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(json.dumps({
        "checkpoint": str(checkpoint),
        "alerts_count": len([a for a in alerts_generated if a.get("alert_sent")]),
        "dry_run": args.dry_run,
    }, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
