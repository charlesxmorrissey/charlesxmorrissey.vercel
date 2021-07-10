import { render } from 'test/test-utils'

import IndexPage from 'pages/index'

describe('IndexPage', () => {
  it('should the index page', () => {
    render(<IndexPage />)

    // const heading = screen.getByText(/Main content/i)

    // We can only use toBeInTheDocument because it was imported
    // in the jest.setup.js and configured in jest.config.js
    // expect(heading).toBeInTheDocument()
  })
})
