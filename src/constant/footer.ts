import { JSXElementConstructor, SVGProps } from 'react'

import EmailIcon from 'images/email.svg'
import GithubIcon from 'images/github.svg'
import LinkedInIcon from 'images/linkedin.svg'

export interface LinkData {
  Icon: JSXElementConstructor<SVGProps<SVGElement>>
  link: string
  name: string
  options?: {
    rel?: string
    target?: string
  }
}

export const footerData: LinkData[] = [
  {
    Icon: EmailIcon,
    link: 'mailto:hi@charles-x.com?subject=hello%20from%20website',
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
