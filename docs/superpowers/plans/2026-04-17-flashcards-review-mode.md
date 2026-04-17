# Flashcards review mode — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a triage/review mode so users can mark each flashcard as `memorized` (skip forever) or `not_memorized` (cycle back), with sessionStorage persistence keyed by deck slug.

**Architecture:** Status (`unseen | memorized | not_memorized`) per card id is stored in React state, persisted to sessionStorage, hydrated after mount. Navigation operates on the *active pool* (`unseen ∪ not_memorized`) rather than the full deck. Memorized cards retire from the pool; once the pool is empty a Done screen replaces the card. All logic lives in `src/components/flashcards/Flashcards.tsx` — one file, no new deps.

**Tech Stack:** React 19, TypeScript, Tailwind v4 (page-scoped), `lucide-react` for icons. No test runner exists in this repo; verification is `grep` + `npm run build` + manual browser checks via the Claude Preview MCP.

**Spec:** [`docs/superpowers/specs/2026-04-17-flashcards-review-mode-design.md`](../specs/2026-04-17-flashcards-review-mode-design.md)

---

## Notes before you start

- **No test runner.** Each task's verification step is a mix of `grep`s (to confirm the edit landed), `npm run build` (to catch TS/Tailwind regressions), and — where relevant — a browser-side `preview_eval` or `preview_screenshot` to verify runtime behavior. The controller running this plan has Claude Preview MCP; implementer subagents do not, so subagents end with grep + build, and the controller spot-checks runtime after review.
- **Single file end-to-end.** All changes land in `src/components/flashcards/Flashcards.tsx`. Don't touch `src/data/flashcards/`, `src/styles/`, `src/pages/`, or any other file unless a specific step explicitly says so.
- **Commit after each task.** Lowercase conventional prefix, include the `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>` trailer.
- **Preserve existing invariants.** Don't alter SafeImage, hiragana-suppression, flip animation timing (150 ms), keyboard shortcuts, mobile layout, focus ring, safe-area padding, etc. Each task scopes its edits precisely.
- **Keep a running dev server on port 4321** in a worktree so HMR picks up edits and the controller can spot-check via preview_screenshot. Start once with `npm run dev -- --host`.

---

## File structure

Only one file is modified:

| File | Purpose |
|---|---|
| `src/components/flashcards/Flashcards.tsx` | Presentational React component + local persistence hook + navigation logic. Grows from ~200 → ~320 lines. Acceptable to keep single-file per the spec's invariants; splitting into smaller modules is a follow-up only if it crosses 400 lines. |

Not modified: deck data, Tailwind tokens, page wrapper, `Header.astro`, layouts.

---

## Task 1: Baseline capture

Records the "before" state so regressions are visible after the refactor.

**Files:** none modified.

- [ ] **Step 1.1: Confirm dev server is running and responding**

In the worktree (or wherever `Flashcards.tsx` lives at HEAD of this branch):

```bash
npm run dev -- --host
```

Then from another shell:

```bash
curl -sSf http://localhost:4321/japanese/flashcards -o /dev/null -w "http=%{http_code}\n"
```

Expected: `http=200`.

- [ ] **Step 1.2: Capture "before" mobile + desktop screenshots via MCP Preview**

From the controller:

```
mcp__Claude_Preview__preview_resize { preset: "mobile" }
mcp__Claude_Preview__preview_screenshot { ... }  # save as before-mobile
mcp__Claude_Preview__preview_resize { preset: "desktop" }
mcp__Claude_Preview__preview_screenshot { ... }  # save as before-desktop
```

Store both in the transcript for end-of-plan comparison.

- [ ] **Step 1.3: Note the current counter format**

In `preview_eval`:

```js
(() => {
  const counter = Array.from(document.querySelectorAll('p'))
    .find(p => /^\s*\d+\s*\/\s*\d+\s*$/.test(p.textContent));
  return counter?.textContent?.trim();
})()
```

Expected output: `"1 / 39"`. Write down the exact string; the counter format/spec stays `N / M` after the refactor — only the meaning of M changes (from 39 → active-pool size).

---

## Task 2: Add CardStatus type + useSessionStatuses hook

Introduces the persistence layer without wiring it to navigation yet. After this task the file compiles, the hook exists, and reads/writes work; nothing visually changes because no component state consumes it yet.

**Files:**
- Modify: `src/components/flashcards/Flashcards.tsx` (add type + hook near the top of the file, after imports and the SafeImage component).

- [ ] **Step 2.1: Add types + hook**

Find the line (currently line 37–39):

```tsx
  );
}

export default function Flashcards({ deck }: Props) {
```

Replace with:

```tsx
  );
}

// --- Persistence: per-deck card-status map in sessionStorage -------------------

type CardStatus = "unseen" | "memorized" | "not_memorized";

type SessionState = {
  deckSlug: string;
  version: 1;
  statuses: Record<number, CardStatus>;
};

const SESSION_KEY_PREFIX = "flashcards:session:";
const SESSION_VERSION = 1;

function readSession(deckSlug: string): Record<number, CardStatus> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY_PREFIX + deckSlug);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as SessionState;
    if (
      !parsed ||
      parsed.version !== SESSION_VERSION ||
      parsed.deckSlug !== deckSlug ||
      typeof parsed.statuses !== "object"
    ) {
      return {};
    }
    return parsed.statuses;
  } catch {
    // Private-mode Safari or corrupted JSON — fall back to in-memory.
    return {};
  }
}

function writeSession(deckSlug: string, statuses: Record<number, CardStatus>) {
  if (typeof window === "undefined") return;
  try {
    const payload: SessionState = {
      deckSlug,
      version: SESSION_VERSION,
      statuses,
    };
    window.sessionStorage.setItem(
      SESSION_KEY_PREFIX + deckSlug,
      JSON.stringify(payload)
    );
  } catch {
    // Storage unavailable or quota exceeded — keep in-memory only.
  }
}

function useSessionStatuses(deckSlug: string) {
  // First render (including SSR) has an empty map; real state hydrates in the effect below.
  const [statuses, setStatuses] = useState<Record<number, CardStatus>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setStatuses(readSession(deckSlug));
    setHydrated(true);
  }, [deckSlug]);

  useEffect(() => {
    if (!hydrated) return;
    writeSession(deckSlug, statuses);
  }, [deckSlug, statuses, hydrated]);

  const setStatus = (cardId: number, status: CardStatus) => {
    setStatuses((prev) => ({ ...prev, [cardId]: status }));
  };

  const resetStatuses = () => {
    setStatuses({});
  };

  return { statuses, setStatus, resetStatuses, hydrated };
}

// ----------------------------------------------------------------------------

export default function Flashcards({ deck }: Props) {
```

- [ ] **Step 2.2: Verify build**

```bash
npm run build 2>&1 | tail -3
```

Expected: `[build] Complete!` with 20 pages. TypeScript must accept the new types. If the build fails with a type error, read the message — most likely a typo in the hook.

- [ ] **Step 2.3: Verify grep checks**

```bash
grep -nE "type CardStatus = |function useSessionStatuses|SESSION_KEY_PREFIX" src/components/flashcards/Flashcards.tsx
```

Expected: 3 lines, one match each.

- [ ] **Step 2.4: Commit**

```bash
git add src/components/flashcards/Flashcards.tsx
git commit -m "feat(flashcards): add CardStatus type + session persistence hook

Introduces the data model and sessionStorage-backed hook that later
tasks will wire into navigation. The hook is SSR-safe (empty map on
first render, hydrates after mount), survives refresh within a tab,
wipes on tab close, and falls back to in-memory on private-mode
Safari where sessionStorage is disabled. Nothing else in the component
uses it yet; this commit is a no-op at runtime.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 3: Refactor to pool-based indexing

Replaces `currentIndex` (into full cards array) with `poolIndex` (into the active pool). Consumes the hook from Task 2. After this task, memorized cards are skipped by next/prev/shuffle but there's still no UI to mark them — so the refactor is invisible in practice until Task 4 lands. This intermediate state builds cleanly.

**Files:**
- Modify: `src/components/flashcards/Flashcards.tsx` (inside `Flashcards` component body).

- [ ] **Step 3.1: Replace state + derive pool**

Find (lines ~40–43 after Task 2):

```tsx
  const [cards, setCards] = useState(deck.cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
```

Replace with:

```tsx
  const [cards, setCards] = useState(deck.cards);
  const [poolIndex, setPoolIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const { statuses, setStatus, resetStatuses } = useSessionStatuses(deck.slug);

  // Active pool = cards that are either unseen or explicitly flagged as
  // not-memorized. Memorized cards retire from navigation entirely.
  const activePool = cards.filter(
    (c) => statuses[c.id] !== "memorized"
  );
  const poolSize = activePool.length;
  const safePoolIndex = poolSize === 0 ? 0 : Math.min(poolIndex, poolSize - 1);
  const currentCard = poolSize === 0 ? null : activePool[safePoolIndex];
```

- [ ] **Step 3.2: Update `handleNext` / `handlePrev` to walk the pool**

Find (the `handleNext` / `handlePrev` block, currently ~lines 55–67):

```tsx
  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
    }, 150);
  };
```

Replace with:

```tsx
  const handleNext = () => {
    if (poolSize <= 1) return;
    setIsFlipped(false);
    setTimeout(() => {
      setPoolIndex((prev) => (prev + 1) % poolSize);
    }, 150);
  };

  const handlePrev = () => {
    if (poolSize <= 1) return;
    setIsFlipped(false);
    setTimeout(() => {
      setPoolIndex((prev) => (prev - 1 + poolSize) % poolSize);
    }, 150);
  };
```

- [ ] **Step 3.3: Update `handleShuffle` to reset pool index**

Find (currently ~lines 73–80):

```tsx
  const handleShuffle = () => {
    setIsFlipped(false);
    setTimeout(() => {
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setCards(shuffled);
      setCurrentIndex(0);
    }, 150);
  };
```

Replace with:

```tsx
  const handleShuffle = () => {
    setIsFlipped(false);
    setTimeout(() => {
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setCards(shuffled);
      setPoolIndex(0);
    }, 150);
  };
```

- [ ] **Step 3.4: Update empty / current-card handling**

Find (currently ~lines 45–53):

```tsx
  if (cards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg text-ink-muted">
        <p>Chưa có thẻ nào trong bộ này.</p>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
```

Replace with (note: `currentCard` is now already declared earlier, so this block only handles the empty deck case):

```tsx
  if (cards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg text-ink-muted">
        <p>Chưa có thẻ nào trong bộ này.</p>
      </div>
    );
  }

  if (!currentCard) {
    // Active pool is empty — user has marked every card memorized.
    // Task 7 replaces this with a proper Done screen; for now, render a placeholder
    // so the component doesn't crash.
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-[color:var(--color-ink-muted)]">
        <p>Bạn đã thuộc hết rồi. Reset ở task sau.</p>
      </div>
    );
  }
```

- [ ] **Step 3.5: Update the counter to use pool size**

Find (currently ~line 162):

```tsx
      <p className="mt-4 md:mt-3 text-center text-xs font-medium text-[color:var(--color-ink-muted)] [@media(max-height:640px)]:mt-2">
        {currentIndex + 1} / {cards.length}
      </p>
```

Replace with:

```tsx
      <p className="mt-4 md:mt-3 text-center text-xs font-medium text-[color:var(--color-ink-muted)] [@media(max-height:640px)]:mt-2">
        {safePoolIndex + 1} / {poolSize}
      </p>
```

- [ ] **Step 3.6: Verify build + counter render**

```bash
grep -nE "const activePool = cards.filter|setPoolIndex|safePoolIndex" src/components/flashcards/Flashcards.tsx
```

Expected: at least 4 hits covering activePool derivation, the three setPoolIndex call sites, and safePoolIndex usage.

```bash
grep -nE "currentIndex" src/components/flashcards/Flashcards.tsx
```

Expected: **no matches** (fully replaced by poolIndex).

```bash
npm run build 2>&1 | tail -3
```

Expected: `[build] Complete!`

- [ ] **Step 3.7: Commit**

```bash
git add src/components/flashcards/Flashcards.tsx
git commit -m "refactor(flashcards): drive navigation from active pool

Replace currentIndex (into full cards array) with poolIndex (into
active pool derived from card statuses). Memorized cards — none yet
exist at runtime since no UI writes statuses — are filtered out of
next/prev/shuffle and from the card counter. Counter now reads
'N / pool-size'; on a fresh session pool-size === deck size so
there's no visible change. Empty-pool case has a temporary
placeholder; Task 7 replaces it with the Done screen.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 4: Add back-of-card mark buttons + auto-advance

Wires the UI to the persistence layer. After this task, users can flip a card, tap one of two mark buttons, and see the card auto-advance to the next pool member.

**Files:**
- Modify: `src/components/flashcards/Flashcards.tsx` (add `handleMark` function; extend the back-of-card render).

- [ ] **Step 4.1: Add `handleMark` near the other handlers**

Find the `handleShuffle` function (after Task 3's edits). Immediately after its closing `};`, insert:

```tsx

  const handleMark = (status: CardStatus) => {
    if (!currentCard) return;
    const cardId = currentCard.id;
    setStatus(cardId, status);

    setIsFlipped(false);
    setTimeout(() => {
      // Recompute pool as it would be AFTER this mark, then pick the next
      // logical position. Marking memorized shrinks the pool, so the cleanest
      // "next" is to stay at the same pool index (the card at that slot is
      // now the one that used to come after), wrapping if we were at the end.
      const nextStatuses = { ...statuses, [cardId]: status };
      const nextPool = cards.filter((c) => nextStatuses[c.id] !== "memorized");
      if (nextPool.length === 0) {
        setPoolIndex(0);
        return;
      }
      if (status === "memorized") {
        // Current card leaves the pool → same index now points at the card
        // that was formerly at poolIndex + 1 (or wraps to 0 at the end).
        setPoolIndex(safePoolIndex % nextPool.length);
      } else {
        // Card stays in the pool → advance like Next.
        setPoolIndex((prev) => (prev + 1) % nextPool.length);
      }
    }, 150);
  };
```

- [ ] **Step 4.2: Extend the back-of-card render with mark buttons**

Find (after Task 3's edits, the back-of-card block around lines 145–156):

```tsx
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            {currentCard.kanji !== currentCard.hiragana && (
              <p className="text-2xl font-medium text-[color:var(--color-accent)] mb-2">
                {currentCard.hiragana}
              </p>
            )}
            <h2 className="font-serif text-3xl font-semibold text-[color:var(--color-ink)] mb-4 px-4">
              {currentCard.vietnamese}
            </h2>
          </div>
        )}
```

Replace with:

```tsx
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-6 w-full">
            {currentCard.kanji !== currentCard.hiragana && (
              <p className="text-2xl font-medium text-[color:var(--color-accent)] mb-2">
                {currentCard.hiragana}
              </p>
            )}
            <h2 className="font-serif text-3xl font-semibold text-[color:var(--color-ink)] mb-2 px-4">
              {currentCard.vietnamese}
            </h2>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMark("not_memorized");
                }}
                className="px-4 h-11 inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] text-[color:var(--color-ink)] text-sm font-medium shadow-sm hover:shadow-md hover:text-[color:var(--color-accent)] transition-transform duration-150 ease-out active:scale-95 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]"
                aria-label="Chưa thuộc từ này"
              >
                <RotateCw size={16} />
                Chưa thuộc
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMark("memorized");
                }}
                className="px-4 h-11 inline-flex items-center justify-center rounded-full bg-[color:var(--color-accent-soft)] text-[color:var(--color-ink)] text-sm font-semibold shadow-sm hover:shadow-md transition-transform duration-150 ease-out active:scale-95 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]"
                aria-label="Đã thuộc từ này"
              >
                Đã thuộc
              </button>
            </div>
          </div>
        )}
```

Note: `e.stopPropagation()` on the button onClicks is important — the card itself is a clickable `role="button"` that flips on click. Without stopPropagation, tapping Chưa thuộc / Đã thuộc would also re-flip the card immediately, producing an incoherent state.

- [ ] **Step 4.3: Verify build + grep**

```bash
grep -nE "const handleMark|Chưa thuộc|Đã thuộc" src/components/flashcards/Flashcards.tsx
```

Expected: 3+ hits (the function, and both button labels).

```bash
grep -nE "e.stopPropagation" src/components/flashcards/Flashcards.tsx
```

Expected: 2 hits (one per mark button).

```bash
npm run build 2>&1 | tail -3
```

Expected: `[build] Complete!`

- [ ] **Step 4.4: Commit**

```bash
git add src/components/flashcards/Flashcards.tsx
git commit -m "feat(flashcards): add Chưa thuộc / Đã thuộc mark buttons

Two buttons on the back of the card let users triage each word:
  - Chưa thuộc (not memorized): card stays in the pool, auto-advance
  - Đã thuộc (memorized): card retires from the pool, auto-advance
Auto-advance flips the card back to its front and moves poolIndex
forward, recomputing the post-mark pool first so the index never
points at a memorized card. stopPropagation keeps the underlying
card-flip from firing on the buttons.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 5: Progress caption + Reset button

Adds a small caption between the counter and the control row showing how many cards are in each status, plus a Reset button that wipes the session.

**Files:**
- Modify: `src/components/flashcards/Flashcards.tsx` (insert a new block between the counter `<p>` and the Controls `<div>`).

- [ ] **Step 5.1: Compute per-status counts**

Inside the `Flashcards` component body, immediately after the `safePoolIndex` / `currentCard` declarations added in Task 3 (just before the `if (cards.length === 0)` check), add:

Find:

```tsx
  const safePoolIndex = poolSize === 0 ? 0 : Math.min(poolIndex, poolSize - 1);
  const currentCard = poolSize === 0 ? null : activePool[safePoolIndex];

  if (cards.length === 0) {
```

Replace with:

```tsx
  const safePoolIndex = poolSize === 0 ? 0 : Math.min(poolIndex, poolSize - 1);
  const currentCard = poolSize === 0 ? null : activePool[safePoolIndex];

  // Per-status counts for the progress caption.
  let memorizedCount = 0;
  let notMemorizedCount = 0;
  for (const c of cards) {
    const s = statuses[c.id];
    if (s === "memorized") memorizedCount++;
    else if (s === "not_memorized") notMemorizedCount++;
  }
  const unseenCount = cards.length - memorizedCount - notMemorizedCount;

  if (cards.length === 0) {
```

- [ ] **Step 5.2: Insert progress caption + Reset between counter and controls**

Find (after Task 4, around lines ~165–170 — the counter `<p>` immediately followed by the Controls `<div>`):

```tsx
      {/* Card counter */}
      <p className="mt-4 md:mt-3 text-center text-xs font-medium text-[color:var(--color-ink-muted)] [@media(max-height:640px)]:mt-2">
        {safePoolIndex + 1} / {poolSize}
      </p>

      {/* Controls */}
      <div className="mt-4 md:mt-3 flex items-center gap-5 md:gap-6 [@media(max-height:640px)]:mt-0">
```

Replace with:

```tsx
      {/* Card counter */}
      <p className="mt-4 md:mt-3 text-center text-xs font-medium text-[color:var(--color-ink-muted)] [@media(max-height:640px)]:mt-2">
        {safePoolIndex + 1} / {poolSize}
      </p>

      {/* Progress + reset */}
      <div className="mt-2 flex items-center justify-center gap-3 text-xs font-medium text-[color:var(--color-ink-muted)] [@media(max-height:640px)]:mt-1">
        <span>
          {memorizedCount} đã thuộc · {notMemorizedCount} chưa thuộc · {unseenCount} chưa xem
        </span>
        <button
          type="button"
          onClick={() => {
            resetStatuses();
            setPoolIndex(0);
            setIsFlipped(false);
          }}
          className="underline decoration-dotted underline-offset-2 hover:text-[color:var(--color-accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)] rounded"
          aria-label="Reset trạng thái học phiên này"
        >
          Reset
        </button>
      </div>

      {/* Controls */}
      <div className="mt-4 md:mt-3 flex items-center gap-5 md:gap-6 [@media(max-height:640px)]:mt-0">
```

- [ ] **Step 5.3: Verify**

```bash
grep -nE "đã thuộc · |chưa thuộc · |chưa xem|resetStatuses\(\)" src/components/flashcards/Flashcards.tsx
```

Expected: at least 2 hits (the caption template string, the reset call).

```bash
npm run build 2>&1 | tail -3
```

Expected: `[build] Complete!`

- [ ] **Step 5.4: Commit**

```bash
git add src/components/flashcards/Flashcards.tsx
git commit -m "feat(flashcards): progress caption + session reset

A small caption between the counter and the controls shows how many
cards are memorized / not-memorized / unseen, and a Reset button
wipes sessionStorage and returns every card to the unseen pool. No
confirmation modal — Reset only touches per-session classifications,
the built-in deck content is unaffected.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 6: Status indicator on the card front

A small accent-gold dot on the top-left of the card front when the current card is flagged `not_memorized`. Memorized cards are never in the pool, so no indicator is ever shown for them.

**Files:**
- Modify: `src/components/flashcards/Flashcards.tsx` (add the dot inside the card, alongside the existing RotateCw icon in the top-right).

- [ ] **Step 6.1: Add the dot**

Find (the `<div>` wrapping the existing RotateCw icon, currently around lines 107–115):

```tsx
        <div
          className={`absolute top-4 right-4 transition-colors ${
            isFlipped
              ? "text-[color:var(--color-accent)]"
              : "text-[color:var(--color-border)]"
          }`}
        >
          <RotateCw size={20} />
        </div>
```

Insert immediately **before** that block (so the dot is a sibling placed in the opposite corner):

```tsx
        {statuses[currentCard.id] === "not_memorized" && !isFlipped && (
          <span
            className="absolute top-4 left-4 inline-block w-2 h-2 rounded-full bg-[color:var(--color-accent)]"
            aria-label="Chưa thuộc"
            title="Chưa thuộc"
          />
        )}
        <div
          className={`absolute top-4 right-4 transition-colors ${
            isFlipped
              ? "text-[color:var(--color-accent)]"
              : "text-[color:var(--color-border)]"
          }`}
        >
          <RotateCw size={20} />
        </div>
```

Notes:
- `!isFlipped` keeps the dot visible only on the front; the back is busy with meaning + mark buttons.
- 8 px diameter (`w-2 h-2`) matches the spec.
- `span` (not `div`) so it doesn't break flex children; explicit `aria-label`+`title` for accessibility/tooltip.

- [ ] **Step 6.2: Verify**

```bash
grep -n "not_memorized.*!isFlipped" src/components/flashcards/Flashcards.tsx
```

Expected: one hit.

```bash
grep -nE "top-4 left-4 inline-block w-2 h-2 rounded-full" src/components/flashcards/Flashcards.tsx
```

Expected: one hit.

```bash
npm run build 2>&1 | tail -3
```

Expected: `[build] Complete!`

- [ ] **Step 6.3: Commit**

```bash
git add src/components/flashcards/Flashcards.tsx
git commit -m "feat(flashcards): dot indicator for not-memorized cards on card front

Small accent-gold dot in the top-left corner when landing on a card
previously flagged Chưa thuộc. Only appears on the front (back is
busy with meaning + mark buttons) and never for memorized cards
(they're not in the pool). Nothing for unseen cards — absence of a
dot is the unseen state.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 7: Done screen

Replace the placeholder from Task 3.4 with a proper Done panel, shown when the active pool is empty.

**Files:**
- Modify: `src/components/flashcards/Flashcards.tsx` (replace the early-return `!currentCard` block).

- [ ] **Step 7.1: Replace the placeholder**

Find (inserted in Task 3.4):

```tsx
  if (!currentCard) {
    // Active pool is empty — user has marked every card memorized.
    // Task 7 replaces this with a proper Done screen; for now, render a placeholder
    // so the component doesn't crash.
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-[color:var(--color-ink-muted)]">
        <p>Bạn đã thuộc hết rồi. Reset ở task sau.</p>
      </div>
    );
  }
```

Replace with:

```tsx
  if (!currentCard) {
    const handleRestart = () => {
      resetStatuses();
      setPoolIndex(0);
      setIsFlipped(false);
    };

    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center pt-4 px-4 pb-[max(env(safe-area-inset-bottom),1rem)] font-sans text-[color:var(--color-ink)]">
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="font-serif text-2xl md:text-4xl font-semibold text-[color:var(--color-ink)] mb-1 md:mb-2 tracking-tight">
            {deck.title}
          </h1>
          <p className="text-sm md:text-base text-[color:var(--color-ink-muted)] font-medium">
            {deck.subtitle}
          </p>
        </div>

        <div className="w-full max-w-sm bg-[color:var(--color-surface)] rounded-3xl shadow-lg border border-[color:var(--color-border)] flex flex-col items-center justify-center p-10 text-center">
          <p className="text-5xl mb-4" aria-hidden="true">🎉</p>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[color:var(--color-ink)] mb-2">
            Bạn đã thuộc hết {cards.length} từ!
          </h2>
          <p className="text-sm text-[color:var(--color-ink-muted)] mb-6">
            Làm tốt lắm. Reset để học lại từ đầu?
          </p>
          <button
            type="button"
            onClick={handleRestart}
            className="px-6 h-12 inline-flex items-center justify-center rounded-full bg-[color:var(--color-accent-soft)] text-[color:var(--color-ink)] text-base font-semibold shadow-sm hover:shadow-md transition-transform duration-150 ease-out active:scale-95 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]"
            aria-label="Bắt đầu lại từ đầu"
          >
            Bắt đầu lại
          </button>
        </div>

        <p className="mt-4 md:mt-3 text-xs font-medium text-[color:var(--color-ink-muted)]">
          {cards.length} đã thuộc · 0 chưa thuộc · 0 chưa xem
        </p>
      </div>
    );
  }
```

- [ ] **Step 7.2: Verify**

```bash
grep -nE "Bạn đã thuộc hết|Bắt đầu lại" src/components/flashcards/Flashcards.tsx
```

Expected: 2 hits.

```bash
grep -n "Reset ở task sau" src/components/flashcards/Flashcards.tsx
```

Expected: **no matches** (placeholder removed).

```bash
npm run build 2>&1 | tail -3
```

Expected: `[build] Complete!`

- [ ] **Step 7.3: Commit**

```bash
git add src/components/flashcards/Flashcards.tsx
git commit -m "feat(flashcards): Done screen when every card is memorized

When the active pool is empty the component renders a celebratory
panel instead of a card, with the deck header above and a 'Bắt đầu
lại' button that runs the same reset path as the progress caption.
Replaces the temporary placeholder introduced in the pool-refactor
task.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 8: End-to-end verification + push

Sanity-check every user-facing behavior on mobile and desktop, then push.

**Files:** none modified.

- [ ] **Step 8.1: Fresh-session mobile check**

Via MCP Preview:

```
mcp__Claude_Preview__preview_resize { preset: "mobile" }
```

In `preview_eval`, reload the page to clear sessionStorage:

```js
window.sessionStorage.clear();
window.location.reload();
```

Wait 1.5 s, then screenshot. Verify:
- Counter reads `1 / 39`.
- Progress caption reads `0 đã thuộc · 0 chưa thuộc · 39 chưa xem`.
- No dot on the card front.

- [ ] **Step 8.2: Mark a few cards, verify pool shrinks**

In `preview_eval`, run a scripted sequence:

```js
(async () => {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const card = document.querySelector('[role="button"][tabindex="0"]');
  // Round 1: flip, mark memorized
  card.click(); await sleep(300);
  document.querySelector('button[aria-label="Đã thuộc từ này"]').click(); await sleep(400);
  // Round 2: flip, mark not memorized
  card.click(); await sleep(300);
  document.querySelector('button[aria-label="Chưa thuộc từ này"]').click(); await sleep(400);
  // Inspect
  const counter = Array.from(document.querySelectorAll('p')).find(p => /^\s*\d+\s*\/\s*\d+\s*$/.test(p.textContent));
  const progress = Array.from(document.querySelectorAll('span')).find(s => /đã thuộc · /.test(s.textContent));
  return { counter: counter?.textContent?.trim(), progress: progress?.textContent?.trim() };
})()
```

Expected:
- `counter` like `"2 / 38"` (one card left the pool; current index advanced).
- `progress` like `"1 đã thuộc · 1 chưa thuộc · 37 chưa xem"`.

- [ ] **Step 8.3: Refresh persistence check**

In `preview_eval`:

```js
window.location.reload();
```

After reload (~1.5 s), verify the progress caption still reads `"1 đã thuộc · 1 chưa thuộc · 37 chưa xem"`. This confirms sessionStorage round-trip.

- [ ] **Step 8.4: Dot indicator check**

Navigate Prev/Next until landing on the card flagged not-memorized (you may need to step through a few cards). In `preview_eval`:

```js
(() => {
  const dot = document.querySelector('span[aria-label="Chưa thuộc"]');
  return { dotPresent: !!dot };
})()
```

Expected (when on a not-memorized card): `{ dotPresent: true }`.
Expected (when on an unseen card): `{ dotPresent: false }`.

- [ ] **Step 8.5: Reset check**

Click the Reset button in the progress caption (use `preview_eval`):

```js
Array.from(document.querySelectorAll('button')).find(b => /^\s*Reset\s*$/.test(b.textContent))?.click();
```

After ~300 ms verify the progress caption reads `"0 đã thuộc · 0 chưa thuộc · 39 chưa xem"` and counter is `"1 / 39"`.

- [ ] **Step 8.6: Done-screen simulation**

Fast path to the Done screen (saves marking 39 cards by hand):

```js
(() => {
  // Populate sessionStorage with every card memorized, then reload.
  const deckSlug = "n5-lesson12-c";
  const statuses = {};
  for (let i = 1; i <= 39; i++) statuses[i] = "memorized";
  window.sessionStorage.setItem(
    "flashcards:session:" + deckSlug,
    JSON.stringify({ deckSlug, version: 1, statuses })
  );
  window.location.reload();
})()
```

After reload, verify the Done panel is visible (🎉, "Bạn đã thuộc hết 39 từ!", "Bắt đầu lại" button). Click "Bắt đầu lại":

```js
Array.from(document.querySelectorAll('button')).find(b => /Bắt đầu lại/.test(b.textContent))?.click();
```

Verify the card reappears, counter is `"1 / 39"`.

- [ ] **Step 8.7: Desktop parity**

```
mcp__Claude_Preview__preview_resize { preset: "desktop" }
mcp__Claude_Preview__preview_screenshot { ... }
```

Compare to the Task 1.2 "before-desktop" screenshot. Differences should be additive only: the progress caption / Reset between counter and controls, mark buttons on the back of flipped cards (not visible on the front), optional dot indicator. The existing layout (title, card shape, arrow controls, shuffle button) must match.

- [ ] **Step 8.8: Push**

```bash
git push origin <branch-name>
```

(Branch name is whatever worktree/branch the controller is using — e.g. `feature/flashcards-review-mode` if a worktree was created for this work.)

- [ ] **Step 8.9: Post-deploy smoke**

Once `gh run list --limit 1` shows the deploy as `completed success`, visit `https://vinh.to/japanese/flashcards` on a real device. Run through: mark 2 memorized + 1 not-memorized, refresh, confirm persistence, reset.

---

## Spec coverage check

| Spec section | Task(s) | Status |
|---|---|---|
| §1 State + persistence (CardStatus, SessionState, sessionStorage key, SSR safety, try/catch fallback, version) | Task 2 | covered |
| §2 Pool derivation + poolIndex replacement | Task 3 | covered |
| §3 Back-of-card mark buttons + auto-advance + stopPropagation | Task 4 | covered |
| §4 Next/Prev/Shuffle pool-awareness, wrap-around, edge cases | Task 3 (+ Task 4 for auto-advance) | covered |
| §5 Progress caption + Reset | Task 5 | covered |
| §6 Status indicator dot on front | Task 6 | covered |
| §7 Done screen | Task 7 (uses Task 3.4 placeholder slot) | covered |
| Test-plan items 1–11 | Task 8 covers 1–9; items 10–11 (private-mode Safari, invariant regressions) are controller spot-checks after merge | covered |
