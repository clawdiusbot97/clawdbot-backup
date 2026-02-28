import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const app = express();
const PORT = process.env.PORT || 3001;

const WORKSPACE_DIR = '/home/manpac/.openclaw/workspace';
const DASHBOARD_DIR = path.join(WORKSPACE_DIR, 'dashboard');
const DISPATCH_QUEUE_DIR = path.join(DASHBOARD_DIR, 'dispatch-queue');

const FILES = {
  agents: path.join(DASHBOARD_DIR, 'agents.md'),
  tasks: path.join(DASHBOARD_DIR, 'tasks.md'),
  handoffs: path.join(DASHBOARD_DIR, 'handoffs.md'),
  models: path.join(DASHBOARD_DIR, 'models.md'),
  briefing: path.join(DASHBOARD_DIR, 'briefing-config.md'),
  approvals: path.join(DASHBOARD_DIR, 'approvals.md'),
  runtimeRuns: path.join(DASHBOARD_DIR, 'runtime-runs.json')
};

const TASK_STATUS_ORDER = ['Pending', 'In Progress', 'Needs Approval', 'Completed'];

app.use(express.json());

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function loadFile(filePath) {
  const [content, stat] = await Promise.all([
    fs.readFile(filePath, 'utf8'),
    fs.stat(filePath)
  ]);
  return { content, mtime: stat.mtime.toISOString() };
}

async function loadFileSafe(filePath, fallback = '') {
  try {
    return await loadFile(filePath);
  } catch {
    return { content: fallback, mtime: null };
  }
}

function clean(v) {
  if (!v) return '';
  return v.trim().replace(/^_none_$/i, 'none');
}

function normalizeAgentName(v) {
  return (v || '').trim().toLowerCase();
}

function hasApprovalMarker(text) {
  return /(NEEDS_APPROVAL|@Manu)/i.test(text || '');
}

function hasMention(text) {
  return /@Manu/i.test(text || '');
}

function parseAgents(content) {
  const inlineUpdated = content.match(/Last updated:\s*([^\n]+)/i)?.[1]?.trim() || null;
  const parts = content.split(/\n##\s+/).slice(1);

  return {
    sourceUpdated: inlineUpdated,
    agents: parts.map((part) => {
      const [nameLine, ...rest] = part.split('\n');
      const name = nameLine.trim();
      const body = rest.join('\n');
      const role = clean(body.match(/-\s*Role:\s*([^\n]+)/i)?.[1]);
      const currentTask = clean(body.match(/-\s*Current task:\s*([^\n]+)/i)?.[1]);
      const queue = clean(body.match(/-\s*Queue:\s*([^\n]+)/i)?.[1]);
      const lastCompleted = clean(body.match(/-\s*Last completed:\s*([^\n]+)/i)?.[1]);
      return { name, role, currentTask, queue, lastCompleted };
    })
  };
}

function parseTaskDetailLine(rawLine) {
  const line = rawLine.trim().replace(/^[-*]\s*/, '');

  const deliverable = line.match(/^deliverable:\s*([^|]+?)\s*\|\s*path:\s*(.+)$/i);
  if (deliverable) {
    return {
      kind: 'deliverable',
      value: {
        name: deliverable[1].trim(),
        path: deliverable[2].trim()
      }
    };
  }

  const keyValue = line.match(/^([a-zA-Z ]+):\s*(.+)$/);
  if (keyValue) {
    const key = keyValue[1].trim().toLowerCase();
    const value = keyValue[2].trim();
    if (['description', 'context'].includes(key)) return { kind: 'description', value };
    if (['comment', 'comments', 'timeline', 'update', 'note'].includes(key)) return { kind: 'timeline', value };
    if (['attachment', 'attachments'].includes(key)) return { kind: 'attachment', value };
    if (['completed', 'completed at', 'completedat', 'done at', 'finished at', 'finished'].includes(key)) return { kind: 'completedAt', value };
  }

  return { kind: 'timeline', value: line };
}

function parseTaskItem(line, sectionStatus, detailLines = []) {
  const item = line.replace(/^[-*]\s*/, '');
  const done = /^\[x\]/i.test(item);
  const text = item.replace(/^\[[ x]\]\s*/i, '').trim();
  const id = text.match(/^(T-\d+)/i)?.[1] || null;
  const owner = normalizeAgentName(text.match(/\(\s*owner:\s*([^)]+)\)/i)?.[1] || '');

  const deliverables = [];
  const timeline = [];
  const attachments = [];
  let description = '';
  let completedAt = null;

  for (const rawDetail of detailLines) {
    const parsed = parseTaskDetailLine(rawDetail);
    if (parsed.kind === 'deliverable') deliverables.push(parsed.value);
    if (parsed.kind === 'timeline') timeline.push(parsed.value);
    if (parsed.kind === 'attachment') attachments.push(parsed.value);
    if (parsed.kind === 'description' && !description) description = parsed.value;
    if (parsed.kind === 'completedAt' && !completedAt) completedAt = parsed.value;
  }

  const mentionTexts = [text, description, ...timeline, ...attachments, ...deliverables.map((d) => d.name)].join(' ');
  const mentionDetected = hasMention(mentionTexts);
  const approvalRequired = hasApprovalMarker(mentionTexts);

  let status = sectionStatus;
  if (approvalRequired && sectionStatus !== 'Completed') status = 'Needs Approval';
  if (done) status = 'Completed';

  return {
    id,
    done,
    text,
    owner: owner || null,
    approvalRequired,
    mentionDetected,
    description: description || null,
    timeline,
    attachments,
    deliverables,
    completedAt,
    status,
    source: 'tasks.md'
  };
}

function parseTasks(content) {
  const byStatus = Object.fromEntries(TASK_STATUS_ORDER.map((status) => [status, []]));

  for (const status of TASK_STATUS_ORDER) {
    const section = content.match(new RegExp(`##\\s+${status}\\n([\\s\\S]*?)(?=\\n##\\s+|$)`, 'i'))?.[1] || '';
    const lines = section.split('\n');

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (!line.trim().startsWith('-')) continue;
      if (/^\s*[-*]\s*_none_\s*$/i.test(line)) continue;

      const detailLines = [];
      let j = i + 1;
      while (j < lines.length) {
        const next = lines[j];
        if (/^\s+/.test(next) && next.trim()) {
          detailLines.push(next);
          j += 1;
          continue;
        }
        break;
      }
      i = j - 1;

      const task = parseTaskItem(line.trim(), status, detailLines);
      byStatus[task.status].push(task);
    }
  }

  return { byStatus };
}

function parseHandoffs(content) {
  const section = content.match(/##\s+Recent\n([\s\S]*?)(?=\n##\s+|$)/i)?.[1] || '';
  const entries = section
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('- '))
    .map((l) => l.replace(/^-\s+/, ''))
    .map((line) => {
      const [timestamp = '', fromTo = '', askPart = '', resultPart = '', refsPart = ''] = line.split('|').map((p) => p.trim());
      const [from = '', to = ''] = fromTo.split('->').map((p) => normalizeAgentName(p));
      return {
        timestamp,
        from,
        to,
        ask: askPart.replace(/^ask:\s*/i, ''),
        result: resultPart.replace(/^result:\s*/i, ''),
        refs: refsPart.replace(/^refs:\s*/i, '')
      };
    });
  return { entries };
}

function parseModels(content) {
  const planTitle = content.match(/##\s+([^\n]*Cost Plan[^\n]*)/i)?.[1]?.trim() || 'Cost Plan';
  const planSection = content.match(/##\s+[^\n]*Cost Plan[^\n]*\n([\s\S]*?)(?=\n##\s+|$)/i)?.[1] || '';
  const agents = planSection
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('- **'))
    .map((line) => {
      const m = line.match(/-\s*\*\*([^*]+)\*\*:\s*`([^`]+)`\s*\(([^)]+)\)/);
      if (!m) return null;
      return { agent: normalizeAgentName(m[1].trim()), model: m[2].trim(), note: m[3].trim() };
    })
    .filter(Boolean);

  const policySection = content.match(/##\s+Sub-agent cost safety policy\n([\s\S]*?)(?=\n##\s+|$)/i)?.[1] || '';
  const policy = Object.fromEntries(
    policySection
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('-'))
      .map((l) => l.replace(/^-\s*/, ''))
      .map((l) => {
        const [k, ...rest] = l.split(':');
        return [k.trim(), rest.join(':').trim().replace(/^`|`$/g, '')];
      })
  );

  return { planTitle, agents, policy };
}

function parseBriefing(content) {
  const rows = content
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('-'))
    .map((l) => l.replace(/^-\s*/, '').replace(/<!--.*?-->/g, '').trim())
    .map((l) => {
      const [k, ...rest] = l.split(':');
      return [k.trim(), rest.join(':').trim().replace(/^`|`$/g, '')];
    });
  return { config: Object.fromEntries(rows) };
}

function parseApprovals(content) {
  const lines = content.split('\n');
  const entries = [];
  let current = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (/^-\s+id:\s*/i.test(line)) {
      if (current) entries.push(current);
      current = { id: line.replace(/^-\s+id:\s*/i, '').trim() };
      continue;
    }

    if (!current) continue;

    const m = line.match(/^[-*]?\s*([a-zA-Z][a-zA-Z0-9]*):\s*(.*)$/);
    if (!m) continue;
    const key = m[1].trim();
    const value = m[2].trim();
    current[key] = value;
  }

  if (current) entries.push(current);

  return {
    entries,
    pending: entries.filter((x) => (x.status || '').toLowerCase() === 'pending')
  };
}

function createApprovalEntry({ type, title, message }) {
  const now = new Date().toISOString();
  const id = `APR-${Date.now()}`;
  return {
    id,
    type,
    title,
    message,
    requestedAt: now,
    status: 'pending'
  };
}

function formatApproval(entry) {
  const preferredOrder = [
    'id', 'type', 'title', 'message', 'targetAgents', 'requestedAt', 'status',
    'approvedAt', 'approvedBy', 'rejectedAt', 'rejectedBy', 'executedAt',
    'failedAt', 'failureReason', 'dispatchState', 'dispatchJobId', 'lastUpdatedAt'
  ];

  const lines = [`- id: ${entry.id}`];
  for (const key of preferredOrder) {
    if (key === 'id') continue;
    if (entry[key] == null || entry[key] === '') continue;
    lines.push(`  ${key}: ${String(entry[key]).replace(/\n/g, ' ')}`);
  }

  for (const [key, value] of Object.entries(entry)) {
    if (preferredOrder.includes(key)) continue;
    if (value == null || value === '') continue;
    lines.push(`  ${key}: ${String(value).replace(/\n/g, ' ')}`);
  }

  lines.push('');
  return lines.join('\n');
}

async function writeApprovals(entries) {
  const header = '# Dashboard Approvals Queue\n\n';
  const body = entries.map((e) => formatApproval(e)).join('\n');
  await fs.writeFile(FILES.approvals, `${header}${body}`.trimEnd() + '\n', 'utf8');
}

async function appendApproval(entry) {
  const existing = await loadFileSafe(FILES.approvals, '# Dashboard Approvals Queue\n\n');
  const parsed = parseApprovals(existing.content).entries;
  parsed.push(entry);
  await writeApprovals(parsed);
}

function toIsoNow() {
  return new Date().toISOString();
}

async function appendHandoffEvent({ approvalId, action, result, actor, type, title, detail = '' }) {
  const existing = await loadFileSafe(FILES.handoffs, '# Dashboard Handoffs\n\n## Recent\n');
  const base = existing.content.trimEnd();
  const ts = toIsoNow();
  const refs = `approval:${approvalId}; type:${type || 'unknown'}; title:${title || '—'}; actor:${actor || 'dashboard'}${detail ? `; detail:${detail}` : ''}`;
  const line = `- ${ts} | dashboard -> dispatcher | ask: ${action} approval ${approvalId} | result: ${result} | refs: ${refs}`;

  if (!/##\s+Recent/i.test(base)) {
    const next = `${base}\n\n## Recent\n${line}\n`;
    await fs.writeFile(FILES.handoffs, next, 'utf8');
    return;
  }

  const next = `${base}\n${line}\n`;
  await fs.writeFile(FILES.handoffs, next, 'utf8');
}

function parseRuntimeRunsJson(raw) {
  try {
    const parsed = JSON.parse(raw || '[]');
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed?.runs)) return parsed.runs;
    return [];
  } catch {
    return [];
  }
}

async function loadRuntimeRunsFromFile() {
  const raw = await loadFileSafe(FILES.runtimeRuns, '[]');
  return parseRuntimeRunsJson(raw.content);
}

function parseRunsFromSessionsJson(stdout) {
  try {
    const parsed = JSON.parse(stdout || '{}');
    const sessions = Array.isArray(parsed?.sessions) ? parsed.sessions : [];
    const now = Date.now();
    return sessions
      .filter((s) => String(s.key || '').includes(':subagent:'))
      .map((s) => {
        const updatedAtMs = Number(s.updatedAt || 0);
        const ageMs = now - updatedAtMs;
        const isActive = Number.isFinite(ageMs) && ageMs >= 0 && ageMs <= 15 * 60 * 1000;
        return {
          id: s.key,
          agent: (String(s.key).split(':')[1] || 'runtime').toLowerCase(),
          status: isActive ? 'running' : 'completed',
          title: `Session ${s.key}`,
          startedAt: s.updatedAt ? new Date(Number(s.updatedAt)).toISOString() : null,
          updatedAt: s.updatedAt ? new Date(Number(s.updatedAt)).toISOString() : null,
          source: 'sessions-list'
        };
      });
  } catch {
    return [];
  }
}

async function loadRuntimeRunsBestEffort() {
  try {
    const { stdout } = await execFileAsync('openclaw', ['sessions', 'list', '--json', '--active-minutes', '120'], {
      cwd: WORKSPACE_DIR,
      timeout: 3000,
      windowsHide: true,
      maxBuffer: 1024 * 1024
    });
    const runs = parseRunsFromSessionsJson(stdout);
    if (runs.length > 0) return runs;
  } catch {
    // fallback below
  }

  return loadRuntimeRunsFromFile();
}

function mapLiveRunToTask(run, idx = 0) {
  const id = String(run.id || run.runId || run.sessionId || `RUN-${idx + 1}`);
  const owner = normalizeAgentName(run.agent || run.name || run.worker || run.owner || 'runtime');
  const statusRaw = String(run.status || run.state || 'running').toLowerCase();
  const status = /done|complete|finished|success/.test(statusRaw)
    ? 'Completed'
    : /approval/.test(statusRaw)
      ? 'Needs Approval'
      : 'In Progress';

  const title = String(run.title || run.task || run.prompt || `Live run ${id}`);
  const startedAt = run.startedAt || run.createdAt || null;
  const completedAt = run.completedAt || run.endedAt || (/done|complete|finished|success/.test(statusRaw) ? (run.updatedAt || null) : null);

  return {
    id,
    done: status === 'Completed',
    text: title,
    owner: owner || 'runtime',
    approvalRequired: status === 'Needs Approval',
    mentionDetected: false,
    description: run.description || `Live runtime run (${statusRaw})`,
    timeline: [
      `Runtime source: subagents/live`,
      `Run status: ${statusRaw}`,
      startedAt ? `Started: ${startedAt}` : null,
      completedAt ? `Completed: ${completedAt}` : null
    ].filter(Boolean),
    attachments: [],
    deliverables: [],
    completedAt,
    status,
    source: 'live-runs'
  };
}

function mergeLiveRunsIntoTasks(parsedTasks, runs) {
  const merged = {
    byStatus: {
      Pending: [...(parsedTasks.byStatus.Pending || [])],
      'In Progress': [...(parsedTasks.byStatus['In Progress'] || [])],
      'Needs Approval': [...(parsedTasks.byStatus['Needs Approval'] || [])],
      Completed: [...(parsedTasks.byStatus.Completed || [])]
    }
  };

  const existingIds = new Set(
    Object.values(merged.byStatus)
      .flat()
      .map((t) => t.id)
      .filter(Boolean)
  );

  runs.forEach((run, idx) => {
    const task = mapLiveRunToTask(run, idx);
    const key = task.status;
    if (task.id && existingIds.has(task.id)) return;
    if (!merged.byStatus[key]) merged.byStatus[key] = [];
    merged.byStatus[key].push(task);
    if (task.id) existingIds.add(task.id);
  });

  return merged;
}

async function createDispatchJob(approval, actor = 'dashboard-ui') {
  await ensureDir(DISPATCH_QUEUE_DIR);
  const jobId = `JOB-${approval.id}`;
  const filePath = path.join(DISPATCH_QUEUE_DIR, `${jobId}.json`);

  const job = {
    jobId,
    approvalId: approval.id,
    type: approval.type,
    title: approval.title,
    message: approval.message,
    targetAgents: approval.targetAgents || 'all',
    requestedAt: approval.requestedAt,
    approvedAt: approval.approvedAt,
    approvedBy: actor,
    state: 'queued',
    createdAt: toIsoNow(),
    dispatch: {
      mode: 'staged-executor',
      instructions: approval.type === 'notify'
        ? 'Send Telegram notification to Manu (2017549847) with concise context.'
        : 'Send internal instruction message to selected/all agents via session tooling only (no public external channel).'
    }
  };

  try {
    await fs.access(filePath);
    return { jobId, filePath, created: false };
  } catch {
    await fs.writeFile(filePath, JSON.stringify(job, null, 2) + '\n', 'utf8');
    return { jobId, filePath, created: true };
  }
}

async function loadApprovalsEntries() {
  const raw = await loadFileSafe(FILES.approvals, '# Dashboard Approvals Queue\n\n');
  return parseApprovals(raw.content).entries;
}

async function updateApprovalById(approvalId, updater) {
  const entries = await loadApprovalsEntries();
  const idx = entries.findIndex((e) => e.id === approvalId);
  if (idx === -1) return { found: false };

  const next = { ...entries[idx] };
  updater(next);
  next.lastUpdatedAt = toIsoNow();
  entries[idx] = next;
  await writeApprovals(entries);
  return { found: true, entry: next };
}

async function approveOne(approvalId, actor = 'dashboard-ui') {
  const entries = await loadApprovalsEntries();
  const idx = entries.findIndex((e) => e.id === approvalId);
  if (idx === -1) return { ok: false, code: 404, error: 'Approval not found' };

  const current = entries[idx];
  const status = String(current.status || '').toLowerCase();
  if (['executed', 'failed', 'rejected'].includes(status)) {
    return { ok: true, idempotent: true, entry: current, note: `Already ${status}` };
  }

  if (status === 'approved' && current.dispatchJobId) {
    return { ok: true, idempotent: true, entry: current, note: 'Already approved/queued' };
  }

  const now = toIsoNow();
  const updated = {
    ...current,
    status: 'approved',
    approvedAt: current.approvedAt || now,
    approvedBy: actor,
    dispatchState: current.dispatchState || 'queued'
  };

  const job = await createDispatchJob(updated, actor);
  updated.dispatchJobId = updated.dispatchJobId || job.jobId;

  entries[idx] = updated;
  await writeApprovals(entries);

  await appendHandoffEvent({
    approvalId,
    action: 'approve',
    result: job.created ? 'approved and dispatch queued' : 'approved (dispatch already queued)',
    actor,
    type: updated.type,
    title: updated.title
  });

  return { ok: true, entry: updated, dispatchJob: job };
}

async function rejectOne(approvalId, actor = 'dashboard-ui') {
  const result = await updateApprovalById(approvalId, (entry) => {
    const status = String(entry.status || '').toLowerCase();
    if (['executed', 'failed'].includes(status)) return;
    entry.status = 'rejected';
    entry.rejectedAt = entry.rejectedAt || toIsoNow();
    entry.rejectedBy = actor;
    if (!entry.dispatchState) entry.dispatchState = 'none';
  });

  if (!result.found) return { ok: false, code: 404, error: 'Approval not found' };

  await appendHandoffEvent({
    approvalId,
    action: 'reject',
    result: 'rejected',
    actor,
    type: result.entry.type,
    title: result.entry.title
  });

  return { ok: true, entry: result.entry };
}

async function listDispatchJobs() {
  await ensureDir(DISPATCH_QUEUE_DIR);
  const names = await fs.readdir(DISPATCH_QUEUE_DIR);
  const jobs = [];
  for (const name of names.filter((n) => n.endsWith('.json')).sort()) {
    const fp = path.join(DISPATCH_QUEUE_DIR, name);
    try {
      const content = await fs.readFile(fp, 'utf8');
      jobs.push(JSON.parse(content));
    } catch {
      // ignore malformed
    }
  }
  return jobs;
}

async function markApprovalDispatchResult(approvalId, nextStatus, actor, detail = '') {
  const now = toIsoNow();
  const result = await updateApprovalById(approvalId, (entry) => {
    entry.status = nextStatus;
    entry.dispatchState = nextStatus;
    if (nextStatus === 'executed') entry.executedAt = now;
    if (nextStatus === 'failed') {
      entry.failedAt = now;
      entry.failureReason = detail || 'dispatch failed';
    }
    entry.approvedBy = entry.approvedBy || actor;
  });

  return result;
}

async function processDispatchJob(job, actor = 'dispatcher') {
  const approvalId = job.approvalId;
  const approvals = await loadApprovalsEntries();
  const approval = approvals.find((a) => a.id === approvalId);
  if (!approval) {
    return { ok: false, approvalId, error: 'Missing approval for dispatch job' };
  }

  const status = String(approval.status || '').toLowerCase();
  if (status === 'executed') {
    return { ok: true, idempotent: true, approvalId, note: 'already executed' };
  }
  if (status !== 'approved') {
    return { ok: false, approvalId, error: `approval status must be approved, got ${status || 'unknown'}` };
  }

  // Staged executor: records safe execution handoff for main agent/manual processor.
  const actionText = approval.type === 'notify'
    ? 'notify Manu on Telegram (2017549847) with concise context'
    : 'broadcast internal instruction to selected/all agents via session tooling (internal only)';

  await appendHandoffEvent({
    approvalId,
    action: 'dispatch',
    result: `executed staged dispatch: ${actionText}`,
    actor,
    type: approval.type,
    title: approval.title,
    detail: `job:${job.jobId}`
  });

  await markApprovalDispatchResult(approvalId, 'executed', actor);

  const fp = path.join(DISPATCH_QUEUE_DIR, `${job.jobId}.json`);
  try {
    await fs.unlink(fp);
  } catch {
    // ignore
  }

  return { ok: true, approvalId, jobId: job.jobId, action: actionText };
}

function deriveAgents(baseAgents, tasks, handoffs, modelEntries) {
  const modelByAgent = new Map(modelEntries.map((m) => [normalizeAgentName(m.agent), m.model]));

  const completed = tasks.byStatus.Completed || [];
  const inProgress = tasks.byStatus['In Progress'] || [];
  const pending = tasks.byStatus.Pending || [];
  const needsApproval = tasks.byStatus['Needs Approval'] || [];

  const byAgentCompleted = new Map();
  for (const t of completed) {
    if (!t.owner) continue;
    if (!byAgentCompleted.has(t.owner)) byAgentCompleted.set(t.owner, []);
    byAgentCompleted.get(t.owner).push(t);
  }

  const handoffsByAgent = new Map();
  for (const h of handoffs.entries) {
    const participants = [h.from, h.to].filter(Boolean);
    for (const agent of participants) {
      if (!handoffsByAgent.has(agent)) handoffsByAgent.set(agent, []);
      handoffsByAgent.get(agent).push(h);
    }
  }

  const known = new Set(baseAgents.map((a) => normalizeAgentName(a.name)).filter(Boolean));
  const runtimeOwners = [...pending, ...inProgress, ...needsApproval]
    .map((t) => t.owner)
    .filter(Boolean)
    .filter((name) => !known.has(name));

  const synthetic = [...new Set(runtimeOwners)].map((name) => ({
    name,
    role: 'runtime worker',
    currentTask: 'live runtime run',
    queue: 'live',
    lastCompleted: ''
  }));

  return [...baseAgents, ...synthetic].map((agent) => {
    const name = normalizeAgentName(agent.name);
    const model = modelByAgent.get(name) || null;

    const hasNeedsApproval = [...pending, ...inProgress, ...needsApproval].some((t) => t.owner === name && t.approvalRequired);
    const hasInProgress = inProgress.some((t) => t.owner === name);
    let status = 'idle';
    if (hasNeedsApproval) status = 'needs input';
    if (agent.currentTask && agent.currentTask !== 'none') status = 'working';
    if (hasInProgress) status = 'working';

    let lastCompletedDerived = agent.lastCompleted && agent.lastCompleted !== 'none' ? agent.lastCompleted : '';

    if (!lastCompletedDerived) {
      const completedForAgent = byAgentCompleted.get(name) || [];
      if (completedForAgent.length > 0) {
        const latestTask = completedForAgent[completedForAgent.length - 1];
        lastCompletedDerived = `Task ${latestTask.id || ''} ${latestTask.text}`.trim();
      }
    }

    if (!lastCompletedDerived) {
      const handoffsForAgent = handoffsByAgent.get(name) || [];
      if (handoffsForAgent.length > 0) {
        const latestHandoff = handoffsForAgent[handoffsForAgent.length - 1];
        lastCompletedDerived = `${latestHandoff.timestamp} — ${latestHandoff.result || latestHandoff.ask}`;
      }
    }

    return {
      ...agent,
      name,
      model,
      status,
      lastCompletedDerived: lastCompletedDerived || null
    };
  });
}

function summary(data) {
  const agentsActive = data.agents.agents.filter((a) => a.status === 'working').length;
  const pendingTasks = data.tasks.byStatus.Pending.length;
  const inProgressTasks = data.tasks.byStatus['In Progress'].length;
  const completedTasks = data.tasks.byStatus.Completed.length;
  const needsApprovalTasks = data.tasks.byStatus['Needs Approval'].length;
  const recentHandoffs = data.handoffs.entries.length;
  const pendingApprovals = data.approvals.pending.length;
  const liveRuns = data.runtime.runs.length;
  return { agentsActive, pendingTasks, inProgressTasks, completedTasks, needsApprovalTasks, recentHandoffs, pendingApprovals, liveRuns };
}

async function buildData() {
  const [agentsRaw, tasksRaw, handoffsRaw, modelsRaw, briefingRaw, approvalsRaw, runtimeRuns] = await Promise.all([
    loadFile(FILES.agents),
    loadFile(FILES.tasks),
    loadFile(FILES.handoffs),
    loadFile(FILES.models),
    loadFile(FILES.briefing),
    loadFileSafe(FILES.approvals, '# Dashboard Approvals Queue\n\n'),
    loadRuntimeRunsBestEffort()
  ]);

  const parsedAgents = parseAgents(agentsRaw.content);
  const parsedTasks = parseTasks(tasksRaw.content);
  const mergedTasks = mergeLiveRunsIntoTasks(parsedTasks, runtimeRuns);
  const parsedHandoffs = parseHandoffs(handoffsRaw.content);
  const parsedModels = parseModels(modelsRaw.content);
  const parsedApprovals = parseApprovals(approvalsRaw.content);

  const enrichedAgents = deriveAgents(
    parsedAgents.agents,
    mergedTasks,
    parsedHandoffs,
    parsedModels.agents
  );

  const data = {
    agents: { ...parsedAgents, agents: enrichedAgents, fileUpdated: agentsRaw.mtime },
    tasks: { ...mergedTasks, fileUpdated: tasksRaw.mtime },
    handoffs: { ...parsedHandoffs, fileUpdated: handoffsRaw.mtime },
    models: { ...parsedModels, fileUpdated: modelsRaw.mtime },
    briefing: { ...parseBriefing(briefingRaw.content), fileUpdated: briefingRaw.mtime },
    approvals: { ...parsedApprovals, fileUpdated: approvalsRaw.mtime },
    runtime: { runs: runtimeRuns }
  };

  return { ...data, summary: summary(data), generatedAt: new Date().toISOString() };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'agent-mission-control-api' });
});

app.get('/api/dashboard', async (_req, res) => {
  try {
    const data = await buildData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load dashboard data', detail: err.message });
  }
});

app.post('/api/approvals', async (req, res) => {
  try {
    const { type, title, message, targetAgents } = req.body || {};
    if (!['broadcast', 'notify'].includes(type)) {
      return res.status(400).json({ error: 'Invalid approval type' });
    }
    if (!title || !message) {
      return res.status(400).json({ error: 'title and message are required' });
    }

    const entry = createApprovalEntry({ type, title, message });
    if (targetAgents) entry.targetAgents = String(targetAgents);
    await appendApproval(entry);
    res.status(201).json({ ok: true, entry });
  } catch (err) {
    res.status(500).json({ error: 'Failed to queue approval', detail: err.message });
  }
});

app.post('/api/approvals/:id/approve', async (req, res) => {
  try {
    const actor = String(req.body?.actor || 'dashboard-ui');
    const out = await approveOne(req.params.id, actor);
    if (!out.ok && out.code) return res.status(out.code).json(out);
    return res.json(out);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to approve item', detail: err.message });
  }
});

app.post('/api/approvals/:id/reject', async (req, res) => {
  try {
    const actor = String(req.body?.actor || 'dashboard-ui');
    const out = await rejectOne(req.params.id, actor);
    if (!out.ok && out.code) return res.status(out.code).json(out);
    return res.json(out);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reject item', detail: err.message });
  }
});

app.post('/api/approvals/approve-all', async (req, res) => {
  try {
    const actor = String(req.body?.actor || 'dashboard-ui');
    const entries = await loadApprovalsEntries();
    const pending = entries.filter((e) => String(e.status || '').toLowerCase() === 'pending');
    const results = [];
    for (const entry of pending) {
      // sequential for deterministic file/audit writes
      // eslint-disable-next-line no-await-in-loop
      results.push(await approveOne(entry.id, actor));
    }
    return res.json({ ok: true, count: results.length, results });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to approve all pending', detail: err.message });
  }
});

app.post('/api/approvals/reject-all', async (req, res) => {
  try {
    const actor = String(req.body?.actor || 'dashboard-ui');
    const entries = await loadApprovalsEntries();
    const pending = entries.filter((e) => String(e.status || '').toLowerCase() === 'pending');
    const results = [];
    for (const entry of pending) {
      // eslint-disable-next-line no-await-in-loop
      results.push(await rejectOne(entry.id, actor));
    }
    return res.json({ ok: true, count: results.length, results });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reject all pending', detail: err.message });
  }
});

app.get('/api/dispatch/jobs', async (_req, res) => {
  try {
    const jobs = await listDispatchJobs();
    return res.json({ ok: true, jobs });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to list dispatch jobs', detail: err.message });
  }
});

app.post('/api/dispatch/process-one', async (req, res) => {
  try {
    const actor = String(req.body?.actor || 'dispatcher');
    const jobId = String(req.body?.jobId || '').trim();

    const jobs = await listDispatchJobs();
    const job = jobId ? jobs.find((j) => j.jobId === jobId) : jobs[0];
    if (!job) return res.status(404).json({ error: 'No dispatch job found' });

    const out = await processDispatchJob(job, actor);
    if (!out.ok) return res.status(400).json(out);
    return res.json({ ok: true, result: out });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to process dispatch job', detail: err.message });
  }
});

app.post('/api/dispatch/process-all', async (req, res) => {
  try {
    const actor = String(req.body?.actor || 'dispatcher');
    const jobs = await listDispatchJobs();
    const results = [];
    for (const job of jobs) {
      // eslint-disable-next-line no-await-in-loop
      results.push(await processDispatchJob(job, actor));
    }
    return res.json({ ok: true, count: results.length, results });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to process dispatch jobs', detail: err.message });
  }
});

app.get('/api/workspace-file', async (req, res) => {
  try {
    const relPath = String(req.query.path || '');
    if (!relPath) return res.status(400).json({ error: 'path is required' });

    const resolved = path.resolve(DASHBOARD_DIR, relPath);
    if (!resolved.startsWith(WORKSPACE_DIR)) {
      return res.status(400).json({ error: 'Path outside workspace is not allowed' });
    }

    await fs.access(resolved);
    return res.sendFile(resolved);
  } catch (err) {
    return res.status(404).json({ error: 'File not found', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Agent Mission Control API running on http://localhost:${PORT}`);
});
