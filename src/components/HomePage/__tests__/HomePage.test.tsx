import { render, screen } from '@testing-library/react'
import { FALLBACK_CONTENT, SOCIAL_LINK_OPTIONS } from 'constant'
import * as utils from 'utils'

import { HomePage } from '../'

describe('HomePage', () => {
  beforeEach(() => {
    vi.spyOn(utils, 'setBackgroundStyles').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls setBackgroundStyles and renders Header and Social', () => {
    render(<HomePage {...FALLBACK_CONTENT} />)

    expect(utils.setBackgroundStyles).toHaveBeenCalledTimes(1)
    expect(utils.setBackgroundStyles).toHaveBeenCalledWith(
      expect.objectContaining({ tagName: expect.stringMatching(/main/i) }),
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      FALLBACK_CONTENT.name,
    )
    expect(screen.getAllByRole('link')).toHaveLength(
      FALLBACK_CONTENT.socialLinks.length,
    )
  })

  it('renders the description', () => {
    render(<HomePage {...FALLBACK_CONTENT} />)

    expect(screen.getByText(FALLBACK_CONTENT.description)).toBeInTheDocument()
  })

  it('renders each social link with href, label, and platform options', () => {
    render(<HomePage {...FALLBACK_CONTENT} />)

    FALLBACK_CONTENT.socialLinks.forEach(({ label, platform, url }) => {
      const link = screen.getByRole('link', { name: label })

      expect(link).toHaveAttribute('href', url)

      const options = SOCIAL_LINK_OPTIONS[platform]

      if (options?.target) {
        expect(link).toHaveAttribute('target', options.target)
      }

      if (options?.rel) {
        expect(link).toHaveAttribute('rel', options.rel)
      }
    })
  })

  it('renders the props it is given', () => {
    render(
      <HomePage
        description='Custom bio'
        name='Jane Doe'
        socialLinks={[
          { label: 'Custom', platform: 'github', url: 'https://example.com' },
        ]}
        title='Custom title'
      />,
    )

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Jane Doe',
    )
    expect(screen.getByText('Custom bio')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Custom' })).toHaveAttribute(
      'href',
      'https://example.com',
    )
  })

  it('renders main > article wrapper', () => {
    const { container } = render(<HomePage {...FALLBACK_CONTENT} />)

    expect(container.querySelector('main article')).toBeInTheDocument()
  })
})
