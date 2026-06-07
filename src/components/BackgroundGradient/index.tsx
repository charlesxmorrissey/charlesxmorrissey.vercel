'use client'

import { setBackgroundStyles } from 'utils'

import type { ReactNode } from 'react'

import styles from './BackgroundGradient.module.css'

interface BackgroundGradientProps {
  children: ReactNode
}

export const BackgroundGradient = ({ children }: BackgroundGradientProps) => {
  const backgroundRef = (element: HTMLElement | null) => {
    if (element) {
      setBackgroundStyles(element)
    }
  }

  return (
    <main className={styles.wrapper} ref={backgroundRef}>
      {children}
    </main>
  )
}
