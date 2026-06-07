import { FALLBACK_CONTENT } from 'constant'

import { getSiteContent } from '../getSiteContent'

const { fetchMock, state } = vi.hoisted(() => ({
  fetchMock: vi.fn(),
  state: { isConfigured: true },
}))

vi.mock('../client', () => ({
  client: { fetch: fetchMock },
  get isConfigured() {
    return state.isConfigured
  },
}))

describe('getSiteContent', () => {
  afterEach(() => {
    fetchMock.mockReset()
    state.isConfigured = true
  })

  it('returns mapped content when the query resolves a document', async () => {
    fetchMock.mockResolvedValue({
      description: 'desc',
      name: 'Ada Lovelace',
      socialLinks: [{ label: 'GH', platform: 'github', url: 'https://gh' }],
      title: 'Engineer',
    })

    const content = await getSiteContent()

    expect(content.name).toBe('Ada Lovelace')
    expect(content.socialLinks).toHaveLength(1)
  })

  it('drops social links with unknown platforms', async () => {
    fetchMock.mockResolvedValue({
      description: 'desc',
      name: 'Ada Lovelace',
      socialLinks: [
        { label: 'GH', platform: 'github', url: 'https://gh' },
        { label: 'X', platform: 'twitter', url: 'https://x' },
      ],
      title: 'Engineer',
    })

    const content = await getSiteContent()

    expect(content.socialLinks).toHaveLength(1)
    expect(content.socialLinks[0].platform).toBe('github')
  })

  it('coalesces missing description and title to the fallback', async () => {
    fetchMock.mockResolvedValue({
      description: null,
      name: 'Ada Lovelace',
      socialLinks: [],
      title: null,
    })

    const content = await getSiteContent()

    expect(content.description).toBe(FALLBACK_CONTENT.description)
    expect(content.title).toBe(FALLBACK_CONTENT.title)
  })

  it('falls back when the query resolves null', async () => {
    fetchMock.mockResolvedValue(null)

    expect(await getSiteContent()).toEqual(FALLBACK_CONTENT)
  })

  it('falls back when the fetch throws', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    fetchMock.mockRejectedValue(new Error('network'))

    expect(await getSiteContent()).toEqual(FALLBACK_CONTENT)
    expect(warn).toHaveBeenCalled()

    warn.mockRestore()
  })

  it('returns fallback without fetching when not configured', async () => {
    state.isConfigured = false

    expect(await getSiteContent()).toEqual(FALLBACK_CONTENT)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
