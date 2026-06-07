import { BackgroundGradient, PostList, SiteIdentity } from 'components'
import Link from 'next/link'

import type { Post, SiteContent } from 'types'

import styles from './HomePage.module.css'

interface HomePageProps extends SiteContent {
  posts: Post[]
}

export const HomePage = ({
  description,
  name,
  posts,
  socialLinks,
}: HomePageProps) => (
  <BackgroundGradient>
    <article className={styles.content}>
      <SiteIdentity
        description={description}
        name={name}
        socialLinks={socialLinks}
      />

      <section className={styles.writing}>
        <h2 className={styles.eyebrow}>Writing</h2>
        <PostList posts={posts} />
        <Link className={styles.viewAll} href='/blog'>
          View all →
        </Link>
      </section>
    </article>
  </BackgroundGradient>
)
