import { render } from '@testing-library/react'

interface ProviderProps {
  children: React.ReactElement
}

// Add in any providers here if necessary:
// (ReduxProvider, ThemeProvider, etc)
const Providers = ({ children }: ProviderProps): React.ReactElement => {
  return children
}

const customRender = (ui, options = {}) =>
  render(ui, { wrapper: Providers, ...options })

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { customRender as render }
