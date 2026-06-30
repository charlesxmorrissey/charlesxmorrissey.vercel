'use client'

import { Header, Social } from 'components'
import { SOCIAL_ICONS, SOCIAL_LINK_OPTIONS } from 'constant'
import { setBackgroundHue } from 'utils'

import type { LinkData, SiteContent } from 'types'

import styles from './HomePage.module.css'

export const HomePage = ({ description, name, socialLinks }: SiteContent) => {
  const backgroundRef = (element: HTMLElement | null) => {
    if (element) {
      setBackgroundHue(element)
    }
  }

  const data: LinkData[] = socialLinks.map(({ label, platform, url }) => ({
    Icon: SOCIAL_ICONS[platform],
    link: url,
    name: label,
    options: SOCIAL_LINK_OPTIONS[platform],
  }))

  return (
    <main className={styles.wrapper} ref={backgroundRef}>
      <article className={styles.content}>
        <Header description={description} name={name} />
        <Social data={data} />
      </article>
    </main>
  )
}
