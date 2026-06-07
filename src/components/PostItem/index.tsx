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
  excerpt,
  formattedDate,
  slug,
  title,
}: PostItemProps) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (window.location.hash === `#${slug}`) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(true)
    }
  }, [slug])

  return (
    <article className={`${styles.post} ${open ? styles.open : ''}`} id={slug}>
      <div className={styles.head}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.date}>{formattedDate}</span>
      </div>

      {excerpt ? <p className={styles.summary}>{excerpt}</p> : null}

      <button
        aria-controls={`${slug}-content`}
        aria-expanded={open}
        className={styles.toggle}
        onClick={() => setOpen((value) => !value)}
        type='button'
      >
        {open ? 'View less' : 'View more'}
        <span aria-hidden className={styles.chevron}>
          ›
        </span>
      </button>

      <div className={styles.body} id={`${slug}-content`}>
        <div className={styles.bodyInner}>{children}</div>
      </div>
    </article>
  )
}
