import EmailIcon from 'assets/icons/email.svg'
import GithubIcon from 'assets/icons/github.svg'
import LinkedInIcon from 'assets/icons/linkedin.svg'

import type { ComponentPropsWithoutRef, ComponentType, SVGProps } from 'react'
import type { AppData, LinkData, Platform, SiteContent } from 'types'

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

export const SOCIAL_ICONS: Record<
  Platform,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  email: EmailIcon,
  github: GithubIcon,
  linkedin: LinkedInIcon,
}

export const SOCIAL_LINK_OPTIONS: Partial<
  Record<Platform, ComponentPropsWithoutRef<'a'>>
> = {
  email: {
    rel: 'noreferrer',
    target: '_blank',
  },
}

export const FALLBACK_CONTENT: SiteContent = {
  description: APP_DATA.description,
  name: APP_DATA.name,
  socialLinks: [
    {
      label: 'Github',
      platform: 'github',
      url: 'https://github.com/charlesxmorrissey',
    },
    {
      label: 'LinkedIn',
      platform: 'linkedin',
      url: 'https://www.linkedin.com/in/charles-x-morrissey-b366976',
    },
    {
      label: 'Email',
      platform: 'email',
      url: 'mailto:hi@charles-x.com?subject=hello%20from%20website',
    },
  ],
  title: APP_DATA.title,
}
