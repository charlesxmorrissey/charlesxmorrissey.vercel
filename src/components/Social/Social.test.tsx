import { render, screen } from '@testing-library/react'
import { SOCIAL_DATA } from 'constant'

import type { LinkData } from 'types'

import { Social } from './'

const { getAllByRole, getByRole } = screen
const MOCKED_SOCIAL_DATA_WITH_OPTIONS: LinkData[] = [{ ...SOCIAL_DATA[2] }]

const renderSocialComponent = ({ data = SOCIAL_DATA } = {}) =>
  render(<Social data={data} />)

describe('Social', () => {
  it('renders a link for each item with accessible name and correct href', () => {
    renderSocialComponent()

    const links = getAllByRole('link')

    expect(links).toHaveLength(SOCIAL_DATA.length)

    SOCIAL_DATA.forEach(({ link, name }) => {
      const linkEl = getByRole('link', { name })

      expect(linkEl).toBeInTheDocument()
      expect(linkEl).toHaveAttribute('href', link)
      expect(linkEl.querySelector('svg')).toBeTruthy()
    })
  })

  it('applies target and rel attributes when options are provided', () => {
    renderSocialComponent({ data: MOCKED_SOCIAL_DATA_WITH_OPTIONS })

    const item = MOCKED_SOCIAL_DATA_WITH_OPTIONS[0]
    const linkEl = getByRole('link', { name: item.name })

    expect(linkEl).toHaveAttribute('target', '_blank')
    expect(linkEl).toHaveAttribute('rel', 'noreferrer')
  })

  it('does not add external attributes for same-origin links', () => {
    const localData: LinkData[] = [{ ...SOCIAL_DATA[0], link: '/' }]

    renderSocialComponent({ data: localData })

    const linkEl = getByRole('link', { name: localData[0].name })

    expect(linkEl).not.toHaveAttribute('target')
    expect(linkEl).not.toHaveAttribute('rel')
  })

  it('matches the rendered snapshot', () => {
    const { container } = render(<Social data={SOCIAL_DATA} />)

    expect(container).toMatchSnapshot()
  })
})
