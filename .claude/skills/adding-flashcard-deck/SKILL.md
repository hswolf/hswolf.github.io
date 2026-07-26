---
name: adding-flashcard-deck
description: Use when adding a new Japanese vocabulary flashcard deck to this repo, editing an existing deck's data or images, or modifying the Flashcards component / image-generation script.
---

# Adding a Flashcard Deck

## Overview

The flashcard experience lives at `/japanese/flashcards` and is powered by a React island (`src/components/flashcards/Flashcards.tsx`) hydrated on per-deck Astro pages. A "deck" is a typed TS file plus a folder of images. Current repo ships thirteen decks: `n5-lesson1-a` / `n5-lesson1-b` / `n5-lesson1-c` (42 / 38 / 24 cards, no images and no `ALL_PROMPTS` entry), `n5-lesson12-c` (39 cards, fully imaged), `n5-lesson15-1` (21 cards), `n5-lesson15-6` (25 cards), `n5-lesson16` (39 cards, no images yet), `n5-lesson17` (34 cards, no images yet), `n5-lesson18` (46 cards, no images yet), `n5-lesson19` (46 cards, no images yet), `n5-lesson20` (42 cards combining A + B, no images yet), `n5-lesson20-c` (19 cards, no images yet), `n5-lesson22` (45 cards combining A + B, no images yet). The routing is multi-deck: `/japanese/flashcards` is a deck index, `/japanese/flashcards/<slug>` mounts the island for one deck. This skill covers how to add another deck, edit an existing one, or touch the supporting machinery without breaking the mobile polish and review-mode state machinery that already landed.

## Quick reference

| What you want | Where |
|---|---|
| Deck data (cards, title, slug) | `src/data/flashcards/<deck-slug>.ts` |
| Shared types (`Deck`, `FlashCard`) | `src/data/flashcards/types.ts` |
| Deck registry (`decks` array, `getDeckBySlug`) | `src/data/flashcards/index.ts` |
| Per-card images | `public/images/flashcards/<deck-slug>/<id>.webp` |
| Image directory README + prompt table | `public/images/flashcards/<deck-slug>/README.md` |
| Deck index landing page | `src/pages/japanese/flashcards/index.astro` |
| Per-deck page wrapper (dynamic, one static page per slug via `getStaticPaths`) | `src/pages/japanese/flashcards/[deck].astro` |
| React component (kanji/hiragana/meaning/image/controls) | `src/components/flashcards/Flashcards.tsx` |
| Tailwind theme tokens (zen palette) | `src/styles/tailwind.css` |
| Image-generation script (Pollinations or HF, `DECK` env var picks the slug) | `scripts/generate-flashcard-images.mjs` |
| Env for HF provider | `.env` (copy from `.env.example`) |
| Nav entry pointing at the index | `src/components/Header.astro` (`Nhật` link → `/japanese/flashcards`) |
| Per-tab review state (memorized / not-memorized flags) | `window.sessionStorage` key `flashcards:session:<deck.slug>` |
| Specs + plans (reference) | `docs/superpowers/specs/` + `docs/superpowers/plans/` — notably `2026-04-17-flashcards-mobile-polish-design.md`, `2026-04-17-flashcards-review-mode-design.md`, and `2026-05-08-flashcards-back-image-position-design.md` |

## When to use

- Adding a new Bài / lesson / vocab set (e.g. "N5 Bài 13 - Phần A")
- Editing the current deck's cards, hiragana, or Vietnamese meanings
- Regenerating an image you don't like
- Bulk-generating images for a freshly-added deck
- Making structural changes to `Flashcards.tsx` (layout, controls, flip behavior)

**Skip this skill** when: adding blog/life/poetry content (those flow through Astro content collections, not this React island).

## Deck data shape

Types live in `src/data/flashcards/types.ts`. Each deck file imports from there:

```ts
// src/data/flashcards/types.ts
export type FlashCard = {
  id: number;          // 1-indexed, used for image filenames
  kanji: string;       // front primary — "兄弟", or "ごみ" if kana-only
  hiragana: string;    // reading — same value as kanji for kana-only entries
  vietnamese: string;  // meaning shown on the back
  image?: string;      // filename (e.g. "1.webp") relative to /public/images/flashcards/<slug>/
};

export type Deck = {
  slug: string;        // URL-safe kebab-case, matches the image folder name
  title: string;       // h1 on the page
  subtitle: string;    // sits beneath the h1
  cards: FlashCard[];
};
```

```ts
// src/data/flashcards/<deck-slug>.ts
import type { Deck } from "./types";
export const <deckVar>: Deck = { slug, title, subtitle, cards };
```

The deck must also be registered in `src/data/flashcards/index.ts`:

```ts
import { n5Lesson12C } from "./n5-lesson12-c";
import { n5Lesson15Part1 } from "./n5-lesson15-1";
// ...
export const decks: Deck[] = [n5Lesson12C, n5Lesson15Part1, /* new deck */];
```

`[deck].astro` reads `decks` in `getStaticPaths()` to materialize one static page per slug at build time, and `index.astro` reads it to render the landing list. Forgetting to register a new deck means it has data but no route.

Conventions that already bit us:

- `hiragana === kanji` → the component automatically suppresses the hiragana line (front and back) so it doesn't render the same thing twice. Keep them equal for kana-only words (`ごみ`, `パート`, `きちんと`).
- `image` is a filename, **not** a path — the component prefixes `/images/flashcards/${deck.slug}/`.
- Cards can omit `image`. The `SafeImage` wrapper hides the img if the file 404s or loads empty, so you can ship a deck before all images exist and fill in later.

## Adding a new deck (step by step)

1. **Pick a slug.** Kebab-case, lowercase, e.g. `n5-lesson13-a`. Same string will be the URL segment, image folder name, and the basis of the exported variable name.

2. **Create the data file.** `src/data/flashcards/<slug>.ts`. Import `Deck` type from `./types`. Populate `cards` with sequential `id`s from 1; pre-fill `image: "N.webp"` for every card so image drop-in works without touching the file again.

3. **Register the deck.** Add an `import { ... } from "./<slug>"` and append to the `decks` array in `src/data/flashcards/index.ts`. This is what wires the deck into both the index landing page and the dynamic `[deck].astro` route.

4. **Create the image folder.** `mkdir public/images/flashcards/<slug>` and add a `README.md` modeled on `n5-lesson12-c/README.md` — style-prefix paragraph + a per-card prompt table. The README is the human reference; the script holds its own prompt copy keyed by deck slug.

5. **Add prompts to the image-generation script** (only if you intend to gen images): in `scripts/generate-flashcard-images.mjs`, add a `"<slug>": { 1: "...", 2: "...", ... }` entry to `ALL_PROMPTS`. Keep the `STYLE` constant alone — both providers and all decks share it.

6. **Generate images.** Defaults to Pollinations (free, no key) and the `n5-lesson12-c` deck. To target a new deck, set `DECK`:
   ```bash
   DECK=n5-lesson15-1 npm run gen:images
   ```
   Or use Hugging Face if you have credits (better quality):
   ```bash
   # in .env: HF_TOKEN=hf_...
   DECK=n5-lesson15-1 npm run gen:images:hf
   ```
   Both invocations:
   - Skip cards whose `<id>.webp` already exists in the output folder (safe re-run / resume)
   - Convert PNG → WebP via `sharp`
   - Report per-card success/failure with a summary at the end

7. **Verify locally.**
   ```bash
   npm run dev    # port 4321
   ```
   Open `/japanese/flashcards` to confirm the new deck appears in the index, then click through to `/japanese/flashcards/<slug>`. Check flip, next/prev, shuffle, hiragana-suppression on kana-only cards, image render, empty-image fallback.

8. **Ship.** Commit data + images + script edits in cohesive units; push to main; the `withastro/action` workflow in `.github/workflows/deploy.yml` deploys automatically.

## Image-generation providers

Single script, two providers, chosen by `PROVIDER` env var:

| provider | needs key? | when to use |
|---|---|---|
| `pollinations` (default) | no | first pass; no setup; uses FLUX via image.pollinations.ai URL endpoint |
| `hf` | `HF_TOKEN` in `.env` | better quality when free monthly credits are available (`@huggingface/inference` SDK, model `black-forest-labs/FLUX.1-schnell`) |

Both routes use the same style prefix (`STYLE` constant near top of the script) — zen earth-tone, flat illustration, no text. Tweak the style in one place and both providers inherit.

**Regenerating a single card:** delete its `.webp` file, then re-run `npm run gen:images`. The script regenerates only missing files. Combine with editing that card's entry in `PROMPTS` if you want a different result.

**Avoid Unsplash/Pexels stock:** Unsplash API terms prohibit automated batch downloads for this use case. Pexels allows it but real photos clash with the zen illustration aesthetic. Both were tried and rejected during the original rollout.

## Component contract

The React island accepts a single prop:

```tsx
<Flashcards deck={myDeck} client:load />
```

### Card states

Every card has a `CardStatus`: `"unseen" | "memorized" | "not_memorized"`. Fresh session = all `unseen`. The **active pool** is `unseen + not_memorized` — memorized cards retire from navigation. Status is persisted per-tab in `sessionStorage` under `flashcards:session:<deck.slug>` via the local `useSessionStatuses` hook; state survives refresh, wipes on tab close, falls back to in-memory on private-mode Safari.

### Front render (per card)

- Small accent-gold dot at top-left when the current card is `not_memorized` (purely visual; the parent card's `aria-label` carries the status string for AT)
- Hiragana line (accent color, serif, `text-xl`), suppressed if `kanji === hiragana`
- Kanji (large, Cormorant Garamond, 5xl)
- "Chạm để lật" hint (muted)
- **No image.** The image lives on the back so the front is a pure recall prompt — seeing a picture before recalling the meaning defeats the spaced-repetition exercise.

### Back render (per card)

- Hiragana (accent, `text-2xl`), same suppression rule — first row, so the user reads the kana cue immediately after flipping
- Vietnamese meaning (serif, 3xl) — visual focal point of the back
- Optional image (96 px square, `SafeImage` with graceful 404 fallback) — sits *below* the meaning, so it confirms the answer without previewing it; collapses cleanly when the card has no image
- Two mark buttons side-by-side: **Chưa thuộc** (muted surface, Repeat icon — NOT `RotateCw`, which is reserved for the flip indicator) and **Đã thuộc** (accent-soft surface)
- Each mark button **must** call `e.stopPropagation()` in its `onClick` — the card wrapper has its own `onClick={handleFlip}`, so a bare click would both mark AND re-flip the card, producing an incoherent state

### Controls row

- Prev 56×56 (ChevronLeft 24) — secondary surface
- Shuffle 48×48 (Shuffle 20) — accent-soft surface
- Next 56×56 (ChevronRight 24) — secondary surface
- All three: `type="button"`, `touch-manipulation`, `focus-visible` zen-accent ring, `transition-transform duration-150 ease-out active:scale-95`
- Counter `<p>` reads **`N / pool-size`**, not `N / deck-size`. As the user marks cards memorized, `M` shrinks — that's intentional progress visibility.
- Progress caption below the counter reads `X đã thuộc · Y chưa thuộc · Z chưa xem` with an inline **Reset** (underlined, dotted) that wipes sessionStorage and returns every card to `unseen`

### Done screen

When the pool reaches zero (user marked every card memorized), the component early-returns a celebratory panel instead of rendering the card — 🎉 + "Bạn đã thuộc hết N từ!" + "Bắt đầu lại" button. Marked with `role="status" aria-live="polite"` for screen-reader announce. The Done screen's own header/progress caption reuses the same JSX structure as the main return; if you edit one, consider whether the other needs the same change.

### Mobile polish the component already handles

- Heading shrinks (`text-2xl → md:text-4xl`) on < 768 px
- Card-to-controls gap scales per viewport: 48 px mobile, 40 px desktop, 24 px when viewport height ≤ 640 px
- Safe-area bottom padding on iOS (`pb-[max(env(safe-area-inset-bottom),1rem)]`)
- Split outer padding as `pt-4 px-4 pb-[...]` so a future Tailwind class-sorter can't override the safe-area value

**Don't re-invent these.** If you find yourself wanting different spacing, edit the one place (e.g. outer wrapper or counter `<p>`) instead of duplicating.

## Common mistakes

| Mistake | Fix |
|---|---|
| Image file named `1.png` but card data says `image: "1.webp"` | Pick one extension and make both match. WebP is smaller and is the default convention. |
| Adding a new deck at `/japanese/<slug>` without updating `Header.astro` | Either add a new nav link or change the existing `Nhật` href. The active-state check uses `pathname.startsWith('/japanese')`, so sub-routes auto-highlight the nav. |
| Editing the Flashcards component and watching mobile layout break | The mobile polish (button sizing, gap, counter position) is spec'd in `docs/superpowers/specs/2026-04-17-flashcards-mobile-polish-design.md`. Read it before restructuring. |
| Moving the card image to the front, or making it the first row of the back | Both defeat the recall exercise — the eye spots the image before the user retrieves the meaning, so the brain never does the retrieval work. The image's job is *confirmation*, not preview. Front: no image at all. Back: image *below* the meaning, smaller (`w-24`). See `docs/superpowers/specs/2026-05-08-flashcards-back-image-position-design.md`. |
| Adding a new deck file but forgetting to register it in `src/data/flashcards/index.ts` | The deck has data and an image folder but no route — `getStaticPaths()` in `[deck].astro` only sees what the registry exports. Add the import + push to `decks`. |
| Generating images without setting `DECK=<slug>` | `npm run gen:images` defaults to `n5-lesson12-c`. For a new deck, prefix with `DECK=<slug>`, e.g. `DECK=n5-lesson15-1 npm run gen:images`. The script errors loudly if `DECK` doesn't match a key in `ALL_PROMPTS`. |
| Running `npm run gen:images` and seeing 429s mid-run | HF free tier runs out mid-batch. Switch to default Pollinations (`npm run gen:images`) to backfill the remaining cards. Mixed provider output is visible but close enough. |
| Forgetting `text-center` on a new caption `<p>` | Intrinsic-width centering only works for short content. Always include `text-center` on captions so future text changes don't misalign. |
| Animating everything with `transition-all` on buttons | We deliberately use `transition-transform duration-150 ease-out` to avoid animating box-shadow and keep tap feel snappy. Keep it narrow. |
| New button on the card back without `e.stopPropagation()` | The card wrapper is a `role="button"` with `onClick={handleFlip}`. Any click on a child `<button>` bubbles up and re-flips the card. Every interactive element on the back needs `e.stopPropagation()` in its handler. |
| Using `RotateCw` for anything but the flip indicator | The top-right `RotateCw` icon signals flip state. Reusing it elsewhere (e.g. as a "comes back" glyph) creates visual ambiguity. Use `Repeat` for repetition semantics and pick something clearly distinct for other concepts. |
| Indexing into the full `cards` array by `currentIndex` | There is no `currentIndex` — navigation is pool-based (`poolIndex` into `activePool`). Reading `cards[poolIndex]` after any cards are memorized will return the wrong card. Always derive `currentCard` via `activePool[safePoolIndex]`. |
| Computing "done" from `memorizedCount === cards.length` | Use the existing `!currentCard` guard (which tests `poolSize === 0`). That way stale sessionStorage entries with IDs no longer in the deck still route to the Done screen correctly. |
| Renaming a deck's `slug` without migrating sessionStorage | The session key is `flashcards:session:<deck.slug>`. Changing the slug orphans the old key — users who had progress silently start from scratch. If you must rename, prefer keeping the old slug and changing the display title/subtitle instead. |
| Changing the shape of `SessionState` without bumping `SESSION_VERSION` | `readSession` rejects payloads whose `version !== SESSION_VERSION` and returns `{}`. If you change the schema (e.g. add per-card timestamps for spaced repetition), bump the constant so existing tabs don't try to use incompatible shapes. |

## Multi-deck architecture (already in place)

Three pieces work together to make new decks "just appear" once they're registered:

1. **Registry** — `src/data/flashcards/index.ts` exports a `decks: Deck[]` array. Add an import + array entry to expose a deck.
2. **Dynamic route** — `src/pages/japanese/flashcards/[deck].astro` calls `getStaticPaths()` over the registry to emit one static page per slug at build time.
3. **Landing page** — `src/pages/japanese/flashcards/index.astro` reads the same registry and renders deck cards linking into each route.

The `Nhật` nav link lives at `/japanese/flashcards` (the index). `pathname.startsWith('/japanese')` matches it and any sub-route, so the active highlight just works.

**Session persistence handles multiple decks for free.** The `useSessionStatuses` hook keys sessionStorage by `deck.slug`, so switching decks loads each one's own memorized/not-memorized state and they never collide.

**Image-generation script** (`scripts/generate-flashcard-images.mjs`) takes a `DECK` env var (default `n5-lesson12-c`) and indexes into `ALL_PROMPTS[DECK]`. `OUT_DIR` is computed from `DECK`. Add a deck's prompts under a new key in `ALL_PROMPTS` to make it generatable.

## Red flags — stop and reconsider

- **"I'll just hotlink Unsplash URLs"** → No. Violates their API TOS for automated/batch use. We rejected this path.
- **"I'll write a custom CSS file for the new deck"** → No. Zen tokens are in `tailwind.css`; use arbitrary-value utilities (`bg-[color:var(--color-surface)]`) or extend the `@theme` block.
- **"I'll add `p-4 pb-8` to fix spacing on mobile"** → No. Prefer pairing `pt-4 px-4 pb-[...]` so automatic class sorters can't silently break safe-area handling.
- **"I don't need `type="button"` because it's not in a form today"** → Add it anyway. It's a one-attribute guard against future surprise submit behavior.
- **"I'll just change the heading size globally"** → That also changes blog/life/poetry pages. Heading scale on `/japanese/flashcards` is component-local via Tailwind utilities, not global CSS.
- **"I'll switch sessionStorage to localStorage so progress sticks forever"** → Deliberate design choice. Spec §1 chose session-scoped. If you want cross-session persistence, brainstorm it first — it changes the UX (stale flags hang around across days; need a manual reset affordance that's more prominent than the inline `Reset`). Don't flip storage layers silently.
- **"I'll compute the active pool with `useMemo`"** → `cards.filter(...)` runs on every render for a 39-card deck; the cost is ~µs. The spec explicitly keeps it unmemoized for clarity. Don't add memoization without a profile-backed reason.
