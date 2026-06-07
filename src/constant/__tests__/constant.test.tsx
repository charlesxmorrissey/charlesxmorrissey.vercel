import { FALLBACK_CONTENT, SOCIAL_ICONS, SOCIAL_LINK_OPTIONS } from '../'

describe('constant fallback + maps', () => {
  it('FALLBACK_CONTENT has identity fields and three social links', () => {
    expect(FALLBACK_CONTENT.name).toBe('Charles X. Morrissey')
    expect(FALLBACK_CONTENT.title).toBe('Senior Frontend Engineer')
    expect(FALLBACK_CONTENT.socialLinks).toHaveLength(3)
  })

  it('every fallback link platform has an icon', () => {
    FALLBACK_CONTENT.socialLinks.forEach(({ platform }) => {
      expect(SOCIAL_ICONS[platform]).toBeDefined()
    })
  })

  it('email link opens in a new tab with noreferrer', () => {
    expect(SOCIAL_LINK_OPTIONS.email).toEqual({
      rel: 'noreferrer',
      target: '_blank',
    })
  })
})
