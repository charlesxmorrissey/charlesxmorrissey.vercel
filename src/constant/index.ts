import EmailIcon from 'assets/icons/email.svg'
import GithubIcon from 'assets/icons/github.svg'
import LinkedInIcon from 'assets/icons/linkedin.svg'

import type { AppData, LinkData } from 'types'

export const APP_DATA: AppData = {
  description:
    "I'm passionate about building user-facing web products and overcoming technical hurdles to ensure their success.",
  name: 'Charles X. Morrissey',
  title: 'Senior Frontend Engineer',
}

export const SOCIAL_DATA: LinkData[] = [
  {
    Icon: GithubIcon,
    link: 'https://github.com/charlesxmorrissey',
    name: 'Github',
  },
  {
    Icon: LinkedInIcon,
    link: 'https://www.linkedin.com/in/charles-x-morrissey-b366976',
    name: 'LinkedIn',
  },
  {
    Icon: EmailIcon,
    link: `mailto:hi@charles-x.com?subject=${encodeURIComponent(
      'hello from website',
    )}`,
    name: 'Email',
    options: {
      rel: 'noreferrer',
      target: '_blank',
    },
  },
]
