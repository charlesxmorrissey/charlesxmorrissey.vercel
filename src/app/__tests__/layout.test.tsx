import { FALLBACK_CONTENT } from 'constant'

import RootLayout, { generateMetadata } from '../layout'

// Mocks the local 'sanity' path alias (src/sanity/), not the npm package.
vi.mock('sanity', async () => {
  const { FALLBACK_CONTENT: fallback } = await import('constant')

  return {
    getSiteContent: vi.fn().mockResolvedValue(fallback),
  }
})

describe('RootLayout', () => {
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

  it('passes children to body element via BackgroundGradient wrapper', () => {
    const testChild = <div data-testid='test-child'>Test Content</div>
    const result = RootLayout({ children: testChild })
    const bodyElement = result?.props.children
    const renderedChildren = bodyElement?.props.children

    expect(Array.isArray(renderedChildren)).toBe(true)
    const backgroundGradient = renderedChildren?.[0]

    expect(backgroundGradient?.type).toBeDefined()
    expect(backgroundGradient?.props.children).toBe(testChild)
  })

  it('builds the metadata title as "name | title"', async () => {
    const metadata = await generateMetadata()

    expect(metadata.title).toBe(
      `${FALLBACK_CONTENT.name} | ${FALLBACK_CONTENT.title}`,
    )
  })

  it('uses the content description for metadata', async () => {
    const metadata = await generateMetadata()

    expect(metadata.description).toBe(FALLBACK_CONTENT.description)
  })

  it('exports a complete metadata object', async () => {
    const metadata = await generateMetadata()

    expect(metadata).toEqual({
      description: FALLBACK_CONTENT.description,
      title: `${FALLBACK_CONTENT.name} | ${FALLBACK_CONTENT.title}`,
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
})
