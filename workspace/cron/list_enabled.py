#!/usr/bin/env python3
import json

with open('/home/manpac/.openclaw/cron/jobs.json') as f:
    data = json.load(f)

jobs = data.get('jobs', [])
print("=== Enabled jobs ===")
for j in sorted(jobs, key=lambda x: x.get('name', '')):
    if j.get('enabled'):
        print(f"- {j['name']}")
        state = j.get('state', {})
        if state.get('lastStatus') == 'error':
            print(f"  (last error: {state.get('lastError', 'unknown')})")

print("\n=== Disabled jobs ===")
for j in sorted(jobs, key=lambda x: x.get('name', '')):
    if not j.get('enabled'):
        print(f"- {j['name']}")

print(f"\nTotal: {len(jobs)}, enabled: {sum(1 for j in jobs if j['enabled'])}, disabled: {sum(1 for j in jobs if not j['enabled'])}")