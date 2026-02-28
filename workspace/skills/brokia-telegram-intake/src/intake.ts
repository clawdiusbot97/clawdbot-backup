/**
 * Brokia Telegram Intake MVP
 * Polling-based workitem creation with confirm-first workflow
 */

import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATE_PATH = process.env.INTAKE_STATE_PATH || join(__dirname, '../state/state.json');
const BOT_TOKEN = [TOKEN] || '';
const CHAT_ID = process.env.BROKIA_INBOX_CHAT_ID || '';
const MC_BASE_URL = process.env.MISSION_CONTROL_BASE_URL || 'http://localhost:3000';
const USE_LLM = process.env.INTAKE_USE_LLM_CLASSIFIER === 'true';
const DEDUPE_MINUTES = parseInt(process.env.INTAKE_DEDUPE_WINDOW_MINUTES || '10', 10);

// Types
interface Proposal {
  id: string;
  user_id: number;
  chat_id: number;
  message_id: number;
  username?: string;
  normalized_text: string;
  proposal: {
    type: string;
    title: string;
    description: string;
    tags: string[];
    priority: string;
    needs_clarification: boolean;
    proposed_next_action: string;
  };
  proposed_at: string;
  status: 'awaiting_confirmation' | 'creating' | 'completed' | 'cancelled';
  workitem_id?: string;
}

interface State {
  last_update_id: number;
  pending_proposals: Proposal[];
}

interface TelegramMessage {
  message_id: number;
  from?: { id: number; username?: string; first_name?: string };
  chat: { id: number; type: string };
  date: number;
  text?: string;
  voice?: { file_id: string; duration: number };
  caption?: string;
  reply_to_message?: { message_id: number; text?: string };
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
}

// Heuristic classification
function classifyWorkitem(text: string): { type: string; title: string; description: string } {
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();
  
  // Prefix routing
  let type = 'idea';
  let content = trimmed;
  
  const prefixes = [
    { prefix: 'idea:', type: 'idea' },
    { prefix: 'risk:', type: 'risk' },
    { prefix: 'feature:', type: 'feature' },
    { prefix: 'research:', type: 'research' },
    { prefix: 'requirement:', type: 'requirement' },
  ];
  
  for (const { prefix, type: t } of prefixes) {
    if (lower.startsWith(prefix)) {
      type = t;
      content = trimmed.slice(prefix.length).trim();
      break;
    }
  }
  
  // Title: first sentence, max 80 chars
  const firstSentence = content.split(/[.!?\n]/)[0].trim();
  const title = firstSentence.length > 80 
    ? firstSentence.slice(0, 77) + '...'
    : firstSentence;
  
  // Description: remaining content or bullet points
  const remaining = content.slice(firstSentence.length).trim();
  const description = remaining || content;
  
  return { type, title, description: description.slice(0, 500) };
}

function generateProposalId(): string {
  return `prop_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function readState(): Promise<State> {
  try {
    const content = await readFile(STATE_PATH, 'utf-8');
    return JSON.parse(content);
  } catch {
    return { last_update_id: 0, pending_proposals: [] };
  }
}

async function writeState(state: State): Promise<void> {
  await writeFile(STATE_PATH, JSON.stringify(state, null, 2));
}

async function telegramApi(method: string, body: Record<string, unknown>): Promise<unknown> {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/${method}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return response.json();
}

async function getUpdates(offset: number): Promise<TelegramUpdate[]> {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${offset + 1}&limit=100`;
  const response = await fetch(url);
  const data = await response.json() as { ok: boolean; result: TelegramUpdate[] };
  return data.ok ? data.result : [];
}

async function sendMessage(chatId: number, text: string, replyTo?: number): Promise<void> {
  const body: Record<string, unknown> = {
    chat_id: chatId,
    text: text.slice(0, 4096), // Telegram limit
    parse_mode: 'HTML',
  };
  if (replyTo) body.reply_to_message_id = replyTo;
  await telegramApi('sendMessage', body);
}

function isDuplicate(state: State, userId: number, normalizedText: string): Proposal | undefined {
  const windowMs = DEDUPE_MINUTES * 60 * 1000;
  const now = Date.now();
  
  return state.pending_proposals.find(p => {
    if (p.user_id !== userId) return false;
    if (p.status !== 'awaiting_confirmation') return false;
    const age = now - new Date(p.proposed_at).getTime();
    if (age > windowMs) return false;
    return p.normalized_text === normalizedText;
  });
}

async function createWorkitem(proposal: Proposal['proposal']): Promise<{ id: string; title: string; type: string } | null> {
  try {
    const response = await fetch(`${MC_BASE_URL}/api/workitems`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: proposal.type,
        title: proposal.title,
        description: proposal.description,
        priority: proposal.priority,
        tags: proposal.tags,
      }),
    });
    
    const data = await response.json() as { success: boolean; id?: string; data?: { items?: Array<{ id: string; title: string; type: string }> } };
    
    if (data.success && data.id) {
      // Find the created item in the returned data
      const items = data.data?.items || [];
      const created = items.find(i => i.id === data.id);
      return created || { id: data.id, title: proposal.title, type: proposal.type };
    }
    return null;
  } catch (error) {
    console.error('Failed to create workitem:', error);
    return null;
  }
}

function formatProposalMessage(proposal: Proposal, isUpdate = false): string {
  const lines = [
    isUpdate ? '<b>✏️ Propuesta actualizada:</b>' : '<b>📝 Nueva propuesta:</b>',
    '',
    `<b>Entendí:</b> ${proposal.proposal.title}`,
    '',
    '<b>Voy a crear:</b>',
    `• <b>Tipo:</b> ${proposal.proposal.type}`,
    `• <b>Título:</b> ${proposal.proposal.title}`,
    `• <b>Prioridad:</b> ${proposal.proposal.priority}`,
    `• <b>Tags:</b> ${proposal.proposal.tags.join(', ') || '(ninguno)'}`,
    `• <b>Necesita clarificación:</b> ${proposal.proposal.needs_clarification ? 'Sí' : 'No'}`,
    `• <b>Próxima acción:</b> ${proposal.proposal.proposed_next_action}`,
    '',
    '<b>Responde:</b>',
    '• <code>OK</code> — Crear workitem',
    '• <code>EDIT: type=risk priority=p1</code> — Modificar campos',
    '• <code>DISCARD</code> — Cancelar',
    '',
    `<i>ID propuesta: ${proposal.id}</i>`,
  ];
  
  return lines.join('\n');
}

function formatDuplicateMessage(existing: Proposal): string {
  return [
    '<b>⚠️ Duplicado detectado</b>',
    '',
    `Ya tienes una propuesta pendiente similar:`,
    `• "${existing.proposal.title}"`,
    `• ID: <code>${existing.id}</code>`,
    '',
    '<b>Responde:</b>',
    '• <code>OK2</code> — Crear igual (forzar)',
    '• <code>STATUS</code> — Ver propuestas pendientes',
    '• Ignorar para mantener la propuesta existente',
  ].join('\n');
}

function formatStatusMessage(proposals: Proposal[]): string {
  if (proposals.length === 0) {
    return '<b>📋 No hay propuestas pendientes</b>';
  }
  
  const now = Date.now();
  const lines = ['<b>📋 Propuestas pendientes:</b>', ''];
  
  for (const p of proposals) {
    const age = Math.round((now - new Date(p.proposed_at).getTime()) / 60000);
    lines.push(`• <code>${p.id}</code>`);
    lines.push(`  "${p.proposal.title.slice(0, 40)}${p.proposal.title.length > 40 ? '...' : ''}"`);
    lines.push(`  hace ${age} min — Responde <code>OK</code> o <code>CANCEL ${p.id}</code>`);
    lines.push('');
  }
  
  return lines.join('\n');
}

async function processNewMessage(message: TelegramMessage, state: State): Promise<void> {
  const chatId = message.chat.id;
  const userId = message.from?.id || 0;
  const username = message.from?.username || message.from?.first_name || 'unknown';
  
  // Only process target chat
  if (String(chatId) !== CHAT_ID) {
    console.log(`Ignoring message from chat ${chatId} (expected ${CHAT_ID})`);
    return;
  }
  
  // Extract text (voice notes use transcript in caption or text)
  let text = message.text || message.caption || '';
  if (!text && message.voice) {
    // Telegram Premium sends transcript in caption; if not, we can't process
    await sendMessage(chatId, '<b>⚠️ No pude leer el audio.</b>\n\nAsegúrate de que sea un mensaje de voz con transcript o escribe el texto.', message.message_id);
    return;
  }
  
  text = text.trim();
  if (!text) return;
  
  const normalized = normalizeText(text);
  const upperText = text.toUpperCase().trim();
  
  // Control commands (check first)
  if (upperText === 'STATUS') {
    const pending = state.pending_proposals.filter(p => p.status === 'awaiting_confirmation');
    await sendMessage(chatId, formatStatusMessage(pending), message.message_id);
    return;
  }
  
  if (upperText.startsWith('CANCEL ')) {
    const propId = text.slice(7).trim();
    const proposal = state.pending_proposals.find(p => p.id === propId);
    if (proposal) {
      proposal.status = 'cancelled';
      await sendMessage(chatId, `<b>❌ Cancelada propuesta:</b> <code>${propId}</code>`, message.message_id);
    } else {
      await sendMessage(chatId, `<b>⚠️ No encontré propuesta:</b> <code>${propId}</code>\n\nUsa <code>STATUS</code> para ver las pendientes.`, message.message_id);
    }
    return;
  }
  
  // Check if this is a response to a proposal (reply)
  if (message.reply_to_message) {
    await processReply(message, text, normalized, state);
    return;
  }
  
  // Check for duplicates
  const duplicate = isDuplicate(state, userId, normalized);
  if (duplicate) {
    await sendMessage(chatId, formatDuplicateMessage(duplicate), message.message_id);
    return;
  }
  
  // Create new proposal
  const classified = classifyWorkitem(text);
  const proposal: Proposal = {
    id: generateProposalId(),
    user_id: userId,
    chat_id: chatId,
    message_id: message.message_id,
    username,
    normalized_text: normalized,
    proposal: {
      type: classified.type,
      title: classified.title,
      description: classified.description,
      tags: [],
      priority: 'p2',
      needs_clarification: true,
      proposed_next_action: 'clarify',
    },
    proposed_at: new Date().toISOString(),
    status: 'awaiting_confirmation',
  };
  
  state.pending_proposals.push(proposal);
  await sendMessage(chatId, formatProposalMessage(proposal), message.message_id);
}

async function processReply(message: TelegramMessage, text: string, normalized: string, state: State): Promise<void> {
  const chatId = message.chat.id;
  const userId = message.from?.id || 0;
  const replyToId = message.reply_to_message?.message_id;
  
  // Find proposal by reply reference
  const proposal = state.pending_proposals.find(p => 
    p.message_id === replyToId && 
    p.user_id === userId && 
    p.status === 'awaiting_confirmation'
  );
  
  if (!proposal) {
    // Check for OK2 (force create despite duplicate)
    if (text.toUpperCase().trim() === 'OK2') {
      // Find the most recent duplicate proposal for this user
      const recentProposals = state.pending_proposals
        .filter(p => p.user_id === userId && p.status === 'awaiting_confirmation')
        .sort((a, b) => new Date(b.proposed_at).getTime() - new Date(a.proposed_at).getTime());
      
      if (recentProposals.length > 0) {
        await createFromProposal(recentProposals[0], state, chatId, message.message_id);
        return;
      }
    }
    return; // Ignore orphan replies
  }
  
  const upperText = text.toUpperCase().trim();
  
  // OK: Create workitem
  if (upperText === 'OK') {
    await createFromProposal(proposal, state, chatId, message.message_id);
    return;
  }
  
  // DISCARD: Cancel proposal
  if (upperText === 'DISCARD') {
    proposal.status = 'cancelled';
    await sendMessage(chatId, '<b>❌ Propuesta descartada.</b>', message.message_id);
    return;
  }
  
  // EDIT: Modify fields
  if (upperText.startsWith('EDIT:') || upperText.startsWith('EDIT ')) {
    const editText = text.slice(5).trim();
    const updates = parseEditCommand(editText);
    
    if (updates.type) proposal.proposal.type = updates.type;
    if (updates.title) proposal.proposal.title = updates.title.slice(0, 80);
    if (updates.priority) proposal.proposal.priority = updates.priority;
    if (updates.tags) proposal.proposal.tags = updates.tags;
    if (updates.needs_clarification !== undefined) proposal.proposal.needs_clarification = updates.needs_clarification;
    if (updates.proposed_next_action) proposal.proposal.proposed_next_action = updates.proposed_next_action;
    
    await sendMessage(chatId, formatProposalMessage(proposal, true), message.message_id);
    return;
  }
  
  // Unknown reply
  await sendMessage(chatId, '<b>⚠️ No entendí.</b>\n\nResponde: <code>OK</code>, <code>EDIT: ...</code>, o <code>DISCARD</code>', message.message_id);
}

function parseEditCommand(text: string): Partial<Proposal['proposal']> {
  const updates: Partial<Proposal['proposal']> = {};
  const pairs = text.split(',').map(s => s.trim());
  
  for (const pair of pairs) {
    const [key, ...valueParts] = pair.split('=');
    const value = valueParts.join('=').trim();
    
    switch (key.trim().toLowerCase()) {
      case 'type':
        if (['idea', 'risk', 'feature', 'research', 'requirement'].includes(value)) {
          updates.type = value;
        }
        break;
      case 'title':
        updates.title = value;
        break;
      case 'priority':
        if (['p0', 'p1', 'p2', 'p3'].includes(value)) {
          updates.priority = value;
        }
        break;
      case 'tags':
        updates.tags = value.split(/\s+/).filter(t => t.startsWith('#')).map(t => t.slice(1));
        break;
      case 'needs_clarification':
        updates.needs_clarification = value === 'true' || value === 'yes';
        break;
      case 'next_action':
      case 'proposed_next_action':
        updates.proposed_next_action = value;
        break;
    }
  }
  
  return updates;
}

async function createFromProposal(proposal: Proposal, state: State, chatId: number, replyMessageId: number): Promise<void> {
  proposal.status = 'creating';
  
  const created = await createWorkitem(proposal.proposal);
  
  if (created) {
    proposal.status = 'completed';
    proposal.workitem_id = created.id;
    await sendMessage(
      chatId,
      `<b>✅ Creado:</b> <code>${created.id}</code>\n• Tipo: ${created.type}\n• Título: ${created.title}`,
      replyMessageId
    );
  } else {
    proposal.status = 'awaiting_confirmation';
    await sendMessage(chatId, '<b>❌ Error al crear workitem.</b>\n\nIntenta de nuevo con <code>OK</code>', replyMessageId);
  }
}

// Cleanup old proposals (> 24h)
function cleanupOldProposals(state: State): void {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  state.pending_proposals = state.pending_proposals.filter(p => {
    const created = new Date(p.proposed_at).getTime();
    return created > cutoff || p.status === 'awaiting_confirmation';
  });
}

// Main polling loop
async function main(): Promise<void> {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('Missing required env vars: TELEGRAM_BOT_TOKEN, BROKIA_INBOX_CHAT_ID');
    process.exit(1);
  }
  
  const state = await readState();
  console.log(`Starting poll from offset ${state.last_update_id}`);
  
  const updates = await getUpdates(state.last_update_id);
  console.log(`Received ${updates.length} updates`);
  
  for (const update of updates) {
    state.last_update_id = Math.max(state.last_update_id, update.update_id);
    
    const message = update.message || update.edited_message;
    if (!message) continue;
    
    await processNewMessage(message, state);
  }
  
  cleanupOldProposals(state);
  await writeState(state);
  
  console.log(`Processed ${updates.length} updates, last_id=${state.last_update_id}`);
}

main().catch(console.error);