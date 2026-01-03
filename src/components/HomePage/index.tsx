'use client'

import { useLayoutEffect, useRef } from 'react'
import { Header } from 'components/Header'
import { Social } from 'components/Social'
import { APP_DATA, SOCIAL_DATA } from 'constant'
import { setBackgroundStyles } from 'utils'

import styles from './HomePage.module.css'

export const HomePage = () => {
  const backgroundElemRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    setBackgroundStyles(backgroundElemRef.current)
  }, [])

  return (
    <main className={styles.wrapper} ref={backgroundElemRef}>
      <article className={styles.content}>
        <Header {...APP_DATA} />
        <Social data={SOCIAL_DATA} />
      </article>
    </main>
  )
}
