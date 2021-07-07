import { render, screen } from '@testing-library/react'

import { footerData } from 'constant'

import Footer from './'

const { getByText } = screen

describe('Footer', () => {
  beforeEach(() => {
    render(<Footer />)
  })

  it.each(footerData)(
    'renders the button with the correct footerData: %s',
    ({ link, name }) => {
      expect(getByText(name)).toBeInTheDocument()
      expect(getByText(name).closest('a')).toHaveAttribute('href', link)
    }
  )
})
