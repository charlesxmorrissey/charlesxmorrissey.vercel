'use client'

import { useCallback } from 'react'
import { Header } from 'components/Header'
import { Social } from 'components/Social'
import { APP_DATA, SOCIAL_DATA } from 'constant'
import { setBackgroundStyles } from 'utils'

import styles from './HomePage.module.css'

export const HomePage = () => {
  const backgroundRef = useCallback((element: HTMLElement | null) => {
    if (element) {
      setBackgroundStyles(element)
    }
  }, [])

  return (
    <main className={styles.wrapper} ref={backgroundRef}>
      <article className={styles.content}>
        <Header {...APP_DATA} />
        <Social data={SOCIAL_DATA} />
      </article>
    </main>
  )
}
