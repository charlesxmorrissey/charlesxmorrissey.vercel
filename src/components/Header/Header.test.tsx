import { render, screen } from '@testing-library/react'

import Header from './'

const { getByText } = screen

const mockHeaderProps = {
  description: 'description',
  name: 'name',
}

describe('Header', () => {
  it('should render the header with required props', () => {
    render(<Header {...mockHeaderProps} />)

    expect(getByText('name')).toBeInTheDocument()
    expect(getByText('description')).toBeInTheDocument()
  })
})
