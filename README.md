# Charles X. Morrissey

Personal site — a single-page [Next.js 16](https://nextjs.org/) app compiled to
a **static export** (`output: 'export'`), with content managed in
[Sanity](https://www.sanity.io/). Content is fetched at **build time** and baked
into static HTML; there is no server at runtime.

- **Live site:** https://charles-x.com
- **Content Studio:** https://charlesxmorrissey-site.sanity.studio/

## Requirements

- **Node 24** — run `nvm use` (version pinned in `.nvmrc`).
- **Yarn 4** — managed via Corepack (`packageManager` in `package.json`). The
  Sanity Studio in `studio/` is a separate, npm-managed package (see below).

## Getting started

```bash
nvm use        # Node 24
yarn           # install dependencies
yarn dev       # dev server on http://localhost:3000
```

### Environment

Content is read from Sanity using two **public** build-time variables:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=g1wgihy2
NEXT_PUBLIC_SANITY_DATASET=production
```

Copy `.env.example` to `.env.local` and fill these in (or run
`vercel env pull .env.local` if you have the Vercel CLI linked). **Without**
them, the site falls back to the in-repo content in `src/constant/index.ts`, so
it still builds and runs offline.

## How content works

Site content (name, title, description, social links) lives in a `siteSettings`
singleton in Sanity, **not** in code. The flow:

1. Edit content in the Studio (hosted URL above, or run it locally — see below).
2. Click **Publish** — the site only reads _published_ content.
3. **Redeploy** so the static export rebuilds with the new content. (Content
   edits do not appear until a rebuild — there is no ISR under static export.)

Icons and layout stay in code; the CMS only owns the text and links. See
`.claude/CLAUDE.md` for the full architecture.

## Running the Studio locally

The Studio is a standalone package in `studio/` (its own dependencies, deployed
independently of the site):

```bash
npm --prefix studio install      # first time only
npm --prefix studio run dev      # Studio on http://localhost:3333
npm --prefix studio run deploy   # publish to charlesxmorrissey-site.sanity.studio
```

## Scripts

| Command              | What it does                                             |
| -------------------- | -------------------------------------------------------- |
| `yarn dev`           | Next.js dev server (http://localhost:3000)               |
| `yarn build`         | Production build → static export in `out/`               |
| `yarn serve`         | Build, then serve `out/` to smoke-test the static export |
| `yarn lint`          | ESLint + `tsc` type-check + Stylelint                    |
| `yarn format`        | Prettier write                                           |
| `yarn test`          | Vitest (single run)                                      |
| `yarn test:coverage` | Vitest with coverage (run by the pre-commit hook)        |

The Husky pre-commit hook runs `yarn format && yarn lint && yarn test:coverage`.
Fix failures rather than bypassing the hook.

## Deployment

Hosted on [Vercel](https://vercel.com). The **production branch is `main`**;
pushing/merging to `main` deploys https://charles-x.com. `develop` builds
preview deployments. The `NEXT_PUBLIC_SANITY_*` variables are configured in the
Vercel project for all environments.
