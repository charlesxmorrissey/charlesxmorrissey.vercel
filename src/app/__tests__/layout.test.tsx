import '@testing-library/jest-dom'

import { APP_DATA } from 'constant'

import RootLayout, { metadata } from '../layout'

vi.mock('next/font/google', () => ({
  Inter: () => ({
    variable: '--font-sans',
  }),
}))

describe('RootLayout', () => {
  const { description, name, title } = APP_DATA

  it('renders children as JSX element with html and body tags', () => {
    const testChild = <div data-testid='test-child'>Test Content</div>
    const result = RootLayout({ children: testChild })

    expect(result).toBeDefined()
    expect(result?.type).toBe('html')
  })

  it('sets html lang attribute to en', () => {
    const testChild = <div>Test</div>
    const result = RootLayout({ children: testChild })

    expect(result?.props.lang).toBe('en')
  })

  it('renders body with font variable class', () => {
    const testChild = <div>Test</div>
    const result = RootLayout({ children: testChild })
    const bodyElement = result?.props.children

    expect(bodyElement?.type).toBe('body')
    expect(bodyElement?.props.className).toContain('--font-sans')
  })

  it('passes children to body element', () => {
    const testChild = <div data-testid='test-child'>Test Content</div>
    const result = RootLayout({ children: testChild })
    const bodyElement = result?.props.children
    const renderedChildren = bodyElement?.props.children

    expect(renderedChildren).toBe(testChild)
  })

  it('has correct metadata configuration', () => {
    expect(metadata).toEqual({
      description,
      title: `${name} | ${title}`,
    })
  })
})
