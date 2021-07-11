import EmailIcon from 'images/email.svg'
import GithubIcon from 'images/github.svg'
import LinkedInIcon from 'images/linkedin.svg'

type SVGIcon = keyof JSX.IntrinsicElements

interface LinkData {
  icon: SVGIcon
  link: string
  name: string
  options?: {
    rel: string
    target: string
  }
}

export const footerData: LinkData[] = [
  {
    icon: EmailIcon as SVGIcon,
    link: 'mailto:hi@charles-x.com?subject=hello%20from%20website',
    name: 'Email',
    options: {
      rel: 'noreferrer',
      target: '_blank',
    },
  },
  {
    icon: GithubIcon as SVGIcon,
    link: 'https://www.linkedin.com/in/charles-x-morrissey-b366976',
    name: 'LinkedIn',
  },
  {
    icon: LinkedInIcon as SVGIcon,
    link: 'https://github.com/charlesxmorrissey',
    name: 'Github',
  },
]

export const siteData = {
  name: 'Charles X. Morrissey',
  title: 'Senior Front End Engineer',
  description:
    'I build accessible web applications using technologies like Vue, React, Node, ES6, Webpack, and more.',
}
