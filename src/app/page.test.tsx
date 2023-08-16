import { render, screen } from '@testing-library/react'

import { APP_DATA } from 'constant'

import Home from './page'

const { description, name } = APP_DATA
const { getByRole, getByText } = screen

describe('Home', () => {
  it('should render the header with required props', () => {
    render(<Home />)

    expect(getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(getByRole('heading', { level: 1 })).toHaveTextContent(name)
    expect(getByText(description)).toBeInTheDocument()
  })
})
