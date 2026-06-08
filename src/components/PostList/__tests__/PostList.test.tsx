import { render, screen } from '@testing-library/react'

import { PostList } from '../'

vi.mock('../mdx', () => ({
  compilePostBody: vi.fn(async (body: string) => <p>compiled: {body}</p>),
}))

const POSTS = [
  {
    body: 'alpha body',
    date: '2026-03-01',
    formattedDate: 'Mar 1, 2026',
    slug: 'alpha',
    title: 'Alpha',
  },
  {
    body: 'beta body',
    date: '2026-02-01',
    formattedDate: 'Feb 1, 2026',
    slug: 'beta',
    title: 'Beta',
  },
]

describe('PostList', () => {
  it('renders one post per item with its title and date', async () => {
    render(await PostList({ posts: POSTS }))

    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.getByText('Mar 1, 2026')).toBeInTheDocument()
    expect(screen.getByText('Feb 1, 2026')).toBeInTheDocument()
  })

  it('preserves the given post order', async () => {
    render(await PostList({ posts: POSTS }))

    const titles = screen
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.textContent)

    expect(titles).toEqual(['Alpha', 'Beta'])
  })

  it('renders the compiled body of each post', async () => {
    render(await PostList({ posts: POSTS }))

    expect(screen.getByText(/compiled: alpha body/)).toBeInTheDocument()
    expect(screen.getByText(/compiled: beta body/)).toBeInTheDocument()
  })

  it('renders nothing but the container when there are no posts', async () => {
    const { container } = render(await PostList({ posts: [] }))

    expect(container.querySelectorAll('article')).toHaveLength(0)
  })
})
