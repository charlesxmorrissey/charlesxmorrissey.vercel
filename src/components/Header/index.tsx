import { DotName } from 'components'

import type { AppData } from 'types'

import styles from './Header.module.css'

interface HeaderProps {
  description: AppData['description']
  name: AppData['name']
}

export const Header = ({ description, name }: HeaderProps) => (
  <header className={styles.header}>
    <h1 className={styles.headerTitle}>
      <DotName text={name} variant='block' />
    </h1>
    <p className={styles.headerText}>
      <DotName text={description} />
    </p>
  </header>
)
