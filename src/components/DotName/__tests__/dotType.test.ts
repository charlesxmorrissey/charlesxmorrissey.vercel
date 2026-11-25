import { mountDotType } from '../dotType'

const PADDING = 96
const TEXT_HTML = '<span style="font-size: 24px">Hello</span><canvas></canvas>'
const ICON_HTML =
  '<span style="font-size: 16px"><svg><path d="M0 0h24v24H0z"></path></svg></span><canvas></canvas>'

interface SetupOptions {
  height?: number
  html?: string
  variant?: string
  width?: number
}

const createContext = () => ({
  beginPath: vi.fn(),
  clearRect: vi.fn(),
  drawImage: vi.fn(),
  fill: vi.fn(),
  fillStyle: '',
  fillText: vi.fn(),
  font: '',
  /* Every pixel is opaque, so every grid cell becomes a dot. */
  getImageData: vi.fn(
    (_x: number, _y: number, width: number, height: number) => ({
      data: new Uint8ClampedArray(width * height * 4).fill(255),
    }),
  ),
  measureText: vi.fn(() => ({ fontBoundingBoxAscent: 10 })),
  rect: vi.fn(),
  scale: vi.fn(),
  setTransform: vi.fn(),
  textBaseline: '',
  translate: vi.fn(),
})

const rectOf = (width: number, height: number) =>
  ({ height, left: 0, top: 0, width }) as DOMRect

const mockMatchMedia = (reduceMotion = false) => {
  const media = {
    addEventListener: vi.fn(),
    matches: false,
    removeEventListener: vi.fn(),
  }

  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      ...media,
      matches: reduceMotion && query.includes('reduced-motion'),
    })),
  )
}

const setup = ({
  height = 10,
  html = TEXT_HTML,
  variant = 'dots',
  width = 40,
}: SetupOptions = {}) => {
  const root = document.createElement('span')

  root.dataset.variant = variant
  root.innerHTML = html
  root.getBoundingClientRect = () => rectOf(width, height)
  document.body.append(root)

  return root
}

/* Let document.fonts.ready resolve, so that the observer starts. */
const flushFonts = async () => {
  await Promise.resolve()
  await Promise.resolve()
}

const runFrames = (milliseconds: number) => {
  vi.advanceTimersByTime(milliseconds)
}

const pointer = (type: string, x: number, y: number, pointerType = 'mouse') => {
  const event = new MouseEvent(type, { clientX: x, clientY: y })

  Object.defineProperty(event, 'pointerType', { value: pointerType })
  window.dispatchEvent(event)
}

describe('mountDotType', () => {
  let context: ReturnType<typeof createContext>

  beforeEach(() => {
    vi.useFakeTimers({
      toFake: ['cancelAnimationFrame', 'performance', 'requestAnimationFrame'],
    })

    context = createContext()
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
      () => context as unknown as CanvasRenderingContext2D,
    )
    vi.stubGlobal(
      'ResizeObserver',
      class {
        callback: () => void

        constructor(callback: () => void) {
          this.callback = callback
        }

        disconnect = vi.fn()

        observe = () => this.callback()
      },
    )
    vi.stubGlobal('Path2D', class {})
    mockMatchMedia()
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: { ready: Promise.resolve() },
    })
    Range.prototype.getClientRects = () =>
      [rectOf(10, 10)] as unknown as DOMRectList
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('shows the plain text when the browser has no ResizeObserver', () => {
    vi.stubGlobal('ResizeObserver', undefined)

    const root = setup()
    const cleanup = mountDotType(root)

    expect(root.dataset.dots).toBe('rest')
    expect(HTMLCanvasElement.prototype.getContext).not.toHaveBeenCalled()
    expect(() => cleanup()).not.toThrow()
  })

  it('shows the plain text when the canvas has no 2D context', () => {
    vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(null)

    const root = setup()

    mountDotType(root)

    expect(root.dataset.dots).toBe('rest')
  })

  it('waits for the fonts before it draws', async () => {
    const root = setup()

    mountDotType(root)

    expect(root.dataset.dots).toBeUndefined()

    await flushFonts()

    expect(root.dataset.dots).toBe('on')
  })

  it('sizes the canvas to the text plus padding on every side', async () => {
    const root = setup({ height: 10, width: 40 })
    const canvas = root.querySelector('canvas')

    mountDotType(root)
    await flushFonts()

    expect(canvas?.width).toBe(40 + PADDING * 2)
    expect(canvas?.height).toBe(10 + PADDING * 2)
    expect(canvas?.style.width).toBe(`${40 + PADDING * 2}px`)
  })

  it('plays the intro with dots, then hands over to the real text', async () => {
    const root = setup()

    mountDotType(root)
    await flushFonts()
    runFrames(100)

    expect(root.dataset.dots).toBe('on')
    expect(context.rect).toHaveBeenCalled()
    expect(context.fill).toHaveBeenCalled()

    runFrames(4000)

    expect(root.dataset.dots).toBe('rest')
  })

  it('changes each dot into its piece of the real text when it is home', async () => {
    const root = setup()

    mountDotType(root)
    await flushFonts()
    runFrames(16)

    expect(context.drawImage).not.toHaveBeenCalled()

    runFrames(4000)

    expect(context.drawImage).toHaveBeenCalledWith(
      expect.any(HTMLCanvasElement),
      0,
      0,
      1,
      1,
      PADDING,
      PADDING,
      1,
      1,
    )

    const pieces = context.drawImage.mock.calls.length

    pointer('pointermove', PADDING + 5, PADDING + 5)
    runFrames(100)

    expect(context.drawImage.mock.calls.length).toBe(pieces)
  })

  it('draws one glyph of text per character at the position from the DOM', async () => {
    const root = setup()

    mountDotType(root)
    await flushFonts()

    expect(context.fillText).toHaveBeenCalledTimes('Hello'.length)
    expect(context.fillText).toHaveBeenCalledWith('H', 0, 10)
    expect(root.querySelectorAll('canvas')).toHaveLength(1)
  })

  it('takes the baseline from the page, on a whole device pixel', async () => {
    const root = setup()

    vi.spyOn(
      HTMLSpanElement.prototype,
      'getBoundingClientRect',
    ).mockReturnValue({ ...rectOf(0, 0), top: 12.5 })
    mountDotType(root)
    await flushFonts()

    expect(context.fillText).toHaveBeenCalledWith('H', 0, 13)
    expect(root.querySelector('span')?.children).toHaveLength(0)
  })

  it('cuts a hole at the pointer and closes it when the pointer leaves', async () => {
    const root = setup()

    mountDotType(root)
    await flushFonts()
    runFrames(4000)

    pointer('pointermove', PADDING + 5, PADDING + 5)
    runFrames(100)

    expect(root.dataset.dots).toBe('hole')
    expect(root.style.getPropertyValue('--hole-x')).toBe('5px')
    expect(root.style.getPropertyValue('--hole-y')).toBe('5px')

    pointer('pointermove', 5000, 5000)
    runFrames(2000)

    expect(root.dataset.dots).toBe('rest')
  })

  it('stops following the pointer when it leaves the page', async () => {
    const root = setup()

    mountDotType(root)
    await flushFonts()
    runFrames(4000)

    pointer('pointermove', PADDING + 5, PADDING + 5)
    runFrames(100)
    document.documentElement.dispatchEvent(new Event('pointerleave'))
    runFrames(2000)

    expect(root.dataset.dots).toBe('rest')

    const calls = context.clearRect.mock.calls.length

    runFrames(500)

    expect(context.clearRect.mock.calls.length).toBe(calls)
  })

  it('reacts to a finger press and lets go when the finger lifts', async () => {
    const root = setup()

    mountDotType(root)
    await flushFonts()
    runFrames(4000)

    pointer('pointerdown', PADDING + 5, PADDING + 5, 'touch')
    runFrames(100)

    expect(root.dataset.dots).toBe('hole')

    pointer('pointerup', PADDING + 5, PADDING + 5, 'touch')
    runFrames(2000)

    expect(root.dataset.dots).toBe('rest')
  })

  it('keeps following a mouse after the button is released', async () => {
    const root = setup()

    mountDotType(root)
    await flushFonts()
    runFrames(4000)

    pointer('pointerdown', PADDING + 5, PADDING + 5)
    pointer('pointerup', PADDING + 5, PADDING + 5)
    runFrames(500)

    expect(root.dataset.dots).toBe('hole')
  })

  it('skips the intro and ignores the pointer with reduced motion', async () => {
    mockMatchMedia(true)

    const root = setup()

    mountDotType(root)
    await flushFonts()
    runFrames(200)

    expect(root.dataset.dots).toBe('rest')

    pointer('pointermove', PADDING + 5, PADDING + 5)
    runFrames(200)

    expect(root.dataset.dots).toBe('rest')
  })

  it('draws nothing when the text has no size', async () => {
    const root = setup({ height: 0, width: 0 })

    mountDotType(root)
    await flushFonts()

    expect(root.dataset.dots).toBeUndefined()
    expect(context.getImageData).not.toHaveBeenCalled()
  })

  describe('block variant', () => {
    const BLOCK_HTML = '<span>Ada X.</span><canvas></canvas>'

    it('reserves height for the block letters and stays drawn', async () => {
      const root = setup({ html: BLOCK_HTML, variant: 'block', width: 512 })

      mountDotType(root)
      await flushFonts()

      /* "ADA" and "X." fit on one line of six rows, each 13px high. */
      expect(root.style.height).toBe('78px')

      runFrames(6000)

      expect(root.dataset.dots).toBe('on')
      expect(context.rect).toHaveBeenCalled()
      expect(context.getImageData).not.toHaveBeenCalled()
    })

    it('wraps words onto more lines when the width is small', async () => {
      const root = setup({ html: BLOCK_HTML, variant: 'block', width: 100 })

      mountDotType(root)
      await flushFonts()

      expect(parseFloat(root.style.height)).toBeGreaterThan(78)
    })

    it('moves the blocks away from the pointer and back', async () => {
      const root = setup({ html: BLOCK_HTML, variant: 'block', width: 512 })

      mountDotType(root)
      await flushFonts()
      runFrames(6000)

      const settled = context.clearRect.mock.calls.length

      runFrames(500)

      expect(context.clearRect.mock.calls.length).toBe(settled)

      pointer('pointermove', PADDING + 20, PADDING + 20)
      runFrames(100)

      expect(context.clearRect.mock.calls.length).toBeGreaterThan(settled)
      expect(root.dataset.dots).toBe('on')
    })

    it('draws nothing for text with no supported characters', async () => {
      const root = setup({
        html: '<span>~~~</span><canvas></canvas>',
        variant: 'block',
        width: 512,
      })

      mountDotType(root)
      await flushFonts()

      expect(root.dataset.dots).toBeUndefined()
    })
  })

  describe('icon', () => {
    const setupIcon = () => {
      const link = document.createElement('a')
      const root = setup({ height: 24, html: ICON_HTML, width: 24 })
      const svg = root.querySelector('svg') as SVGSVGElement

      link.href = '#'
      link.append(root)
      document.body.append(link)
      svg.getBoundingClientRect = () => rectOf(24, 24)
      Object.defineProperty(svg, 'viewBox', {
        value: { baseVal: { height: 24, width: 24, x: 0, y: 0 } },
      })

      return { link, root }
    }

    it('fills the SVG paths in place of text', async () => {
      const { root } = setupIcon()

      mountDotType(root)
      await flushFonts()

      expect(context.fill).toHaveBeenCalledTimes(1)
      expect(context.fillText).not.toHaveBeenCalled()
    })

    it('does not open a hole under the pointer', async () => {
      const { root } = setupIcon()

      mountDotType(root)
      await flushFonts()
      runFrames(4000)

      pointer('pointermove', PADDING + 5, PADDING + 5)
      runFrames(200)

      expect(root.dataset.dots).toBe('rest')
    })

    it('redraws when its link gains focus', async () => {
      const { link, root } = setupIcon()

      mountDotType(root)
      await flushFonts()
      runFrames(4000)

      const settled = context.clearRect.mock.calls.length

      link.dispatchEvent(new Event('focus'))
      runFrames(200)

      expect(context.clearRect.mock.calls.length).toBeGreaterThan(settled)
    })
  })

  it('removes its marks and stops drawing on cleanup', async () => {
    const root = setup()
    const cleanup = mountDotType(root)

    await flushFonts()
    runFrames(4000)
    pointer('pointermove', PADDING + 5, PADDING + 5)
    runFrames(100)
    cleanup()

    const calls = context.clearRect.mock.calls.length

    pointer('pointermove', PADDING + 6, PADDING + 6)
    runFrames(500)

    expect(root.dataset.dots).toBeUndefined()
    expect(root.style.getPropertyValue('--hole-x')).toBe('')
    expect(context.clearRect.mock.calls.length).toBe(calls)
  })

  it('does not start if it is cleaned up before the fonts are ready', async () => {
    const root = setup()
    const cleanup = mountDotType(root)

    cleanup()
    await flushFonts()

    expect(root.dataset.dots).toBeUndefined()
  })
})
