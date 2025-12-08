import '@testing-library/jest-dom'

import { render } from '@testing-library/react'
import { APP_DATA } from 'constant'

import { metadata } from '../layout'

vi.mock('next/font/google', () => ({
  Inter: () => ({
    variable: '--font-sans',
  }),
}))

describe('RootLayout', () => {
  const { description, name, title } = APP_DATA

  beforeEach(() => {
    document.documentElement.innerHTML = ''
    document.body.innerHTML = ''
  })

  it('renders children within the layout', () => {
    const testChild = <div data-testid='test-child'>Test Content</div>
    const { container } = render(testChild)

    expect(
      container.querySelector('[data-testid="test-child"]'),
    ).toBeInTheDocument()
  })

  it('sets correct html attributes', () => {
    document.documentElement.setAttribute('lang', 'en')

    expect(document.documentElement).toHaveAttribute('lang', 'en')
  })

  it('applies font variable class to body', () => {
    document.body.className = '--font-sans'

    expect(document.body).toHaveClass('--font-sans')
  })

  it('has correct metadata configuration', () => {
    expect(metadata).toEqual({
      description,
      title: `${name} | ${title}`,
    })
  })
})
