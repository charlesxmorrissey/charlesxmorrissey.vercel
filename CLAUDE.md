# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Commands

Package manager is **Yarn 4** (see `packageManager` in `package.json`). Node 24
(`.nvmrc`).

- `yarn dev` — Next.js dev server on http://localhost:3000
- `yarn build` — Next.js production build (statically exported to `out/` via
  `output: 'export'`)
- `yarn serve` — build then serve `out/` with `serve` (smoke-test the static
  export)
- `yarn start` — Next.js production server (rarely useful given static export)
- `yarn lint` — runs `eslint .`, then `tsc --project tsconfig.json` (`lint:ts`),
  then `stylelint '**/*.css'` (`lint:styles`). Each is also available as its own
  script.
- `yarn lint:ts:watch` — type-check in watch mode
- `yarn format` — Prettier write across `**/*.{css,html,js,md,mjs,ts,tsx}`
- `yarn test` — Vitest single run (jsdom env, globals enabled)
- `yarn test:watch` — Vitest watch
- `yarn test:coverage` — Vitest with Istanbul coverage (HTML/JSON/text
  reporters)
- Run a single test file: `yarn test src/utils/__tests__/utils.test.tsx`
- Run by test name: `yarn test -t 'partial name'`

The Husky pre-commit hook runs `yarn lint-staged`, whose config
(`.lintstagedrc.mjs`) runs `prettier --write` on staged files and then full
`yarn lint` and `yarn test:coverage`. If a hook fails, fix the underlying issue
rather than bypassing it — never use `--no-verify`.

## Architecture

Single-page personal site built as a **Next.js 16 App Router** project compiled
to a **static export**. The interesting bits:

- **Static export.** `next.config.ts` sets `output: 'export'`, so there is no
  Node server at runtime — everything ships as static HTML/CSS/JS in `out/`.
  Don't introduce Server Actions, dynamic API routes, ISR, or middleware; they
  won't work under static export.
- **React Compiler is on** (`reactCompiler: true` +
  `babel-plugin-react-compiler` + `eslint-plugin-react-compiler`). Don't add
  manual `useMemo`/`useCallback` for compiler-eligible code; let the compiler
  handle it. Lint rule `react-compiler/react-compiler` will flag patterns the
  compiler can't optimize.
- **SVG-as-component is wired twice.** Next/Turbopack uses `@svgr/webpack`
  (configured in `next.config.ts`), and Vitest uses `vite-plugin-svgr`
  (configured in `vite.config.ts`). When importing icons
  (`import Icon from 'assets/icons/foo.svg'`), keep the `ref: true` /
  `titleProp: true` SVGR conventions in mind — both pipelines must stay in sync.
- **Path aliases, not `baseUrl`.** `tsconfig.json` defines `paths` for
  `assets/*`, `components`, `constant`, `sanity`, `types`, `utils`. Always
  import as e.g. `from 'components'` or `from 'utils'`, never via deep relative
  paths into `src/`.
- **Barrel exports.** `src/components/index.ts`, `src/utils/index.ts`,
  `src/constant/index.ts`, `src/types/index.ts` are the public surfaces of each
  folder. Add new exports to the barrel (sorted alphabetically —
  `sort-export-all` enforces this).
- **Component layout convention.** Each component lives in
  `src/components/<Name>/` with `index.tsx`, `<Name>.module.css`, and a
  `__tests__/` directory next to it. Tests follow the same pattern in
  `src/app/__tests__/` and `src/utils/__tests__/`.
- **Random background colors.** `setBackgroundStyles` in `src/utils/index.ts`
  writes `--color-bg-1..6` CSS custom properties on the root element via a ref
  callback in `HomePage`. This is the entire client-side runtime behavior of the
  site.
- **Sanity CMS (build-time only).** Site content (name, title, description,
  social links) lives in a `siteSettings` singleton in Sanity. `src/sanity/`
  holds a read-only `@sanity/client` and `getSiteContent()`, which `page.tsx`
  (async Server Component) and `layout.tsx` (`generateMetadata`) await at
  **build time** — the result is baked into the static export. When the
  `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` env vars are
  absent (or the fetch fails), `getSiteContent()` falls back to
  `FALLBACK_CONTENT` in `src/constant/index.ts`, so the build always works
  offline. Icons stay in code: each link's `platform` enum
  (`github`/`linkedin`/`email`) maps to a local SVG via `SOCIAL_ICONS`.
  **Editing content requires a rebuild/redeploy** — there is no ISR/live update
  under static export. Copy `.env.example` to `.env.local` for live content.
- **Sanity Studio.** The editing UI is a standalone package in `studio/` (its
  own `package.json`, npm-managed, excluded from root eslint/tsc/prettier). Run
  `npm --prefix studio run dev` for the local Studio, or
  `npm --prefix studio run deploy` to publish to
  `https://charlesxmorrissey-site.sanity.studio/`. The Next app never imports
  from `studio/`; it only reads published content over the API.

## Conventions enforced by lint

The ESLint config (`eslint.config.ts`) is opinionated and many rules are
`error`. Notable ones to write code against from the start:

- `sort-keys`, `sort-destructure-keys`, `react/jsx-sort-props`,
  `sort-export-all` — keys, destructured names, JSX props, and barrel exports
  must be alphabetical.
- `prefer-arrow/prefer-arrow-functions` (warn) and `arrow-body-style: as-needed`
  — components and helpers are written as arrow functions with implicit returns
  where possible (see `src/app/page.tsx`).
- `padding-line-between-statements` — blank line required after a block of
  `const`/`let`/`var` declarations before any other statement.
- `no-console` allows only `warn` and `error`.
- `unused-imports/no-unused-imports` and `@typescript-eslint/no-unused-vars` are
  `error` — leftover imports/vars will fail lint.
- Prettier config (`.prettierrc.mjs`): no semicolons, single quotes,
  single-quote JSX, sorted imports via `@ianvs/prettier-plugin-sort-imports`
  (react → builtins → third-party → blank → types → blank → relative).

## Testing notes

- Vitest runs in `jsdom` with `globals: true`, so `describe`/`it`/`expect`/`vi`
  are global — no imports needed. `@testing-library/jest-dom/vitest` matchers
  and `cleanup()` after each test are wired in `vitest-setup.ts`.
- `next/font/google`'s `Inter` is mocked globally in `vitest-setup.ts` to avoid
  network/font work in tests.
- Coverage is tracked via Istanbul over `src/**/*.ts?(x)`; the pre-commit hook
  runs the coverage variant, so test failures or coverage regressions block
  commits.
