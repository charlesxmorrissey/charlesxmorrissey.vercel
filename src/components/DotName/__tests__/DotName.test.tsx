import { render, screen } from '@testing-library/react'

import { DotName } from '../'
import { mountDotType } from '../dotType'

vi.mock('../dotType', () => ({
  mountDotType: vi.fn(() => vi.fn()),
}))

describe('DotName', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('keeps the real text in the document', () => {
    render(<DotName text='Ada Lovelace' />)

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
  })

  it('hides the canvas from assistive technology', () => {
    const { container } = render(<DotName text='Ada Lovelace' />)

    expect(container.querySelector('canvas')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
  })

  it('uses the dots variant by default', () => {
    const { container } = render(<DotName text='Ada Lovelace' />)

    expect(container.firstElementChild).toHaveAttribute('data-variant', 'dots')
  })

  it('passes the block variant to the root element', () => {
    const { container } = render(
      <DotName text='Ada Lovelace' variant='block' />,
    )

    expect(container.firstElementChild).toHaveAttribute('data-variant', 'block')
  })

  it('renders children in place of text', () => {
    render(
      <DotName text='ignored'>
        <svg data-testid='icon' />
      </DotName>,
    )

    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.queryByText('ignored')).not.toBeInTheDocument()
  })

  it('mounts the renderer on the root element and cleans up on unmount', () => {
    const cleanup = vi.fn()

    vi.mocked(mountDotType).mockReturnValueOnce(cleanup)

    const { container, unmount } = render(<DotName text='Ada Lovelace' />)

    expect(mountDotType).toHaveBeenCalledTimes(1)
    expect(mountDotType).toHaveBeenCalledWith(container.firstElementChild)

    unmount()

    expect(cleanup).toHaveBeenCalledTimes(1)
  })
})
