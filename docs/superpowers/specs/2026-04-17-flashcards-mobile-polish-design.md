# Flashcards mobile polish — design

**Status:** approved (brainstorm)
**Date:** 2026-04-17
**Scope:** [`src/components/flashcards/Flashcards.tsx`](../../../src/components/flashcards/Flashcards.tsx)

## Problem

On mobile the flashcard page feels cramped. Two specific complaints from the user:

1. Prev / next / shuffle buttons are small (roughly 48 px).
2. Controls sit too close to the card's bottom edge (~16 px gap), visually overlapping the card's rounded corner.

Baseline screenshots at 375 × 812 confirm both: header + title consume ~170 px before the card starts, the card + its in-card counter consume another ~490 px, leaving the control row in the last ~150 px of the viewport with minimal breathing room.

## Goals

- Restore comfortable touch targets and visual spacing on small screens.
- Keep the desktop experience essentially unchanged — any tightening on desktop is incidental.
- Ship as a "medium" rework: in-flow layout preserved, viewport-scaled spacing, no fixed bottom toolbar, no gesture-only UX.

## Non-goals

- Gesture-driven navigation (swipe to nav, shake to shuffle) — deferred.
- Fixed / sticky bottom control bar — rejected; user preferred in-flow.
- Changing the card itself (aspect ratio, image/hiragana/kanji/hint hierarchy).
- Altering the global site header or `BaseLayout.astro`.
- Any change to the deck data, keyboard shortcuts, flip/shuffle semantics, wrap-around behavior.

## Design

### 1. Touch-target sizing

Primary nav bigger than secondary action so visual hierarchy matches behavior. Sizes picked from Apple HIG (44 pt), Material (48 dp), WCAG 2.2 AAA (44 CSS px), and usability research (Hoober / Baymard) converging on ~48–56 px for comfortable thumb use.

| element | mobile | desktop (≥ `md`) |
|---|---|---|
| prev / next button | 56 px square (`w-14 h-14`), 24 px icon | 56 px (same) |
| shuffle button | 48 px (`w-12 h-12`), 20 px icon | 48 px (same) |
| gap between buttons | 20 px (`gap-5`) | 24 px (`md:gap-6`) |
| gap between card and controls | 48 px (`mt-12`) | 40 px (`md:mt-10`) |

Reference sizes above are CSS px; all buttons remain `rounded-full`. Icons (`ChevronLeft`, `ChevronRight`, `Shuffle`) already come from `lucide-react`; just adjust the `size` prop.

### 2. Counter repositioning

Move `{currentIndex + 1} / {cards.length}` out of the card and render it as a caption between the card and the controls.

```
[  image + hiragana + kanji + "Chạm để lật"  ]
                    1 / 39                        ← new
          [ ← ]    [ shuffle ]    [ → ]
```

- Type: `text-xs font-medium text-[color:var(--color-ink-muted)]`, centered
- Vertical rhythm on mobile: card → 16 px → counter → 32 px → controls (totals the 48 px slot designated in §1, split)
- On desktop: card → 12 px → counter → 28 px → controls (totals 40 px, matching `md:mt-10`)

Reason: reclaims ~32 px inside the card for the image / word, and puts the number in the natural eye-transition zone between "studied" and "act next".

### 3. Mobile header / title shrink

Applied only at mobile widths (`< md`, i.e. `< 768 px`):

| element | current | mobile |
|---|---|---|
| h1 ("Flashcard Sơ Cấp N5") | `text-4xl font-semibold` | `text-2xl md:text-4xl` |
| h1 margin-bottom | `mb-2` | `mb-1 md:mb-2` |
| subtitle ("Từ vựng Bài 12 - Phần C") | base size | `text-sm md:text-base` |
| container top padding | `mb-8` current (below title) | `mb-6 md:mb-8` |

Net ~60–80 px reclaimed on mobile; desktop intact.

Site-wide `Header.astro` (nav) is untouched.

### 4. Edge cases

- **iOS safe-area.** Apply `pb-[max(env(safe-area-inset-bottom),1rem)]` to the outermost `<div>` in `Flashcards.tsx` so the last control row doesn't clash with the home indicator.
- **Short viewports.** For `@media (max-height: 640px)` (iPhone SE landscape, foldable cover screens), tighten vertical spacing: `mt-12` → `mt-6`, counter margins halved. Tailwind v4 supports arbitrary-property variants: `[@media(max-height:640px)]:mt-6` on the controls row, and the same variant on the counter.
- **Touch press feel.** Replace `transition-all` on buttons with `transition-transform duration-150 ease-out active:scale-95 touch-manipulation`. Removes the iOS 300 ms tap delay and gives a tactile press.
- **Keyboard focus.** Add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg)]` to every interactive element (card + 3 buttons). Zen-accent focus, non-breaking.

### 5. Invariants (stays the same)

- Tap card to flip, same 150 ms reset before next/prev/shuffle mutate index.
- Card aspect ratio (`aspect-[3/4]`), max width (`max-w-sm`), surface color, border, shadow, rounded-3xl.
- Front shows hiragana + kanji + "Chạm để lật" hint (hiragana suppressed when it equals kanji).
- Back shows hiragana + Vietnamese meaning (hiragana suppressed when it equals kanji).
- Deck data (`src/data/flashcards/n5-lesson12-c.ts`) and per-card images — no changes.
- Desktop visual result is within ~4 px of today's layout.

## Test plan

Manual verification after implementation:

1. **Mobile baseline (375 × 812).** Screenshot before/after in `preview_resize` mobile preset. Card, counter, and controls all visible without scroll.
2. **Touch target measurements.** `getBoundingClientRect()` on each button confirms ≥ 48 px (primary ≥ 56 px). Gap to card ≥ 40 px.
3. **Short viewport (568 × 320 landscape).** All controls still reachable; no overlap.
4. **iOS safe-area.** Inspect with emulated iPhone 14 Pro; controls sit above the home indicator zone.
5. **Keyboard navigation.** Tab through: focus ring visible and zen-colored on card + all 3 buttons. Space / Enter still flips the card.
6. **Functional regression.** On real mobile (Safari iOS via Network URL), run through 5 cards with tap / flip / shuffle / wrap-around.
7. **Desktop (≥ 1024 px).** Side-by-side screenshot vs. `main` to confirm the desktop layout is visually unchanged.

## Files touched

- `src/components/flashcards/Flashcards.tsx` — all changes live here.

## Files **not** touched

- `src/layouts/BaseLayout.astro`
- `src/components/Header.astro`
- `src/styles/tailwind.css` (tokens already sufficient)
- `src/styles/global.css`
- `src/data/flashcards/n5-lesson12-c.ts`
- `src/pages/japanese/flashcards.astro`
