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

  it('renders Header component with APP_DATA props', () => {
    render(<HomePage />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      APP_DATA.name,
    )
  })

  it('renders Social component with all social links', () => {
    render(<HomePage />)

    const links = screen.getAllByRole('link')

    expect(links).toHaveLength(SOCIAL_DATA.length)

    SOCIAL_DATA.forEach((socialItem) => {
      const link = screen.getByRole('link', { name: socialItem.name })

      expect(link).toHaveAttribute('href', socialItem.link)
    })
  })

  it('renders main element as wrapper for child components', () => {
    const { container } = render(<HomePage />)
    const mainElement = container.querySelector('main')

    expect(mainElement).toBeInTheDocument()
    expect(mainElement?.children.length).toBeGreaterThan(0)
  })

  it('renders article element inside main', () => {
    const { container } = render(<HomePage />)
    const article = container.querySelector('main article')

    expect(article).toBeInTheDocument()
  })

  it('renders Header inside article', () => {
    const { container } = render(<HomePage />)
    const header = container.querySelector('article header')

    expect(header).toBeInTheDocument()
  })

  it('renders Social inside article after Header', () => {
    const { container } = render(<HomePage />)
    const article = container.querySelector('article')
    const children = article?.children

    expect(children?.length).toBeGreaterThanOrEqual(2)
  })

  it('passes correct ref to setBackgroundStyles', () => {
    const { container } = render(<HomePage />)
    const mainElement = container.querySelector('main')

    expect(utils.setBackgroundStyles).toHaveBeenCalledWith(mainElement)
  })

  it('renders main element with wrapper styling', () => {
    const { container } = render(<HomePage />)
    const mainElement = container.querySelector('main')

    expect(mainElement).toBeInTheDocument()
    expect(mainElement?.className).toBeTruthy()
  })

  it('useLayoutEffect is called on mount', () => {
    render(<HomePage />)

    expect(utils.setBackgroundStyles).toHaveBeenCalledTimes(1)
  })

  it('renders all social links with correct attributes', () => {
    render(<HomePage />)

    SOCIAL_DATA.forEach((item) => {
      const link = screen.getByRole('link', { name: item.name })

      expect(link).toHaveAttribute('href', item.link)

      if (item.options?.target) {
        expect(link).toHaveAttribute('target', item.options.target)
      }

      if (item.options?.rel) {
        expect(link).toHaveAttribute('rel', item.options.rel)
      }
    })
  })

  it('renders description from APP_DATA', () => {
    render(<HomePage />)

    expect(screen.getByText(APP_DATA.description)).toBeInTheDocument()
  })
})
