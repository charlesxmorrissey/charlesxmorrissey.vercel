import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { PostItem } from '../'

const META = {
  date: '2026-05-20',
  formattedDate: 'May 20, 2026',
  slug: 'smooth-css',
  title: 'Smooth CSS',
}

describe('PostItem', () => {
  it('renders the title and formatted date', () => {
    render(
      <PostItem {...META}>
        <p>body</p>
      </PostItem>,
    )

    expect(screen.getByText('Smooth CSS')).toBeInTheDocument()
    expect(screen.getByText('May 20, 2026')).toBeInTheDocument()
  })

  it('is collapsed by default and toggles open on click', async () => {
    const user = userEvent.setup()

    render(
      <PostItem {...META}>
        <p>body</p>
      </PostItem>,
    )

    const button = screen.getByRole('button', { name: /smooth css/i })

    expect(button).toHaveAttribute('aria-expanded', 'false')

    await user.click(button)

    expect(button).toHaveAttribute('aria-expanded', 'true')
  })

  it('starts open when the URL hash matches its slug', () => {
    window.location.hash = '#smooth-css'

    render(
      <PostItem {...META}>
        <p>body</p>
      </PostItem>,
    )

    expect(screen.getByRole('button', { name: /smooth css/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    )

    window.location.hash = ''
  })
})
