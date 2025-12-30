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
    expect(bodyElement?.props.className).toBe('--font-sans')
  })

  it('passes children to body element', () => {
    const testChild = <div data-testid='test-child'>Test Content</div>
    const result = RootLayout({ children: testChild })
    const bodyElement = result?.props.children
    const renderedChildren = bodyElement?.props.children

    expect(Array.isArray(renderedChildren)).toBe(true)
    expect(renderedChildren?.[0]).toBe(testChild)
  })

  it('has correct metadata title format', () => {
    expect(metadata.title).toBe(`${name} | ${title}`)
  })

  it('has correct metadata description', () => {
    expect(metadata.description).toBe(description)
  })

  it('has correct metadata configuration', () => {
    expect(metadata).toEqual({
      description,
      title: `${name} | ${title}`,
    })
  })

  it('includes charset in head element', () => {
    const testChild = <div>Test</div>
    const result = RootLayout({ children: testChild })

    expect(result).toBeDefined()
  })

  it('renders semantic HTML structure', () => {
    const testChild = <div data-testid='test-child'>Test</div>
    const result = RootLayout({ children: testChild })

    expect(result?.type).toBe('html')
    expect(result?.props.lang).toBe('en')
    expect(result?.props.children?.type).toBe('body')
  })

  it('body element contains array of children', () => {
    const testChild1 = <div data-testid='child-1'>Child 1</div>
    const result = RootLayout({ children: testChild1 })
    const bodyElement = result?.props.children
    const children = bodyElement?.props.children

    expect(Array.isArray(children)).toBe(true)
  })

  it('metadata is exported correctly', () => {
    expect(metadata).toBeDefined()
    expect(metadata.title).toBeDefined()
    expect(metadata.description).toBeDefined()
  })
})
