import type { AppData } from 'types'

import styles from './Header.module.css'

interface HeaderProps {
  description: AppData['description']
  name: AppData['name']
}

export const Header = ({ description, name }: HeaderProps) => (
  <header className={styles.header}>
    <h1 className={styles.headerTitle}>{name}</h1>

    <p className={styles.headerText}>{description}</p>
  </header>
)
