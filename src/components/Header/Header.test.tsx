import { render, screen } from '@testing-library/react'
import { APP_DATA } from 'constant'

import { Header } from './'

const { description, name } = APP_DATA
const { getByRole, getByText } = screen

describe('Header', () => {
  it('should render the header with required props', () => {
    render(<Header {...APP_DATA} />)

    expect(getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(getByRole('heading', { level: 1 })).toHaveTextContent(name)
    expect(getByText(description)).toBeInTheDocument()
  })

  it('renders exactly one level-1 heading with the correct accessible name', () => {
    render(<Header {...APP_DATA} />)

    const h1 = screen.getAllByRole('heading', { level: 1 })

    expect(h1).toHaveLength(1)
    expect(h1[0]).toHaveAccessibleName(name)
    expect(h1[0]).toBeVisible()
  })

  it('renders the description as visible text', () => {
    render(<Header {...APP_DATA} />)

    const desc = screen.getByText(description)

    expect(desc).toBeVisible()
    expect(desc.tagName.toLowerCase()).not.toBe('h1')
  })

  it('renders the description as paragraph element', () => {
    render(<Header {...APP_DATA} />)

    const desc = screen.getByText(description)

    expect(desc.tagName.toLowerCase()).toBe('p')
  })

  it('renders with proper semantic HTML structure', () => {
    const { container } = render(<Header {...APP_DATA} />)
    const header = container.querySelector('header')

    expect(header).toBeInTheDocument()
    expect(header?.querySelector('h1')).toBeInTheDocument()
    expect(header?.querySelector('p')).toBeInTheDocument()
  })

  it('header element contains all child content', () => {
    const { container } = render(<Header {...APP_DATA} />)
    const header = container.querySelector('header')
    const h1 = header?.querySelector('h1')
    const p = header?.querySelector('p')

    expect(h1?.parentElement).toBe(header)
    expect(p?.parentElement).toBe(header)
  })

  it('handles custom name and description props', () => {
    const customName = 'Test Name'
    const customDescription = 'Test Description'

    render(<Header description={customDescription} name={customName} />)

    expect(screen.getByText(customName)).toBeInTheDocument()
    expect(screen.getByText(customDescription)).toBeInTheDocument()
  })
})
