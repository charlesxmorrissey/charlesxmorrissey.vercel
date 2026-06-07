import { PostItem } from 'components'

import type { Post } from 'types'

import { compilePostBody } from './mdx'
import styles from './PostList.module.css'

interface PostListProps {
  posts: Post[]
}

export const PostList = async ({ posts }: PostListProps) => {
  const items = await Promise.all(
    posts.map(async ({ body, ...meta }) => ({
      content: await compilePostBody(body),
      meta,
    })),
  )

  return (
    <div className={styles.list}>
      {items.map(({ content, meta }) => (
        <PostItem key={meta.slug} {...meta}>
          {content}
        </PostItem>
      ))}
    </div>
  )
}
