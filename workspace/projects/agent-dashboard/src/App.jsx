import React, { useEffect, useMemo, useState } from 'react';

const VIEWS = [
  { key: 'agents', label: 'Agents' },
  { key: 'tasks', label: 'Tasks' },
  { key: 'completed', label: 'Completed' },
  { key: 'handoffs', label: 'Handoffs' },
  { key: 'models', label: 'Models/Cost' },
  { key: 'briefing', label: 'Briefing Status' },
  { key: 'approvals', label: 'Approvals' }
];

const REFRESH_INTERVAL_MS = 600000;

function fmt(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleString();
}

function shortText(value, max = 72) {
  if (!value) return '—';
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}

function Card({ label, value }) {
  return (
    <div className="card stat-card">
      <div className="muted">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

function SectionHeader({ title, updated, lastFetched }) {
  return (
    <div className="section-head">
      <h2>{title}</h2>
      <div className="muted section-meta">
        <div>Last fetched: {fmt(lastFetched)}</div>
        <div>Source file update: {fmt(updated)}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const key = String(status || '').toLowerCase();
  const css = {
    working: 'badge-working',
    idle: 'badge-idle',
    'needs input': 'badge-needs-input',
    pending: 'badge-idle',
    'in progress': 'badge-working',
    completed: 'badge-completed',
    'needs approval': 'badge-needs-input',
    approved: 'badge-working',
    rejected: 'badge-idle',
    executed: 'badge-completed',
    failed: 'badge-needs-input'
  }[key] || 'badge-idle';
  return <span className={`badge ${css}`}>{status || 'idle'}</span>;
}

function safeLink(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `/api/workspace-file?path=${encodeURIComponent(path)}`;
}

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('agents');
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [lastFetched, setLastFetched] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [submitState, setSubmitState] = useState('idle');

  async function load({ silent = false } = {}) {
    if (!silent) setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/dashboard');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setLastFetched(new Date().toISOString());
    } catch (e) {
      setError(e.message || 'Failed to load data');
    } finally {
      if (!silent) setLoading(false);
    }
  }

  async function queueApproval(type, title, message) {
    const res = await fetch('/api/approvals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, title, message })
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `HTTP ${res.status}`);
    }
    await load({ silent: true });
  }

  async function approvalAction(url) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor: 'dashboard-ui' })
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `HTTP ${res.status}`);
    }
    await load({ silent: true });
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      load({ silent: true });
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const cards = useMemo(() => {
    if (!data) return [];
    return [
      { label: 'Active agents', value: data.summary.agentsActive },
      { label: 'Pending tasks', value: data.summary.pendingTasks },
      { label: 'In progress', value: data.summary.inProgressTasks },
      { label: 'Completed tasks', value: data.summary.completedTasks || 0 },
      { label: 'Live runs', value: data.summary.liveRuns || 0 },
      { label: 'Needs approval', value: data.summary.needsApprovalTasks || 0 },
      { label: 'Pending approvals', value: data.summary.pendingApprovals || 0 }
    ];
  }, [data]);

  const agentsList = data?.agents?.agents || [];

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>Agent Mission Control</h1>
          <div className="muted">Generated: {data ? fmt(data.generatedAt) : '—'}</div>
          <div className="muted" title="Dashboard auto-refreshes every 10 minutes (600000 ms)">Last fetched: {fmt(lastFetched)} · Auto-refresh: 10 min</div>
        </div>
        <div className="topbar-actions">
          <button
            className="tab"
            title="Queue a broadcast request for manual approval (does not send directly)"
            onClick={() => setBroadcastOpen(true)}
          >
            Broadcast
          </button>
          <button
            onClick={() => load()}
            aria-label="Refresh dashboard now"
            title="Immediate manual refresh"
          >
            Refresh now
          </button>
        </div>
      </header>

      {error && <div className="error">Error loading dashboard: {error}</div>}
      {loading && <div className="muted">Loading…</div>}

      {data && (
        <>
          <div className="grid cards">
            {cards.map((c) => (
              <Card key={c.label} label={c.label} value={c.value} />
            ))}
          </div>

          <div className="dashboard-layout">
            <aside className="card sidebar" aria-label="Agents mission control list">
              <div className="sidebar-head">
                <h2>AGENTS</h2>
                <button
                  className={selectedAgent === 'all' ? 'tab active' : 'tab'}
                  onClick={() => setSelectedAgent('all')}
                >
                  All
                </button>
              </div>

              <div className="agent-list">
                {agentsList.map((a) => (
                  <button
                    key={a.name}
                    className={selectedAgent === a.name ? 'agent-card agent-card-active' : 'agent-card'}
                    onClick={() => setSelectedAgent(a.name)}
                    aria-label={`Filter by agent ${a.name}`}
                  >
                    <div className="agent-row">
                      <strong>{a.name}</strong>
                      <StatusBadge status={a.status || 'idle'} />
                    </div>
                    <div className="muted">{a.model || 'model: —'}</div>
                    <div className="muted">{shortText(a.lastCompletedDerived || a.lastCompleted)}</div>
                  </button>
                ))}
              </div>
            </aside>

            <section className="main-content">
              <nav className="tabs">
                {VIEWS.map((v) => (
                  <button
                    key={v.key}
                    className={view === v.key ? 'tab active' : 'tab'}
                    onClick={() => setView(v.key)}
                  >
                    {v.label}
                  </button>
                ))}
              </nav>

              <main className="card panel">
                {view === 'agents' && <AgentsView data={data.agents} lastFetched={lastFetched} />}
                {view === 'tasks' && (
                  <TasksView
                    data={data.tasks}
                    selectedAgent={selectedAgent}
                    lastFetched={lastFetched}
                    onTaskClick={setSelectedTask}
                    onRequestNotify={async (task) => {
                      await queueApproval(
                        'notify',
                        `Notify for ${task.id || 'task mention'}`,
                        `Telegram notify request for mention @Manu in task: ${task.text}`
                      );
                    }}
                  />
                )}
                {view === 'completed' && (
                  <CompletedView
                    data={data.tasks}
                    selectedAgent={selectedAgent}
                    lastFetched={lastFetched}
                    onTaskClick={setSelectedTask}
                  />
                )}
                {view === 'handoffs' && <HandoffsView data={data.handoffs} selectedAgent={selectedAgent} lastFetched={lastFetched} />}
                {view === 'models' && <ModelsView data={data.models} lastFetched={lastFetched} />}
                {view === 'briefing' && <BriefingView data={data.briefing} lastFetched={lastFetched} />}
                {view === 'approvals' && (
                  <ApprovalsView
                    data={data.approvals}
                    lastFetched={lastFetched}
                    onApproveOne={(id) => approvalAction(`/api/approvals/${encodeURIComponent(id)}/approve`)}
                    onRejectOne={(id) => approvalAction(`/api/approvals/${encodeURIComponent(id)}/reject`)}
                    onApproveAll={() => approvalAction('/api/approvals/approve-all')}
                    onRejectAll={() => approvalAction('/api/approvals/reject-all')}
                    onProcessAll={() => approvalAction('/api/dispatch/process-all')}
                  />
                )}
              </main>
            </section>
          </div>
        </>
      )}

      {selectedTask && <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />}

      {broadcastOpen && (
        <div className="overlay" role="dialog" aria-modal="true">
          <div className="modal card">
            <h3>Queue Broadcast (Approval First)</h3>
            <p className="muted">Submitting creates a pending approval entry in approvals.md. No external send happens here.</p>
            <label className="field">
              <span>Title</span>
              <input value={broadcastTitle} onChange={(e) => setBroadcastTitle(e.target.value)} placeholder="Broadcast title" />
            </label>
            <label className="field">
              <span>Message</span>
              <textarea value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)} rows={5} placeholder="Broadcast message" />
            </label>
            <div className="actions">
              <button className="tab" onClick={() => setBroadcastOpen(false)}>Cancel</button>
              <button
                onClick={async () => {
                  try {
                    setSubmitState('saving');
                    await queueApproval('broadcast', broadcastTitle.trim(), broadcastMessage.trim());
                    setSubmitState('saved');
                    setBroadcastOpen(false);
                    setBroadcastTitle('');
                    setBroadcastMessage('');
                  } catch (e) {
                    setError(e.message || 'Failed to queue broadcast approval');
                    setSubmitState('idle');
                  }
                }}
                disabled={!broadcastTitle.trim() || !broadcastMessage.trim() || submitState === 'saving'}
              >
                {submitState === 'saving' ? 'Queueing…' : 'Queue for Approval'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AgentsView({ data, lastFetched }) {
  return (
    <>
      <SectionHeader title="Agents" updated={data.fileUpdated} lastFetched={lastFetched} />
      <div className="muted">Dashboard updated field: {data.sourceUpdated || '—'}</div>
      <div className="grid table-grid">
        {data.agents.map((a) => (
          <div className="card" key={a.name}>
            <h3>{a.name}</h3>
            <p><strong>Role:</strong> {a.role || '—'}</p>
            <p><strong>Status:</strong> <StatusBadge status={a.status || 'idle'} /></p>
            <p><strong>Model:</strong> {a.model || '—'}</p>
            <p><strong>Current task:</strong> {a.currentTask || '—'}</p>
            <p><strong>Queue:</strong> {a.queue || '—'}</p>
            <p><strong>Last completed:</strong> {a.lastCompletedDerived || a.lastCompleted || '—'}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function completedTs(task) {
  const raw = task?.completedAt;
  if (!raw) return null;
  const ts = Date.parse(raw);
  return Number.isNaN(ts) ? null : ts;
}

function TasksView({ data, selectedAgent, lastFetched, onTaskClick, onRequestNotify }) {
  const filteredByStatus = useMemo(() => {
    const out = {};
    for (const [status, list] of Object.entries(data.byStatus)) {
      out[status] = list.filter((t) => selectedAgent === 'all' || t.owner === selectedAgent);
    }
    return out;
  }, [data.byStatus, selectedAgent]);

  return (
    <>
      <SectionHeader title="Tasks (Static + Live Runs)" updated={data.fileUpdated} lastFetched={lastFetched} />
      {selectedAgent !== 'all' && <div className="muted">Filtered by agent: {selectedAgent}</div>}
      <div className="grid task-columns">
        {Object.entries(filteredByStatus).map(([status, list]) => (
          <div key={status} className="card">
            <h3>{status} ({list.length})</h3>
            {list.length === 0 ? (
              <div className="muted">No tasks</div>
            ) : (
              <ul>
                {list.map((t, idx) => (
                  <li key={`${t.id || idx}-${t.text}`}>
                    <button className="task-link" onClick={() => onTaskClick(t)}>
                      <div><strong>{t.id || 'Task'}</strong> — {t.text}</div>
                    </button>
                    <div className="task-meta">
                      {t.owner && <span className="muted">owner: {t.owner}</span>}
                      <StatusBadge status={t.status} />
                      {t.source && <span className="muted">source: {t.source}</span>}
                      {t.approvalRequired && <span className="badge badge-needs-input">Approval Required</span>}
                      {t.mentionDetected && (
                        <button
                          className="tab"
                          title="Queue Telegram notify request for manual approval"
                          onClick={() => onRequestNotify(t)}
                        >
                          Request Telegram Notify
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function CompletedView({ data, selectedAgent, lastFetched, onTaskClick }) {
  const completedItems = useMemo(() => {
    const base = [...(data.byStatus?.Completed || [])];
    const filtered = selectedAgent === 'all'
      ? base
      : base.filter((t) => t.owner === selectedAgent);

    return filtered.sort((a, b) => {
      const bTs = completedTs(b) || 0;
      const aTs = completedTs(a) || 0;
      if (bTs !== aTs) return bTs - aTs;
      return String(b.id || b.text || '').localeCompare(String(a.id || a.text || ''));
    });
  }, [data.byStatus, selectedAgent]);

  return (
    <>
      <SectionHeader title="Completed" updated={data.fileUpdated} lastFetched={lastFetched} />
      {selectedAgent !== 'all' && <div className="muted">Filtered by agent: {selectedAgent}</div>}
      {completedItems.length === 0 ? (
        <div className="muted">No completed tasks for this filter.</div>
      ) : (
        <div className="stack">
          {completedItems.map((t, idx) => (
            <div className="card" key={`${t.id || idx}-${t.text}`}>
              <button className="task-link" onClick={() => onTaskClick(t)}>
                <div><strong>{t.id || 'Task'}</strong> — {t.text}</div>
              </button>
              <div className="task-meta">
                {t.owner && <span className="muted">owner: {t.owner}</span>}
                <StatusBadge status="Completed" />
                <span className={t.source === 'live-runs' ? 'badge badge-working' : 'badge badge-idle'}>
                  {t.source || 'tasks.md'}
                </span>
                <span className="muted">completed: {fmt(t.completedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function TaskDrawer({ task, onClose }) {
  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <aside className="drawer card">
        <div className="drawer-head">
          <h3>{task.title || task.id || 'Task detail'}</h3>
          <button className="tab" onClick={onClose}>Close</button>
        </div>

        <div className="drawer-section">
          <strong>Title</strong>
          <div>{task.text || '—'}</div>
        </div>
        <div className="drawer-section">
          <strong>Status</strong>
          <div><StatusBadge status={task.status || 'pending'} /></div>
        </div>
        <div className="drawer-section">
          <strong>Owner</strong>
          <div>{task.owner || 'Unassigned'}</div>
        </div>
        <div className="drawer-section">
          <strong>Source</strong>
          <div>{task.source || 'tasks.md'}</div>
        </div>
        <div className="drawer-section">
          <strong>Completed at</strong>
          <div>{fmt(task.completedAt)}</div>
        </div>
        <div className="drawer-section">
          <strong>Description / Context</strong>
          <div>{task.description || 'No description/context provided.'}</div>
        </div>

        <div className="drawer-section">
          <strong>Timeline / Comments</strong>
          {task.timeline?.length ? (
            <ul>
              {task.timeline.map((line, idx) => <li key={`${line}-${idx}`}>{line}</li>)}
            </ul>
          ) : (
            <div className="muted">No timeline/comments yet.</div>
          )}
        </div>

        <div className="drawer-section">
          <strong>Attachments / Deliverables</strong>
          {task.deliverables?.length ? (
            <ul>
              {task.deliverables.map((d, idx) => {
                const href = safeLink(d.path);
                return (
                  <li key={`${d.name}-${idx}`}>
                    {href ? <a href={href} target="_blank" rel="noreferrer">{d.name}</a> : d.name} <span className="muted">({d.path || '—'})</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="muted">No deliverables attached.</div>
          )}
          {task.attachments?.length ? (
            <ul>
              {task.attachments.map((a, idx) => <li key={`${a}-${idx}`}>{a}</li>)}
            </ul>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

function HandoffsView({ data, selectedAgent, lastFetched }) {
  const entries = useMemo(() => {
    if (selectedAgent === 'all') return data.entries;
    return data.entries.filter((h) => h.from === selectedAgent || h.to === selectedAgent);
  }, [data.entries, selectedAgent]);

  return (
    <>
      <SectionHeader title="Handoffs" updated={data.fileUpdated} lastFetched={lastFetched} />
      {selectedAgent !== 'all' && <div className="muted">Filtered by agent: {selectedAgent}</div>}
      {entries.length === 0 ? (
        <div className="muted">No handoffs logged.</div>
      ) : (
        <div className="stack">
          {entries.map((h, idx) => (
            <div key={`${h.timestamp}-${idx}`} className="card">
              <div><strong>{h.timestamp}</strong> — {h.from} → {h.to}</div>
              <div><strong>Ask:</strong> {h.ask}</div>
              <div><strong>Result:</strong> {h.result}</div>
              {h.refs && <div><strong>Refs:</strong> {h.refs}</div>}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function ModelsView({ data, lastFetched }) {
  return (
    <>
      <SectionHeader title="Models / Cost" updated={data.fileUpdated} lastFetched={lastFetched} />
      <h3>{data.planTitle}</h3>
      <div className="grid table-grid">
        {data.agents.map((m) => (
          <div key={m.agent} className="card">
            <h4>{m.agent}</h4>
            <div><code>{m.model}</code></div>
            <div className="muted">{m.note}</div>
          </div>
        ))}
      </div>
      <h3>Sub-agent Cost Safety Policy</h3>
      <ul>
        {Object.entries(data.policy).map(([k, v]) => (
          <li key={k}><strong>{k}:</strong> {v}</li>
        ))}
      </ul>
    </>
  );
}

function BriefingView({ data, lastFetched }) {
  const cfg = data.config || {};
  return (
    <>
      <SectionHeader title="Briefing Status" updated={data.fileUpdated} lastFetched={lastFetched} />
      <div className="grid briefing-grid">
        {Object.entries(cfg).map(([k, v]) => (
          <div className="card" key={k}>
            <div className="muted">{k}</div>
            <div>{v || '—'}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <strong>Status:</strong>{' '}
        {String(cfg.enabled).toLowerCase() === 'true' ? 'Enabled' : 'Disabled'}
      </div>
    </>
  );
}

function ApprovalsView({ data, lastFetched, onApproveOne, onRejectOne, onApproveAll, onRejectAll, onProcessAll }) {
  return (
    <>
      <SectionHeader title="Approvals" updated={data.fileUpdated} lastFetched={lastFetched} />
      <div className="actions" style={{ justifyContent: 'flex-start', marginBottom: 10 }}>
        <button className="tab" onClick={onApproveAll}>Approve All Pending</button>
        <button className="tab" onClick={onRejectAll}>Reject All Pending</button>
        <button className="tab" onClick={onProcessAll} title="Process queued approved dispatch jobs safely">Process Dispatch Queue</button>
      </div>
      {data.entries.length === 0 ? (
        <div className="muted">No approvals.</div>
      ) : (
        <div className="stack">
          {data.entries.map((a) => (
            <div className="card" key={a.id}>
              <div><strong>{a.title || a.id}</strong></div>
              <div className="muted">type: {a.type || '—'} · <StatusBadge status={a.status || '—'} /></div>
              <div>{a.message || '—'}</div>
              <div className="muted">requestedAt: {fmt(a.requestedAt)} · approvedAt: {fmt(a.approvedAt)} · executedAt: {fmt(a.executedAt)}</div>
              <div className="task-meta">
                <button className="tab" onClick={() => onApproveOne(a.id)} disabled={String(a.status).toLowerCase() !== 'pending'}>Approve</button>
                <button className="tab" onClick={() => onRejectOne(a.id)} disabled={String(a.status).toLowerCase() !== 'pending'}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
