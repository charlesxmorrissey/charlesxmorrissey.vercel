import type { AppProps } from 'next/app'

import 'styles/app.css'

const App = ({ Component, pageProps }: AppProps) => <Component {...pageProps} />

export default App
