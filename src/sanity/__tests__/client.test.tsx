const createClientMock = vi.fn()

vi.mock('@sanity/client', () => ({
  createClient: (config: unknown) => createClientMock(config),
}))

describe('sanity client', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
    createClientMock.mockClear()
    vi.resetModules()
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('is not configured when no project id is set', async () => {
    delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    vi.resetModules()

    const { isConfigured } = await import('../client')

    expect(isConfigured).toBe(false)
  })

  it('is configured when a project id is set', async () => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'abc123'
    vi.resetModules()

    const { isConfigured } = await import('../client')

    expect(isConfigured).toBe(true)
  })

  it('creates the client with useCdn:false and the production dataset by default', async () => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'abc123'
    delete process.env.NEXT_PUBLIC_SANITY_DATASET
    vi.resetModules()

    await import('../client')

    expect(createClientMock).toHaveBeenCalledWith(
      expect.objectContaining({
        dataset: 'production',
        projectId: 'abc123',
        useCdn: false,
      }),
    )
  })

  it('uses the configured dataset when provided', async () => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'abc123'
    process.env.NEXT_PUBLIC_SANITY_DATASET = 'staging'
    vi.resetModules()

    await import('../client')

    expect(createClientMock).toHaveBeenCalledWith(
      expect.objectContaining({ dataset: 'staging' }),
    )
  })
})
