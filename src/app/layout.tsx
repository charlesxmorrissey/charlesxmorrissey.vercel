import { SpeedInsights } from '@vercel/speed-insights/next'
import { Inter } from 'next/font/google'
import { getSiteContent } from 'sanity'

import type { Metadata } from 'next'

import './globals.css'

const inter = Inter({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-sans',
})

export const generateMetadata = async (): Promise<Metadata> => {
  const { description, name, title } = await getSiteContent()

  return {
    description,
    title: `${name} | ${title}`,
  }
}

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang='en'>
    <body className={`${inter.variable}`}>
      {children}

      <SpeedInsights />
    </body>
  </html>
)

export default RootLayout
