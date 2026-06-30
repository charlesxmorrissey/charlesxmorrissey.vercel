import { setBackgroundHue } from '../'

describe('utils', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    document.querySelectorAll('main.test-root').forEach((el) => el.remove())
  })

  describe('setBackgroundHue', () => {
    const createElement = () => {
      const mainEl = document.createElement('main')

      mainEl.className = 'test-root'
      document.body.appendChild(mainEl)

      return mainEl
    }

    it('sets --hue-seed to a random angle in [0, 360)deg', () => {
      vi.spyOn(global.Math, 'random').mockReturnValue(0.5)

      const mainEl = createElement()

      setBackgroundHue(mainEl)

      expect(mainEl.style.getPropertyValue('--hue-seed')).toBe('180deg')
    })

    it('clamps to 0deg at the low end', () => {
      vi.spyOn(global.Math, 'random').mockReturnValue(0)

      const mainEl = createElement()

      setBackgroundHue(mainEl)

      expect(mainEl.style.getPropertyValue('--hue-seed')).toBe('0deg')
    })

    it('produces a different seed when Math.random varies', () => {
      const first = createElement()
      const second = createElement()

      vi.spyOn(global.Math, 'random').mockReturnValueOnce(0.25)
      setBackgroundHue(first)

      vi.spyOn(global.Math, 'random').mockReturnValueOnce(0.75)
      setBackgroundHue(second)

      expect(first.style.getPropertyValue('--hue-seed')).not.toBe(
        second.style.getPropertyValue('--hue-seed'),
      )
    })

    it('leaves other inline styles untouched', () => {
      vi.spyOn(global.Math, 'random').mockReturnValue(0.5)

      const mainEl = createElement()

      mainEl.style.color = 'red'
      setBackgroundHue(mainEl)

      expect(mainEl.style.color).toBe('red')
      expect(mainEl.style.getPropertyValue('--hue-seed')).toBe('180deg')
    })
  })
})
