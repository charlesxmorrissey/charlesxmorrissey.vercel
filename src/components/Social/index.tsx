import { DotName } from 'components'

import type { LinkData } from 'types'

import styles from './Social.module.css'

interface SocialProps {
  data: LinkData[]
}

export const Social = ({ data }: SocialProps) => (
  <footer>
    <h2 className={styles.socialTitle}>
      <DotName text='Get in touch' />
    </h2>

    <div className={styles.socialWrapper}>
      {data.map(({ Icon, link, name, options }: LinkData, index) => (
        <a
          className={styles.socialLink}
          href={link}
          key={`social-item-${index}`}
          {...options}
        >
          <span className={styles.socialLinkTitle}>{name}</span>
          <DotName>
            <Icon aria-hidden className={styles.socialIcon} />
          </DotName>
        </a>
      ))}
    </div>
  </footer>
)
