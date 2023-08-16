import { render, screen } from '@testing-library/react'

import { setBackgroundStyles } from './'

global.Math.random = () => 1

const { getByRole } = screen

describe('setBackgroundStyles', () => {
  const hslStr = 'hsl(360 100% 100%);'

  it('should set custom properties on the specified element', () => {
    render(<main className='foo' />)

    const mainEl = getByRole('main')

    setBackgroundStyles(mainEl)

    expect(mainEl).toHaveStyle(
      `--color-bg-1: ${hslStr}; --color-bg-2: ${hslStr}; --color-bg-3: ${hslStr}; --color-bg-4: ${hslStr};`,
    )
  })
})
