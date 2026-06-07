import { BackgroundGradient, PostList, SiteIdentity } from 'components'
import { getPosts } from 'posts'
import { getSiteContent } from 'sanity'

import styles from './BlogPage.module.css'

const BlogPage = async () => {
  const [content, posts] = await Promise.all([getSiteContent(), getPosts()])

  return (
    <BackgroundGradient>
      <article className={styles.content}>
        <SiteIdentity
          description={content.description}
          homeHref='/'
          name={content.name}
          socialLinks={content.socialLinks}
        />

        <section className={styles.writing}>
          <h2 className={styles.eyebrow}>Writing</h2>
          <PostList posts={posts} />
        </section>
      </article>
    </BackgroundGradient>
  )
}

export default BlogPage
