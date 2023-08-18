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
})
