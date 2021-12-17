import type { AppProps } from 'next/app'

import 'styles/globals.css'

const App = ({ Component, pageProps }: AppProps): React.ReactNode => (
  <Component {...pageProps} />
)

export default App
