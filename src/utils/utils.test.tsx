import { render, screen } from '@testing-library/react'

import { setBackgroundStyles } from './'

global.Math.random = () => 1

const { getByRole } = screen

describe('setBackgroundStyles', () => {
  const hslStr = 'hsl(360 100% 100%);'

  it('should set custom properties on the specified element', () => {
    render(<main className='foo' />)

    const main = getByRole('main')

    setBackgroundStyles(main)

    expect(main).toHaveStyle(
      `--color-1: ${hslStr} --color-2: ${hslStr} --color-3: ${hslStr} --color-4: ${hslStr}`
    )
  })
})
