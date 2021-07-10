import { render, screen } from 'test/test-utils'

import Header from './'

const mockHeaderProps = {
  name: 'name',
  description: 'description',
}

describe('Header', () => {
  test('should render the header with required props', () => {
    render(<Header {...mockHeaderProps} />)

    expect(screen.getByText('name')).toBeInTheDocument()
    expect(screen.getByText('description')).toBeInTheDocument()
  })
})
