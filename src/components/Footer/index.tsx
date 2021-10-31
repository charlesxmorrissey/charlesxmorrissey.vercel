import { footerData } from 'constant'

import styles from './Footer.module.css'

const Footer = () => (
  <footer className={styles.pageFooter}>
    {footerData.map((data, i) => {
      const { icon: Icon, link, name, options } = data

      return (
        <a
          className={styles.pageFooterLink}
          href={link}
          key={`footer-item-${i}`}
          {...options}
        >
          <span className={styles.pageFooterLabel}>{name}</span>

          <Icon aria-hidden className={styles.pageFooterIcon} />
        </a>
      )
    })}
  </footer>
)

export default Footer
