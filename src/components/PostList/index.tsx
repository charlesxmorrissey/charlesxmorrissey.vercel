import { PostItem } from 'components'

import type { Post } from 'types'

import { compilePostBody } from './mdx'
import styles from './PostList.module.css'

interface PostListProps {
  expandFirst?: boolean
  posts: Post[]
}

export const PostList = async ({ expandFirst, posts }: PostListProps) => {
  const items = await Promise.all(
    posts.map(async ({ body, ...meta }) => ({
      content: await compilePostBody(body),
      meta,
    })),
  )

  return (
    <div className={styles.list}>
      {items.map(({ content, meta }, index) => (
        <PostItem
          defaultOpen={Boolean(expandFirst) && index === 0}
          key={meta.slug}
          {...meta}
        >
          {content}
        </PostItem>
      ))}
    </div>
  )
}
