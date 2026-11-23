import { render } from '@testing-library/react'

import { Backdrop } from '../'

const OPTIONS = ['current', 'smoke', 'max', 'cosmic']

/* Run the inline pick script the way a browser does while it parses HTML. */
const runPickScript = (source: string) => {
  const backdrop = document.createElement('div')
  const script = document.createElement('script')

  backdrop.dataset.bg = 'current'
  script.textContent = source
  document.body.append(backdrop)
  document.body.append(script)

  return backdrop
}

describe('Backdrop', () => {
  const getScript = () => {
    const { container } = render(<Backdrop />)

    return container.querySelector('script')?.innerHTML ?? ''
  }

  afterEach(() => {
    window.history.replaceState(null, '', '/')
    document.body.innerHTML = ''
  })

  it('renders the default background, hidden from assistive technology', () => {
    const { container } = render(<Backdrop />)
    const backdrop = container.querySelector('[data-bg]')

    expect(backdrop).toHaveAttribute('data-bg', 'current')
    expect(backdrop).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders nine smoke billows and one set of hills', () => {
    const { container } = render(<Backdrop />)

    expect(container.querySelectorAll('svg')).toHaveLength(10)
    expect(container.querySelectorAll('svg filter')).toHaveLength(9)
  })

  it('gives every billow its own gradient and filter ids', () => {
    const { container } = render(<Backdrop />)
    const ids = [...container.querySelectorAll('[id]')].map(({ id }) => id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  it('places the pick script directly after the backdrop', () => {
    const { container } = render(<Backdrop />)

    expect(container.querySelector('[data-bg] + script')).toBeInTheDocument()
  })

  it('marks the page as scripted', () => {
    expect(runPickScript(getScript()).dataset.js).toBe('on')
  })

  /*
   * The script runs in the page's own realm, so Math.random cannot be mocked
   * from here. 80 runs miss one of four options about once in 10^9 tries.
   */
  it('picks only known backgrounds, and reaches every one of them', () => {
    const script = getScript()
    const picks = Array.from(
      { length: 80 },
      () => runPickScript(script).dataset.bg,
    )

    expect(new Set(picks)).toEqual(new Set(OPTIONS))
  })

  it.each(OPTIONS)('lets ?bg=%s force a background', (option) => {
    const script = getScript()

    window.history.replaceState(null, '', `/?bg=${option}`)

    const picks = Array.from(
      { length: 12 },
      () => runPickScript(script).dataset.bg,
    )

    expect(new Set(picks)).toEqual(new Set([option]))
  })

  it('ignores an unknown ?bg value', () => {
    window.history.replaceState(null, '', '/?bg=nope')

    expect(OPTIONS).toContain(runPickScript(getScript()).dataset.bg)
  })
})
