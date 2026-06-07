import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'

import type { Post } from 'types'

const POSTS_DIR = join(process.cwd(), 'content', 'posts')

const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
  })

export const getPosts = async (dir: string = POSTS_DIR): Promise<Post[]> => {
  if (!existsSync(dir)) {
    return []
  }

  const posts = readdirSync(dir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const raw = readFileSync(join(dir, file), 'utf8')
      const { content, data } = matter(raw)

      if (!data.date || !data.title) {
        throw new Error(
          `Post "${file}" is missing required frontmatter (date, title)`,
        )
      }

      const date = new Date(data.date).toISOString().slice(0, 10)

      return {
        body: content,
        date,
        formattedDate: formatDate(date),
        slug: file.replace(/\.mdx$/, ''),
        title: data.title as string,
      }
    })

  return posts.sort((a, b) => b.date.localeCompare(a.date))
}
