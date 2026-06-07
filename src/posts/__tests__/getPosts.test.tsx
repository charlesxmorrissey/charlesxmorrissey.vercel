import { join } from 'node:path'

import { getPosts } from '../getPosts'

const FIXTURES = join(__dirname, 'fixtures')

describe('getPosts', () => {
  it('returns posts sorted by date descending', async () => {
    const posts = await getPosts(FIXTURES)

    expect(posts.map((p) => p.slug)).toEqual(['beta', 'alpha'])
  })

  it('derives slug from filename and parses frontmatter', async () => {
    const [beta] = await getPosts(FIXTURES)

    expect(beta.slug).toBe('beta')
    expect(beta.title).toBe('Beta Post')
    expect(beta.date).toBe('2026-03-22')
    expect(beta.body).toContain('Beta body')
  })

  it('formats the date deterministically (UTC, en-US)', async () => {
    const [beta] = await getPosts(FIXTURES)

    expect(beta.formattedDate).toBe('Mar 22, 2026')
  })

  it('returns an empty array when the directory has no posts', async () => {
    const posts = await getPosts(join(__dirname, 'fixtures', 'does-not-exist'))

    expect(posts).toEqual([])
  })

  it('throws when a post is missing required frontmatter', async () => {
    await expect(getPosts(join(__dirname, 'fixtures-invalid'))).rejects.toThrow(
      /missing required frontmatter/,
    )
  })

  it('includes excerpt when present and leaves it undefined otherwise', async () => {
    const posts = await getPosts(FIXTURES)
    const beta = posts.find((p) => p.slug === 'beta')
    const alpha = posts.find((p) => p.slug === 'alpha')

    expect(beta?.excerpt).toBe('second')
    expect(alpha?.excerpt).toBeUndefined()
  })
})
