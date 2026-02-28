#!/usr/bin/env python3
"""
route_request.py — LOCAL cost router (0 LLM tokens)
Decides model based on agent + prompt content using regex heuristics.

Usage: route_request.py <agent_id> <prompt_text...>
Returns: JSON with chosen_model, requested_model, route_reason

Exit codes:
  0 = success (model chosen)
  1 = error (fallback applied)
"""

import json
import re
import sys
from pathlib import Path

ROUTER_CONFIG = Path("/home/manpac/.openclaw/workspace/.openclaw/router-v1.json")

def load_config():
    """Load router configuration (LOCAL, no network/LLM)."""
    if not ROUTER_CONFIG.exists():
        return {
            "default_model": "openrouter/minimax/minimax-m2.1",
            "rules": [],
            "fallback": {"model": "openrouter/minimax/minimax-m2.1", "reason": "config_missing"}
        }
    with open(ROUTER_CONFIG) as f:
        return json.load(f)

def matches_any(text: str, patterns: list, case_sensitive: bool = False) -> bool:
    """Check if text matches any regex pattern (LOCAL, no LLM)."""
    flags = 0 if case_sensitive else re.IGNORECASE
    for pattern in patterns:
        try:
            if re.search(pattern, text, flags):
                return True
        except re.error:
            continue
    return False

def route(agent_id: str, prompt: str, requested_model: str = None) -> dict:
    """
    Route request to appropriate model based on agent + prompt content.
    STRICTLY LOCAL: no LLM calls, only regex matching.
    """
    config = load_config()
    default = config.get("default_model", "openrouter/minimax/minimax-m2.1")
    fallback = config.get("fallback", {"model": default, "reason": "fallback"})
    
    # Find rule for this agent
    for rule in config.get("rules", []):
        if rule.get("agent") != agent_id:
            continue
        
        # Simple static rule (writer, chief, ops, brokia, qubika)
        if "model" in rule:
            return {
                "chosen_model": rule["model"],
                "requested_model": requested_model or rule["model"],
                "route_reason": rule.get("reason", "static_rule"),
                "agent": agent_id,
                "llm_calls": 0,
                "method": "regex_heuristics"
            }
        
        # Researcher: check for deep research markers
        if agent_id == "researcher":
            has_research_markers = matches_any(
                prompt, 
                rule.get("match_any", []), 
                rule.get("case_sensitive", False)
            )
            if has_research_markers:
                return {
                    "chosen_model": rule.get("premium_model", default),
                    "requested_model": requested_model or rule.get("default_model", default),
                    "route_reason": rule.get("reason_premium", "researcher_deep"),
                    "agent": agent_id,
                    "llm_calls": 0,
                    "method": "regex_heuristics"
                }
            else:
                return {
                    "chosen_model": rule.get("default_model", default),
                    "requested_model": requested_model or rule.get("default_model", default),
                    "route_reason": rule.get("reason_frugal", "researcher_quick"),
                    "agent": agent_id,
                    "llm_calls": 0,
                    "method": "regex_heuristics"
                }
        
        # Builder: check for code-edit markers
        if agent_id == "builder":
            has_code_markers = matches_any(
                prompt,
                rule.get("match_any", []),
                rule.get("case_sensitive", False)
            )
            if has_code_markers:
                return {
                    "chosen_model": rule.get("premium_model", default),
                    "requested_model": requested_model or rule.get("frugal_model", default),
                    "route_reason": rule.get("reason_premium", "builder_code_edit"),
                    "agent": agent_id,
                    "llm_calls": 0,
                    "method": "regex_heuristics"
                }
            else:
                return {
                    "chosen_model": rule.get("frugal_model", default),
                    "requested_model": requested_model or rule.get("frugal_model", default),
                    "route_reason": rule.get("reason_frugal", "builder_design_planning"),
                    "agent": agent_id,
                    "llm_calls": 0,
                    "method": "regex_heuristics"
                }
    
    # No rule matched - use fallback
    return {
        "chosen_model": fallback["model"],
        "requested_model": requested_model or fallback["model"],
        "route_reason": fallback["reason"],
        "agent": agent_id,
        "llm_calls": 0,
        "method": "fallback"
    }

def main():
    if len(sys.argv) < 3:
        print("Usage: route_request.py <agent_id> <prompt_text...>", file=sys.stderr)
        print("Example: route_request.py builder 'fix bug in auth.rb'", file=sys.stderr)
        sys.exit(1)
    
    agent_id = sys.argv[1]
    prompt = " ".join(sys.argv[2:])
    requested_model = None
    
    # Allow optional --model flag: route_request.py agent prompt --model codex
    if "--model" in sys.argv:
        model_idx = sys.argv.index("--model")
        if model_idx + 1 < len(sys.argv):
            requested_model = sys.argv[model_idx + 1]
    
    result = route(agent_id, prompt, requested_model)
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
