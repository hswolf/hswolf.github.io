# vinh.to - Personal Blog

## Overview

Personal blog at `vinh.to`, built with Astro, deployed to GitHub Pages via `hswolf.github.io` repo. Also hosts interactive learning tools (Japanese flashcards) as React islands on specific routes.

## Commands

```bash
npm run dev           # Dev server at localhost:4321
npm run build         # Build to dist/
npm run preview       # Preview built site
npm run gen:images    # Generate flashcard images (default: Pollinations, no key, deck=n5-lesson12-c)
npm run gen:images:hf # Generate via Hugging Face (requires HF_TOKEN in .env)
DECK=n5-lesson15-1 npm run gen:images   # Generate images for a specific deck
```

## Architecture

- **Astro 5** static site generator with MDX, sitemap, RSS integrations
- **React 19** via `@astrojs/react` — used as islands on routes that need interactivity (currently only the per-deck flashcard pages under `/japanese/flashcards/<slug>`)
- **Styling:**
  - **Pure CSS + CSS custom properties** for the content site (blog/life/poetry/about) and the flashcard index. Design tokens in `src/styles/global.css`.
  - **Tailwind v4** (via `@tailwindcss/vite`) **page-scoped** to interactive pages — imported only where needed, e.g. `src/styles/tailwind.css` is imported by `src/pages/japanese/flashcards/[deck].astro` and nothing else. Does **not** leak into content pages.
- **GitHub Pages** deployment via `.github/workflows/deploy.yml` (withastro/action)
- **Custom domain** `vinh.to` via `public/CNAME`

## Content collections

Three collections defined in `src/content.config.ts`:

| Collection | Directory | URL | Notes |
|-----------|-----------|-----|-------|
| blog | `src/content/blog/` | `/blog/[slug]` | Tech posts |
| life | `src/content/life/` | `/life/[slug]` | Daily life |
| poetry | `src/content/poetry/` | `/tho/[slug]` | Poems (no heroImage, has subtitle) |

Shared frontmatter: `title`, `description`, `pubDate`, `tags`, `lang` (vi/en), `draft`, `heroImage`, `updatedDate`

## Interactive islands

### Japanese flashcards — `/japanese/flashcards`

React island (`src/components/flashcards/Flashcards.tsx`) rendered via per-deck Astro page wrapper with `client:load`. Uses Tailwind v4 (page-scoped) and the zen palette.

Routing:
- `/japanese/flashcards` — deck index (pure Astro, no React, no Tailwind). Lists all decks from the registry and links into them.
- `/japanese/flashcards/<slug>` — individual deck (Astro wrapper + React island + Tailwind). Generated statically via `getStaticPaths()` from the registry.

Decks currently in the registry (`src/data/flashcards/index.ts`):
- `n5-lesson1-a` — N5 Bài 1 - Phần A (42 cards, no images, no prompts)
- `n5-lesson1-b` — N5 Bài 1 - Phần B (38 cards, no images, no prompts)
- `n5-lesson1-c` — N5 Bài 1 - Phần C (24 cards, no images, no prompts)
- `n5-lesson12-c` — N5 Bài 12 - Phần C (39 cards, fully imaged)
- `n5-lesson15-1` — N5 Bài 15 - Phần 1 (21 cards, fully imaged)
- `n5-lesson15-6` — N5 Bài 15 - Phần 6 (25 cards, fully imaged)
- `n5-lesson16` — N5 Bài 16 (39 cards, no images yet — prompts pre-loaded in script)
- `n5-lesson17` — N5 Bài 17 (34 cards, no images yet — prompts pre-loaded in script)
- `n5-lesson18` — N5 Bài 18 (46 cards, no images yet — prompts pre-loaded in script)
- `n5-lesson19` — N5 Bài 19 (46 cards, no images yet — prompts pre-loaded in script)
- `n5-lesson20` — N5 Bài 20 A + B (42 cards, no images yet — prompts pre-loaded in script)
- `n5-lesson20-c` — N5 Bài 20 - Phần C (19 cards, no images yet — prompts pre-loaded in script)
- `n5-lesson22` — N5 Bài 22 A + B (45 cards, no images yet — prompts pre-loaded in script)

**Adding or editing a deck:** see [`.claude/skills/adding-flashcard-deck/SKILL.md`](.claude/skills/adding-flashcard-deck/SKILL.md) — covers deck data shape, image folder conventions, the two image-generation providers (Pollinations default / Hugging Face opt-in), mobile polish invariants, and the multi-deck routing.

Key files:
- `src/components/flashcards/Flashcards.tsx` — React component. Flip, prev/next/shuffle, per-card status (`unseen` / `memorized` / `not_memorized`), `Chưa thuộc` / `Đã thuộc` mark buttons on the back, progress caption + Reset, dot indicator on front for not-memorized cards, Done screen when all cards are memorized. State persists per tab in `sessionStorage: flashcards:session:<deck.slug>` (survives refresh, wipes on tab close, falls back to in-memory on private-mode Safari). Mobile polish: safe-area padding, focus-visible ring, touch-manipulation, viewport-scaled spacing.
- `src/data/flashcards/types.ts` — shared `Deck` and `FlashCard` types.
- `src/data/flashcards/index.ts` — deck registry (`decks` array, `getDeckBySlug` helper, type re-exports).
- `src/data/flashcards/<deck-slug>.ts` — deck data (one file per deck).
- `src/pages/japanese/flashcards/index.astro` — deck index landing page.
- `src/pages/japanese/flashcards/[deck].astro` — Astro wrapper that mounts the island, one static page per slug.
- `src/styles/tailwind.css` — Tailwind v4 entry with `@theme` remapping to the zen palette (imported only by `[deck].astro`).
- `public/images/flashcards/<deck-slug>/` — per-card WebP images + a README with per-card prompt hints.
- `scripts/generate-flashcard-images.mjs` — unified batch image generation. Pick provider with `PROVIDER=pollinations` (default) or `PROVIDER=hf`; pick deck with `DECK=<slug>` (default `n5-lesson12-c`).
- `.env.example` → `.env` for `HF_TOKEN` (git-ignored)

## Design

- Minimalist zen aesthetic, **light mode only**
- Colors: bg `#F5F0EB`, text `#3D2B1F`, accent `#C4A35A` (earth tones / mệnh Thổ)
- Fonts: `Cormorant Garamond` (headings), `Inter` (body) via Google Fonts
- Max content width: `42rem`
- Fluid typography with `clamp()`

The zen tokens are duplicated in two places because the site is split between pure-CSS (content) and Tailwind (islands):
- `src/styles/global.css` — CSS custom properties used by `.astro` and `.md(x)` content
- `src/styles/tailwind.css` — `@theme` tokens that mirror the same colors/fonts for Tailwind utilities on interactive pages

Keep the two in sync when tweaking tokens.

## Key files

- `astro.config.mjs` — Site config, integrations (`@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/react`), Shiki theme, Tailwind Vite plugin
- `src/content.config.ts` — Collection schemas (Zod)
- `src/styles/global.css` — Design tokens, base styles, `.prose` styles
- `src/styles/tailwind.css` — Tailwind v4 entry + zen `@theme` (page-scoped import only)
- `src/layouts/BaseLayout.astro` — Root HTML shell (shared across content and island pages)
- `src/layouts/PostLayout.astro` — Individual post layout
- `src/components/BaseHead.astro` — SEO meta, OG tags, fonts
- `src/components/Header.astro` — Site nav (includes `Nhật` link for the flashcards)
- `src/components/flashcards/Flashcards.tsx` — React flashcard island
- `src/data/flashcards/` — deck data files
- `public/images/flashcards/` — per-deck image assets
- `scripts/generate-flashcard-images.mjs` — batch image generator (multi-provider)
- `src/pages/rss.xml.ts` — RSS feed (all collections)
- `docs/superpowers/specs/` and `docs/superpowers/plans/` — design + implementation documents for major features (e.g. mobile polish)

## Conventions

- Blog posts: Vietnamese by default (`lang: "vi"`), set `lang: "en"` for English
- Content images stored in `public/images/` (posts/, about/); flashcard images under `public/images/flashcards/<deck-slug>/`
- Tags link to `/tags/[tag]`
- Poetry pages use centered text with serif font and generous line spacing
- **Relative markdown links across posts** (`./other-post`) resolve differently on Astro dev vs GitHub Pages (trailing slash). Always use absolute paths (`/blog/<slug>/`) for cross-post links.
- Commit style: lowercase conventional prefix (`feat:`, `style:`, `fix:`, `refactor:`, `chore:`, `docs:`); include a `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>` trailer on agent-authored commits.

## Project-local skills

- [`adding-flashcard-deck`](.claude/skills/adding-flashcard-deck/SKILL.md) — add or edit Japanese vocabulary flashcard decks; covers deck data shape, image generation, and component contract.
