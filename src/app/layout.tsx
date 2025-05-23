import { APP_DATA } from 'constant'
import { Inter } from 'next/font/google'

import type { Metadata } from 'next'

import './globals.css'

const inter = Inter({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-sans',
})

const { description, name, title } = APP_DATA

export const metadata: Metadata = {
  description,
  title: `${name} | ${title}`,
}

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang='en'>
    <body className={`${inter.variable}`}>{children}</body>
  </html>
)

export default RootLayout
