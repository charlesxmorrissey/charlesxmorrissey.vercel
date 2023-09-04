import { render, screen } from '@testing-library/react'

import { randomHSLColor, setBackgroundStyles } from './'

const { getByRole } = screen

describe('utils', () => {
  const hslStr = 'hsl(360 100% 100% / 25%)'

  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(1)
  })

  describe('randomHSLColor', () => {
    it('should generate a random hsl color', () => {
      const hsl = randomHSLColor()

      expect(hsl).toBe(hslStr)
    })
  })

  describe('setBackgroundStyles', () => {
    it('should set custom properties on the specified element', () => {
      render(<main className='foo' />)

      const mainEl = getByRole('main')

      setBackgroundStyles(mainEl)

      expect(mainEl).toHaveStyle(
        `--color-bg-1: ${hslStr}; --color-bg-2: ${hslStr}; --color-bg-3: ${hslStr}; --color-bg-4: ${hslStr};`,
      )
    })
  })
})
