#!/usr/bin/env python3
"""
Drift Alert: Monitor openclaw.json for unauthorized model changes.
Sends Telegram alert if agent.model.primary or defaults drift from expected.
"""
import json
import sys
import os
from pathlib import Path

OPENCLAW_PATH = Path('/home/manpac/.openclaw/openclaw.json')
SNAPSHOT_PATH = Path('/home/manpac/.openclaw/workspace/config-lock-expected.json')
ALERT_FILE = Path('/tmp/openclaw_drift_alert.json')

def load_json(path: Path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def agent_model_map(openclaw_cfg):
    result = {}
    for agent in openclaw_cfg.get('agents', {}).get('list', []):
        result[agent.get('id')] = {
            'primary': agent.get('model', {}).get('primary'),
            'fallbacks': agent.get('model', {}).get('fallbacks', []),
        }
    return result

def load_default_models(openclaw_cfg):
    defaults = openclaw_cfg.get('agents', {}).get('defaults', {})
    return {
        'model': {
            'primary': defaults.get('model', {}).get('primary'),
            'fallbacks': defaults.get('model', {}).get('fallbacks', [])
        },
        'subagents': {
            'model': {
                'primary': defaults.get('subagents', {}).get('model', {}).get('primary'),
                'fallbacks': defaults.get('subagents', {}).get('model', {}).get('fallbacks', [])
            }
        }
    }

def main():
    snapshot = load_json(SNAPSHOT_PATH)
    cfg = load_json(OPENCLAW_PATH)
    
    errors = []
    changes = []
    
    # Check agents
    models = agent_model_map(cfg)
    expected_agents = snapshot.get('expected_agents', {})
    
    for agent_id, expected in expected_agents.items():
        actual = models.get(agent_id)
        if actual is None:
            errors.append(f'AGENT_MISSING: {agent_id}')
            continue
        if actual.get('primary') != expected.get('primary'):
            changes.append(f'{agent_id}: {expected.get("primary")} → {actual.get("primary")}')
        if actual.get('fallbacks', []) != expected.get('fallbacks', []):
            changes.append(f'{agent_id}.fallbacks modified')
    
    # Check defaults
    expected_defaults = snapshot.get('expected_defaults', {})
    actual_defaults = load_default_models(cfg)
    
    if actual_defaults['model']['primary'] != expected_defaults['model']['primary']:
        changes.append(f'defaults.model.primary: {expected_defaults["model"]["primary"]} → {actual_defaults["model"]["primary"]}')
    
    if actual_defaults['subagents']['model']['primary'] != expected_defaults['subagents']['model']['primary']:
        changes.append(f'defaults.subagents.model.primary: {expected_defaults["subagents"]["model"]["primary"]} → {actual_defaults["subagents"]["model"]["primary"]}')
    
    # Write alert file if drift detected
    if changes:
        alert = {
            'alert': 'CONFIG_DRIFT_DETECTED',
            'changes': changes,
            'timestamp': cfg.get('meta', {}).get('lastTouchedAt', 'unknown'),
            'recommendation': 'Review unexpected model changes or update expected snapshot'
        }
        with open(ALERT_FILE, 'w', encoding='utf-8') as f:
            json.dump(alert, f, indent=2)
        print('DRIFT_DETECTED')
        for c in changes:
            print(f'  - {c}')
        sys.exit(1)
    
    print('NO_DRIFT')
    # Clear any previous alert
    ALERT_FILE.unlink(missing_ok=True)
    sys.exit(0)

if __name__ == '__main__':
    main()
