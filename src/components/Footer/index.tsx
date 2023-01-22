import { LinkData, socialData } from 'constant'

import styles from './Footer.module.css'

const Footer = (): JSX.Element => (
  <footer className={styles.footer}>
    {socialData.map(({ Icon, link, name, options }: LinkData, index) => (
      <a
        className={styles.footerLink}
        href={link}
        key={`footer-item-${index}`}
        {...options}
      >
        <span className={styles.footerLabel}>{name}</span>

        <Icon aria-hidden className={styles.footerIcon} />
      </a>
    ))}
  </footer>
)

export default Footer
