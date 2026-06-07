# Move site content into Sanity CMS

**Date:** 2026-06-06 **Status:** Approved (pending spec review)

## Goal

Move the site's existing hardcoded content out of `src/constant/index.ts` and
manage it through Sanity Studio. Specifically: the identity fields (`name`,
`title`, `description`) and the social links currently in `APP_DATA` and
`SOCIAL_DATA`. The broader intent is to get hands-on with Sanity in a real repo
while doing something useful.

## Constraints

- The site is a **Next.js 16 App Router app compiled to a static export**
  (`output: 'export'`). There is no Node server at runtime. All Sanity content
  must be fetched at **build time** and baked into the static HTML. No Server
  Actions, dynamic API routes, ISR, or middleware.
- Existing lint/test discipline must stay green: the Husky pre-commit hook runs
  `yarn format && yarn lint && yarn test:coverage`. New code follows the
  alphabetical-sort / arrow-function / barrel-export conventions in `CLAUDE.md`.

## Key decisions

| Decision             | Choice                                                                  | Because                                                                                                                                                            | Rejected alternative                       |
| -------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| Studio location      | Sanity-hosted, separate `studio/` package, deployed via `sanity deploy` | Site is one tiny static page; embedding a Studio SPA at `/studio` bolts a heavy client-only catch-all route onto a static export for a UI only the owner sees      | Embedded `/studio` route via `next-sanity` |
| Social-link icons    | `platform` enum; icons stay in code via a `platform → Icon` map         | Icons are local SVGs in the SVGR pipeline (`currentColor` styling, type-safe components); CMS controls _which_ links and their URLs, code owns the visual identity | Upload icons as Sanity image/file assets   |
| Missing/failed fetch | Fall back to current `constant/index.ts` values                         | Dev, tests, and builds work without Sanity creds; build never hard-fails                                                                                           | Hard dependency on Sanity at build         |
| Publishing model     | Edit in Studio, then rebuild/redeploy                                   | No ISR/live updates possible under `output: 'export'`; acceptable "edit then redeploy" flow for a personal site                                                    | (none viable under static export)          |

## Architecture

```
charlesxmorrissey.vercel/
├─ src/…                  ← Next app (read-only consumer, static export)
│  └─ sanity/             ← NEW: build-time read client + query + mapper
│     ├─ client.ts
│     ├─ queries.ts
│     └─ getSiteContent.ts
└─ studio/               ← NEW: standalone Sanity Studio (own package.json)
   ├─ sanity.config.ts
   ├─ sanity.cli.ts
   └─ schemaTypes/
      ├─ index.ts
      ├─ siteSettings.ts
      └─ socialLink.ts
```

`studio/` is its own package with its own `sanity` dependencies. The Next app
never imports from `studio/`; it only reads published content over the Sanity
API at build time. This keeps `output: 'export'` untouched.

## Content model

**`siteSettings`** — singleton document (fixed id `siteSettings`, enforced via
Structure Builder so there is exactly one document and no "create new" action):

- `name` — string, required
- `title` — string, required
- `description` — text, required
- `socialLinks` — array of `socialLink`

**`socialLink`** — object:

- `platform` — string, enum `github | linkedin | email`, required
- `label` — string, required (e.g. "Github")
- `url` — string, required (full URL including `mailto:…`)

## Data flow (build-time)

1. `src/sanity/client.ts` —
   `createClient({ projectId, dataset, apiVersion, useCdn: true })` reading
   project id / dataset from env.
2. `src/sanity/queries.ts` — GROQ query for the `siteSettings` singleton.
3. `src/sanity/getSiteContent.ts` — typed async fetch returning a serializable
   `SiteContent`. Falls back to `constant/index.ts` values when env vars are
   absent or the query returns nothing.
4. `src/app/page.tsx` (Server Component) — `await getSiteContent()` at build,
   passes serializable props (`name`, `title`, `description`,
   `socialLinks: {platform,label,url}[]`) to `HomePage`.
5. `src/components/HomePage` (Client Component) — receives props, maps
   `platform → Icon` and `platform → default link options` (the mailto
   `rel`/`target`) via the map in `constant`, then renders as today. Icons are
   mapped client-side because React components are not serializable across the
   server→client boundary.

## `constant/index.ts` (repurposed)

Three roles: (a) the `platform → Icon` map; (b) per-platform default link
options; (c) the existing `APP_DATA` / `SOCIAL_DATA` values, now serving as the
build-time fallback and as test fixtures. This is the single home for the
"design" bits that stay in code.

## Types (`types/index.ts`)

- Add serializable `SocialLink` (`{ platform, label, url }`) and `SiteContent`.
- Keep `LinkData` (with `Icon`) as the rendered shape `HomePage` builds.
- `platform` is a union type `'github' | 'linkedin' | 'email'` shared by schema
  intent and the icon map.

## Environment & secrets

- `.env.local` (already gitignored) holds `NEXT_PUBLIC_SANITY_PROJECT_ID` and
  `NEXT_PUBLIC_SANITY_DATASET`.
- Add a committed `.env.example` documenting these.
- Add a short Sanity section to `CLAUDE.md` (studio commands, env vars,
  rebuild-to-publish note).

## Seeding

After the schemas exist, migrate today's `APP_DATA` + `SOCIAL_DATA` into the
`siteSettings` singleton once via a generated NDJSON file and
`sanity dataset import`, so the live content matches the current site. The
NDJSON is committed for reproducibility.

## Testing

- `HomePage.test.tsx` — pass fixture props (the component takes props now).
- `page.test.tsx` — mock `getSiteContent` to return a fixture.
- New `getSiteContent` test — covers the fallback path (no env / empty result)
  and the shape of the returned data.
- Coverage must not regress (pre-commit runs `test:coverage`).

## Out of scope

- New content types (blog, projects, "now" page).
- Embedded Studio inside the Next app.
- Live preview / visual editing / Presentation tool.
- Any runtime (non-build-time) data fetching.

## Setup prerequisites (operational, not code)

- Sanity account exists (done).
- `sanity login` and `sanity init` to create the project + dataset (run during
  implementation; login is browser-based and run by the user).
