import path from 'path';

const STRICT_ID_REGEX = /^[A-Z][A-Z0-9]*-[0-9]{8}-[0-9]{3}$/;
const FALLBACK_ID_REGEX = /^[a-zA-Z0-9_-]{1,80}$/;

export type WorkItemIdValidationResult =
  | { ok: true; id: string; mode: 'strict' | 'fallback' }
  | { ok: false; reason: string };

export function validateWorkItemId(raw: unknown): WorkItemIdValidationResult {
  if (typeof raw !== 'string') {
    return { ok: false, reason: 'id must be a string' };
  }

  const id = raw.trim();
  if (!id) {
    return { ok: false, reason: 'id is required' };
  }

  if (id.includes('/') || id.includes('\\') || id.includes('..')) {
    return { ok: false, reason: 'id contains path traversal characters' };
  }

  if (STRICT_ID_REGEX.test(id)) {
    return { ok: true, id, mode: 'strict' };
  }

  if (FALLBACK_ID_REGEX.test(id)) {
    return { ok: true, id, mode: 'fallback' };
  }

  return { ok: false, reason: 'id does not match allowed format' };
}

export function safeResolve(base: string, ...parts: string[]): string {
  const baseResolved = path.resolve(base);
  const targetResolved = path.resolve(baseResolved, ...parts);
  const normalizedBase = `${baseResolved}${path.sep}`;

  if (targetResolved !== baseResolved && !targetResolved.startsWith(normalizedBase)) {
    throw new Error('Path escapes base directory');
  }

  return targetResolved;
}
