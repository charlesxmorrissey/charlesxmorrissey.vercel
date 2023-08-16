import type { LinkData } from 'types'

interface SocialProps {
  data: LinkData[]
}

export const Social = ({ data }: SocialProps) => (
  <div className='flex items-center ml-[-0.5rem] md:gap-1'>
    {data.map(({ Icon, link, name, options }: LinkData, index) => (
      <a
        className='p-2 hover:text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-50/50 transition-[box-shadow,color] rounded-md'
        href={link}
        key={`social-item-${index}`}
        {...options}
      >
        <span className='sr-only'>{name}</span>

        <Icon aria-hidden className='w-6 h-6 fill-current shrink-0' />
      </a>
    ))}
  </div>
)
