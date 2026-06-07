export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  description,
  name,
  "socialLinks": socialLinks[]{label, platform, url},
  title
}`
