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

HUB_DIR = Path("/home/manpac/.openclaw/workspace/brokia/thesis-hub")
BRIEF = HUB_DIR / "01_BRIEF.md"
CHECKLIST = HUB_DIR / "02_ACADEMIC_CHECKLIST.md"
ROADMAP = HUB_DIR / "03_ROADMAP.md"
BACKLOG = HUB_DIR / "04_BACKLOG.md"

CHANNELS_MD = Path("/home/manpac/.openclaw/workspace/CHANNELS.md")
DISCORD_TARGET = "1476311753305362564"
SLACK_TARGET = "brokia-ai-alerts"

CHECKPOINT_DIR = Path("/home/manpac/.openclaw/workspace/checkpoints/brokia")

ANTEPROYECTO_DEADLINE = dt.datetime(2026, 3, 26, 21, 0, tzinfo=TZ)


@dataclass(frozen=True)
class Task:
    title: str
    owner: str  # Manu / Rodrigo / JM


def iso_week_key(now: dt.datetime) -> str:
    y, w, _ = now.isocalendar()
    return f"{y}-W{w:02d}"


def detect_phase(now: dt.datetime) -> str:
    # Automatic + evidence-light heuristic:
    # - Before anteproyecto deadline: Phase 2 (we are building the anteproyecto)
    # - After deadline but before September 2026: Phase 3
    # - September 2026 onwards: Phase 4 (placeholder)
    if now < ANTEPROYECTO_DEADLINE:
        return "Phase 2 — Anteproyecto build"

    if now.year == 2026 and now.month < 9:
        return "Phase 3 — Validation loop"

    if now.year == 2026 and now.month >= 9:
        return "Phase 4 — Final thesis delivery"

    # Fallback
    return "Phase 4 — Final thesis delivery"


def plan_for_phase(phase: str, now: dt.datetime) -> tuple[list[str], list[Task], str, str]:
    # Minimal, high-ROI templates tied to thesis deadlines. No speculation about unknown dates.
    if phase.startswith("Phase 2"):
        objectives = [
            "Cerrar la definición de problema + métrica base para que el anteproyecto sea defendible.",
            "Completar borrador de anteproyecto v1 (objetivos, metodología, alcance, cronograma).",
            "Resolver incógnitas académicas críticas (final septiembre 2026 + horas de hitos condicionales).",
        ]
        tasks = [
            Task("Redactar 1-pager de problema (versión anteproyecto) y enlazar evidencia en 05_SOURCES.md", "Manu"),
            Task("Confirmar con JM 3 fricciones operativas + estimación de tiempos (inputs para baseline)", "JM"),
            Task("Agendar/realizar 1 entrevista adicional (si aplica) y registrar hallazgos en bitácora", "Rodrigo"),
            Task("Armar anteproyecto v1 (estructura + metodología + alcance) en doc de tesis (ruta a definir)", "Manu"),
            Task("Confirmar requisitos/fechas con CIE/ORT (hora 13/04, condiciones 22/04, final sep 2026) y actualizar checklist", "Rodrigo"),
        ]
        main_risk = "Llegar a 26/03 sin anteproyecto coherente por falta de evidencia y/o requisitos formales." 
        dependency = "Confirmación oficial de fecha final septiembre 2026 (día/hora) o indicación explícita de que sigue TBD." 
        return objectives, tasks, main_risk, dependency

    if phase.startswith("Phase 3"):
        objectives = [
            "Ejecutar baseline medible (tiempos por cotización / pasos) con datos reales.",
            "Correr 1 ciclo de validación (entrevistas + síntesis) y consolidar hallazgos.",
            "Mantener backlog priorizado por evidencia (no por ideas).",
        ]
        tasks = [
            Task("Definir plantilla de registro de baseline (tiempos/pasos) y recolectar 1 semana", "Manu"),
            Task("Completar 3 muestras reales de proceso (JM) y compartir resultados", "JM"),
            Task("Realizar 1–2 entrevistas y extraer métricas comparables", "Rodrigo"),
            Task("Actualizar backlog con top 5 por impacto medible", "Manu"),
            Task("Escribir síntesis semanal para tesis (bitácora) con evidencia", "Rodrigo"),
        ]
        main_risk = "Datos inconsistentes (sin baseline comparable) ⇒ no hay resultados defendibles." 
        dependency = "Acceso sostenido a corredores/operadores para repetir mediciones." 
        return objectives, tasks, main_risk, dependency

    # Phase 4
    objectives = [
        "Cerrar capítulos pendientes (metodología, resultados, discusión) con evidencia final.",
        "Preparar paquete de anexos (tablas/evidencias) cumpliendo normas ORT.",
        "Reducir riesgo de último momento: checklist final + revisión cruzada.",
    ]
    tasks = [
        Task("Definir índice final y asignar capítulos (borradores)", "Manu"),
        Task("Revisar normas ORT y construir checklist final de compliance", "Rodrigo"),
        Task("Validar realismo operativo de conclusiones (revisión de dominio)", "JM"),
        Task("Compilar anexos + redacción PII (si aplica)", "Manu"),
        Task("Planificar revisión final (deadline exacta) y actualizar checklist", "Rodrigo"),
    ]
    main_risk = "Fecha final exacta no confirmada ⇒ planificación fina y revisión final quedan débiles." 
    dependency = "Confirmación oficial de fecha/hora final de septiembre 2026." 
    return objectives, tasks, main_risk, dependency


def ensure_channel_mapping() -> None:
    txt = CHANNELS_MD.read_text(encoding="utf-8")
    if SLACK_TARGET not in txt:
        raise RuntimeError("Slack mapping 'brokia-ai-alerts' not found in CHANNELS.md")


def send_message(channel: str, target: str, message: str) -> tuple[bool, str]:
    cmd = [
        "openclaw", "message", "send",
        "--channel", channel,
        "--target", target,
        "--message", message,
    ]
    p = subprocess.run(cmd, capture_output=True, text=True)
    out = (p.stdout or "") + (p.stderr or "")
    return p.returncode == 0, out.strip()


def append_weekly_plan_to_backlog(backlog_text: str, week_key: str, phase: str, objectives: list[str], tasks: list[Task], main_risk: str, dependency: str) -> str:
    section = []
    section.append("\n\n---\n")
    section.append(f"## Weekly Plan — {week_key}\n")
    section.append(f"**Detected phase:** {phase}\n\n")
    section.append("### Weekly objectives (3)\n")
    for i, o in enumerate(objectives, 1):
        section.append(f"{i}. {o}\n")
    section.append("\n### Tasks (5)\n")
    for t in tasks:
        section.append(f"- [ ] ({t.owner}) {t.title}\n")
    section.append("\n### Main risk\n")
    section.append(f"- {main_risk}\n")
    section.append("\n### Dependency to unblock\n")
    section.append(f"- {dependency}\n")

    return backlog_text.rstrip() + "".join(section) + "\n"


def render_summary(week_key: str, phase: str, objectives: list[str], tasks: list[Task], main_risk: str, dependency: str) -> str:
    lines = []
    lines.append(f"Brokia — Weekly Plan ({week_key})")
    lines.append(f"Detected phase: {phase}")
    lines.append("")
    lines.append("Weekly objectives:")
    for i, o in enumerate(objectives, 1):
        lines.append(f"{i}) {o}")
    lines.append("")
    lines.append("Tasks:")
    for t in tasks:
        lines.append(f"- ({t.owner}) {t.title}")
    lines.append("")
    lines.append(f"Main risk: {main_risk}")
    lines.append(f"Dependency: {dependency}")
    return "\n".join(lines)


def main() -> int:
    ap = argparse.ArgumentParser(description="Brokia weekly planning")
    ap.add_argument("--dry-run", action="store_true", help="Do not send Slack/Discord messages")
    args = ap.parse_args()

    ensure_channel_mapping()

    now = dt.datetime.now(TZ)
    week_key = iso_week_key(now)

    CHECKPOINT_DIR.mkdir(parents=True, exist_ok=True)
    checkpoint_path = CHECKPOINT_DIR / f"weekly-plan-{week_key}.json"
    if checkpoint_path.exists():
        print(json.dumps({"status": "skipped", "reason": "checkpoint_exists", "checkpoint": str(checkpoint_path)}, ensure_ascii=False))
        return 0

    # Read required inputs (existence is part of the contract)
    _ = BRIEF.read_text(encoding="utf-8")
    _ = CHECKLIST.read_text(encoding="utf-8")
    _ = ROADMAP.read_text(encoding="utf-8")
    backlog_text = BACKLOG.read_text(encoding="utf-8")

    phase = detect_phase(now)
    objectives, tasks, main_risk, dependency = plan_for_phase(phase, now)

    # Update backlog
    updated = append_weekly_plan_to_backlog(backlog_text, week_key, phase, objectives, tasks, main_risk, dependency)
    BACKLOG.write_text(updated, encoding="utf-8")

    summary = render_summary(week_key, phase, objectives, tasks, main_risk, dependency)

    # Write checkpoint
    checkpoint_payload = {
        "schema": "brokia-weekly-plan-v1",
        "generated_at": now.isoformat(),
        "tz": "America/Montevideo",
        "week": week_key,
        "phase": phase,
        "objectives": objectives,
        "tasks": [t.__dict__ for t in tasks],
        "main_risk": main_risk,
        "dependency": dependency,
        "inputs": {
            "brief": str(BRIEF),
            "academic_checklist": str(CHECKLIST),
            "roadmap": str(ROADMAP),
            "backlog": str(BACKLOG),
        },
        "posts": {
            "discord": {"target": DISCORD_TARGET, "sent": False, "result": None},
            "slack": {"target": SLACK_TARGET, "sent": False, "result": None},
        },
    }

    if not args.dry_run:
        ok_s, out_s = send_message("slack", SLACK_TARGET, summary)
        ok_d, out_d = send_message("discord", DISCORD_TARGET, summary)
        checkpoint_payload["posts"]["slack"] = {"target": SLACK_TARGET, "sent": bool(ok_s), "result": out_s}
        checkpoint_payload["posts"]["discord"] = {"target": DISCORD_TARGET, "sent": bool(ok_d), "result": out_d}

    checkpoint_path.write_text(json.dumps(checkpoint_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(json.dumps({"status": "ok", "checkpoint": str(checkpoint_path), "dry_run": args.dry_run}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
