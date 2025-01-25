import type { AppData } from 'types'

interface HeaderProps {
  description: AppData['description']
  name: AppData['name']
}

export const Header = ({ description, name }: HeaderProps) => (
  <header className='max-w-lg'>
    <h1 className='mb-3 text-3xl font-semibold tracking-tighter md:mb-4 md:text-5xl md:tracking-tight'>
      {name}
    </h1>

    <p className='mb-3 text-lg tracking-tight md:mb-5 md:text-2xl'>
      {description}
    </p>
  </header>
)
