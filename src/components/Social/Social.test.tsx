import { render, screen } from '@testing-library/react'

import { SOCIAL_DATA } from 'constant'
import type { LinkData } from 'types'

import { Social } from './'

const { getByText } = screen

const MOCKED_SOCIAL_DATA_WITH_OPTIONS: LinkData[] = [{ ...SOCIAL_DATA[2] }]

const renderSocialComponent = ({ data = SOCIAL_DATA } = {}) =>
  render(<Social data={data} />)

describe('Social', () => {
  describe('When the required props are provided', () => {
    beforeEach(() => {
      renderSocialComponent()
    })

    it.each(SOCIAL_DATA)(
      'renders a list of links with the correct data: %s',
      ({ Icon, link, name }) => {
        expect(Icon).toBeDefined()
        expect(getByText(name)).toBeInTheDocument()
        expect(getByText(name).closest('a')).toHaveAttribute('href', link)
      },
    )
  })

  describe('When options are provided', () => {
    beforeEach(() => {
      renderSocialComponent({ data: MOCKED_SOCIAL_DATA_WITH_OPTIONS })
    })

    it('Provides the correct options as attributes', () => {
      const linkEl = getByText(MOCKED_SOCIAL_DATA_WITH_OPTIONS[0].name).closest(
        'a',
      )

      expect(linkEl).toHaveAttribute('rel', 'noreferrer')
      expect(linkEl).toHaveAttribute('target', '_blank')
    })
  })
})
