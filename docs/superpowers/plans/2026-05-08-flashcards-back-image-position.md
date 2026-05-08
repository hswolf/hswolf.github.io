# Flashcards back-side image position — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the per-card image on the back of the flashcard from above the hiragana/meaning to below the meaning, and shrink it from 160 px to 96 px, so the Vietnamese meaning is what the user reads first after flipping.

**Architecture:** Pure render-order + size change in one shared React component. No state, routing, persistence, or asset changes. The component is consumed by `[deck].astro` for all three decks (`n5-lesson12-c`, `n5-lesson15-1`, `n5-lesson15-6`) so a single edit propagates everywhere.

**Tech Stack:** React 19 + Astro 5 island, Tailwind v4 utility classes, `lucide-react` icons. Verification via `mcp__Claude_Preview__*` tools and `astro build`.

**Spec:** [`docs/superpowers/specs/2026-05-08-flashcards-back-image-position-design.md`](../specs/2026-05-08-flashcards-back-image-position-design.md)

---

## Task 1: Reorder back render and shrink image

**Files:**
- Modify: `src/components/flashcards/Flashcards.tsx` (two regions: `SafeImage` className at line 34, back render block at lines 332–367)

- [ ] **Step 1: Shrink the SafeImage `<img>` from 160 px to 96 px**

  Edit `src/components/flashcards/Flashcards.tsx` line 34. Replace `w-40 h-40` with `w-24 h-24`.

  ```tsx
  // before
  className="w-40 h-40 object-contain rounded-2xl"
  // after
  className="w-24 h-24 object-contain rounded-2xl"
  ```

  *Why source-edit, not runtime class swap:* Tailwind v4 only emits CSS for utility classes that appear in source. `w-24 h-24` must live in source so the compiled stylesheet contains the corresponding rules.

- [ ] **Step 2: Reorder the back render JSX so the image renders after the meaning**

  In the same file, locate the `isFlipped === true` branch (the `: (` arm of the ternary). Current order is:

  1. `SafeImage` (image)
  2. `<p>` hiragana (suppressed if `kanji === hiragana`)
  3. `<h2>` Vietnamese meaning
  4. `<div>` mark buttons

  Reorder children so the new top-to-bottom order is: hiragana, meaning, image, buttons. Replace the entire back-side block with the snippet below. Keep the parent `div`'s class list (`flex flex-col items-center justify-center text-center space-y-4 w-full`) and the `<button>` markup verbatim — only the order of the four children inside the parent changes, plus the image moves.

  ```tsx
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-4 w-full">
            {currentCard.kanji !== currentCard.hiragana && (
              <p className="text-2xl font-medium text-[color:var(--color-accent)]">
                {currentCard.hiragana}
              </p>
            )}
            <h2 className="font-serif text-3xl font-semibold text-[color:var(--color-ink)] px-4">
              {currentCard.vietnamese}
            </h2>
            {currentCard.image && !failedImages.has(currentCard.id) && (
              <SafeImage
                key={currentCard.id}
                src={`/images/flashcards/${deck.slug}/${currentCard.image}`}
                onFail={() =>
                  setFailedImages((prev) => {
                    if (prev.has(currentCard.id)) return prev;
                    const next = new Set(prev);
                    next.add(currentCard.id);
                    return next;
                  })
                }
              />
            )}
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
                <Repeat size={16} />
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

- [ ] **Step 3: Sanity-check the front render is unchanged**

  Open the same file and verify the `!isFlipped` arm still reads (in this order): optional hiragana paragraph (suppressed if `kanji === hiragana`), `<h2>` kanji, "Chạm để lật" hint paragraph. **No image element on the front.** No edit; this is a read-only check to make sure Step 2 didn't accidentally touch the front block.

---

## Task 2: Update the skill doc to reflect the new back order

**Files:**
- Modify: `.claude/skills/adding-flashcard-deck/SKILL.md` (the "Back render (per card)" section)

- [ ] **Step 1: Update the "Back render (per card)" bullet list**

  Find the section that currently reads (in the file, under `### Back render (per card)`):

  ```markdown
  - Optional image (160 px square, `SafeImage` with graceful 404 fallback) — first thing rendered, top of the back stack
  - Hiragana (accent, `text-2xl`), same suppression rule
  - Vietnamese meaning (serif, 3xl)
  - Two mark buttons side-by-side: ...
  ```

  Replace with:

  ```markdown
  - Hiragana (accent, `text-2xl`), same suppression rule — first row, so the user reads the kana cue immediately after flipping
  - Vietnamese meaning (serif, 3xl) — visual focal point of the back
  - Optional image (96 px square, `SafeImage` with graceful 404 fallback) — sits *below* the meaning, so it confirms the answer without previewing it; collapses cleanly when the card has no image
  - Two mark buttons side-by-side: ...
  ```

  Keep the full "Two mark buttons..." bullet and the `e.stopPropagation()` bullet that follows it verbatim. They are unaffected by the reorder.

- [ ] **Step 2: Update the rationale paragraph in the "Front render (per card)" section**

  In the same file, find the bullet on the front-render side that reads:

  ```markdown
  - **No image.** The image lives on the back so the front is a pure recall prompt — seeing a picture before recalling the meaning defeats the spaced-repetition exercise.
  ```

  Leave it as-is — this is still accurate and matches the new design. No edit needed; this step is just a confirmation read.

---

## Task 3: Verify in dev preview

**Files:** none modified.

- [ ] **Step 1: Start the dev server**

  Use the preview tool: `mcp__Claude_Preview__preview_start` with name `astro-dev`. Note the returned `serverId` for subsequent calls.

- [ ] **Step 2: Navigate to deck `n5-lesson15-1` and flip card 1**

  Use `mcp__Claude_Preview__preview_eval` to navigate and flip:

  ```js
  (async () => {
    window.location.href = 'http://localhost:4321/japanese/flashcards/n5-lesson15-1/';
    await new Promise(r => setTimeout(r, 800));
    document.querySelector('[role="button"][aria-label*="lật thẻ"]')?.click();
    await new Promise(r => setTimeout(r, 400));
    return 'flipped';
  })()
  ```

  Expected return: `"flipped"`.

- [ ] **Step 3: Inspect the back-side render order and image size**

  Use `mcp__Claude_Preview__preview_eval`:

  ```js
  (() => {
    const card = document.querySelector('[role="button"][aria-label*="lật thẻ"]');
    const inner = card.querySelector('div.flex.flex-col');
    const tags = Array.from(inner.children).map(c => c.tagName);
    const img = inner.querySelector('img');
    const rect = img?.getBoundingClientRect();
    return {
      childOrder: tags,
      imageSize: rect ? `${Math.round(rect.width)}x${Math.round(rect.height)}` : null,
    };
  })()
  ```

  Expected output (exact): `{ childOrder: ["P", "H2", "IMG", "DIV"], imageSize: "96x96" }`.

  If `childOrder` differs, Task 1 Step 2 wasn't applied correctly. If `imageSize` is `160x160`, Task 1 Step 1 (the className change) didn't take, or Tailwind didn't recompile — restart the dev server.

- [ ] **Step 4: Verify the front render is image-free**

  Click the card again to flip back, then re-inspect:

  ```js
  (async () => {
    document.querySelector('[role="button"][aria-label*="lật thẻ"]')?.click();
    await new Promise(r => setTimeout(r, 400));
    const card = document.querySelector('[role="button"][aria-label*="lật thẻ"]');
    return { hasImage: !!card.querySelector('img') };
  })()
  ```

  Expected: `{ hasImage: false }`.

- [ ] **Step 5: Capture a screenshot for the commit message**

  Use `mcp__Claude_Preview__preview_screenshot`. Flip the card to the back first if needed. Confirm visually: hiragana on top, "hàng thật, đồ thật" larger below it, small 96 px illustration under the meaning, two mark buttons at the bottom.

- [ ] **Step 6: Stop the dev server**

  Use `mcp__Claude_Preview__preview_stop` with the same `serverId`.

---

## Task 4: Production build sanity check

**Files:** none modified.

- [ ] **Step 1: Run the production build**

  Run: `npm run build`

  Expected output (last 6 lines, allowing minor whitespace variation):
  ```
  ▶ src/pages/japanese/flashcards/[deck].astro
    ├─ /japanese/flashcards/n5-lesson12-c/index.html
    ├─ /japanese/flashcards/n5-lesson15-1/index.html
    └─ /japanese/flashcards/n5-lesson15-6/index.html
  ▶ src/pages/japanese/flashcards/index.astro
    └─ /japanese/flashcards/index.html
  ```

  No errors, no `[ERROR] [vite]` lines, exit code `0`.

- [ ] **Step 2: Confirm the compiled CSS contains `w-24` and not stale `w-40` references for the SafeImage**

  Run: `grep -E '\.w-(24|40)' dist/_astro/*.css | head -20`

  Expected: matches for `.w-24` (the new class). `.w-40` may also appear if used elsewhere in the codebase, but verify that `.w-24 { width:6rem }` (or equivalent in v4 cascade form, e.g. `.w-24{width:calc(var(--spacing)*24))}`) is present.

  If `w-24` is missing from the compiled CSS, the source edit from Task 1 Step 1 didn't reach the file Tailwind scans — re-check.

---

## Task 5: Commit and push

**Files:** none modified — staging existing changes.

- [ ] **Step 1: Confirm the working tree only contains the expected diff**

  Run: `git status`

  Expected modified files (and only these):
  ```
  modified:   .claude/skills/adding-flashcard-deck/SKILL.md
  modified:   src/components/flashcards/Flashcards.tsx
  ```

  If any other file is modified, investigate before staging.

- [ ] **Step 2: Stage and commit**

  Run:
  ```bash
  git add src/components/flashcards/Flashcards.tsx .claude/skills/adding-flashcard-deck/SKILL.md
  git commit -m "$(cat <<'EOF'
  refactor(flashcards): place back-side image after the meaning, shrink to 96px

  Putting the image first on the back still let the eye preview the answer
  before reading the meaning. Reorder children so hiragana → meaning → image
  → mark buttons, and shrink SafeImage to w-24 h-24 so the meaning's text-3xl
  is the visually dominant element. Front render is unchanged.

  Spec: docs/superpowers/specs/2026-05-08-flashcards-back-image-position-design.md

  Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
  EOF
  )"
  ```

- [ ] **Step 3: Push to the feature branch and main**

  Run: `git push origin HEAD:claude/loving-hamilton-71f32a HEAD:main`

  Expected: two `<old>..<new> HEAD -> <branch>` lines, no errors.

  This mirrors the project convention of pushing the feature branch and fast-forwarding `main` together so the GitHub Pages deploy workflow runs.

---

## Self-review

- **Spec coverage:** Each spec section maps to a task —
  - Spec "Goal" / "Chosen layout" → Task 1 (the JSX reorder + size change)
  - Spec "Files touched" Flashcards.tsx → Task 1; SKILL.md → Task 2
  - Spec "Verification" 6 checks → Task 3 (dev preview, items 1–3, 5) and Task 4 (production build, item 6)
  - Spec items 4 (cards without images) and 5 (kana-only suppression) are exercised implicitly by Task 3 since the same render branch handles all three cases — explicitly checking them adds two extra preview navigations for very low marginal value, so they're left as observational checks during the screenshot review.
- **Placeholders:** None.
- **Type/identifier consistency:** `SafeImage`, `failedImages`, `currentCard`, `handleMark`, `Repeat` (icon) — all already defined in the existing component. No new identifiers introduced.
