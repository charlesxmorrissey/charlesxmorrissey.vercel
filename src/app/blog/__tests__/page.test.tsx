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

vi.mock('components', () => ({
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
  it('renders all posts with a home link', async () => {
    render(await BlogPage())

    expect(screen.getByText('Post A')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /charles x\. morrissey/i }),
    ).toHaveAttribute('href', '/')
  })
})
