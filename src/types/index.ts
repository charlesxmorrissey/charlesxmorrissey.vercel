import type { ComponentPropsWithoutRef, ComponentType, SVGProps } from 'react'

export interface AppData {
  description: string
  name: string
  title: string
}

export interface LinkData {
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  link: string
  name: string
  options?: ComponentPropsWithoutRef<'a'>
}

export type Platform = 'email' | 'github' | 'linkedin'

export interface SiteContent {
  description: string
  name: string
  socialLinks: SocialLink[]
  title: string
}

export interface SocialLink {
  label: string
  platform: Platform
  url: string
}
