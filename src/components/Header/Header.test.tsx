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

  it('matches the rendered snapshot', () => {
    const { container } = render(<Header {...APP_DATA} />)

    expect(container).toMatchSnapshot()
  })
})
