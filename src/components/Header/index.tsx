import styles from './Header.module.css'

interface Props {
  description: string
  name: string
}

const Header: React.FC<Props> = ({ description, name }) => (
  <header className={styles.pageHeader}>
    <h1 className={styles.pageHeaderTitle}>{name}</h1>
    <p className={styles.pageHeaderBody}>{description}</p>
  </header>
)

export default Header
