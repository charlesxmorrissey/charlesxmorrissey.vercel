import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})

vi.mock('next/font/google', () => ({
  Inter: () => ({
    variable: '--font-sans',
  }),
}))
