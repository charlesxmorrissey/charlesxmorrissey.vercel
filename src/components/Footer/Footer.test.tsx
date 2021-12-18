import { render, screen } from 'utils/test-utils'

import Footer from './'

const mockFooterData = [
  {
    link: 'mailto:hi@charles-x.com?subject=hello%20from%20website',
    name: 'Email',
  },
]

describe('Footer', () => {
  beforeEach(() => {
    render(<Footer />)
  })

  it('should render link with the correct href', () => {
    expect(screen.getByText(mockFooterData[0].name)).toBeInTheDocument()
    expect(
      screen.getByText(mockFooterData[0].name).closest('a')
    ).toHaveAttribute('href', mockFooterData[0].link)
  })
})
