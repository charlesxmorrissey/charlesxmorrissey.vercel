import PropTypes, { InferProps } from 'prop-types'

import styles from './Header.module.css'

const propTypes = {
  description: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}

const Header = ({ description, name }: InferProps<typeof propTypes>) => (
  <header className={styles.pageHeader}>
    <h1 className={styles.pageHeaderTitle}>{name}</h1>
    <p className={styles.pageHeaderBody}>{description}</p>
  </header>
)

Header.propTypes = propTypes

export default Header
