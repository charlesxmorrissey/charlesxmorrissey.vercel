import { BackgroundGradient, Header, PostList, Social } from 'components'
import { SOCIAL_ICONS, SOCIAL_LINK_OPTIONS } from 'constant'
import Link from 'next/link'

import type { LinkData, Post, SiteContent } from 'types'

import styles from './HomePage.module.css'

interface HomePageProps extends SiteContent {
  posts: Post[]
}

export const HomePage = ({
  description,
  name,
  posts,
  socialLinks,
}: HomePageProps) => {
  const data: LinkData[] = socialLinks.map(({ label, platform, url }) => ({
    Icon: SOCIAL_ICONS[platform],
    link: url,
    name: label,
    options: SOCIAL_LINK_OPTIONS[platform],
  }))

  return (
    <BackgroundGradient>
      <article className={styles.content}>
        <Header description={description} name={name} />
        <Social data={data} />

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
}
