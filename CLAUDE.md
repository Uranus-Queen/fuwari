# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fuwari is a static blog template built on **Astro 6** with **Svelte 5** islands, **Tailwind CSS 3**, and **Stylus**. It deploys to **Vercel** at `https://zhangjun.xyz`. The site language is Chinese (`zh_CN`).

## Commands

```bash
pnpm dev          # Dev server at localhost:4321
pnpm build        # Production build (astro build → pagefind → sitemap)
pnpm preview      # Preview production build
pnpm check        # Astro type/error checking
pnpm type-check   # TypeScript strict check
pnpm lint         # Biome lint with auto-fix (biome check --write ./src)
pnpm format       # Biome format (biome format --write ./src)
pnpm new-post <name>  # Scaffold a new post in src/content/posts/
```

Package manager is **pnpm** (enforced via `only-allow pnpm` in preinstall script). No test framework is configured.

## Architecture

### Rendering Pipeline

Posts (markdown in `src/content/posts/`) → Astro content collections with Zod schema (`src/content/config.ts`) → Remark/Rehype plugin chain (`astro.config.mjs`) → Static HTML. Search index built via Pagefind at build time.

### Component Strategy

- **`.astro` files** — static SSG components (layouts, cards, nav, sidebar widgets). Zero client JS.
- **`.svelte` files** — interactive islands loaded with `client:only="svelte"` (search, dark mode toggle, archive panel, display settings).

### Theming

Color system uses oklch with a single `--hue` CSS custom property (`src/styles/variables.styl`). All colors derive from this hue. Dark mode is class-based (`class` strategy in Tailwind config), persisted in localStorage and applied before render to prevent FOUC. Users can change the hue via a slider in display settings.

### Key Source Layout

| Area | Path | Purpose |
|---|---|---|
| Blog config | `src/config.ts` | Site title, theme color, navbar, profile, license settings |
| Content schema | `src/content/config.ts` | Zod frontmatter schema (title, published, tags, category, etc.) |
| Content utils | `src/utils/content-utils.ts` | `getSortedPosts()`, tag/category aggregation, prev/next links |
| Types | `src/types/config.ts` | TypeScript types for all config structures |
| i18n | `src/i18n/` | 10 languages; enum keys in `i18nKey.ts`, translations in `languages/` |
| Styles | `src/styles/` | `variables.styl` (theme vars), `main.css` (Tailwind components), `markdown.css` |
| Plugins | `src/plugins/` | Remark (reading time, excerpts) and Rehype (admonitions, GitHub cards, KaTeX) plugins |
| Layouts | `src/layouts/` | `Layout.astro` (root HTML), `MainGridLayout.astro` (navbar + sidebar + content grid) |
| Pages | `src/pages/` | File-based routing: `[...page].astro` (home, paginated), `posts/[...slug].astro`, `archive.astro`, `about.astro` |

### Path Aliases (tsconfig.json)

`@components/*`, `@assets/*`, `@constants/*`, `@utils/*`, `@i18n/*`, `@layouts/*`, `@/*` — all resolve to `src/`.

## Blog Post Frontmatter

```yaml
---
title: "Post Title"
published: 2025-01-15    # Required, Date
updated: 2025-01-20      # Optional
draft: false              # Excluded from production builds
description: ""
image: ""                 # Cover image (URL or relative path)
tags: [tag1, tag2]
category: "Category"
lang: ""                  # Override site language per-post
---
```

## Code Style

**Biome** with tabs and double quotes. `.svelte` and `.astro` files have relaxed rules (no `useConst`, `useImportType`, `noUnusedVariables` enforcement). Run `pnpm lint` before committing. CI runs `biome ci ./src --reporter=github`.

## Markdown Extensions

Posts support: admonitions (`:::note`, `:::tip`, `:::warning`, etc.), GitHub cards (`::github{repo="user/repo"}`), KaTeX math (`$...$` inline, `$$...$$` display), Expressive Code blocks with collapsible sections, and reading time auto-calculation.
