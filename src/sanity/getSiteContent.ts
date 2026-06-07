import { FALLBACK_CONTENT, SOCIAL_ICONS } from 'constant'

import type { SiteContent } from 'types'

import { client, isConfigured } from './client'
import { siteSettingsQuery } from './queries'

export const getSiteContent = async (): Promise<SiteContent> => {
  if (!isConfigured) {
    return FALLBACK_CONTENT
  }

  try {
    // Use a finite `revalidate` rather than `cache: 'no-store'`: no-store
    // forces dynamic rendering, which is incompatible with `output: 'export'`.
    // A finite value keeps the route static while busting Next's persistent
    // build-time fetch cache, so each rebuild picks up fresh CMS content.
    const result = await client.fetch<SiteContent | null>(
      siteSettingsQuery,
      {},
      { next: { revalidate: 1 } },
    )

    if (!result?.name) {
      return FALLBACK_CONTENT
    }

    return {
      description: result.description ?? FALLBACK_CONTENT.description,
      name: result.name,
      socialLinks: (result.socialLinks ?? []).filter(
        ({ platform }) => platform in SOCIAL_ICONS,
      ),
      title: result.title ?? FALLBACK_CONTENT.title,
    }
  } catch (error) {
    console.warn(
      'Failed to fetch site content from Sanity; using fallback content.',
      error,
    )

    return FALLBACK_CONTENT
  }
}
