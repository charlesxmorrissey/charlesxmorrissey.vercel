import { render, screen } from '@testing-library/react'
import { APP_DATA, SOCIAL_DATA } from 'constant'
import * as utils from 'utils'

import { HomePage } from './'

describe('HomePage', () => {
  beforeEach(() => {
    vi.spyOn(utils, 'setBackgroundStyles').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls setBackgroundStyles with the main element and renders Header and Social', () => {
    render(<HomePage />)

    expect(utils.setBackgroundStyles).toHaveBeenCalledTimes(1)
    expect(utils.setBackgroundStyles).toHaveBeenCalledWith(
      expect.objectContaining({ tagName: expect.stringMatching(/main/i) }),
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      APP_DATA.name,
    )
    expect(screen.getAllByRole('link')).toHaveLength(SOCIAL_DATA.length)
  })
})
