import Head from 'next/head'
import { useEffect, useRef } from 'react'

import { setBackground, siteData } from 'utils'

import Footer from 'components/Footer'
import Header from 'components/Header'

import styles from 'styles/Home.module.css'

const Home = () => {
  const { description, name, title } = siteData
  const bgEl = useRef(null)

  useEffect(() => {
    setBackground(bgEl.current)
  }, [])

  return (
    <>
      <Head>
        <title>{`${name} | ${title}`}</title>
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.pageContainer} ref={bgEl}>
        <Header name={name} description={description} />

        <Footer />
      </main>
    </>
  )
}

export default Home
