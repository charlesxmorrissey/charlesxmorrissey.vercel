import Link from 'next/link'

import type { AppData } from 'types'

import styles from './Header.module.css'

interface HeaderProps {
  description: AppData['description']
  homeHref?: string
  name: AppData['name']
}

export const Header = ({ description, homeHref, name }: HeaderProps) => (
  <header className={styles.header}>
    <h1 className={styles.headerTitle}>
      {homeHref ? <Link href={homeHref}>{name}</Link> : name}
    </h1>
    <p className={styles.headerText}>{description}</p>
  </header>
)
