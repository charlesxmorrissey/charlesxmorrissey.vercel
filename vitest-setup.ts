import { cleanup } from '@testing-library/react'

import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})

vi.mock('next/font/google', () => ({
  Inter: () => ({
    variable: '--font-sans',
  }),
}))
