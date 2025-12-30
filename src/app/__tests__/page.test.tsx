import { render, screen } from '@testing-library/react'

import Page from '../page'

vi.mock('components/HomePage', () => ({
  HomePage: () => <div data-testid='mock-homepage'>Mocked HomePage</div>,
}))

describe('Page', () => {
  it('renders the HomePage component', () => {
    render(<Page />)

    expect(screen.getByTestId('mock-homepage')).toBeInTheDocument()
  })

  it('renders without errors', () => {
    expect(() => render(<Page />)).not.toThrow()
  })

  it('renders HomePage with mocked content', () => {
    render(<Page />)

    expect(screen.getByText('Mocked HomePage')).toBeInTheDocument()
  })

  it('HomePage component is rendered within container', () => {
    const { container } = render(<Page />)

    const homePage = container.querySelector('[data-testid="mock-homepage"]')

    expect(homePage).toBeInTheDocument()
  })

  it('returns a valid React component', () => {
    const page = Page()

    expect(page).toBeDefined()
    expect(page?.type).toBeDefined()
  })

  it('Page component is functional', () => {
    const { container } = render(<Page />)

    expect(container).toBeInTheDocument()
    expect(container.children.length).toBeGreaterThan(0)
  })
})
