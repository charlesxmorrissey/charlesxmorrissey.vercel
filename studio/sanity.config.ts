import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { schemaTypes } from './schemaTypes'
import { structure } from './structure'

export default defineConfig({
  dataset: 'production',
  name: 'default',
  plugins: [structureTool({ structure }), visionTool()],
  projectId: 'l11hx0kp',
  schema: { types: schemaTypes },
  title: 'charlesxmorrissey-site',
})
