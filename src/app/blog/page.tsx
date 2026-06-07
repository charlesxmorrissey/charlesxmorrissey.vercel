import { BackgroundGradient, PostList } from 'components'
import Link from 'next/link'
import { getPosts } from 'posts'

import styles from './BlogPage.module.css'

const BlogPage = async () => {
  const posts = await getPosts()

  return (
    <BackgroundGradient>
      <article className={styles.content}>
        <Link className={styles.home} href='/'>
          Charles X. Morrissey
        </Link>
        <h1 className={styles.title}>Writing</h1>
        <PostList posts={posts} />
      </article>
    </BackgroundGradient>
  )
}

export default BlogPage
