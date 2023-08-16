import { JSXElementConstructor, SVGProps } from 'react'

import EmailIcon from 'assets/icons/email.svg'
import GithubIcon from 'assets/icons/github.svg'
import LinkedInIcon from 'assets/icons/linkedin.svg'

interface AppData {
  description: string
  name: string
  title: string
}

interface LinkDataAttributes {
  rel?: string
  target?: string
}

export interface LinkData {
  Icon: JSXElementConstructor<SVGProps<SVGElement>>
  link: string
  name: string
  options?: LinkDataAttributes
}

export const appData: AppData = {
  description:
    "I'm passionate about building user-facing web products and overcoming technical hurdles to ensure their success.",
  name: 'Charles X. Morrissey',
  title: 'Senior Frontend Engineer',
}

export const socialData: LinkData[] = [
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
]
