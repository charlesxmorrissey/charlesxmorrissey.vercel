import { render, screen } from '@testing-library/react'
import EmailIcon from 'assets/icons/email.svg'
import GithubIcon from 'assets/icons/github.svg'
import LinkedInIcon from 'assets/icons/linkedin.svg'

import type { LinkData } from 'types'

import { Social } from '../'

const { getAllByRole, getByRole } = screen

const SOCIAL_FIXTURE: LinkData[] = [
  {
    Icon: GithubIcon,
    link: 'https://github.com/charlesxmorrissey',
    name: 'Github',
  },
  {
    Icon: LinkedInIcon,
    link: 'https://www.linkedin.com/in/charles-x-morrissey-b366976',
    name: 'LinkedIn',
  },
  {
    Icon: EmailIcon,
    link: 'mailto:hi@charles-x.com?subject=hello%20from%20website',
    name: 'Email',
    options: {
      rel: 'noreferrer',
      target: '_blank',
    },
  },
]

const SOCIAL_FIXTURE_WITH_OPTIONS: LinkData[] = [{ ...SOCIAL_FIXTURE[2] }]

const renderSocialComponent = ({ data = SOCIAL_FIXTURE } = {}) =>
  render(<Social data={data} />)

describe('Social', () => {
  it('renders a link for each item with accessible name and correct href', () => {
    renderSocialComponent()

    const links = getAllByRole('link')

    expect(links).toHaveLength(SOCIAL_FIXTURE.length)

    SOCIAL_FIXTURE.forEach(({ link, name }) => {
      const linkEl = getByRole('link', { name })

      expect(linkEl).toBeInTheDocument()
      expect(linkEl).toHaveAttribute('href', link)
      expect(linkEl.querySelector('svg')).toBeTruthy()
    })
  })

  it('applies target and rel attributes when options are provided', () => {
    renderSocialComponent({ data: SOCIAL_FIXTURE_WITH_OPTIONS })

    const item = SOCIAL_FIXTURE_WITH_OPTIONS[0]
    const linkEl = getByRole('link', { name: item.name })

    expect(linkEl).toHaveAttribute('target', '_blank')
    expect(linkEl).toHaveAttribute('rel', 'noreferrer')
  })

  it('does not add external attributes for same-origin links', () => {
    const localData: LinkData[] = [{ ...SOCIAL_FIXTURE[0], link: '/' }]

    renderSocialComponent({ data: localData })

    const linkEl = getByRole('link', { name: localData[0].name })

    expect(linkEl).not.toHaveAttribute('target')
    expect(linkEl).not.toHaveAttribute('rel')
  })

  it('renders section title "Get in touch"', () => {
    renderSocialComponent()

    expect(screen.getByText('Get in touch')).toBeInTheDocument()
  })

  it('renders title as heading level 2', () => {
    renderSocialComponent()

    const h2 = screen.getByRole('heading', { level: 2 })

    expect(h2).toHaveTextContent('Get in touch')
  })

  it('renders with empty data array', () => {
    renderSocialComponent({ data: [] })

    expect(screen.getByText('Get in touch')).toBeInTheDocument()

    const links = screen.queryAllByRole('link')

    expect(links).toHaveLength(0)
  })

  it('renders with single social item', () => {
    const singleItem: LinkData[] = [SOCIAL_FIXTURE[0]]

    renderSocialComponent({ data: singleItem })

    const links = getAllByRole('link')

    expect(links).toHaveLength(1)
    expect(links[0]).toHaveTextContent(singleItem[0].name)
  })

  it('renders icon for each social link', () => {
    renderSocialComponent()

    const links = getAllByRole('link')

    links.forEach((link) => {
      const icon = link.querySelector('svg')

      expect(icon).toBeInTheDocument()
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    })
  })

  it('renders link text with accessible name', () => {
    renderSocialComponent()

    SOCIAL_FIXTURE.forEach(({ name }) => {
      const linkEl = getByRole('link', { name })

      expect(linkEl).toHaveAccessibleName(name)
    })
  })

  it('uses correct key structure for list items', () => {
    const { container } = render(<Social data={SOCIAL_FIXTURE} />)
    const links = container.querySelectorAll('a')

    expect(links.length).toBe(SOCIAL_FIXTURE.length)
  })
})
