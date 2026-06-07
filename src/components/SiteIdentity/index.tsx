import { Header, Social } from 'components'
import { SOCIAL_ICONS, SOCIAL_LINK_OPTIONS } from 'constant'

import type { LinkData, SiteContent } from 'types'

type SiteIdentityProps = Pick<
  SiteContent,
  'description' | 'name' | 'socialLinks'
>

export const SiteIdentity = ({
  description,
  name,
  socialLinks,
}: SiteIdentityProps) => {
  const data: LinkData[] = socialLinks.map(({ label, platform, url }) => ({
    Icon: SOCIAL_ICONS[platform],
    link: url,
    name: label,
    options: SOCIAL_LINK_OPTIONS[platform],
  }))

  return (
    <>
      <Header description={description} name={name} />
      <Social data={data} />
    </>
  )
}
