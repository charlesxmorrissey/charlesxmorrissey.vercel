import { render, screen } from '@testing-library/react'

import { socialData } from 'constant'

import Footer from './'

const { getByText } = screen

describe('Footer', () => {
  beforeEach(() => {
    render(<Footer />)
  })

  it.each(socialData)(
    'renders the button with the correct socialData: %s',
    ({ link, name }) => {
      expect(getByText(name)).toBeInTheDocument()
      expect(getByText(name).closest('a')).toHaveAttribute('href', link)
    }
  )
})
