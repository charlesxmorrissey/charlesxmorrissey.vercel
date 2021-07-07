import PropTypes from 'prop-types'

import styles from './Header.module.css'

const Header = ({ description, name }) => (
  <header className={styles.pageHeader}>
    <h1 className={styles.pageHeaderTitle}>{name}</h1>
    <p className={styles.pageHeaderBody}>{description}</p>
  </header>
)

Header.propTypes = {
  description: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}

export default Header
