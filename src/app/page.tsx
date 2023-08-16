'use client'

import { useEffect, useRef } from 'react'

import { Social } from 'components/Social'
import { APP_DATA, SOCIAL_DATA } from 'constant'
import { setBackgroundStyles } from 'utils'

const { description, name } = APP_DATA

const Home = () => {
  const backgroundRef = useRef<HTMLElement>(null)

  useEffect(() => setBackgroundStyles(backgroundRef.current), [])

  return (
    <main
      className='animate-bg-init flex flex-col min-h-screen p-6 md:px-8'
      ref={backgroundRef}
    >
      <header className='max-w-lg'>
        <h1 className='font-semibold text-3xl md:text-5xl tracking-tighter md:tracking-tight mb-3 md:mb-4'>
          {name}
        </h1>

        <p className='text-lg md:text-2xl leading-6 tracking-tight mb-3 md:mb-5'>
          {description}
        </p>
      </header>

      <h2 className='font-semibold'>Get in touch</h2>

      <Social data={SOCIAL_DATA} />
    </main>
  )
}

export default Home
