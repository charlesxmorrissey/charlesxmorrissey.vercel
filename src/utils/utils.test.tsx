import { render, screen } from '@testing-library/react'

import { setBackground } from './'

global.Math.random = () => 1

describe('setBackground', () => {
  it('should set custom properties on the specified element', () => {
    render(<main className='foo' />)

    const main = screen.getByRole('main')

    setBackground(main)

    expect(main).toHaveStyle(
      `--color-1: hsl(360, 100%, 100%); --color-2: hsl(360, 100%, 100%); --color-3: hsl(360, 100%, 100%); --color-4: hsl(360, 100%, 100%);`
    )
  })
})
