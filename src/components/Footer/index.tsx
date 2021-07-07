import EmailIcon from 'images/email.svg'
import GithubIcon from 'images/github.svg'
import LinkedInIcon from 'images/linkedin.svg'

import styles from './Footer.module.css'

const footerData = [
  {
    icon: EmailIcon as keyof JSX.IntrinsicElements,
    link: 'mailto:hi@charles-x.com?subject=hello%20from%20website',
    options: {
      rel: 'noreferrer',
      target: '_blank',
    },
    name: 'Email',
  },
  {
    icon: GithubIcon as keyof JSX.IntrinsicElements,
    link: 'https://www.linkedin.com/in/charles-x-morrissey-b366976',
    name: 'LinkedIn',
  },
  {
    icon: LinkedInIcon as keyof JSX.IntrinsicElements,
    link: 'https://github.com/charlesxmorrissey',
    name: 'Github',
  },
]

const Footer = () => (
  <footer className={styles.pageFooter}>
    {footerData.map((data, i) => {
      const { icon: Icon, link, name, options } = data

      return (
        <a
          className={styles.pageFooterLink}
          href={link}
          key={`footer-item-${i}`}
          {...options}>
          <span className={styles.pageFooterLabel}>{name}</span>

          <Icon aria-hidden className={styles.pageFooterIcon} />
        </a>
      )
    })}
  </footer>
)

export default Footer
