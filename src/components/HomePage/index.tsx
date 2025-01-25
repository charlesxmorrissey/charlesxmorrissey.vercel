'use client'

import { useLayoutEffect, useRef } from 'react'
import { Header } from 'components/Header'
import { Social } from 'components/Social'
import { APP_DATA, SOCIAL_DATA } from 'constant'
import { setBackgroundStyles } from 'utils'

export const HomePage = () => {
  const backgroundElemRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    setBackgroundStyles(backgroundElemRef.current)
  }, [])

  return (
    <main
      className='animate-bg-init flex min-h-full flex-col p-6 md:px-8'
      ref={backgroundElemRef}
    >
      <Header {...APP_DATA} />
      <Social data={SOCIAL_DATA} />
    </main>
  )
}
