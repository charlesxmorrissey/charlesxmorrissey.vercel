import { render, screen } from '@testing-library/react'
import { FALLBACK_CONTENT } from 'constant'

import { HomePage } from '../'

vi.mock('components', async (importOriginal) => ({
  ...(await importOriginal<typeof import('components')>()),
  PostList: ({ posts }: { posts: { title: string }[] }) => (
    <div>
      {posts.map((p) => (
        <span key={p.title}>{p.title}</span>
      ))}
    </div>
  ),
}))

const POSTS = [
  {
    body: 'Body',
    date: '2026-05-20',
    formattedDate: 'May 20, 2026',
    slug: 'a',
    title: 'Post A',
  },
]

describe('HomePage', () => {
  it('renders the identity name and description', async () => {
    render(await HomePage({ ...FALLBACK_CONTENT, posts: POSTS }))

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      FALLBACK_CONTENT.name,
    )
    expect(screen.getByText(FALLBACK_CONTENT.description)).toBeInTheDocument()
  })

  it('renders the social links', async () => {
    render(await HomePage({ ...FALLBACK_CONTENT, posts: POSTS }))

    expect(screen.getAllByRole('link').length).toBeGreaterThanOrEqual(
      FALLBACK_CONTENT.socialLinks.length,
    )
  })

  it('renders a Writing section with the post title and a View all link', async () => {
    render(await HomePage({ ...FALLBACK_CONTENT, posts: POSTS }))

    expect(screen.getByText('Writing')).toBeInTheDocument()
    expect(screen.getByText('Post A')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view all/i })).toHaveAttribute(
      'href',
      '/blog',
    )
  })
})
