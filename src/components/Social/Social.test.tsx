import { render, screen } from '@testing-library/react'

import { SOCIAL_DATA } from 'constant'

import { Social } from './'

const { getByText } = screen

describe('Social', () => {
  beforeEach(() => {
    render(<Social data={SOCIAL_DATA} />)
  })

  it.each(SOCIAL_DATA)(
    'renders the button with the correct socialData: %s',
    ({ link, name }) => {
      expect(getByText(name)).toBeInTheDocument()
      expect(getByText(name).closest('a')).toHaveAttribute('href', link)
    },
  )
})
