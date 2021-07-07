import { LinkData, footerData } from 'constant'

import styles from './Footer.module.css'

const Footer: React.FC = () => (
  <footer className={styles.footer}>
    {footerData.map(({ Icon, link, name, options }: LinkData, index) => (
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
