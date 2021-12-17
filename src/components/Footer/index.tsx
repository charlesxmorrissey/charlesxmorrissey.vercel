import { LinkData, footerData } from 'constant'

import styles from './Footer.module.css'

const Footer: React.FC = () => (
  <footer className={styles.pageFooter}>
    {footerData.map(({ Icon, link, name, options }: LinkData, index) => (
      <a
        className={styles.pageFooterLink}
        href={link}
        key={`footer-item-${index}`}
        {...options}
      >
        <span className={styles.pageFooterLabel}>{name}</span>

        <Icon aria-hidden className={styles.pageFooterIcon} />
      </a>
    ))}
  </footer>
)

export default Footer
