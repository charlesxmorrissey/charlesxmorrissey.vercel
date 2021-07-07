import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useRef } from 'react'

import { siteData } from 'constant'
import { setBackground } from 'utils'

import Footer from 'components/Footer'
import Header from 'components/Header'

import styles from 'styles/Home.module.css'

const { description, name, title } = siteData

const Home: NextPage = () => {
  const bgRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setBackground(bgRef.current)
  }, [])

  return (
    <>
      <Head>
        <title>{`${name} | ${title}`}</title>
        <meta content='width=device-width,initial-scale=1.0' name='viewport' />
        <meta content={description} name='description' />
        <link href='/images/favicon.ico' rel='icon' />
      </Head>

      <main className={styles.pageContainer} ref={bgRef}>
        <Header description={description} name={name} />
        <Footer />
      </main>
    </>
  )
}

export default Home
