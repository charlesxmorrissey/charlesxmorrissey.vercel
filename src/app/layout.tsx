import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { appData } from 'constant'

import './globals.css'

const inter = Inter({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-inter',
})

const { description, name, title } = appData

export const metadata: Metadata = {
  description,
  title: `${name} | ${title}`,
}

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang='en'>
    <body className={`${inter.variable} antialiased`}>{children}</body>
  </html>
)

export default RootLayout
