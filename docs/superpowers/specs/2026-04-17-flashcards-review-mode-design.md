# Flashcards review mode — design

**Status:** approved (brainstorm)
**Date:** 2026-04-17
**Scope:** [`src/components/flashcards/Flashcards.tsx`](../../../src/components/flashcards/Flashcards.tsx)

## Problem

Classmates use the flashcards page to study N5 vocabulary, but the current app treats every card equally — there's no way to skip cards they already know or to force repetition on cards they don't. The ask:

1. Mark a card as "not memorized yet" → it keeps coming back.
2. Mark a card as "memorized" → it gets skipped.
3. The app enforces repetition of not-memorized cards.

## Goals

- Add a triage mechanism (`Chưa thuộc` / `Đã thuộc`) to the back of each card.
- Filter navigation to an active pool of cards that still need study.
- Persist triage state for the current browser tab across page refreshes.
- Preserve all existing mobile polish and interactions (flip, prev/next, shuffle, counter, hiragana-suppression, image fallback, focus ring, safe-area, etc.).

## Non-goals

- Spaced repetition with intervals / timestamps — the pool cycles uniformly; no scheduling.
- Cross-device sync, accounts, or server state.
- Custom card creation at runtime.
- localStorage persistence (cross-tab, cross-session).
- Keyboard shortcuts or swipe gestures for marking (explicit follow-ups if users ask).
- A separate "study" vs "browse" toggle — the new behavior replaces the old.

## Mental model

Every card has one of three statuses:

| status | meaning |
|---|---|
| `unseen` | Starting state; user hasn't marked yet. |
| `not_memorized` | User flagged on the back: "Chưa thuộc". Card stays in the active pool. |
| `memorized` | User flagged on the back: "Đã thuộc". Card retires from the active pool. |

**Active pool** = `unseen ∪ not_memorized`. Navigation (next/prev/shuffle) and the counter all operate on this pool. Memorized cards become invisible until the user resets.

**Lifecycle:** all 39 cards start `unseen`. First pass the user triages each. After first pass, the pool contains only `not_memorized` cards; the app loops them, user re-marks, pool shrinks. When pool becomes empty → "done" screen.

## Design

### 1. State + persistence

In-memory React state of shape:

```ts
type CardStatus = "unseen" | "memorized" | "not_memorized";

type SessionState = {
  deckSlug: string;
  version: 1;
  statuses: Record<number, CardStatus>; // keyed by card.id
};
```

Persisted to `sessionStorage` under key `flashcards:session:<deck.slug>`.

- **Hydrate** inside a `useEffect` after mount (sessionStorage is unavailable during Astro SSR — first render treats everything as `unseen`).
- **Persist** on every status change via a write-through effect watching the `statuses` map.
- **Key by deck slug** so future second-deck support doesn't clobber another deck's progress.
- **`version: 1`** guards against future shape changes (richer status, per-card timestamps, etc.) — mismatched or missing version is treated as a fresh session.
- **Wrap reads/writes in `try/catch`** — Safari private mode disables sessionStorage; on failure, silently fall back to in-memory state so the page still works.

### 2. Status pool + indexing

Replace the existing `currentIndex` (which pointed into `cards`) with `poolIndex` (position within the active pool). The derived `activePool` is computed on each render:

```ts
const activePool = cards.filter((c) => statuses[c.id] !== "memorized");
const currentCard = activePool[poolIndex];
```

**Why pool-indexing:** memorized cards shrink the pool; indexing by pool position avoids the off-by-one problems of translating between full-deck index and pool index.

**When `activePool` is empty:** render the Done screen instead of a card.

### 3. UX — back of the card

After flip, below the Vietnamese meaning, two mark buttons appear side-by-side:

```
         きょうだい
           anh em

  [ Chưa thuộc ]   [ Đã thuộc ]
```

- **Chưa thuộc** — muted / neutral surface (`bg-[color:var(--color-surface)]` + border), optional `RotateCw` icon to hint "comes back"
- **Đã thuộc** — accent surface (`bg-[color:var(--color-accent-soft)]`), zen gold
- Both: same touch-target hygiene as the existing controls (min 44 px, `touch-manipulation`, `focus-visible:ring-[color:var(--color-accent)]`, `type="button"`, `active:scale-95` with `transition-transform duration-150 ease-out`)
- The two buttons sit side by side with a 16 px gap, positioned 20 px below the meaning text. On the narrowest target viewport (375 px) the pair fits comfortably; if content later forces wrapping, the flex container falls back to stacked.

**Tapping either button:**

1. Update `statuses[currentCard.id]` (triggers sessionStorage write).
2. Set `isFlipped = false` (card flips back to front for visual confirmation).
3. After the existing 150 ms flip-reset delay, recompute `activePool`, then set `poolIndex` to the next logical position in the new pool (see §4).

### 4. Navigation semantics

- **Next:** advances `poolIndex` forward within `activePool` with wrap-around. Auto-advance from "Đã thuộc" / "Chưa thuộc" reuses this same path.
- **Prev:** mirror of Next, moves backward with wrap-around.
- **Shuffle:** reorders the full `cards` array via the existing Fisher-Yates-ish sort. Then resets `poolIndex` to 0 (the first pool member in the new order). Memorized cards stay in `cards` but are filtered out of the pool so they don't leak into navigation.
- **Edge: marking the last card in a pool of one** → after marking, the new pool is empty → render the Done screen. Compute new pool before deciding where to advance.
- **Edge: counter smoothness** — the counter format stays "`N / M`" but M is the pool size, which changes as the user marks. When a user marks a card memorized, recompute the pool first, then set `poolIndex` to the index of the next logical card in the new pool (avoids a transient mismatch like "3 / 11" when the user was just at "3 / 12").

### 5. Progress + reset caption

A small caption sits between the existing "N / M" counter and the control row (i.e. counter first, then this progress caption, then controls):

```
3 đã thuộc · 10 chưa thuộc · 26 chưa xem            [ Reset ]
```

- Three counters in muted text (`text-xs font-medium text-[color:var(--color-ink-muted)]`), dot-separated
- The existing "N / M" counter remains, positioned as it is today (between card and controls)
- A small **Reset** button at the right: single click wipes the sessionStorage entry, returns all cards to `unseen`, resets `poolIndex` to 0 and `isFlipped` to false. No confirmation modal — resetting a session is not destructive (the built-in deck is still there).

### 6. Status indicator on the card front

A tiny colored pill in a corner of the card's front (e.g. top-left, opposite the existing `RotateCw` indicator in the top-right) shows the current card's status at a glance:

| status | front indicator |
|---|---|
| `unseen` | (nothing — card is visually unmarked) |
| `not_memorized` | small filled dot (~8 px diameter) in accent gold (`--color-accent`), positioned top-left of the card |
| `memorized` | (never visible — memorized cards aren't in the pool) |

This signals to the user when they land on a card they've already flagged for review.

### 7. Done screen

When `activePool` is empty, the card region renders a centered panel instead:

```
🎉

Bạn đã thuộc hết 39 từ!

[ Bắt đầu lại ]
```

- Same zen aesthetic: serif heading, accent button.
- "Bắt đầu lại" runs the same Reset path as the caption's Reset button.
- Progress caption remains visible above, reading "39 đã thuộc · 0 chưa thuộc · 0 chưa xem".

## Test plan

Manual verification after implementation — no test runner in this repo:

1. **Fresh session (all unseen):** load `/japanese/flashcards`, counter reads "1 / 39", pool includes all cards.
2. **Mark cards memorized:** flip + tap Đã thuộc on 3 cards. Counter becomes "1 / 36". Those 3 cards no longer appear via next/prev.
3. **Mark cards not memorized:** flip + tap Chưa thuộc on 2 cards. Counter stays at "1 / 36" (pool size unchanged; not_memorized stays in pool). Front indicator shows the gold dot when navigating back to them.
4. **Persistence:** refresh the page. Statuses persist, counter still "1 / 36", memorized cards still hidden.
5. **Close tab, reopen:** fresh state (sessionStorage cleared on tab close).
6. **Shuffle with partial progress:** tap Shuffle after marking some cards. Pool is still the correct subset; order changes; poolIndex resets to 0.
7. **Reset:** tap Reset. All cards return to unseen; counter back to "1 / 39"; progress caption "0 đã thuộc · 0 chưa thuộc · 39 chưa xem".
8. **Complete all cards:** mark every card memorized. Pool hits 0 → Done screen renders with "Bắt đầu lại".
9. **Done → Bắt đầu lại:** full reset, back to fresh state.
10. **Private-mode Safari:** hydration doesn't throw; marks behave as in-memory only (lost on refresh).
11. **Existing invariants:** flip, keyboard (space/enter) still flips; image fallback still hides missing images; hiragana still suppressed when kanji === hiragana; mobile layout (≤ 375 px) remains fit-on-screen; desktop parity preserved.

## Files touched

- `src/components/flashcards/Flashcards.tsx` — all changes land here.

## Files **not** touched

- `src/data/flashcards/n5-lesson12-c.ts`
- `src/styles/tailwind.css`
- `src/pages/japanese/flashcards.astro`
- `src/components/Header.astro`
- Any other component / layout / data file.

## Out-of-scope / follow-ups (parked)

- Keyboard shortcuts (`j` / `k` or `1` / `2`) for marking — add later if classmates ask
- Swipe gestures on mobile for marking — same
- localStorage persistence — deliberate; current ask was session-scoped
- Spaced repetition with timestamps — intentional YAGNI; current model cycles uniformly
- Cross-deck progress tracking — wait until a second deck actually exists
