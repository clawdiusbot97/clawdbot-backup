#!/usr/bin/env python3
import json
import sys
from pathlib import Path

OPENCLAW_PATH = Path('/home/manpac/.openclaw/openclaw.json')
SNAPSHOT_PATH = Path('/home/manpac/.openclaw/workspace/config-lock-expected.json')


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


def main():
    errors = []
    snapshot = load_json(SNAPSHOT_PATH)
    cfg = load_json(OPENCLAW_PATH)
    models = agent_model_map(cfg)

    expected_agents = snapshot.get('expected_agents', {})
    for agent_id, expected in expected_agents.items():
        actual = models.get(agent_id)
        if actual is None:
            errors.append(f'missing agent: {agent_id}')
            continue
        if actual.get('primary') != expected.get('primary'):
            errors.append(
                f'{agent_id}.primary mismatch: expected={expected.get("primary")} actual={actual.get("primary")}'
            )
        if actual.get('fallbacks', []) != expected.get('fallbacks', []):
            errors.append(
                f'{agent_id}.fallbacks mismatch: expected={expected.get("fallbacks")} actual={actual.get("fallbacks", [])}'
            )

    expected_models_files = snapshot.get('expected_models_files', {})
    for rel_path, expected_obj in expected_models_files.items():
        path = Path(rel_path)
        if not path.exists():
            errors.append(f'missing models file: {path}')
            continue
        actual_obj = load_json(path)
        if actual_obj != expected_obj:
            errors.append(f'models.json drift detected: {path}')

    if errors:
        print('CONFIG_LOCK_FAILED')
        for err in errors:
            print(f'- {err}')
        sys.exit(1)

    print('CONFIG_LOCK_OK')


if __name__ == '__main__':
    main()

