import Head from 'next/head'
import { useEffect, useRef } from 'react'

import { siteData } from 'constant'
import { setBackground } from 'utils'

import Footer from 'components/Footer'
import Header from 'components/Header'

import styles from 'styles/Home.module.css'

const Home: React.FC = () => {
  const { description, name, title } = siteData
  const bgRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setBackground(bgRef.current)
  }, [])

  return (
    <>
      <Head>
        <title>{`${name} | ${title}`}</title>
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.pageContainer} ref={bgRef}>
        <Header name={name} description={description} />
        <Footer />
      </main>
    </>
  )
}

export default Home
