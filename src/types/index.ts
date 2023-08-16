import { JSXElementConstructor, SVGProps } from 'react'

export interface AppData {
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
