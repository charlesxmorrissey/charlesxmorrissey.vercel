import { render } from '@testing-library/react'

interface ProviderProps {
  children: React.ReactElement
}

const Providers = ({ children }: ProviderProps): React.ReactElement => children

const customRender = (ui: any, options = {}) =>
  render(ui, { wrapper: Providers, ...options })

export * from '@testing-library/react'

export { customRender }
