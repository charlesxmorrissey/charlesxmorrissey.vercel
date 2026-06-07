'use client'

import { useEffect, useState } from 'react'

import type { ReactNode } from 'react'
import type { PostMeta } from 'types'

import styles from './PostItem.module.css'

interface PostItemProps extends PostMeta {
  children: ReactNode
}

export const PostItem = ({
  children,
  formattedDate,
  slug,
  title,
}: PostItemProps) => {
  const [open, setOpen] = useState(false)

  // The URL hash is browser-only and absent during static prerender, so we
  // open from it AFTER mount to avoid a hydration mismatch on deep-linked
  // loads. setState-in-effect is the correct pattern for syncing with a
  // browser-only API here.
  useEffect(() => {
    if (window.location.hash === `#${slug}`) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(true)
    }
  }, [slug])

  return (
    <div className={`${styles.post} ${open ? styles.open : ''}`} id={slug}>
      <button
        aria-expanded={open}
        className={styles.head}
        onClick={() => setOpen((value) => !value)}
        type='button'
      >
        <span className={styles.title}>
          <span aria-hidden className={styles.chevron}>
            ›
          </span>{' '}
          {title}
        </span>
        <span className={styles.date}>{formattedDate}</span>
      </button>

      <div className={styles.body}>
        <div className={styles.bodyInner}>{children}</div>
      </div>
    </div>
  )
}
