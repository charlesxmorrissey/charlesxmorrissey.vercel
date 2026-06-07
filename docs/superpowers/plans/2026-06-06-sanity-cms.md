# Sanity CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the site's hardcoded identity fields and social links out of `src/constant/index.ts` and manage them through a Sanity Studio, fetched at build time and baked into the static export.

**Architecture:** A standalone Sanity Studio lives in `studio/` (its own package, deployed to `<project>.sanity.studio`). The Next app gains a build-time read layer (`src/sanity/`) that fetches a `siteSettings` singleton via `@sanity/client` and falls back to in-repo constants when Sanity is unconfigured or unreachable. `page.tsx` becomes an async Server Component that passes serializable content to the existing client `HomePage`, which maps each link's `platform` to a local SVG icon. Nothing violates `output: 'export'` because all fetching happens at build time.

**Tech Stack:** Next.js 16 (App Router, static export), React 19, TypeScript, `@sanity/client` (app read), `sanity` (Studio), Vitest, Yarn 4.

---

## File Structure

**Phase A — App read layer + refactor (offline, TDD, fallback-driven):**

- `src/types/index.ts` — _modify_: add `Platform`, `SocialLink`, `SiteContent`.
- `src/constant/index.ts` — _modify_: add `SOCIAL_ICONS`, `SOCIAL_LINK_OPTIONS`, `FALLBACK_CONTENT`; later remove old `APP_DATA`/`SOCIAL_DATA`.
- `src/sanity/client.ts` — _create_: configured `@sanity/client` + `isConfigured` flag.
- `src/sanity/queries.ts` — _create_: GROQ string for the singleton.
- `src/sanity/getSiteContent.ts` — _create_: typed build-time fetch with fallback.
- `src/sanity/index.ts` — _create_: barrel exporting `getSiteContent`.
- `src/sanity/__tests__/getSiteContent.test.tsx` — _create_: fallback + mapping tests.
- `tsconfig.json` — _modify_: add `sanity` path alias; exclude `studio`.
- `src/components/HomePage/index.tsx` — _modify_: accept `SiteContent` props, map links.
- `src/components/HomePage/__tests__/HomePage.test.tsx` — _modify_: pass props.
- `src/app/page.tsx` — _modify_: async, fetch + pass props.
- `src/app/__tests__/page.test.tsx` — _modify_: async + mock `sanity`.
- `src/app/layout.tsx` — _modify_: `metadata` → async `generateMetadata`.
- `src/app/__tests__/layout.test.tsx` — _modify_: await `generateMetadata`.

**Phase B — Studio + live data (operational):**

- `eslint.config.ts`, `.prettierignore`, `.gitignore` — _modify_: ignore `studio/`.
- `studio/` — _create_ (via `sanity init`): `sanity.config.ts`, `sanity.cli.ts`, `structure.ts`, `schemaTypes/{index,siteSettings,socialLink}.ts`, `package.json`.
- `.env.example` — _create_: documents app env vars.
- `.env.local` — _create_ (gitignored): real project id + dataset.
- `seed/siteSettings.ndjson` — _create_: seed document matching the fallback.
- `CLAUDE.md` — _modify_: add a Sanity section.

---

# Phase A — App read layer + refactor (offline)

This phase leaves the site rendering identical content via the in-repo fallback, with zero dependency on a live Sanity project. Every task ends green.

## Task 1: Add CMS content types

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1: Add the new types**

Append to `src/types/index.ts` (keep existing `AppData` and `LinkData`; keys stay alphabetical within each interface):

```ts
export type Platform = 'email' | 'github' | 'linkedin'

export interface SiteContent {
  description: string
  name: string
  socialLinks: SocialLink[]
  title: string
}

export interface SocialLink {
  label: string
  platform: Platform
  url: string
}
```

- [ ] **Step 2: Type-check**

Run: `yarn lint:ts`
Expected: PASS (no errors).

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add Sanity site-content types"
```

## Task 2: Add icon map, link options, and fallback content (additive)

**Files:**
- Modify: `src/constant/index.ts`
- Test: `src/constant/__tests__/constant.test.tsx`

Old `APP_DATA`/`SOCIAL_DATA` stay for now so nothing breaks; they are removed in Task 7.

- [ ] **Step 1: Write the failing test**

Create `src/constant/__tests__/constant.test.tsx`:

```tsx
import { FALLBACK_CONTENT, SOCIAL_ICONS, SOCIAL_LINK_OPTIONS } from '../'

describe('constant fallback + maps', () => {
  it('FALLBACK_CONTENT has identity fields and three social links', () => {
    expect(FALLBACK_CONTENT.name).toBe('Charles X. Morrissey')
    expect(FALLBACK_CONTENT.title).toBe('Senior Frontend Engineer')
    expect(FALLBACK_CONTENT.socialLinks).toHaveLength(3)
  })

  it('every fallback link platform has an icon', () => {
    FALLBACK_CONTENT.socialLinks.forEach(({ platform }) => {
      expect(SOCIAL_ICONS[platform]).toBeTypeOf('function')
    })
  })

  it('email link opens in a new tab with noreferrer', () => {
    expect(SOCIAL_LINK_OPTIONS.email).toEqual({
      rel: 'noreferrer',
      target: '_blank',
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn test src/constant/__tests__/constant.test.tsx`
Expected: FAIL — `FALLBACK_CONTENT`/`SOCIAL_ICONS`/`SOCIAL_LINK_OPTIONS` are not exported.

- [ ] **Step 3: Implement**

Replace the body of `src/constant/index.ts` with (keeps `APP_DATA`/`SOCIAL_DATA` exactly as they are today, adds the new exports — all object keys alphabetical):

```ts
import EmailIcon from 'assets/icons/email.svg'
import GithubIcon from 'assets/icons/github.svg'
import LinkedInIcon from 'assets/icons/linkedin.svg'

import type {
  AppData,
  ComponentType,
  LinkData,
  Platform,
  SiteContent,
} from 'types'

import type { ComponentPropsWithoutRef, ComponentType, SVGProps } from 'react'

export const APP_DATA: AppData = {
  description:
    "I'm passionate about building user-facing web products and overcoming technical hurdles to ensure their success.",
  name: 'Charles X. Morrissey',
  title: 'Senior Frontend Engineer',
}

export const SOCIAL_DATA: LinkData[] = [
  {
    Icon: GithubIcon,
    link: 'https://github.com/charlesxmorrissey',
    name: 'Github',
  },
  {
    Icon: LinkedInIcon,
    link: 'https://www.linkedin.com/in/charles-x-morrissey-b366976',
    name: 'LinkedIn',
  },
  {
    Icon: EmailIcon,
    link: `mailto:hi@charles-x.com?subject=${encodeURIComponent(
      'hello from website',
    )}`,
    name: 'Email',
    options: {
      rel: 'noreferrer',
      target: '_blank',
    },
  },
]

export const SOCIAL_ICONS: Record<
  Platform,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  email: EmailIcon,
  github: GithubIcon,
  linkedin: LinkedInIcon,
}

export const SOCIAL_LINK_OPTIONS: Partial<
  Record<Platform, ComponentPropsWithoutRef<'a'>>
> = {
  email: {
    rel: 'noreferrer',
    target: '_blank',
  },
}

export const FALLBACK_CONTENT: SiteContent = {
  description: APP_DATA.description,
  name: APP_DATA.name,
  socialLinks: [
    {
      label: 'Github',
      platform: 'github',
      url: 'https://github.com/charlesxmorrissey',
    },
    {
      label: 'LinkedIn',
      platform: 'linkedin',
      url: 'https://www.linkedin.com/in/charles-x-morrissey-b366976',
    },
    {
      label: 'Email',
      platform: 'email',
      url: 'mailto:hi@charles-x.com?subject=hello%20from%20website',
    },
  ],
  title: APP_DATA.title,
}
```

NOTE: remove the duplicate `ComponentType` import — import `ComponentPropsWithoutRef`, `ComponentType`, and `SVGProps` from `react` only, and `AppData`, `LinkData`, `Platform`, `SiteContent` from `types`. Final import block:

```ts
import EmailIcon from 'assets/icons/email.svg'
import GithubIcon from 'assets/icons/github.svg'
import LinkedInIcon from 'assets/icons/linkedin.svg'

import type { AppData, LinkData, Platform, SiteContent } from 'types'

import type { ComponentPropsWithoutRef, ComponentType, SVGProps } from 'react'
```

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn test src/constant/__tests__/constant.test.tsx`
Expected: PASS.

- [ ] **Step 5: Lint + commit**

```bash
yarn lint && git add src/constant/index.ts src/constant/__tests__/constant.test.tsx
git commit -m "feat: add icon map, link options, and fallback site content"
```

## Task 3: Build the Sanity read layer with fallback

**Files:**
- Create: `src/sanity/client.ts`, `src/sanity/queries.ts`, `src/sanity/getSiteContent.ts`, `src/sanity/index.ts`
- Modify: `tsconfig.json` (add `sanity` path alias)
- Test: `src/sanity/__tests__/getSiteContent.test.tsx`

- [ ] **Step 1: Install the client**

Run: `yarn add @sanity/client`
Expected: adds `@sanity/client` to dependencies.

- [ ] **Step 2: Add the `sanity` path alias**

In `tsconfig.json`, add to `compilerOptions.paths` (alphabetical — after `"constant"`):

```jsonc
"sanity": ["./src/sanity"],
```

- [ ] **Step 3: Create the client**

Create `src/sanity/client.ts`:

```ts
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export const isConfigured = Boolean(projectId)

export const client = createClient({
  apiVersion: '2024-10-01',
  dataset,
  projectId: projectId ?? 'placeholder',
  useCdn: true,
})
```

- [ ] **Step 4: Create the query**

Create `src/sanity/queries.ts`:

```ts
export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  description,
  name,
  "socialLinks": socialLinks[]{label, platform, url},
  title
}`
```

- [ ] **Step 5: Create the fetcher**

Create `src/sanity/getSiteContent.ts`:

```ts
import { FALLBACK_CONTENT } from 'constant'

import { client, isConfigured } from './client'
import { siteSettingsQuery } from './queries'

import type { SiteContent } from 'types'

export const getSiteContent = async (): Promise<SiteContent> => {
  if (!isConfigured) {
    return FALLBACK_CONTENT
  }

  try {
    const result = await client.fetch<SiteContent | null>(siteSettingsQuery)

    if (!result?.name) {
      return FALLBACK_CONTENT
    }

    return {
      description: result.description,
      name: result.name,
      socialLinks: result.socialLinks ?? [],
      title: result.title,
    }
  } catch {
    return FALLBACK_CONTENT
  }
}
```

- [ ] **Step 6: Create the barrel**

Create `src/sanity/index.ts`:

```ts
export * from './getSiteContent'
```

- [ ] **Step 7: Write the tests**

Create `src/sanity/__tests__/getSiteContent.test.tsx`:

```tsx
import { FALLBACK_CONTENT } from 'constant'

const fetchMock = vi.fn()

vi.mock('../client', () => ({
  client: { fetch: (...args: unknown[]) => fetchMock(...args) },
  isConfigured: true,
}))

import { getSiteContent } from '../getSiteContent'

describe('getSiteContent', () => {
  afterEach(() => {
    fetchMock.mockReset()
  })

  it('returns mapped content when the query resolves a document', async () => {
    fetchMock.mockResolvedValue({
      description: 'desc',
      name: 'Ada Lovelace',
      socialLinks: [{ label: 'GH', platform: 'github', url: 'https://gh' }],
      title: 'Engineer',
    })

    const content = await getSiteContent()

    expect(content.name).toBe('Ada Lovelace')
    expect(content.socialLinks).toHaveLength(1)
  })

  it('falls back when the query resolves null', async () => {
    fetchMock.mockResolvedValue(null)

    expect(await getSiteContent()).toEqual(FALLBACK_CONTENT)
  })

  it('falls back when the fetch throws', async () => {
    fetchMock.mockRejectedValue(new Error('network'))

    expect(await getSiteContent()).toEqual(FALLBACK_CONTENT)
  })
})
```

- [ ] **Step 8: Run tests**

Run: `yarn test src/sanity/__tests__/getSiteContent.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 9: Lint + commit**

```bash
yarn lint && git add package.json yarn.lock tsconfig.json src/sanity
git commit -m "feat: add build-time Sanity read layer with fallback"
```

## Task 4: Refactor HomePage to accept content props

**Files:**
- Modify: `src/components/HomePage/index.tsx`
- Test: `src/components/HomePage/__tests__/HomePage.test.tsx`

- [ ] **Step 1: Update the test to pass props**

Replace `src/components/HomePage/__tests__/HomePage.test.tsx` with:

```tsx
import { render, screen } from '@testing-library/react'
import { FALLBACK_CONTENT, SOCIAL_LINK_OPTIONS } from 'constant'
import * as utils from 'utils'

import { HomePage } from '../'

describe('HomePage', () => {
  beforeEach(() => {
    vi.spyOn(utils, 'setBackgroundStyles').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls setBackgroundStyles and renders Header and Social', () => {
    render(<HomePage {...FALLBACK_CONTENT} />)

    expect(utils.setBackgroundStyles).toHaveBeenCalledTimes(1)
    expect(utils.setBackgroundStyles).toHaveBeenCalledWith(
      expect.objectContaining({ tagName: expect.stringMatching(/main/i) }),
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      FALLBACK_CONTENT.name,
    )
    expect(screen.getAllByRole('link')).toHaveLength(
      FALLBACK_CONTENT.socialLinks.length,
    )
  })

  it('renders the description', () => {
    render(<HomePage {...FALLBACK_CONTENT} />)

    expect(screen.getByText(FALLBACK_CONTENT.description)).toBeInTheDocument()
  })

  it('renders each social link with href, label, and platform options', () => {
    render(<HomePage {...FALLBACK_CONTENT} />)

    FALLBACK_CONTENT.socialLinks.forEach(({ label, platform, url }) => {
      const link = screen.getByRole('link', { name: label })

      expect(link).toHaveAttribute('href', url)

      const options = SOCIAL_LINK_OPTIONS[platform]

      if (options?.target) {
        expect(link).toHaveAttribute('target', options.target)
      }
    })
  })

  it('renders main > article wrapper', () => {
    const { container } = render(<HomePage {...FALLBACK_CONTENT} />)

    expect(container.querySelector('main article')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn test src/components/HomePage/__tests__/HomePage.test.tsx`
Expected: FAIL — `HomePage` does not yet accept props / type error on spread.

- [ ] **Step 3: Implement the props-driven HomePage**

Replace `src/components/HomePage/index.tsx` with:

```tsx
'use client'

import { Header, Social } from 'components'
import { SOCIAL_ICONS, SOCIAL_LINK_OPTIONS } from 'constant'
import { setBackgroundStyles } from 'utils'

import type { LinkData, SiteContent } from 'types'

import styles from './HomePage.module.css'

export const HomePage = ({
  description,
  name,
  socialLinks,
  title: _title,
}: SiteContent) => {
  const backgroundRef = (element: HTMLElement | null) => {
    if (element) {
      setBackgroundStyles(element)
    }
  }

  const data: LinkData[] = socialLinks.map(({ label, platform, url }) => ({
    Icon: SOCIAL_ICONS[platform],
    link: url,
    name: label,
    options: SOCIAL_LINK_OPTIONS[platform],
  }))

  return (
    <main className={styles.wrapper} ref={backgroundRef}>
      <article className={styles.content}>
        <Header description={description} name={name} />
        <Social data={data} />
      </article>
    </main>
  )
}
```

NOTE: `title` is part of `SiteContent` but is rendered only in the page metadata (Task 6), not in the body — destructure it as `_title` to satisfy `no-unused-vars` while documenting intent. If lint still flags it, omit `title` from the destructure entirely and type the prop as `SiteContent`.

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn test src/components/HomePage/__tests__/HomePage.test.tsx`
Expected: PASS.

- [ ] **Step 5: Lint + commit**

```bash
yarn lint && git add src/components/HomePage
git commit -m "refactor: drive HomePage from content props"
```

## Task 5: Make page.tsx fetch content at build time

**Files:**
- Modify: `src/app/page.tsx`
- Test: `src/app/__tests__/page.test.tsx`

- [ ] **Step 1: Rewrite the page test (async + mocked fetch)**

Replace `src/app/__tests__/page.test.tsx` with:

```tsx
import { render, screen } from '@testing-library/react'

import Page from '../page'

const FIXTURE = {
  description: 'desc',
  name: 'Ada Lovelace',
  socialLinks: [],
  title: 'Engineer',
}

vi.mock('sanity', () => ({
  getSiteContent: vi.fn().mockResolvedValue(FIXTURE),
}))

vi.mock('../../components/HomePage', () => ({
  HomePage: ({ name }: { name: string }) => (
    <div data-testid='mock-homepage'>{name}</div>
  ),
}))

describe('Page', () => {
  it('renders HomePage with fetched content', async () => {
    render(await Page())

    expect(screen.getByTestId('mock-homepage')).toHaveTextContent(
      'Ada Lovelace',
    )
  })

  it('does not throw', async () => {
    await expect(Page()).resolves.toBeDefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn test src/app/__tests__/page.test.tsx`
Expected: FAIL — current `Page` is sync and ignores content; `sanity` mock unused.

- [ ] **Step 3: Implement the async page**

Replace `src/app/page.tsx` with:

```tsx
import { HomePage } from 'components'
import { getSiteContent } from 'sanity'

const Page = async () => {
  const content = await getSiteContent()

  return <HomePage {...content} />
}

export default Page
```

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn test src/app/__tests__/page.test.tsx`
Expected: PASS.

- [ ] **Step 5: Lint + commit**

```bash
yarn lint && git add src/app/page.tsx src/app/__tests__/page.test.tsx
git commit -m "feat: fetch site content at build time in page"
```

## Task 6: Source layout metadata from content

**Files:**
- Modify: `src/app/layout.tsx`
- Test: `src/app/__tests__/layout.test.tsx`

- [ ] **Step 1: Update the layout test**

In `src/app/__tests__/layout.test.tsx`, replace the `APP_DATA` import and the metadata tests. New top of file:

```tsx
import { FALLBACK_CONTENT } from 'constant'

import RootLayout, { generateMetadata } from '../layout'

vi.mock('sanity', () => ({
  getSiteContent: vi.fn().mockResolvedValue(FALLBACK_CONTENT),
}))
```

Replace the three `metadata` tests (lines 42–55 and 82–86 in the original) with:

```tsx
  it('builds the metadata title as "name | title"', async () => {
    const metadata = await generateMetadata()

    expect(metadata.title).toBe(
      `${FALLBACK_CONTENT.name} | ${FALLBACK_CONTENT.title}`,
    )
  })

  it('uses the content description for metadata', async () => {
    const metadata = await generateMetadata()

    expect(metadata.description).toBe(FALLBACK_CONTENT.description)
  })

  it('exports a complete metadata object', async () => {
    const metadata = await generateMetadata()

    expect(metadata).toEqual({
      description: FALLBACK_CONTENT.description,
      title: `${FALLBACK_CONTENT.name} | ${FALLBACK_CONTENT.title}`,
    })
  })
```

Keep the `RootLayout` rendering tests unchanged, but delete the `const { description, name, title } = APP_DATA` line at the top of the describe block (no longer used).

- [ ] **Step 2: Run test to verify it fails**

Run: `yarn test src/app/__tests__/layout.test.tsx`
Expected: FAIL — `generateMetadata` not exported.

- [ ] **Step 3: Implement generateMetadata**

In `src/app/layout.tsx`: remove the `import { APP_DATA } from 'constant'`, add `import { getSiteContent } from 'sanity'`, delete the `const { description, name, title } = APP_DATA` line and the static `export const metadata`, and add:

```tsx
export const generateMetadata = async (): Promise<Metadata> => {
  const { description, name, title } = await getSiteContent()

  return {
    description,
    title: `${name} | ${title}`,
  }
}
```

The final import block (sorted: react-less, third-party, blank, types, blank, relative-style `./globals.css`):

```tsx
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Inter } from 'next/font/google'
import { getSiteContent } from 'sanity'

import type { Metadata } from 'next'

import './globals.css'
```

- [ ] **Step 4: Run test to verify it passes**

Run: `yarn test src/app/__tests__/layout.test.tsx`
Expected: PASS.

- [ ] **Step 5: Lint + commit**

```bash
yarn lint && git add src/app/layout.tsx src/app/__tests__/layout.test.tsx
git commit -m "feat: build page metadata from site content"
```

## Task 7: Remove the obsolete APP_DATA / SOCIAL_DATA

**Files:**
- Modify: `src/constant/index.ts`

- [ ] **Step 1: Confirm nothing else references them**

Run: `git grep -n "APP_DATA\|SOCIAL_DATA" -- 'src/**' ':!src/constant/index.ts'`
Expected: no matches. If any appear, update them to use `FALLBACK_CONTENT` before continuing.

- [ ] **Step 2: Delete the old exports**

In `src/constant/index.ts`, remove the `APP_DATA` and `SOCIAL_DATA` exports and the now-unused `AppData` and `LinkData` type imports. `FALLBACK_CONTENT` must now inline its literals instead of referencing `APP_DATA`:

```ts
export const FALLBACK_CONTENT: SiteContent = {
  description:
    "I'm passionate about building user-facing web products and overcoming technical hurdles to ensure their success.",
  name: 'Charles X. Morrissey',
  socialLinks: [
    {
      label: 'Github',
      platform: 'github',
      url: 'https://github.com/charlesxmorrissey',
    },
    {
      label: 'LinkedIn',
      platform: 'linkedin',
      url: 'https://www.linkedin.com/in/charles-x-morrissey-b366976',
    },
    {
      label: 'Email',
      platform: 'email',
      url: 'mailto:hi@charles-x.com?subject=hello%20from%20website',
    },
  ],
  title: 'Senior Frontend Engineer',
}
```

Final import block for `src/constant/index.ts`:

```ts
import EmailIcon from 'assets/icons/email.svg'
import GithubIcon from 'assets/icons/github.svg'
import LinkedInIcon from 'assets/icons/linkedin.svg'

import type { Platform, SiteContent } from 'types'

import type { ComponentPropsWithoutRef, ComponentType, SVGProps } from 'react'
```

- [ ] **Step 3: Full verification**

Run: `yarn lint && yarn test:coverage`
Expected: PASS, no unused-var/import errors, coverage not regressed.

- [ ] **Step 4: Commit**

```bash
git add src/constant/index.ts
git commit -m "refactor: drop APP_DATA/SOCIAL_DATA in favor of content layer"
```

## Task 8: Verify the static export still builds

**Files:** none (verification only).

- [ ] **Step 1: Build**

Run: `yarn build`
Expected: build succeeds; `out/index.html` is generated and contains "Charles X. Morrissey" (fallback content, since no Sanity env is set yet).

- [ ] **Step 2: Confirm content baked in**

Run: `grep -c "Charles X. Morrissey" out/index.html`
Expected: ≥ 1.

---

# Phase B — Studio + live data (operational)

These tasks involve an external service and interactive CLI; they are command sequences with verification rather than TDD. The `sanity login` step is browser-based and run by the user.

## Task 9: Isolate `studio/` from root tooling

**Files:**
- Modify: `eslint.config.ts`, `.prettierignore`, `.gitignore`, `tsconfig.json`

- [ ] **Step 1: Ignore studio in ESLint**

In `eslint.config.ts`, add `'studio'` to the `ignores` array (alphabetical, after `'out'`).

- [ ] **Step 2: Exclude studio from root TypeScript**

In `tsconfig.json`, change `"exclude"` to:

```jsonc
"exclude": ["node_modules", "studio"],
```

- [ ] **Step 3: Ignore studio in Prettier**

Append `studio` to `.prettierignore`.

- [ ] **Step 4: Ignore studio build artifacts in git**

Append to `.gitignore`:

```
# sanity studio
/studio/node_modules
/studio/dist
.sanity
```

- [ ] **Step 5: Verify root tooling unaffected**

Run: `yarn lint`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add eslint.config.ts tsconfig.json .prettierignore .gitignore
git commit -m "chore: exclude studio dir from root tooling"
```

## Task 10: Create the Sanity project and Studio scaffold

**Files:** creates `studio/` (CLI-generated).

- [ ] **Step 1: Log in (user runs this)**

In the Claude Code prompt, the user types: `!npx sanity@latest login`
Expected: browser auth completes; CLI reports the logged-in account.

- [ ] **Step 2: Initialize the Studio in `studio/`**

Run: `npx sanity@latest init --bare --output-path studio`
Answer prompts: create a **new project** (name e.g. `charles-x`), use the **default dataset** `production` (public), TypeScript **yes**, package manager **npm**.
Expected: `studio/` created with `sanity.config.ts`, `sanity.cli.ts`, `schemaTypes/`, `package.json`, and its own `node_modules`.

- [ ] **Step 3: Capture project id + dataset**

Run: `cat studio/sanity.cli.ts`
Expected: shows `projectId` and `dataset`. Record both for the next tasks. (If the scaffold hardcodes them, that's fine for the Studio side; the app reads from env.)

- [ ] **Step 4: Verify the Studio runs**

Run: `cd studio && npm run dev` (background), open `http://localhost:3333`, confirm the Studio loads, then stop it.
Expected: default Studio UI loads.

- [ ] **Step 5: Commit the scaffold**

```bash
git add studio
git commit -m "feat: scaffold standalone Sanity Studio"
```

## Task 11: Define the content schema

**Files:**
- Create/replace: `studio/schemaTypes/siteSettings.ts`, `studio/schemaTypes/socialLink.ts`, `studio/schemaTypes/index.ts`, `studio/structure.ts`
- Modify: `studio/sanity.config.ts`

- [ ] **Step 1: socialLink object**

Create `studio/schemaTypes/socialLink.ts`:

```ts
import { defineField, defineType } from 'sanity'

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social link',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          { title: 'GitHub', value: 'github' },
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'Email', value: 'email' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL (include mailto: for email)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { subtitle: 'url', title: 'label' },
  },
})
```

- [ ] **Step 2: siteSettings singleton**

Create `studio/schemaTypes/siteSettings.ts`:

```ts
import { defineArrayMember, defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title / role',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [defineArrayMember({ type: 'socialLink' })],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site settings' }),
  },
})
```

- [ ] **Step 3: schema index**

Replace `studio/schemaTypes/index.ts`:

```ts
import { siteSettings } from './siteSettings'
import { socialLink } from './socialLink'

export const schemaTypes = [siteSettings, socialLink]
```

- [ ] **Step 4: singleton structure**

Create `studio/structure.ts`:

```ts
import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings'),
        ),
    ])
```

- [ ] **Step 5: wire structure into config**

In `studio/sanity.config.ts`, import the structure and pass it to the desk/structure tool, and ensure `schema.types` uses `schemaTypes`. Example final shape:

```ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

import { schemaTypes } from './schemaTypes'
import { structure } from './structure'

export default defineConfig({
  name: 'default',
  title: 'charles-x',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
})
```

NOTE: if the scaffold hardcoded `projectId`/`dataset` literals, keep those literals instead of env reads (Studio-side is not secret). Match whatever `sanity init` generated.

- [ ] **Step 6: Verify schema loads**

Run: `cd studio && npm run dev`, open the Studio, confirm a single "Site settings" item with no "create new" duplication, then stop.
Expected: singleton editing UI with name/title/description/socialLinks.

- [ ] **Step 7: Commit**

```bash
git add studio/schemaTypes studio/structure.ts studio/sanity.config.ts
git commit -m "feat: model siteSettings singleton and social links"
```

## Task 12: Wire app + studio environment variables

**Files:**
- Create: `.env.example`, `.env.local` (gitignored)

- [ ] **Step 1: Create the committed template**

Create `.env.example`:

```
# Sanity (read-only, build-time) — values from your Sanity project
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
```

- [ ] **Step 2: Create local env for the app**

Create `.env.local` (replace `<projectId>` with the id from Task 10 Step 3):

```
NEXT_PUBLIC_SANITY_PROJECT_ID=<projectId>
NEXT_PUBLIC_SANITY_DATASET=production
```

- [ ] **Step 3: Confirm .env.local is ignored**

Run: `git check-ignore .env.local`
Expected: prints `.env.local` (ignored).

- [ ] **Step 4: Commit the template only**

```bash
git add .env.example
git commit -m "docs: document Sanity env vars"
```

## Task 13: Seed the singleton to match the fallback

**Files:**
- Create: `seed/siteSettings.ndjson`

- [ ] **Step 1: Create the seed file**

Create `seed/siteSettings.ndjson` (single line per document):

```
{"_id":"siteSettings","_type":"siteSettings","name":"Charles X. Morrissey","title":"Senior Frontend Engineer","description":"I'm passionate about building user-facing web products and overcoming technical hurdles to ensure their success.","socialLinks":[{"_key":"gh","_type":"socialLink","platform":"github","label":"Github","url":"https://github.com/charlesxmorrissey"},{"_key":"li","_type":"socialLink","platform":"linkedin","label":"LinkedIn","url":"https://www.linkedin.com/in/charles-x-morrissey-b366976"},{"_key":"em","_type":"socialLink","platform":"email","label":"Email","url":"mailto:hi@charles-x.com?subject=hello%20from%20website"}]}
```

- [ ] **Step 2: Import into the dataset**

Run: `cd studio && npx sanity@latest dataset import ../seed/siteSettings.ndjson production --replace`
Expected: reports 1 document imported.

- [ ] **Step 3: Verify in Studio**

Open the Studio, confirm "Site settings" shows the seeded name/title/description and three links. **Publish** the document.
Expected: published singleton matches the current site.

- [ ] **Step 4: Commit the seed**

```bash
git add seed/siteSettings.ndjson
git commit -m "chore: add Sanity seed for site settings"
```

## Task 14: End-to-end verification + docs

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Build against live content**

Run: `yarn build` (with `.env.local` present)
Expected: build succeeds. Confirm content came from Sanity:
Run: `grep -c "Charles X. Morrissey" out/index.html` → ≥ 1.
Temporarily edit the Studio name (e.g. add a middle initial), publish, rebuild, and confirm the new value appears in `out/index.html`; then revert.

- [ ] **Step 2: Deploy the Studio**

Run: `cd studio && SANITY_STUDIO_PROJECT_ID=<projectId> npx sanity@latest deploy`
Choose a studio hostname (e.g. `charles-x`).
Expected: Studio live at `https://charles-x.sanity.studio`.

- [ ] **Step 3: Document it in CLAUDE.md**

Add a "Sanity CMS" subsection under Architecture covering: Studio lives in `studio/` (standalone package, `npm run dev`/`deploy`); content is fetched at **build time** via `src/sanity/getSiteContent` with a fallback to `constant/FALLBACK_CONTENT`; env vars `NEXT_PUBLIC_SANITY_PROJECT_ID`/`NEXT_PUBLIC_SANITY_DATASET` in `.env.local`; **content edits require a rebuild/redeploy** (no ISR under static export).

- [ ] **Step 4: Final verification + commit**

```bash
yarn lint && yarn test:coverage && yarn build
git add CLAUDE.md
git commit -m "docs: document Sanity CMS workflow"
```

---

## Self-Review Notes

- **Spec coverage:** Studio location (Tasks 9–11, 14), `platform`-enum icons in code (Tasks 2, 4), fallback behavior (Tasks 3, 7), rebuild-to-publish (Tasks 8, 14), content model (Task 11), data flow (Tasks 3, 5, 6), constant repurposing (Tasks 2, 7), types (Task 1), env (Task 12), seeding (Task 13), testing (Tasks 2–6) — all mapped. `layout.tsx` metadata was an in-scope `APP_DATA` consumer the spec implied; covered in Task 6.
- **Type consistency:** `SiteContent` (`description/name/socialLinks/title`) and `SocialLink` (`label/platform/url`) are used identically across types, constant, query projection, fetcher, HomePage, and seed. `Platform` union (`email/github/linkedin`) keys `SOCIAL_ICONS`/`SOCIAL_LINK_OPTIONS`.
- **Known risk:** the `sanity` path alias resolves in tests via the same mechanism as the existing `components`/`utils` aliases (tsconfig paths). If a test fails to resolve `sanity`, add `sanity` to the vitest alias config in `vite.config.ts`.
