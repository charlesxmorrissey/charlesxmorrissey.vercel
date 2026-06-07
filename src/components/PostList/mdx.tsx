import { compileMDX } from 'next-mdx-remote/rsc'
import { rehypePrettyCode } from 'rehype-pretty-code'

import type { ReactNode } from 'react'

export const compilePostBody = async (body: string): Promise<ReactNode> => {
  const { content } = await compileMDX({
    options: {
      mdxOptions: {
        rehypePlugins: [
          [rehypePrettyCode, { keepBackground: false, theme: 'github-dark' }],
        ],
      },
    },
    source: body,
  })

  return content
}
