// Review progress for the N3 mistake cards: a small Leitner schedule plus a per-card merge,
// so two devices can both write and the newer answer for each card wins.

export type Progress = {
  /** Leitner box: 0 = review now, MASTERED_BOX = mastered. */
  box: number;
  /** Epoch ms when the card is due again. */
  due: number;
  seen: number;
  wrong: number;
  /** ISO time of the last change. The newer side wins when two devices merge. */
  t: string;
};

export type ProgressState = { v: 1; items: Record<string, Progress> };

export const DAY_MS = 86_400_000;
/** Days until the next review after a right answer, indexed by the new box. */
export const BOX_DAYS = [0, 1, 3, 7];
export const MASTERED_BOX = BOX_DAYS.length - 1;

export function emptyState(): ProgressState {
  return { v: 1, items: {} };
}

function startOfLocalDay(ms: number): number {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Progress after one answer. Right moves up one box. Wrong goes back to box 0, due now. */
export function review(prev: Progress | undefined, correct: boolean, now: number): Progress {
  const box = correct ? Math.min((prev?.box ?? 0) + 1, MASTERED_BOX) : 0;
  return {
    box,
    due: correct ? startOfLocalDay(now) + BOX_DAYS[box] * DAY_MS : now,
    seen: (prev?.seen ?? 0) + 1,
    wrong: (prev?.wrong ?? 0) + (correct ? 0 : 1),
    t: new Date(now).toISOString(),
  };
}

export function isDue(p: Progress | undefined, now: number): boolean {
  return !p || p.due <= now;
}

export function isMastered(p: Progress | undefined): boolean {
  return !!p && p.box >= MASTERED_BOX;
}

/** Per card, keep the side that changed last. */
export function merge(a: ProgressState, b: ProgressState | null): ProgressState {
  const items = { ...a.items };
  for (const [id, p] of Object.entries(b?.items ?? {})) {
    const cur = items[id];
    if (!cur || p.t > cur.t) items[id] = p;
  }
  return { v: 1, items };
}

export function sameItems(a: ProgressState, b: ProgressState | null): boolean {
  if (!b) return false;
  const ka = Object.keys(a.items);
  return ka.length === Object.keys(b.items).length && ka.every((k) => b.items[k]?.t === a.items[k].t);
}

/** Accept only well-formed entries from storage or the gist. */
export function parseState(raw: unknown): ProgressState | null {
  if (!raw || typeof raw !== "object") return null;
  const items = (raw as { items?: unknown }).items;
  if (!items || typeof items !== "object") return null;
  const out: Record<string, Progress> = {};
  for (const [id, p] of Object.entries(items as Record<string, Partial<Progress>>)) {
    if (p && typeof p.box === "number" && typeof p.due === "number" && typeof p.t === "string") {
      out[id] = { box: p.box, due: p.due, seen: p.seen ?? 0, wrong: p.wrong ?? 0, t: p.t };
    }
  }
  return { v: 1, items: out };
}

/** Due card ids in study order: lower box first, then the given order. */
export function dueQueue(ids: string[], state: ProgressState, now: number): string[] {
  return ids
    .map((id, i) => ({ id, i, p: state.items[id] }))
    .filter(({ p }) => isDue(p, now))
    .sort((x, y) => (x.p?.box ?? 0) - (y.p?.box ?? 0) || x.i - y.i)
    .map(({ id }) => id);
}
