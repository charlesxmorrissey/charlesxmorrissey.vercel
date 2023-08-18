'use client'

import { useEffect, useRef } from 'react'

import { Header } from 'components/Header'
import { Social } from 'components/Social'
import { APP_DATA, SOCIAL_DATA } from 'constant'
import { setBackgroundStyles } from 'utils'

const Home = () => {
  const backgroundRef = useRef<HTMLElement>(null)

  useEffect(() => setBackgroundStyles(backgroundRef.current), [])

  return (
    <main
      className='animate-bg-init flex flex-col min-h-screen p-6 md:px-8'
      ref={backgroundRef}
    >
      <Header {...APP_DATA} />
      <Social data={SOCIAL_DATA} />
    </main>
  )
}

export default Home
