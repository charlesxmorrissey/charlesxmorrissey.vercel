# Blog — design

**Date:** 2026-06-07 **Status:** Approved (pending spec review) **Branch:**
`feature/blog`

## Goal

Add a small developer blog to the personal site that showcases the author's
**AKT** repo and (later) **CSS** posts. The homepage gains a left-aligned
"Writing" feed of the **3 most recent** posts; a dedicated `/blog` page lists
all of them. Clicking a post expands it **inline** with a smooth animation (no
separate per-post route). The whole thing must stay visually true to the
existing site and remain a **static export**.

## Guiding principle

**Stay close to the look and feel of the original site.** The identity block is
the existing `Header`/`Social` components, **unchanged** — `Header` renders the
**name** (h1) and the **description** paragraph ("I'm passionate about building
user-facing web products…"), and `Social` renders the real icons. (The `title`,
"Senior Frontend Engineer", is not rendered on the page — it only feeds the
browser `<title>` via `generateMetadata`, also unchanged.) Same theme colors
(black text in light mode, white in dark), same `mix-blend-mode: overlay`
treatment. The signature animated gradient background and `fade-in` are
preserved. The blog is an additive layer in the same visual language, not a
redesign.

## Constraints

- **Next.js 16 App Router, static export (`output: 'export'`)** — no runtime
  server. All MDX is read and compiled at **build time** and baked into static
  HTML. No Server Actions / dynamic routes / ISR.
- Existing conventions hold: Yarn 4, CSS Modules, path aliases, alphabetical
  sort rules, no semicolons, arrow functions, barrel exports. Pre-commit hook
  (`lint-staged` + `yarn lint` + `yarn test:coverage`) must pass.
- React Compiler is on — no manual `useMemo`/`useCallback`.

## Key decisions

| Decision                     | Choice                                                              | Because                                                                                                                                                                          | Rejected                                                                                           |
| ---------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Content source               | **MDX files in repo** (`content/posts/*.mdx`)                       | Code-heavy posts; native fenced code blocks + build-time highlighting; version-controlled; publish via `git push` (already deploys). Fewer steps than a CMS under static export. | Sanity `post` type (Portable Text + custom code block is clunkier for code; author is a developer) |
| Reveal interaction           | **Accordion, expand-in-place**                                      | The "smooth transition / SPA feel" the user wanted; pure-CSS grid-row animation; keeps context; perfect for static export                                                        | Per-post routes; "takeover" View-Transitions detail page (more JS; user explored and rejected)     |
| Homepage layout              | **Fully left-aligned** (identity top-left, feed below)              | User's explicit choice; "content left-aligned"                                                                                                                                   | Centered hero + left feed                                                                          |
| Code legibility              | **Frosted translucent panel** (`backdrop-filter` blur, semi-opaque) | Keeps code readable over the gradient while staying translucent/in-aesthetic                                                                                                     | `mix-blend` on code (unreadable); solid opaque card (breaks the feel)                              |
| Accent (hover/links/chevron) | **Derived from the animated gradient** (`--color-bg-*`)             | Ties the blog into the site's signature animation; no foreign color                                                                                                              | A new standalone accent color                                                                      |
| "View all"                   | **Navigate to `/blog`** (client-side, smooth)                       | Keeps homepage light (3 posts), gives a shareable URL, real home for older posts                                                                                                 | Expand all inline on the homepage                                                                  |
| Launch content               | **System + one real AKT post**                                      | Feature is visibly working; AKT showcased from day one                                                                                                                           | Empty system; system + throwaway sample                                                            |
| AKT post                     | **Written post + link to the repo**                                 | Simplest, fully static                                                                                                                                                           | Live GitHub data at build (more moving parts)                                                      |

## Content model

`content/posts/<slug>.mdx`, one file per post:

```mdx
---
title: Introducing AKT — an agent knowledge toolkit
date: 2026-06-01
excerpt: A memory layer for coding agents. # optional, for future use
---

Markdown/MDX body. Fenced code blocks get build-time syntax highlighting:

​`css .post-body { display: grid; grid-template-rows: 0fr; } ​`
```

- **Slug** = filename (e.g. `introducing-akt.mdx` → `introducing-akt`).
- **Ordering** = `date` descending (most recent first).
- Frontmatter is parsed at build; `title`/`date` required, `excerpt` optional.

## Architecture

```
content/posts/*.mdx                  ← the posts (author-written)
src/utils/posts.ts                   ← build-time loader: read dir, parse
                                       frontmatter, sort by date, return
                                       { slug, title, date, excerpt }[] + raw body
src/components/PostList/             ← Server Component: maps posts → PostItem
src/components/PostItem/             ← Client Component: accordion item
                                       (toggle, aria-expanded, hash open);
                                       receives compiled MDX as children
src/components/PostList/mdx.tsx      ← compiles an MDX string → React node at
                                       build (next-mdx-remote/rsc + rehype-pretty-code)
src/app/page.tsx                     ← identity (Sanity) + latest-3 feed + View all
src/app/blog/page.tsx                ← full archive (all posts)
```

### Data flow (build time)

1. `getPosts()` (in `src/utils/posts.ts`) reads `content/posts/*.mdx` with `fs`,
   parses frontmatter (`gray-matter`), returns metadata sorted by date plus each
   post's raw MDX body. Runs only at build (Node), compatible with static
   export.
2. `page.tsx` (async Server Component) calls `getSiteContent()` (Sanity, for
   identity — unchanged) **and** `getPosts()`; passes identity + the latest 3
   posts to the homepage.
3. `PostList` renders each post; for each, the MDX body is compiled to a React
   node via `next-mdx-remote/rsc` `compileMDX` with `rehype-pretty-code` (Shiki)
   for highlighting — all at build time.
4. Each `PostItem` (client) renders the header (title · date · chevron) and a
   collapsible body containing the compiled MDX (passed as `children`). Toggle
   is local state; pure-CSS grid-row animation does the motion.

### Rendering & static export

- MDX compiled at build via `next-mdx-remote/rsc` → React nodes embedded in the
  page (collapsed). No client-side fetching.
- Syntax highlighting: `rehype-pretty-code` + `shiki`, applied at build → plain
  highlighted markup in the static HTML (no runtime highlighter).
- Both `/` and `/blog` are fully prerendered static routes.

## Interaction & styling

- **Accordion:** clicking a post toggles `.open`. Body animates via
  `grid-template-rows: 0fr → 1fr` + opacity (the `cubic-bezier(0.4, 0, 0.2, 1)`
  timing from the existing tokens); chevron rotates 90°.
- **Accent:** an `--accent` custom property derived from the gradient palette
  (`--color-bg-*`, set client-side by `setBackgroundStyles`) drives title hover,
  links, and the chevron, tying the blog into the animation. The exact
  derivation (e.g. a more saturated/opaque variant) is an implementation detail.
- **Identity:** untouched — existing `Header` + `Social`, `mix-blend` treatment,
  theme colors, real icons. The page `.wrapper` shifts from centered to
  top/left-aligned and becomes scrollable; `background-attachment: fixed` keeps
  the gradient steady while scrolling. `fade-in` preserved.
- **Code panel:** expanded post bodies (and code blocks especially) sit on a
  frosted translucent panel (`backdrop-filter: blur`, semi-opaque dark) — not
  `mix-blend` — so code is legible while the gradient still glows through.
- **Deep links:** visiting `/#<slug>` (or `/blog#<slug>`) opens that post on
  load and scrolls to it.
- **Accessibility:** post header is a real `button` with `aria-expanded`,
  focus-visible styles, keyboard toggle.

## `/blog` archive

- Static `/blog` page (`src/app/blog/page.tsx`) listing **all** posts in the
  same accordion. Light header: the author's name links back home.
- Reached from the homepage "View all →" via Next `<Link>` — client-side, smooth
  (no full reload). Optional View Transitions cross-fade as a progressive
  enhancement.

## Launch content

- The blog system, plus **one real post**: `content/posts/introducing-akt.mdx` —
  a written post about AKT (what it does, the recall/capture loop) with a
  prominent link to the GitHub repo. Drafted from known context; author edits.

## Testing

- `src/utils/posts.ts`: frontmatter parse, date-descending sort, slug from
  filename, latest-N slicing, empty-dir handling.
- `PostItem`: expand/collapse toggle flips `aria-expanded`; renders title/date;
  opens when the URL hash matches its slug.
- `PostList`: renders one item per post in order.
- Coverage stays green for the pre-commit hook.

## Dependencies to add

`next-mdx-remote` (RSC `compileMDX`), `rehype-pretty-code`, `shiki`,
`gray-matter`. (All build-time; none ship a runtime server.)

## Out of scope

Tags/categories, search, RSS, pagination, comments, per-post routes, live GitHub
data, authored CSS posts (author adds later).
