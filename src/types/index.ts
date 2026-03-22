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
