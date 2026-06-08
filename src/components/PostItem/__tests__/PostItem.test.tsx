import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { PostItem } from '../'

const META = {
  date: '2026-05-20',
  excerpt: 'A short summary of the post.',
  formattedDate: 'May 20, 2026',
  slug: 'smooth-css',
  title: 'Smooth CSS',
}

describe('PostItem', () => {
  it('renders the title, date, and summary', () => {
    render(
      <PostItem {...META}>
        <p>full body</p>
      </PostItem>,
    )

    expect(screen.getByText('Smooth CSS')).toBeInTheDocument()
    expect(screen.getByText('May 20, 2026')).toBeInTheDocument()
    expect(screen.getByText('A short summary of the post.')).toBeInTheDocument()
  })

  it('omits the summary when there is no excerpt', () => {
    const noExcerpt = {
      date: META.date,
      formattedDate: META.formattedDate,
      slug: META.slug,
      title: META.title,
    }

    render(
      <PostItem {...noExcerpt}>
        <p>full body</p>
      </PostItem>,
    )

    expect(
      screen.queryByText('A short summary of the post.'),
    ).not.toBeInTheDocument()
  })

  it('expands the full content via View more / View less', async () => {
    const user = userEvent.setup()

    render(
      <PostItem {...META}>
        <p>full body</p>
      </PostItem>,
    )

    const button = screen.getByRole('button', { name: /view more/i })

    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAttribute('aria-controls', 'smooth-css-content')

    await user.click(button)

    expect(screen.getByRole('button', { name: /view less/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('starts open when the URL hash matches its slug', () => {
    window.location.hash = '#smooth-css'

    render(
      <PostItem {...META}>
        <p>full body</p>
      </PostItem>,
    )

    expect(screen.getByRole('button', { name: /view less/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    )

    window.location.hash = ''
  })

  it('starts open when defaultOpen is set', () => {
    render(
      <PostItem {...META} defaultOpen>
        <p>full body</p>
      </PostItem>,
    )

    expect(screen.getByRole('button', { name: /view less/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })
})
