import { PostList, SiteIdentity } from 'components'
import Link from 'next/link'
import { getPosts } from 'posts'
import { getSiteContent } from 'sanity'

import styles from './BlogPage.module.css'

const BlogPage = async () => {
  const [content, posts] = await Promise.all([getSiteContent(), getPosts()])

  return (
    <article className={styles.content}>
      <Link className={styles.home} href='/'>
        ← Home
      </Link>

      <SiteIdentity
        description={content.description}
        name={content.name}
        socialLinks={content.socialLinks}
      />

      <section className={styles.writing}>
        <h2 className={styles.eyebrow}>Writing</h2>
        <PostList posts={posts} />
      </section>
    </article>
  )
}

export default BlogPage
