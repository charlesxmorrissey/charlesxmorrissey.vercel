import { render, screen } from '@testing-library/react'

import { compilePostBody } from '../mdx'

const compileMDXMock = vi.fn()

vi.mock('next-mdx-remote/rsc', () => ({
  compileMDX: (...args: unknown[]) => compileMDXMock(...args),
}))

vi.mock('rehype-pretty-code', () => ({
  rehypePrettyCode: 'rehype-pretty-code-plugin',
}))

describe('compilePostBody', () => {
  afterEach(() => {
    compileMDXMock.mockReset()
  })

  it('compiles the source with rehype-pretty-code (no background, github-dark theme)', async () => {
    compileMDXMock.mockResolvedValue({ content: <p>compiled</p> })

    await compilePostBody('# Heading')

    expect(compileMDXMock).toHaveBeenCalledWith({
      options: {
        mdxOptions: {
          rehypePlugins: [
            [
              'rehype-pretty-code-plugin',
              { keepBackground: false, theme: 'github-dark' },
            ],
          ],
        },
      },
      source: '# Heading',
    })
  })

  it('returns the compiled content', async () => {
    compileMDXMock.mockResolvedValue({ content: <p>compiled output</p> })

    render(await compilePostBody('# Heading'))

    expect(screen.getByText('compiled output')).toBeInTheDocument()
  })
})
