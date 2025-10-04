import { randomHSLColor, setBackgroundStyles } from './'

describe('utils', () => {
  const hslStr = 'hsl(360 100% 100% / 25%)'

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

      expect(hsl).toBe(hslStr)
    })

    it('returns a valid hsl() formatted string', () => {
      const hsl = randomHSLColor()

      expect(hsl).toMatch(/^hsl\(\d+\s+\d+%\s+\d+%\s+\/\s*\d+%?\)$/)
    })
  })

  describe('setBackgroundStyles', () => {
    it('throws when no element is provided', () => {
      expect(() => setBackgroundStyles(null as any)).toThrow()
      expect(() => setBackgroundStyles(undefined as any)).toThrow()
    })

    it('sets the expected CSS custom properties on the provided element', () => {
      const mainEl = document.createElement('main')

      mainEl.className = 'test-root'
      document.body.appendChild(mainEl)

      setBackgroundStyles(mainEl)

      expect(mainEl.style.getPropertyValue('--color-bg-1')).toBe(hslStr)
      expect(mainEl.style.getPropertyValue('--color-bg-2')).toBe(hslStr)
      expect(mainEl.style.getPropertyValue('--color-bg-3')).toBe(hslStr)
      expect(mainEl.style.getPropertyValue('--color-bg-4')).toBe(hslStr)
    })
  })
})
