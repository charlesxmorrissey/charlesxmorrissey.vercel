'use client'

import type { ReactNode } from 'react'

import styles from './DotName.module.css'
import { mountDotType } from './dotType'

interface DotNameProps {
  children?: ReactNode
  text?: string
  variant?: 'block' | 'dots'
}

/* SPIKE: throwaway. The span keeps the real text for assistive technology. */
export const DotName = ({ children, text, variant = 'dots' }: DotNameProps) => {
  const rootRef = (element: HTMLSpanElement) => mountDotType(element)

  return (
    <span className={styles.root} data-variant={variant} ref={rootRef}>
      <span className={styles.text}>{children ?? text}</span>
      <canvas aria-hidden='true' className={styles.canvas} />
    </span>
  )
}
