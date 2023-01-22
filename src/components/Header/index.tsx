import styles from './Header.module.css'

interface Props {
  description: string
  name: string
}

const Header = ({ description, name }: Props): JSX.Element => (
  <header className={styles.header}>
    <h1 className={styles.headerTitle}>{name}</h1>
    <p className={styles.headerBody}>{description}</p>
  </header>
)

export default Header
