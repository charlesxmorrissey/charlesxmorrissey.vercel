import { randomHSLColor, setBackgroundStyles } from './'

describe('utils', () => {
  const defaultHslStr = 'hsl(360 100% 100% / 25%)'

  beforeEach(() => {
    vi.spyOn(global.Math, 'random').mockReturnValue(1)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    document.querySelectorAll('main.test-root').forEach((el) => el.remove())
  })

  describe('randomHSLColor', () => {
    it('generates a deterministic hsl string when Math.random is mocked', () => {
      const hsl = randomHSLColor()

      expect(hsl).toBe(defaultHslStr)
    })

    it('returns a valid hsl() formatted string with default parameters', () => {
      const hsl = randomHSLColor()

      expect(hsl).toMatch(/^hsl\(\d+\s+\d+%\s+\d+%\s+\/\s*\d+%?\)$/)
    })

    it('respects custom saturation range', () => {
      const hsl = randomHSLColor(30, 60)

      expect(hsl).toBe('hsl(360 60% 100% / 25%)')
    })

    it('respects custom lightness range', () => {
      const hsl = randomHSLColor(50, 100, 20, 80)

      expect(hsl).toBe('hsl(360 100% 80% / 25%)')
    })

    it('respects custom opacity', () => {
      const hsl = randomHSLColor(50, 100, 50, 100, 50)

      expect(hsl).toBe('hsl(360 100% 100% / 50%)')
    })

    it('generates different colors when Math.random varies', () => {
      vi.restoreAllMocks()
      const color1 = randomHSLColor()
      const color2 = randomHSLColor()

      expect(color1).not.toBe(color2)
    })
  })

  describe('setBackgroundStyles', () => {
    it('throws when no element is provided', () => {
      expect(() => setBackgroundStyles(null as any)).toThrow(
        'A valid HTMLElement must be provided.',
      )
      expect(() => setBackgroundStyles(undefined as any)).toThrow(
        'A valid HTMLElement must be provided.',
      )
    })

    it('sets the expected CSS custom properties on the provided element with default color count', () => {
      const mainEl = document.createElement('main')

      mainEl.className = 'test-root'
      document.body.appendChild(mainEl)

      setBackgroundStyles(mainEl)

      expect(mainEl.style.getPropertyValue('--color-bg-1')).toBe(defaultHslStr)
      expect(mainEl.style.getPropertyValue('--color-bg-2')).toBe(defaultHslStr)
      expect(mainEl.style.getPropertyValue('--color-bg-3')).toBe(defaultHslStr)
      expect(mainEl.style.getPropertyValue('--color-bg-4')).toBe(defaultHslStr)
      expect(mainEl.style.getPropertyValue('--color-bg-5')).toBe('')
    })

    it('sets custom number of CSS custom properties', () => {
      const mainEl = document.createElement('main')

      mainEl.className = 'test-root'
      document.body.appendChild(mainEl)

      setBackgroundStyles(mainEl, 2)

      expect(mainEl.style.getPropertyValue('--color-bg-1')).toBe(defaultHslStr)
      expect(mainEl.style.getPropertyValue('--color-bg-2')).toBe(defaultHslStr)
      expect(mainEl.style.getPropertyValue('--color-bg-3')).toBe('')
    })

    it('works with single color', () => {
      const mainEl = document.createElement('main')

      mainEl.className = 'test-root'
      document.body.appendChild(mainEl)

      setBackgroundStyles(mainEl, 1)

      expect(mainEl.style.getPropertyValue('--color-bg-1')).toBe(defaultHslStr)
      expect(mainEl.style.getPropertyValue('--color-bg-2')).toBe('')
    })
  })
})
