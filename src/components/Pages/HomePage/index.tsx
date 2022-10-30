import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useRef } from 'react'

import { siteData } from 'constant'
import { setBackgroundStyles } from 'utils'

import Footer from 'components/Footer'
import Header from 'components/Header'

import styles from './Home.module.css'

const { description, name, title } = siteData

const HomePage: NextPage = () => {
  const backgroundRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setBackgroundStyles(backgroundRef.current)
  }, [])

  return (
    <>
      <Head>
        <title>{`${name} | ${title}`}</title>
        <meta content='width=device-width,initial-scale=1.0' name='viewport' />
        <meta content={description} name='description' />
        <link href='/images/favicon.ico' rel='icon' />
      </Head>

      <main className={styles.pageContainer} ref={backgroundRef}>
        <Header description={description} name={name} />
        <Footer />
      </main>
    </>
  )
}

export default HomePage
