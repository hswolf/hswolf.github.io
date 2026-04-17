---
name: adding-flashcard-deck
description: Use when adding a new Japanese vocabulary flashcard deck to this repo, editing an existing deck's data or images, or modifying the Flashcards component / image-generation script.
---

# Adding a Flashcard Deck

## Overview

The flashcard experience lives at `/japanese/flashcards` and is powered by a React island (`src/components/flashcards/Flashcards.tsx`) hydrated on an Astro page. A "deck" is a typed TS file plus a folder of images. Current repo ships one deck (`n5-lesson12-c`). This skill covers how to add another, edit an existing one, or touch the supporting machinery without breaking the mobile polish that already landed.

## Quick reference

| What you want | Where |
|---|---|
| Deck data (cards, title, slug) | `src/data/flashcards/<deck-slug>.ts` |
| Per-card images | `public/images/flashcards/<deck-slug>/<id>.webp` |
| Image directory README + prompt table | `public/images/flashcards/<deck-slug>/README.md` |
| Page wrapper | `src/pages/japanese/flashcards.astro` (single-deck today) |
| React component (kanji/hiragana/meaning/image/controls) | `src/components/flashcards/Flashcards.tsx` |
| Tailwind theme tokens (zen palette) | `src/styles/tailwind.css` |
| Image-generation script (Pollinations or HF) | `scripts/generate-flashcard-images.mjs` |
| Env for HF provider | `.env` (copy from `.env.example`) |
| Nav entry pointing at the deck | `src/components/Header.astro` (`Nhật` link) |
| Mobile polish spec + plan (reference) | `docs/superpowers/specs/` and `docs/superpowers/plans/` |

## When to use

- Adding a new Bài / lesson / vocab set (e.g. "N5 Bài 13 - Phần A")
- Editing the current deck's cards, hiragana, or Vietnamese meanings
- Regenerating an image you don't like
- Bulk-generating images for a freshly-added deck
- Making structural changes to `Flashcards.tsx` (layout, controls, flip behavior)

**Skip this skill** when: adding blog/life/poetry content (those flow through Astro content collections, not this React island).

## Deck data shape

Every deck is a typed `Deck` object exported from `src/data/flashcards/<deck-slug>.ts`:

```ts
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

export const <deckVar>: Deck = { slug, title, subtitle, cards };
```

Conventions that already bit us:

- `hiragana === kanji` → the component automatically suppresses the hiragana line (front and back) so it doesn't render the same thing twice. Keep them equal for kana-only words (`ごみ`, `パート`, `きちんと`).
- `image` is a filename, **not** a path — the component prefixes `/images/flashcards/${deck.slug}/`.
- Cards can omit `image`. The `SafeImage` wrapper hides the img if the file 404s or loads empty, so you can ship a deck before all images exist and fill in later.

## Adding a new deck (step by step)

1. **Pick a slug.** Kebab-case, lowercase, e.g. `n5-lesson13-a`. Same string will be the URL segment, image folder name, and exported variable root.

2. **Create the data file.** `src/data/flashcards/<slug>.ts`. Copy the shape from `n5-lesson12-c.ts`. Populate `cards` with sequential `id`s from 1; pre-fill `image: "N.webp"` for every card so image drop-in works without touching the file again.

3. **Create the image folder.** `mkdir public/images/flashcards/<slug>` and add a `README.md` modeled on `n5-lesson12-c/README.md` — style-prefix paragraph + a per-card prompt table. This README is where the prompt text for the script lives conceptually; the script itself has the prompt list inline.

4. **Decide routing.**
   - **Single deck (swap):** Change the import in `src/pages/japanese/flashcards.astro` to point at the new deck. The old deck becomes unlinked but its data/images stay.
   - **Multiple decks (keep both):** Refactor the page into a deck-picker index + per-deck routes (see "Extending to multiple decks" below).

5. **Update the image-generation script** if you'll generate images for this deck: open `scripts/generate-flashcard-images.mjs`, replace the `PROMPTS` object's values with the new concepts, and confirm `OUT_DIR` (near the top of the file) points at the right slug folder. The script currently hard-codes `n5-lesson12-c`; generalise it if you plan to support multiple decks permanently.

6. **Generate images.** Defaults to Pollinations (free, no key):
   ```bash
   npm run gen:images
   ```
   Or use Hugging Face if you have credits (better quality):
   ```bash
   # in .env: HF_TOKEN=hf_...
   npm run gen:images:hf
   ```
   Both scripts:
   - Skip cards whose `<id>.webp` already exists in the output folder (safe re-run / resume)
   - Convert PNG → WebP via `sharp`
   - Report per-card success/failure with a summary at the end

7. **Verify locally.**
   ```bash
   npm run dev    # port 4321
   ```
   Open `/japanese/flashcards` (or the new route). Check flip, next/prev, shuffle, hiragana-suppression on kana-only cards, image render, empty-image fallback.

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

Front render (per card):
- Optional image (160px square, `SafeImage` with graceful 404 fallback)
- Hiragana line (accent color, serif), suppressed if kanji === hiragana
- Kanji (large, Cormorant Garamond, 5xl)
- "Chạm để lật" hint (muted)

Back render:
- Hiragana (larger, accent), same suppression rule
- Vietnamese meaning (serif, 3xl)

Controls row:
- Prev 56×56 (ChevronLeft 24) — secondary surface
- Shuffle 48×48 (Shuffle 20) — accent-soft surface
- Next 56×56 (ChevronRight 24) — secondary surface
- All three: `type="button"`, `touch-manipulation`, `focus-visible` zen-accent ring, `transition-transform duration-150 ease-out active:scale-95`
- Counter `<p>` sits between card and controls, not inside the card

Mobile polish the component already handles:
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
| Shipping `n5-lesson13.ts` while the script's `PROMPTS` still target `n5-lesson12-c` | Update `scripts/generate-flashcard-images.mjs`'s `OUT_DIR` and `PROMPTS`, or generalise the script to accept a slug. |
| Running `npm run gen:images` and seeing 429s mid-run | HF free tier runs out mid-batch. Switch to default Pollinations (`npm run gen:images`) to backfill the remaining cards. Mixed provider output is visible but close enough. |
| Forgetting `text-center` on a new caption `<p>` | Intrinsic-width centering only works for short content. Always include `text-center` on captions so future text changes don't misalign. |
| Animating everything with `transition-all` on buttons | We deliberately use `transition-transform duration-150 ease-out` to avoid animating box-shadow and keep tap feel snappy. Keep it narrow. |

## Extending to multiple decks

When a second deck lands and you want both reachable:

1. Move the current `src/pages/japanese/flashcards.astro` to `src/pages/japanese/flashcards/[deck].astro` (Astro dynamic route) or to `src/pages/japanese/flashcards/<slug>.astro` (static).
2. Add a landing page at `src/pages/japanese/flashcards/index.astro` that lists decks and links to each.
3. Update `Header.astro`'s `Nhật` link to point at the new index.
4. Update the generation script to iterate over a list of deck slugs rather than a hardcoded `OUT_DIR`.
5. Consider moving `PROMPTS` out of the script into each deck's data file as a `cards[i].prompt` field.

This refactor is **not** done yet — the current shape is optimised for one deck.

## Red flags — stop and reconsider

- **"I'll just hotlink Unsplash URLs"** → No. Violates their API TOS for automated/batch use. We rejected this path.
- **"I'll write a custom CSS file for the new deck"** → No. Zen tokens are in `tailwind.css`; use arbitrary-value utilities (`bg-[color:var(--color-surface)]`) or extend the `@theme` block.
- **"I'll add `p-4 pb-8` to fix spacing on mobile"** → No. Prefer pairing `pt-4 px-4 pb-[...]` so automatic class sorters can't silently break safe-area handling.
- **"I don't need `type="button"` because it's not in a form today"** → Add it anyway. It's a one-attribute guard against future surprise submit behavior.
- **"I'll just change the heading size globally"** → That also changes blog/life/poetry pages. Heading scale on `/japanese/flashcards` is component-local via Tailwind utilities, not global CSS.
