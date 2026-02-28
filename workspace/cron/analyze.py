#!/usr/bin/env python3
import json
import os
import re
from datetime import datetime
from pathlib import Path

def main():
    jobs_path = os.path.expanduser('~/.openclaw/cron/jobs.json')
    with open(jobs_path) as f:
        data = json.load(f)
    
    jobs = data.get('jobs', [])
    
    # Normalized fields for inventory
    inventory = []
    for job in jobs:
        norm = {
            'id': job.get('id'),
            'name': job.get('name'),
            'enabled': job.get('enabled', False),
            'schedule': job.get('schedule', {}),
            'agentId': job.get('agentId'),
            'sessionTarget': job.get('sessionTarget'),
            'model': job.get('payload', {}).get('model'),
            'delivery': job.get('delivery', {}),
            'state': job.get('state', {}),
            'createdAtMs': job.get('createdAtMs'),
            'updatedAtMs': job.get('updatedAtMs'),
            'notify': job.get('notify', False),
            'timeoutSeconds': job.get('payload', {}).get('timeoutSeconds'),
            'thinking': job.get('payload', {}).get('thinking'),
        }
        inventory.append(norm)
    
    # Write inventory
    inventory_path = '/home/manpac/.openclaw/workspace/cron/JOBS_INVENTORY.json'
    with open(inventory_path, 'w') as f:
        json.dump(inventory, f, indent=2)
    print(f'Inventory written to {inventory_path}')
    
    # Generate job map markdown
    map_lines = [
        '# Cron Job Map',
        '',
        '| Name | Schedule | Enabled | Category | Purpose | Produces | Consumes | DependsOn | DeliveryTargets | Model | Notes |',
        '|------|----------|---------|----------|---------|----------|----------|-----------|-----------------|-------|-------|',
    ]
    
    # Infer categories and dependencies
    for job in jobs:
        name = job.get('name', '')
        enabled = job.get('enabled', False)
        schedule = job.get('schedule', {})
        schedule_str = json.dumps(schedule)[:30]
        payload = job.get('payload', {})
        message = payload.get('message', '')
        delivery = job.get('delivery', {})
        model = payload.get('model', '')
        
        # Category inference
        category = 'unknown'
        if 'briefing' in name.lower():
            category = 'briefing'
        elif 'healthcheck' in name.lower() or 'health' in name.lower():
            category = 'health'
        elif 'newsletter' in name.lower():
            category = 'newsletter'
        elif 'twitter' in name.lower():
            category = 'twitter'
        elif 'brokia' in name.lower():
            category = 'brokia'
        elif 'qubika' in name.lower():
            category = 'qubika'
        elif 'music' in name.lower():
            category = 'music'
        elif 'nightly' in name.lower():
            category = 'nightly'
        elif 'daily' in name.lower():
            category = 'daily'
        elif 'weekly' in name.lower():
            category = 'weekly'
        elif 'budget' in name.lower() or 'cost' in name.lower():
            category = 'budget'
        elif 'update' in name.lower() or 'backup' in name.lower():
            category = 'maintenance'
        elif 'openclaw' in name.lower():
            category = 'openclaw'
        
        # Purpose extraction
        purpose = ''
        if message:
            # take first line
            lines = message.split('\n')
            first = lines[0].strip()
            if len(first) > 80:
                first = first[:77] + '...'
            purpose = first
        
        # Produces inference from message
        produces = []
        # Look for file paths in message
        for match in re.finditer(r'/(?:home|\.openclaw)[\w/\.\-]+', message):
            path = match.group(0)
            if path.endswith('.md') or path.endswith('.json') or path.endswith('.txt'):
                produces.append(path)
        # Also from delivery targets
        delivery_targets = []
        if delivery.get('channel'):
            target = delivery.get('to', '')
            if target:
                delivery_targets.append(f"{delivery['channel']}:{target}")
        
        # Consumes inference (checkpoints, inputs)
        consumes = []
        # Look for checkpoints references
        if 'checkpoint' in message.lower():
            consumes.append('checkpoints/*')
        
        # Dependencies inference
        depends = []
        # name based: briefing_sources_fetch -> daily-morning-briefing-telegram
        if 'briefing_sources_fetch' in name:
            depends.append('daily-morning-briefing-telegram')
        if 'daily-morning-briefing-telegram' in name:
            depends.append('briefing_sources_fetch')
        # Also look for output file patterns that other jobs might consume
        # This is simplistic; could be extended
        
        # Notes
        notes = ''
        state = job.get('state', {})
        last_status = state.get('lastStatus')
        if last_status == 'error':
            notes = f'Last error: {state.get("lastError", "unknown")}'
        
        map_lines.append(
            f'| {name} | {schedule_str} | {enabled} | {category} | {purpose} | {", ".join(produces[:2])} | {", ".join(consumes)} | {", ".join(depends)} | {", ".join(delivery_targets)} | {model} | {notes} |'
        )
    
    map_path = '/home/manpac/.openclaw/workspace/cron/JOB_MAP.md'
    with open(map_path, 'w') as f:
        f.write('\n'.join(map_lines))
    print(f'Job map written to {map_path}')
    
    # Classification
    classification = []
    for job in jobs:
        name = job.get('name', '')
        enabled = job.get('enabled', False)
        category = 'unknown'
        if 'briefing' in name.lower():
            category = 'briefing'
        elif 'healthcheck' in name.lower() or 'health' in name.lower():
            category = 'health'
        elif 'newsletter' in name.lower():
            category = 'newsletter'
        elif 'twitter' in name.lower():
            category = 'twitter'
        elif 'brokia' in name.lower():
            category = 'brokia'
        elif 'qubika' in name.lower():
            category = 'qubika'
        elif 'music' in name.lower():
            category = 'music'
        elif 'nightly' in name.lower():
            category = 'nightly'
        elif 'daily' in name.lower():
            category = 'daily'
        elif 'weekly' in name.lower():
            category = 'weekly'
        elif 'budget' in name.lower() or 'cost' in name.lower():
            category = 'budget'
        elif 'update' in name.lower() or 'backup' in name.lower():
            category = 'maintenance'
        elif 'openclaw' in name.lower():
            category = 'openclaw'
        
        # Determine KEEP, PAUSE, REMOVE, UNKNOWN
        decision = 'UNKNOWN'
        reason = ''
        
        # KEEP: part of operational pipelines
        if ('newsletter' in name.lower() and 'Daily Newsletter Digest' in name) or \
           ('twitter' in name.lower() and 'RSS' in name) or \
           ('nightly' in name.lower() and any(x in name for x in ['healthcheck', 'cost_guard', 'backlog_groomer', 'trends_gate', 'inbox_triage', 'summary'])) or \
           ('openclaw-healthcheck' in name) or \
           ('daily-openclaw-backup' in name) or \
           ('daily-openclaw-update' in name) or \
           ('briefing_sources_fetch' in name) or \
           ('daily-morning-briefing-telegram' in name) or \
           ('brokia-calendar-alerts-daily' in name) or \
           ('brokia-doc-diario-sync' in name) or \
           ('brokia-doc-maestro-weekly-sync' in name) or \
           ('qubika-daily-focus' in name) or \
           ('qubika-deadline-check' in name) or \
           ('music-trends-scout-5am' in name) or \
           ('music-radar-extended-weekly' in name) or \
           ('Weekly Improvements Review' in name) or \
           ('life-story-daily-question' in name):
            decision = 'KEEP'
            reason = 'Part of operational pipeline'
        # PAUSE: duplicates/legacy/overlapping or not needed today
        elif ('daily-morning-briefing' in name and 'telegram' not in name) or \
             ('healthcheck' in name and 'security-audit' in name) or \
             ('healthcheck' in name and 'update-status' in name) or \
             ('llm-budget-guardian' in name) or \
             ('daily-research-scout' in name) or \
             ('weekly-newsletter-metrics' in name) or \
             ('itau-daily-spend-analysis' in name) or \
             ('Morning Twitter Briefing' in name) or \
             ('Twitter RSS Digest' in name and not enabled) or \
             (not enabled and 'error' in str(job.get('state', {}).get('lastStatus'))):
            decision = 'PAUSE'
            reason = 'Duplicate/legacy/overlapping or currently failing'
        # REMOVE: clearly obsolete (but we will only disable)
        elif ('llm-budget-guardian' in name and not enabled) or \
             ('daily-research-scout' in name and not enabled):
            decision = 'REMOVE'
            reason = 'Obsolete'
        else:
            decision = 'UNKNOWN'
            reason = 'Insufficient data'
        
        classification.append({
            'id': job.get('id'),
            'name': name,
            'enabled': enabled,
            'category': category,
            'decision': decision,
            'reason': reason
        })
    
    # Write classification summary (optional)
    class_path = '/home/manpac/.openclaw/workspace/cron/CLASSIFICATION.json'
    with open(class_path, 'w') as f:
        json.dump(classification, f, indent=2)
    
    # Generate disable-only patch
    patch = []
    for cls in classification:
        if cls['decision'] in ['PAUSE', 'REMOVE']:
            patch.append({
                'id': cls['id'],
                'name': cls['name'],
                'action': 'disable',
                'enabled': False
            })
    
    # Create patches directory
    patches_dir = '/home/manpac/.openclaw/workspace/cron/PATCHES'
    os.makedirs(patches_dir, exist_ok=True)
    patch_date = datetime.utcnow().strftime('%Y-%m-%d')
    patch_path = os.path.join(patches_dir, f'disable-only-{patch_date}.json')
    with open(patch_path, 'w') as f:
        json.dump(patch, f, indent=2)
    print(f'Patch written to {patch_path}')
    
    # Generate CLEANUP_LOG.md
    log_lines = [
        '# Cron Cleanup Log',
        f'Generated: {datetime.utcnow().isoformat()}Z',
        '',
        '## Reasoning Summary',
        'Jobs classified based on operational pipelines, duplicates, and failure states.',
        '',
        '## Risk Assessment (What could break)',
        '1. Disabling `briefing_sources_fetch` would break morning briefing freshness.',
        '2. Disabling `daily-morning-briefing-telegram` would stop daily briefing delivery.',
        '3. Disabling any nightly chain job could disrupt nightly reports.',
        '4. Disabling `openclaw-healthcheck` would stop periodic gateway preflight checks.',
        '5. Disabling `daily-openclaw-backup` would stop daily backups.',
        '6. Disabling `daily-openclaw-update` would stop auto-updates.',
        '7. Disabling `brokia-calendar-alerts-daily` would miss calendar alerts.',
        '8. Disabling `qubika-daily-focus` would miss Qubika daily focus.',
        '',
        '## Checklist: Verification of Outputs per Pipeline',
        '### Newsletter Pipeline',
        '- [ ] Daily Newsletter Digest runs at 9:00 UTC',
        '- [ ] Sources: nytdirect@nytimes.com, news@thehustle.co, dan@tldrnewsletter.com, hello@historyfacts.com, newsletter@aisecret.us, newsletter@themarginalian.org, rw@peterc.org, node@cooperpress.com',
        '- [ ] Output: newsletter‑digest‑YYYY‑MM‑DD.md',
        '- [ ] Delivery: Telegram group -5295394319',
        '',
        '### Twitter Pipeline',
        '- [ ] Twitter RSS Digest runs every 12 hours (if enabled)',
        '- [ ] Morning Twitter Briefing at 8:00 AM Montevideo',
        '- [ ] Output: raw tweet data, formatted digest',
        '- [ ] Delivery: Telegram group -5095009832',
        '',
        '### Nightly Chain',
        '- [ ] nightly_healthcheck at 2:00 AM',
        '- [ ] nightly_cost_guard at 2:10',
        '- [ ] nightly_backlog_groomer at 2:20',
        '- [ ] nightly_trends_gate at 2:40',
        '- [ ] nightly_inbox_triage at 3:10',
        '- [ ] nightly_summary at 3:30',
        '- [ ] Outputs: reports/nightly/*',
        '- [ ] Delivery: only if critical (Telegram 2017549847)',
        '',
        '### Brokia Pipeline',
        '- [ ] brokia-calendar-alerts-daily at 7:10 AM',
        '- [ ] brokia-doc-diario-sync at 9:30 PM',
        '- [ ] brokia-doc-maestro-weekly-sync at 10:00 PM Sunday',
        '- [ ] Outputs: bitácora diaria, Google Docs',
        '',
        '### Qubika Pipeline',
        '- [ ] qubika-daily-focus at 8:30 AM Monday/Thursday',
        '- [ ] qubika-deadline-check at 5:30 PM Mon‑Fri',
        '',
        '### Music Pipeline',
        '- [ ] music-trends-scout-5am at 5:00 AM Mon/Wed/Fri',
        '- [ ] music-radar-extended-weekly at 11:00 AM Sunday',
        '',
        '### Maintenance Pipeline',
        '- [ ] openclaw-healthcheck every 6 hours',
        '- [ ] daily-openclaw-update at 4:00 AM',
        '- [ ] daily-openclaw-backup at 4:30 AM',
        '',
        '### Briefing Pipeline',
        '- [ ] briefing_sources_fetch at 7:50 AM',
        '- [ ] daily-morning-briefing-telegram at 8:00 AM',
        '',
        '### Other',
        '- [ ] Weekly Improvements Review at 0:00 UTC Monday',
        '- [ ] life-story-daily-question at 2:30 PM Montevideo',
        '',
        '## Notes',
        '- Patch only disables jobs classified as PAUSE/REMOVE.',
        '- No jobs deleted; enabled flag set to false.',
        '- Review each pipeline after changes to ensure continuity.',
    ]
    
    log_path = '/home/manpac/.openclaw/workspace/cron/CLEANUP_LOG.md'
    with open(log_path, 'w') as f:
        f.write('\n'.join(log_lines))
    print(f'Cleanup log written to {log_path}')
    
    # Summary counts
    keep = sum(1 for cls in classification if cls['decision'] == 'KEEP')
    pause = sum(1 for cls in classification if cls['decision'] == 'PAUSE')
    remove = sum(1 for cls in classification if cls['decision'] == 'REMOVE')
    unknown = sum(1 for cls in classification if cls['decision'] == 'UNKNOWN')
    
    print('\n--- Summary ---')
    print(f'Total jobs: {len(jobs)}')
    print(f'KEEP: {keep}')
    print(f'PAUSE: {pause}')
    print(f'REMOVE: {remove}')
    print(f'UNKNOWN: {unknown}')
    print(f'Patch disables {pause + remove} jobs.')

if __name__ == '__main__':
    main()