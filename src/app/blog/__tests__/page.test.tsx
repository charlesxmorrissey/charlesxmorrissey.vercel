import { render, screen } from '@testing-library/react'

import BlogPage from '../page'

vi.mock('posts', () => ({
  getPosts: vi.fn().mockResolvedValue([
    {
      body: 'B',
      date: '2026-05-20',
      formattedDate: 'May 20, 2026',
      slug: 'a',
      title: 'Post A',
    },
  ]),
}))

vi.mock('sanity', () => ({
  getSiteContent: vi.fn().mockResolvedValue({
    description: 'Builder of things.',
    name: 'Charles X. Morrissey',
    socialLinks: [],
    title: 'Engineer',
  }),
}))

vi.mock('components', async (importOriginal) => ({
  ...(await importOriginal<typeof import('components')>()),
  BackgroundGradient: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  PostList: ({ posts }: { posts: { title: string }[] }) => (
    <div>
      {posts.map((p) => (
        <span key={p.title}>{p.title}</span>
      ))}
    </div>
  ),
}))

describe('BlogPage', () => {
  it('renders the full identity (name + description)', async () => {
    render(await BlogPage())

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Charles X. Morrissey',
    )
    expect(screen.getByText('Builder of things.')).toBeInTheDocument()
  })

  it('has an explicit Home back link', async () => {
    render(await BlogPage())

    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute(
      'href',
      '/',
    )
  })

  it('renders all posts', async () => {
    render(await BlogPage())

    expect(screen.getByText('Post A')).toBeInTheDocument()
  })
})
