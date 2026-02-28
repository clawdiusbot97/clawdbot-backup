export interface WorkItem {
  id: string;
  type: 'idea' | 'research' | 'experiment' | 'spike' | 'story' | 'task' | 'epic' | string;
  title: string;
  description?: string;
  status: 'NEW' | 'RESEARCHING' | 'RESEARCHED' | 'DECIDED' | 'PLANNED' | 'BUILDING' | 'DONE' | 'DROPPED' | string;
  owner: string;
  priority: 'p0' | 'p1' | 'p2' | 'p3' | string;
  tags: string[];
  cost_estimate_usd_month: number | null;
  impact?: string;
  effort?: string;
  needs_clarification: boolean;
  clarification_status?: string;
  implementation_approved: boolean;
  created_at: string;
  updated_at: string;
  path: string;
  allowed_actions: string[];
  reports: {
    clarification: boolean;
    tech: boolean;
    cost: boolean;
    product: boolean;
    arch: boolean;
  };
}

export interface WorkItemsData {
  generated_at: string;
  version: string;
  total_items: number;
  counts_by_status: Record<string, number>;
  counts_by_type: Record<string, number>;
  items: WorkItem[];
  id_validation?: 'strict' | 'fallback';
}

export interface ApiResponse {
  success: boolean;
  action: string;
  id?: string;
  message: string;
  stdout?: string;
  stderr?: string;
  blocked_by_guardrail?: boolean;
  data: WorkItemsData | null;
}

export interface StandardResponse<T = unknown> {
  success: boolean;
  action: string;
  id?: string;
  message: string;
  stdout: string;
  stderr: string;
  blocked_by_guardrail: boolean;
  data?: T;
}

export interface MissionLogEntry {
  action: string;
  id: string;
  success: boolean;
  blocked_by_guardrail: boolean;
  stdout: string;
  stderr: string;
  duration_ms: number;
  provider: string;
  model: string;
  started_at: string;
  finished_at: string;
  id_validation?: 'strict' | 'fallback';
  file?: string;
}

export interface StaleDetectedEntry {
  event: 'run_stale_detected';
  id: string;
  detectedAt: string;
  ttlMinutes: number;
  lastHeartbeatAt?: string;
  startedAt?: string;
  agent?: string;
}

export interface RunningState {
  id: string;
  action: string;
  agent: string;
  started_at: string;
  startedAt?: string;
  status_target?: string;
  pid?: number;
  heartbeat_at?: string;
  lastHeartbeatAt?: string;
  stale?: boolean;
}

export interface ItemLogsData {
  running: boolean;
  runState?: RunningState;
  logs: MissionLogEntry[];
}

export interface RecentLogsData {
  logs: MissionLogEntry[];
}

export const KANBAN_COLUMNS = [
  'NEW',
  'RESEARCHING',
  'RESEARCHED',
  'DECIDED',
  'PLANNED',
  'BUILDING',
  'DONE',
  'DROPPED',
] as const;

export type KanbanColumn = typeof KANBAN_COLUMNS[number];

export interface Filters {
  search: string;
  type: string;
  owner: string;
  tag: string;
  needsClarification: boolean;
  showDropped: boolean;
}
