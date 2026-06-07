import { render, screen } from '@testing-library/react'

import Page from '../page'

// Mocks the local 'sanity' path alias (src/sanity/), not the npm package.
vi.mock('sanity', () => ({
  getSiteContent: vi.fn().mockResolvedValue({
    description: 'desc',
    name: 'Ada Lovelace',
    socialLinks: [],
    title: 'Engineer',
  }),
}))

vi.mock('posts', () => ({
  getPosts: vi.fn().mockResolvedValue([]),
}))

vi.mock('components', () => ({
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
})
