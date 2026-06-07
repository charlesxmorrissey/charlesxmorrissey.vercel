import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export const isConfigured = Boolean(projectId)

export const client = createClient({
  apiVersion: '2024-10-01',
  dataset,
  projectId: projectId ?? 'placeholder',
  useCdn: false,
})
