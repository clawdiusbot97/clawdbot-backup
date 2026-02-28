#!/usr/bin/env python3
import json
import sys

def main():
    jobs_path = '/home/manpac/.openclaw/cron/jobs.json'
    patch_path = '/home/manpac/.openclaw/workspace/cron/PATCHES/disable-only-2026-02-22.json'
    
    with open(jobs_path) as f:
        data = json.load(f)
    
    with open(patch_path) as f:
        patch = json.load(f)
    
    jobs = data.get('jobs', [])
    # Create lookup by id
    job_by_id = {j['id']: j for j in jobs}
    
    changed = []
    for p in patch:
        jid = p['id']
        if jid not in job_by_id:
            print(f"Warning: Job id {jid} ({p['name']}) not found in jobs.json")
            continue
        job = job_by_id[jid]
        if job.get('enabled') != p['enabled']:
            job['enabled'] = p['enabled']
            changed.append(p['name'])
    
    if changed:
        with open(jobs_path, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"Updated {len(changed)} jobs: {', '.join(changed)}")
    else:
        print("No changes needed.")
    
    # Verify counts
    enabled_count = sum(1 for j in jobs if j.get('enabled'))
    disabled_count = sum(1 for j in jobs if not j.get('enabled'))
    print(f"Total jobs: {len(jobs)}, enabled: {enabled_count}, disabled: {disabled_count}")

if __name__ == '__main__':
    main()