# vinh.to - Personal Blog

## Overview

Personal blog at `vinh.to`, built with Astro, deployed to GitHub Pages via `hswolf.github.io` repo.

## Commands

```bash
npm run dev      # Dev server at localhost:4321
npm run build    # Build to dist/
npm run preview  # Preview built site
```

## Architecture

- **Astro 5** static site generator with MDX, sitemap, RSS integrations
- **Pure CSS** - no framework, CSS custom properties in `src/styles/global.css`
- **GitHub Pages** deployment via `.github/workflows/deploy.yml` (withastro/action)
- **Custom domain** `vinh.to` via `public/CNAME`

## Content

Three collections defined in `src/content.config.ts`:

| Collection | Directory | URL | Notes |
|-----------|-----------|-----|-------|
| blog | `src/content/blog/` | `/blog/[slug]` | Tech posts |
| life | `src/content/life/` | `/life/[slug]` | Daily life |
| poetry | `src/content/poetry/` | `/tho/[slug]` | Poems (no heroImage, has subtitle) |

Shared frontmatter: `title`, `description`, `pubDate`, `tags`, `lang` (vi/en), `draft`, `heroImage`, `updatedDate`

## Design

- Minimalist zen aesthetic, **light mode only**
- Colors: bg `#F5F0EB`, text `#3D2B1F`, accent `#C4A35A` (earth tones / mệnh Thổ)
- Fonts: `Cormorant Garamond` (headings), `Inter` (body) via Google Fonts
- Max content width: `42rem`
- Fluid typography with `clamp()`

## Key Files

- `astro.config.mjs` - Site config, integrations, Shiki theme
- `src/content.config.ts` - Collection schemas (Zod)
- `src/styles/global.css` - Design tokens, base styles, `.prose` styles
- `src/layouts/BaseLayout.astro` - Root HTML shell
- `src/layouts/PostLayout.astro` - Individual post layout
- `src/components/BaseHead.astro` - SEO meta, OG tags, fonts
- `src/pages/rss.xml.ts` - RSS feed (all collections)

## Conventions

- Blog posts: Vietnamese by default (`lang: "vi"`), set `lang: "en"` for English
- Images stored in `public/images/` (posts/, about/)
- Tags link to `/tags/[tag]`
- Poetry pages use centered text with serif font and generous line spacing
