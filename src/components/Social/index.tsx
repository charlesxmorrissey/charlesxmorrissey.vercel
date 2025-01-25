import type { LinkData } from 'types'

interface SocialProps {
  data: LinkData[]
}

export const Social = ({ data }: SocialProps) => (
  <>
    <h2 className='font-semibold'>Get in touch</h2>

    <div className='ml-[-0.5rem] flex items-center md:gap-1'>
      {data.map(({ Icon, link, name, options }: LinkData, index) => (
        <a
          className='rounded-md p-2 transition-[box-shadow,color] hover:text-slate-700 focus:ring-1 focus:ring-slate-50/50'
          href={link}
          key={`social-item-${index}`}
          {...options}
        >
          <span className='sr-only'>{name}</span>

          <Icon aria-hidden className='h-6 w-6 shrink-0 fill-current' />
        </a>
      ))}
    </div>
  </>
)
