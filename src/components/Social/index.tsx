import type { LinkData } from 'types'

import styles from './Social.module.css'

interface SocialProps {
  data: LinkData[]
}

export const Social = ({ data }: SocialProps) => (
  <>
    <h2 className={styles.socialTitle}>Get in touch</h2>

    <div className={styles.socialWrapper}>
      {data.map(({ Icon, link, name, options }: LinkData, index) => (
        <a
          className={styles.socialLink}
          href={link}
          key={`social-item-${index}`}
          {...options}
        >
          <span className={styles.socialLinkTitle}>{name}</span>

          <Icon aria-hidden className={styles.socialIcon} />
        </a>
      ))}
    </div>
  </>
)
