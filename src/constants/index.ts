import EmailIcon from 'images/email.svg'
import GithubIcon from 'images/github.svg'
import LinkedInIcon from 'images/linkedin.svg'

export const footerData = [
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

export const siteData = {
  name: 'Charles X. Morrissey',
  title: 'Senior Front End Engineer',
  description:
    'I build accessible web applications using technologies like Vue, React, Node, ES6, Webpack, and more.',
}
