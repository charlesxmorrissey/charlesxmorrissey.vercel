import type { ComponentPropsWithoutRef, ComponentType, SVGProps } from 'react'

export type AppData = Omit<SiteContent, 'socialLinks'>

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

export interface PostMeta {
  date: string
  formattedDate: string
  slug: string
  title: string
}

export interface Post extends PostMeta {
  body: string
}
