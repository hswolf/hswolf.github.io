# Flashcards back-side image position — design

**Status:** approved (brainstorm)
**Date:** 2026-05-08
**Scope:** [`src/components/flashcards/Flashcards.tsx`](../../../src/components/flashcards/Flashcards.tsx)

## Problem

In the previous iteration we moved the card image from the front to the back so it wouldn't give away the meaning before recall. That change worked, but the back's render order is still `image → hiragana → meaning → buttons`, with the image at `w-40 h-40` (160×160). On a flipped card the eye lands on the image first, which still partially "tells" the answer before the user reads the Vietnamese meaning. The image also dominates the back visually — it's the largest element on the panel, while the meaning (the actual answer the user is checking) is smaller.

## Goal

Make the Vietnamese meaning the first text the user reads after flipping the card. The image becomes a confirming visual that reinforces what the user just recalled, not a preview of the answer.

## Non-goals

- Changes to the front side of the card (front already shows hiragana + kanji + flip hint — no image, no other content).
- Image regeneration. The same per-deck images are reused; only their on-card size and position change.
- Per-deck layout customisation. The component is shared by all decks (`n5-lesson12-c`, `n5-lesson15-1`, `n5-lesson15-6`); a single change updates all of them.
- New CSS files, animations, or token additions. Reuses existing zen palette + Tailwind utilities.

## Chosen layout — variant B

Back render order, top to bottom:

```
[ hiragana   text-2xl, accent  ]   (suppressed if kanji === hiragana)
[ meaning    text-3xl, ink     ]   ← visual focal point
[ image      96 × 96            ]   (omitted if card.image is missing or fails)
[ Chưa thuộc │ Đã thuộc         ]
```

Why this order:

1. **Reading flow matches recall flow.** The user flips → reads the kana cue (hiragana) → reads the meaning to confirm what they recalled → sees the image as reinforcement. The image arrives *after* the user has already processed the answer, so it can't "tell" them.
2. **Meaning becomes the focal element.** With the image shrunk to 96×96 and pushed below the meaning, the `text-3xl` Vietnamese line is the visually dominant content — which matches its semantic role as "the answer".
3. **Buttons stay reachable.** The smaller image keeps total content height comfortably within the `aspect-[3/4]` card, including on viewports with `max-height: 640px`. No scrolling, no clipped controls.

Variants considered and rejected: variant **A** (current — image 160px at top, image dominates) and variant **C** (image at top but 96px). Both put the image before the meaning in reading order, so the "image-as-tell" issue persists. C is visually balanced but doesn't address the order-of-perception concern.

## Files touched

- `src/components/flashcards/Flashcards.tsx` — back render block only:
  - Reorder JSX children: hiragana paragraph, meaning `<h2>`, then `SafeImage`, then mark-buttons div.
  - Replace `w-40 h-40` on the `SafeImage` `<img>` with `w-24 h-24` (Tailwind v4 only compiles classes referenced in source, so the new size lives in source).
  - Keep `object-contain rounded-2xl` and the `failedImages` fallback unchanged.
  - Keep parent flex container's `space-y-4 items-center justify-center text-center w-full` unchanged.
- `.claude/skills/adding-flashcard-deck/SKILL.md` — "Back render (per card)" section: update list order so image comes after the meaning, and update the size note (160 → 96).

No other files. No deck data changes. No image asset changes. No route changes.

## Verification

Run `npm run dev`, open `/japanese/flashcards/n5-lesson15-1/`, flip card 1, then confirm in order:

1. Back stack reads top-to-bottom: ほんもの → "hàng thật, đồ thật" → 96px illustration → mark buttons.
2. Image is at 96×96 (`SafeImage`'s rendered `<img>` has `w-24 h-24`).
3. Front render is unchanged — only kanji + hiragana + "Chạm để lật".
4. Repeat on a card without an image (e.g. take a kana-only entry whose `.webp` is removed) — back collapses cleanly: hiragana → meaning → buttons. No empty image slot, no layout jump.
5. Repeat on a kana-only card (`kanji === hiragana`, e.g. ハイキング in `n5-lesson15-1`) — hiragana row is suppressed on both sides; back shows meaning → image → buttons.
6. Production `npm run build` succeeds with the same set of static routes (1 index + 3 deck pages).

## Risk and rollback

Risk is low — single component, single render branch. Rollback is the inverse JSX reorder + size restore in one file. SessionStorage layout (`flashcards:session:<deck.slug>`) is unaffected; the schema doesn't reference rendering details.

## Open questions

None.
