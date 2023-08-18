import type { AppData } from 'types'

interface HeaderProps {
  description: AppData['description']
  name: AppData['name']
}

export const Header = ({ description, name }: HeaderProps) => (
  <header className='max-w-lg'>
    <h1 className='font-semibold text-3xl md:text-5xl tracking-tighter md:tracking-tight mb-3 md:mb-4'>
      {name}
    </h1>

    <p className='text-lg md:text-2xl leading-6 tracking-tight mb-3 md:mb-5'>
      {description}
    </p>
  </header>
)
