# Flashcards mobile polish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the flashcard page on mobile: larger touch targets, more breathing room between card and controls, counter moved out of the card, shrunk heading on mobile, and standard mobile-polish edge cases (safe-area, short viewports, focus-visible, tap feel).

**Architecture:** All changes are scoped to a single React component, `src/components/flashcards/Flashcards.tsx`. Styling uses Tailwind v4 utilities already wired up for this page; theme tokens (`--color-ink`, `--color-accent`, `--color-bg`, `--color-surface`, `--color-border`, etc.) live in `src/styles/tailwind.css`. No new dependencies, no CSS file changes, no data changes.

**Tech Stack:** Astro 5 (static), React 19, Tailwind v4 (page-scoped via `@tailwindcss/vite`), `lucide-react` for icons. Verification via the running dev server (`npm run dev`) using the Claude Preview MCP tools (screenshot + measure), **not** a test runner — this repo has none.

**Spec:** [`docs/superpowers/specs/2026-04-17-flashcards-mobile-polish-design.md`](../specs/2026-04-17-flashcards-mobile-polish-design.md)

---

## Notes before you start

- **No test runner.** Astro's default scaffold here has no Vitest/Playwright. Verification in each task is a **measurement or screenshot** via the dev server. Measurements use `getBoundingClientRect()` in the browser; screenshots use `preview_screenshot`.
- **Keep the dev server running.** Start it once with `npm run dev` (port 4321) before Task 1 and leave it running across all tasks. Vite HMR will pick up each edit.
- **Desktop parity.** Desktop must stay within ~4 px of today's layout. Take one "baseline" desktop screenshot at Task 1 and re-check at the end.
- **Commit after each task.** This keeps the bisect-friendly history the rest of the repo uses.

---

## File structure

Only one file is modified end-to-end:

| File | Purpose |
|---|---|
| `src/components/flashcards/Flashcards.tsx` | Presentational React component for the flashcard page. Renders the header (deck title + subtitle), the card (with image/hiragana/kanji/hint on front, meaning on back), and the control row (prev / shuffle / next). |

Not modified anywhere: `BaseLayout.astro`, `Header.astro`, `global.css`, `tailwind.css`, deck data, or the page wrapper.

---

## Task 1: Capture baseline measurements and screenshots

Establishes the "before" state so regressions are visible.

**Files:**
- None modified. Read-only verification.

- [ ] **Step 1.1: Start the dev server (if not already running)**

From `hswolf.github.io/`:

```bash
npm run dev
```

Expected: server listening on `http://localhost:4321`.

- [ ] **Step 1.2: Resize the preview to the mobile preset and navigate to the flashcards page**

Use the Claude Preview MCP:

```
mcp__Claude_Preview__preview_resize { preset: "mobile" }   # 375 × 812
```

Then in the browser eval:

```js
window.location.href = '/japanese/flashcards';
```

- [ ] **Step 1.3: Take the "before (mobile)" screenshot**

Via `preview_screenshot`. Save / keep for later side-by-side.

- [ ] **Step 1.4: Measure the current state via browser eval**

Paste this into `preview_eval`:

```js
(() => {
  const card = document.querySelector('[role="button"][tabindex="0"]');
  const prev = document.querySelector('button[aria-label="Thẻ trước"]');
  const next = document.querySelector('button[aria-label="Thẻ tiếp theo"]');
  const shuffle = document.querySelector('button[aria-label="Xáo trộn thẻ"]');
  const cb = card.getBoundingClientRect();
  const pb = prev.getBoundingClientRect();
  const nb = next.getBoundingClientRect();
  const sb = shuffle.getBoundingClientRect();
  return {
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    card: `${Math.round(cb.width)}x${Math.round(cb.height)}`,
    prev: `${Math.round(pb.width)}x${Math.round(pb.height)}`,
    shuffle: `${Math.round(sb.width)}x${Math.round(sb.height)}`,
    next: `${Math.round(nb.width)}x${Math.round(nb.height)}`,
    gapCardToPrev: Math.round(pb.top - cb.bottom),
    gapPrevToShuffle: Math.round(sb.left - pb.right),
    gapShuffleToNext: Math.round(nb.left - sb.right),
  };
})()
```

Expected output (roughly; your viewport is exactly 375×812):

```json
{
  "viewport": "375x812",
  "card": "343x457",
  "prev": "60x60",
  "shuffle": "56x56",
  "next": "60x60",
  "gapCardToPrev": 40,
  "gapPrevToShuffle": 24,
  "gapShuffleToNext": 24
}
```

Write the actual numbers down (or keep the tool call transcript) — these are the "before" baseline.

- [ ] **Step 1.5: Resize to desktop and capture the "before (desktop)" screenshot**

```
mcp__Claude_Preview__preview_resize { preset: "desktop" }   # 1280 × 800
```

`preview_screenshot`. Keep for end-of-plan parity check.

---

## Task 2: Resize the control buttons and icons

Sets primary (prev/next) to 56 × 56 with 24 px icons and secondary (shuffle) to 48 × 48 with a 20 px icon. Same sizes on mobile and desktop.

**Files:**
- Modify: `src/components/flashcards/Flashcards.tsx:163-189`

- [ ] **Step 2.1: Replace the control row**

Find (lines ~163–189):

```tsx
      {/* Controls */}
      <div className="mt-10 flex items-center gap-6">
        <button
          onClick={handlePrev}
          className="p-4 rounded-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] text-[color:var(--color-ink)] shadow-sm hover:shadow-md hover:text-[color:var(--color-accent)] transition-all active:scale-95"
          aria-label="Thẻ trước"
        >
          <ChevronLeft size={28} />
        </button>

        <button
          onClick={handleShuffle}
          className="p-4 rounded-full bg-[color:var(--color-accent-soft)] text-[color:var(--color-ink)] shadow-sm hover:shadow-md transition-all active:scale-95"
          title="Xáo trộn thẻ"
          aria-label="Xáo trộn thẻ"
        >
          <Shuffle size={24} />
        </button>

        <button
          onClick={handleNext}
          className="p-4 rounded-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] text-[color:var(--color-ink)] shadow-sm hover:shadow-md hover:text-[color:var(--color-accent)] transition-all active:scale-95"
          aria-label="Thẻ tiếp theo"
        >
          <ChevronRight size={28} />
        </button>
      </div>
```

Replace with:

```tsx
      {/* Controls */}
      <div className="mt-10 flex items-center gap-6">
        <button
          onClick={handlePrev}
          className="w-14 h-14 inline-flex items-center justify-center rounded-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] text-[color:var(--color-ink)] shadow-sm hover:shadow-md hover:text-[color:var(--color-accent)] transition-all active:scale-95"
          aria-label="Thẻ trước"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={handleShuffle}
          className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-[color:var(--color-accent-soft)] text-[color:var(--color-ink)] shadow-sm hover:shadow-md transition-all active:scale-95"
          title="Xáo trộn thẻ"
          aria-label="Xáo trộn thẻ"
        >
          <Shuffle size={20} />
        </button>

        <button
          onClick={handleNext}
          className="w-14 h-14 inline-flex items-center justify-center rounded-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] text-[color:var(--color-ink)] shadow-sm hover:shadow-md hover:text-[color:var(--color-accent)] transition-all active:scale-95"
          aria-label="Thẻ tiếp theo"
        >
          <ChevronRight size={24} />
        </button>
      </div>
```

Changes:
- `p-4` → `w-14 h-14` (prev/next) and `w-12 h-12` (shuffle) — explicit square sizing.
- Added `inline-flex items-center justify-center` so the icon is centered inside the now-explicitly-sized button (previously padding centered it implicitly).
- Icon sizes: `ChevronLeft/Right` from 28 → 24, `Shuffle` from 24 → 20.
- Removed the gap/margin-top changes on this step — those land in Task 3.

- [ ] **Step 2.2: Verify button sizes on mobile**

Resize to mobile:

```
mcp__Claude_Preview__preview_resize { preset: "mobile" }
```

Run the same measurement eval from Step 1.4.

Expected:
- `prev`: `56x56`
- `shuffle`: `48x48`
- `next`: `56x56`

If numbers differ, the class change didn't flush — save the file again to trigger HMR, or reload the page.

- [ ] **Step 2.3: Commit**

```bash
git add src/components/flashcards/Flashcards.tsx
git commit -m "style(flashcards): enlarge primary buttons, shrink shuffle

Primary prev/next buttons explicitly sized 56x56 with 24px icons;
shuffle button 48x48 with 20px icon. Matches WCAG AAA / Apple HIG
touch-target recommendations and establishes visual hierarchy
between primary navigation and secondary shuffle action.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 3: Adjust horizontal and vertical gaps

Sets gap between buttons to 20 px on mobile, 24 px on desktop. Sets gap between card area (which will soon include a counter) and control row to 48 px on mobile, 40 px on desktop.

**Files:**
- Modify: `src/components/flashcards/Flashcards.tsx:164` (the `{/* Controls */}` row's wrapper className)

- [ ] **Step 3.1: Update the control row wrapper classes**

Find:

```tsx
      {/* Controls */}
      <div className="mt-10 flex items-center gap-6">
```

Replace with:

```tsx
      {/* Controls */}
      <div className="mt-12 md:mt-10 flex items-center gap-5 md:gap-6 [@media(max-height:640px)]:mt-6">
```

Changes:
- `mt-10` → `mt-12 md:mt-10` — 48 px on mobile, 40 px on desktop.
- `gap-6` → `gap-5 md:gap-6` — 20 px on mobile, 24 px on desktop.
- Added `[@media(max-height:640px)]:mt-6` — on short viewports (landscape phones, foldable cover screens), shrink the gap to 24 px so controls still fit.

- [ ] **Step 3.2: Verify on mobile**

Resize to mobile and run the measurement eval. Expected:

- `gapPrevToShuffle`: `20`
- `gapShuffleToNext`: `20`
- `gapCardToPrev`: `48`

- [ ] **Step 3.3: Verify on desktop**

Resize to desktop and re-measure. Expected:

- `gapPrevToShuffle`: `24`
- `gapShuffleToNext`: `24`
- `gapCardToPrev`: `40`

- [ ] **Step 3.4: Commit**

```bash
git add src/components/flashcards/Flashcards.tsx
git commit -m "style(flashcards): viewport-scaled control spacing

Mobile gets a more generous 48px gap between card and controls and
20px between buttons (matches the new button sizing); desktop keeps
the denser 40/24px. Short viewports (max-height: 640px) collapse the
card-to-controls gap to 24px so landscape phones still fit everything.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 4: Move the counter out of the card

The `{currentIndex + 1} / {cards.length}` caption currently renders inside the card at `absolute bottom-4`. Move it to a standalone element that sits between the card and the control row.

**Files:**
- Modify: `src/components/flashcards/Flashcards.tsx:158-160` (remove in-card counter)
- Modify: `src/components/flashcards/Flashcards.tsx:163` (insert caption before Controls)

- [ ] **Step 4.1: Remove the in-card counter**

Find (lines ~158–160):

```tsx
        <div className="absolute bottom-4 text-sm font-medium text-[color:var(--color-ink-muted)]">
          {currentIndex + 1} / {cards.length}
        </div>
      </div>
```

Remove the whole `<div>` so the card's closing `</div>` is preserved:

```tsx
      </div>
```

- [ ] **Step 4.2: Insert the counter caption before the control row**

Find the `{/* Controls */}` comment (now at what was line 163, may have shifted). Immediately above that comment, insert:

```tsx
      {/* Card counter */}
      <p className="mt-4 md:mt-3 text-xs font-medium text-[color:var(--color-ink-muted)] [@media(max-height:640px)]:mt-2">
        {currentIndex + 1} / {cards.length}
      </p>

```

- [ ] **Step 4.3: Adjust the control row margin so total card-to-controls is still 48/40**

Because the counter now adds ~16 px (mt-4) on mobile and ~12 px (md:mt-3) on desktop above the controls, the control row's own `mt-12 md:mt-10` is too much. Reduce it so the total (counter top margin + counter height ~16 px + control row top margin) matches §1 of the spec.

Target totals:
- Mobile: card-bottom → 48 px → controls-top. Split: `mt-4` (16 px) on counter, counter text ~16 px tall, then `mt-4` (16 px) = 48 total ✓
- Desktop: 40 px total. Split: `md:mt-3` (12 px), counter ~16 px, `md:mt-3` (12 px) = 40 ✓

Find the Controls row className (just edited in Task 3):

```tsx
      <div className="mt-12 md:mt-10 flex items-center gap-5 md:gap-6 [@media(max-height:640px)]:mt-6">
```

Replace with:

```tsx
      <div className="mt-4 md:mt-3 flex items-center gap-5 md:gap-6 [@media(max-height:640px)]:mt-2">
```

- [ ] **Step 4.4: Verify the card no longer has the counter**

In `preview_eval`:

```js
(() => {
  const card = document.querySelector('[role="button"][tabindex="0"]');
  const inCardCounter = Array.from(card.querySelectorAll('div')).find(d => /\d+\s*\/\s*\d+/.test(d.textContent));
  return { inCardCounter: !!inCardCounter };
})()
```

Expected: `{ inCardCounter: false }`

- [ ] **Step 4.5: Verify the new caption exists between card and controls**

```js
(() => {
  const card = document.querySelector('[role="button"][tabindex="0"]');
  const prev = document.querySelector('button[aria-label="Thẻ trước"]');
  const cb = card.getBoundingClientRect();
  const pb = prev.getBoundingClientRect();
  // find the counter paragraph in the outer stack
  const counter = Array.from(document.querySelectorAll('p'))
    .find(p => /^\s*\d+\s*\/\s*\d+\s*$/.test(p.textContent));
  const r = counter?.getBoundingClientRect();
  return {
    counterText: counter?.textContent?.trim(),
    cardBottom: Math.round(cb.bottom),
    counterTop: r ? Math.round(r.top) : null,
    counterBottom: r ? Math.round(r.bottom) : null,
    controlsTop: Math.round(pb.top),
    cardToCounter: r ? Math.round(r.top - cb.bottom) : null,
    counterToControls: r ? Math.round(pb.top - r.bottom) : null,
  };
})()
```

Expected (on mobile):
- `counterText`: `"1 / 39"`
- `cardToCounter`: ~16
- `counterToControls`: ~16

- [ ] **Step 4.6: Commit**

```bash
git add src/components/flashcards/Flashcards.tsx
git commit -m "refactor(flashcards): move card counter out of card

The \`1 / 39\` caption used to float inside the card at the bottom,
eating ~32px of card real estate. It now sits between the card and
the control row as a small centered caption, where the eye already
tracks during the \"studied → next\" transition. Reclaims space for
the image and word without changing the information architecture.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 5: Shrink heading + subtitle on mobile

Reduce visual weight of the deck title/subtitle on mobile so the card + counter + controls all fit on one phone screen without scrolling.

**Files:**
- Modify: `src/components/flashcards/Flashcards.tsx:84-91`

- [ ] **Step 5.1: Update the header block**

Find:

```tsx
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-semibold text-[color:var(--color-ink)] mb-2 tracking-tight">
          {deck.title}
        </h1>
        <p className="text-[color:var(--color-ink-muted)] font-medium">
          {deck.subtitle}
        </p>
      </div>
```

Replace with:

```tsx
      <div className="mb-6 md:mb-8 text-center">
        <h1 className="font-serif text-2xl md:text-4xl font-semibold text-[color:var(--color-ink)] mb-1 md:mb-2 tracking-tight">
          {deck.title}
        </h1>
        <p className="text-sm md:text-base text-[color:var(--color-ink-muted)] font-medium">
          {deck.subtitle}
        </p>
      </div>
```

Changes (mobile-only; desktop preserved via `md:` modifiers):
- `mb-8` → `mb-6 md:mb-8`
- `text-4xl` → `text-2xl md:text-4xl`
- `mb-2` → `mb-1 md:mb-2`
- Subtitle gains `text-sm md:text-base`

- [ ] **Step 5.2: Verify header height on mobile**

```js
(() => {
  const header = document.querySelector('h1')?.parentElement;
  const r = header.getBoundingClientRect();
  return { headerHeight: Math.round(r.height) };
})()
```

Expected: ~70–80 px on mobile (down from ~140+ px before this task).

- [ ] **Step 5.3: Verify header still looks correct on desktop**

Resize to desktop, take a screenshot, compare mentally to the Task 1 desktop baseline — the header should look visually identical.

- [ ] **Step 5.4: Commit**

```bash
git add src/components/flashcards/Flashcards.tsx
git commit -m "style(flashcards): shrink deck title and subtitle on mobile

Mobile only: h1 drops from text-4xl to text-2xl, mb-2 to mb-1, and
the subtitle picks up text-sm. Desktop keeps the original grandeur
via md: modifiers. Reclaims ~70px of vertical space on iPhone-class
viewports so the card + counter + controls fit without scrolling.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 6: Add safe-area padding, tap feel polish, and keyboard focus ring

Three small polish items bundled — each is a one-line className tweak on the same elements.

**Files:**
- Modify: `src/components/flashcards/Flashcards.tsx:83` (outer container — safe-area)
- Modify: `src/components/flashcards/Flashcards.tsx:94-106` (card interactive area — focus ring)
- Modify: `src/components/flashcards/Flashcards.tsx:165-188` (three buttons — tap feel + focus ring)

- [ ] **Step 6.1: Add safe-area bottom padding on the outermost wrapper**

Find (line ~83):

```tsx
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 font-sans text-[color:var(--color-ink)]">
```

Replace with:

```tsx
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 pb-[max(env(safe-area-inset-bottom),1rem)] font-sans text-[color:var(--color-ink)]">
```

Added: `pb-[max(env(safe-area-inset-bottom),1rem)]` — on iPhones with a home indicator, pushes the last control row ~34 px above the indicator; elsewhere falls back to `1rem`.

- [ ] **Step 6.2: Add focus-visible ring on the card**

Find the card opening `<div>` className (line ~95):

```tsx
        className="w-full max-w-sm aspect-[3/4] bg-[color:var(--color-surface)] rounded-3xl shadow-lg border border-[color:var(--color-border)] flex flex-col items-center justify-center p-8 cursor-pointer relative transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
```

Replace with:

```tsx
        className="w-full max-w-sm aspect-[3/4] bg-[color:var(--color-surface)] rounded-3xl shadow-lg border border-[color:var(--color-border)] flex flex-col items-center justify-center p-8 cursor-pointer relative transition-all duration-300 transform hover:scale-[1.02] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)] touch-manipulation"
```

Added: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)] touch-manipulation`.

- [ ] **Step 6.3: Update all three buttons with the same polish**

For each of the three button classNames (prev, shuffle, next), append the same focus-visible + touch-manipulation utilities, and swap `transition-all` → `transition-transform`:

Find (prev button, line ~167):

```tsx
          className="w-14 h-14 inline-flex items-center justify-center rounded-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] text-[color:var(--color-ink)] shadow-sm hover:shadow-md hover:text-[color:var(--color-accent)] transition-all active:scale-95"
```

Replace with:

```tsx
          className="w-14 h-14 inline-flex items-center justify-center rounded-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] text-[color:var(--color-ink)] shadow-sm hover:shadow-md hover:text-[color:var(--color-accent)] transition-transform duration-150 ease-out active:scale-95 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]"
```

Find (shuffle button, line ~175):

```tsx
          className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-[color:var(--color-accent-soft)] text-[color:var(--color-ink)] shadow-sm hover:shadow-md transition-all active:scale-95"
```

Replace with:

```tsx
          className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-[color:var(--color-accent-soft)] text-[color:var(--color-ink)] shadow-sm hover:shadow-md transition-transform duration-150 ease-out active:scale-95 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]"
```

Find (next button, line ~184):

```tsx
          className="w-14 h-14 inline-flex items-center justify-center rounded-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] text-[color:var(--color-ink)] shadow-sm hover:shadow-md hover:text-[color:var(--color-accent)] transition-all active:scale-95"
```

Replace with:

```tsx
          className="w-14 h-14 inline-flex items-center justify-center rounded-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] text-[color:var(--color-ink)] shadow-sm hover:shadow-md hover:text-[color:var(--color-accent)] transition-transform duration-150 ease-out active:scale-95 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]"
```

- [ ] **Step 6.4: Verify focus ring renders on keyboard focus**

In `preview_eval`:

```js
(() => {
  const prev = document.querySelector('button[aria-label="Thẻ trước"]');
  prev.focus();
  const cs = getComputedStyle(prev);
  return {
    outlineStyle: cs.outlineStyle,
    boxShadow: cs.boxShadow,           // tailwind 'ring' utility implements via box-shadow
    hasRing: cs.boxShadow.includes('rgb') || cs.boxShadow.includes('oklch'),
  };
})()
```

Expected: `hasRing: true` and `outlineStyle: "none"`.

- [ ] **Step 6.5: Verify safe-area padding resolves on a browser that supports `env()`**

```js
(() => {
  const wrapper = document.querySelector('[role="button"][tabindex="0"]').closest('[class*="min-h-"]');
  const cs = getComputedStyle(wrapper);
  return {
    paddingBottom: cs.paddingBottom,
    // On a desktop browser, env(safe-area-inset-bottom) is 0, so max(0, 1rem) = 16px
  };
})()
```

Expected (on the desktop preview with no safe-area inset): `paddingBottom: "16px"`. On a real iPhone, the value would be larger (~34 px on iPhone 13+).

- [ ] **Step 6.6: Commit**

```bash
git add src/components/flashcards/Flashcards.tsx
git commit -m "style(flashcards): safe-area, touch-manipulation, focus ring

- iOS home-indicator safe-area via pb-[max(env(safe-area-inset-bottom),1rem)]
  on the outer wrapper so the last control row doesn't collide with it.
- touch-manipulation on all interactive elements removes the lingering
  300ms tap delay and suppresses double-tap-zoom on card/controls.
- transition-all -> transition-transform (narrower, cheaper) with an
  explicit duration-150 ease-out so active:scale-95 feels like a tactile
  press instead of an abrupt snap.
- focus-visible ring uses the zen accent so keyboard users see clear
  focus without disrupting mouse users.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 7: Final end-to-end verification + push

Sanity-check the whole flow, screenshot before/after, confirm desktop parity, and push.

**Files:** none modified.

- [ ] **Step 7.1: Mobile end-to-end visual check**

Resize to mobile. Navigate to `/japanese/flashcards`. Screenshot. Compare to the "before (mobile)" screenshot from Task 1 side-by-side. Confirm:

- Heading visibly smaller than before
- Buttons look bigger (the primary arrow buttons, at least)
- More breathing room between the card and the controls
- Counter no longer sits inside the card
- Counter visible as a small caption between card and controls
- Everything fits without page scroll

- [ ] **Step 7.2: Mobile interaction check**

In the browser, run through the actual interactions:

```js
(async () => {
  const next = document.querySelector('button[aria-label="Thẻ tiếp theo"]');
  const prev = document.querySelector('button[aria-label="Thẻ trước"]');
  const shuffle = document.querySelector('button[aria-label="Xáo trộn thẻ"]');
  const card = document.querySelector('[role="button"][tabindex="0"]');

  // 1) flip
  card.click(); await new Promise(r => setTimeout(r, 300));
  // 2) unflip
  card.click(); await new Promise(r => setTimeout(r, 200));
  // 3) next 3
  for (let i = 0; i < 3; i++) { next.click(); await new Promise(r => setTimeout(r, 250)); }
  // 4) prev 2
  for (let i = 0; i < 2; i++) { prev.click(); await new Promise(r => setTimeout(r, 250)); }
  // 5) shuffle
  shuffle.click(); await new Promise(r => setTimeout(r, 300));

  // capture final state
  const counter = Array.from(document.querySelectorAll('p')).find(p => /^\s*\d+\s*\/\s*\d+\s*$/.test(p.textContent));
  return { finalCounter: counter?.textContent?.trim() };
})()
```

Expected: no thrown errors; `finalCounter` reads `"1 / 39"` (shuffle resets index to 0 → 1-of-39).

- [ ] **Step 7.3: Short-viewport spot check**

Resize to a landscape-phone viewport:

```
mcp__Claude_Preview__preview_resize { width: 640, height: 400 }
```

Screenshot. Confirm the controls still fit inside the viewport without being clipped (the `[@media(max-height:640px)]` rules kick in here).

- [ ] **Step 7.4: Desktop parity check**

```
mcp__Claude_Preview__preview_resize { preset: "desktop" }
```

Screenshot. Compare to Task 1's desktop "before" screenshot. Layout must be within ~4 px — heading size, button sizes, gap between card and controls all preserved on desktop.

- [ ] **Step 7.5: Push**

```bash
git push origin main
```

Expected: five new commits (Tasks 2, 3, 4, 5, 6) pushed. GitHub Pages deploy will kick off automatically.

- [ ] **Step 7.6: Post-deploy live smoke test**

Once `gh run list --limit 1` shows the deploy as `completed success`, open `https://vinh.to/japanese/flashcards` on a real phone (or at least mobile emulation in Chrome DevTools) and do the manual interaction pass from Step 7.2 one more time. Done.

---

## Spec coverage check

| Spec section | Task | Status |
|---|---|---|
| §1 Touch-target sizing (prev 56, shuffle 48, icon 24/20) | Task 2 | covered |
| §1 Gap between buttons (20 mobile, 24 desktop) | Task 3 | covered |
| §1 Gap between card and controls (48 mobile, 40 desktop) | Task 3 + Task 4 (split) | covered |
| §2 Counter repositioning | Task 4 | covered |
| §3 Mobile header/title shrink | Task 5 | covered |
| §4 iOS safe-area padding | Task 6.1 | covered |
| §4 Short-viewport height-based variant | Task 3.1 + Task 4.2 | covered |
| §4 Touch press feel (transition-transform, duration, touch-manipulation) | Task 6.3 | covered |
| §4 Keyboard focus ring | Task 6.2 + 6.3 | covered |
| §5 Invariants (no regressions) | Task 7.2 + 7.4 | covered |
