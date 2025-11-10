import '@testing-library/jest-dom'

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
})
