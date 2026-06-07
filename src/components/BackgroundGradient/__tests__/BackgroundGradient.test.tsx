import { render, screen } from '@testing-library/react'
import * as utils from 'utils'

import { BackgroundGradient } from '../'

describe('BackgroundGradient', () => {
  beforeEach(() => {
    vi.spyOn(utils, 'setBackgroundStyles').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders a main wrapper and its children', () => {
    render(
      <BackgroundGradient>
        <p>child</p>
      </BackgroundGradient>,
    )

    expect(screen.getByText('child')).toBeInTheDocument()
    expect(document.querySelector('main')).toBeInTheDocument()
  })

  it('applies background styles to the main element', () => {
    render(<BackgroundGradient>x</BackgroundGradient>)

    expect(utils.setBackgroundStyles).toHaveBeenCalledWith(
      expect.objectContaining({ tagName: expect.stringMatching(/main/i) }),
    )
  })
})
