import { writeFileSync } from 'node:fs'

const SITE_URL = 'https://cineworkflo.com'
const OUTPUT_PATH = 'public/sitemap.xml'
const TODAY = new Date().toISOString().split('T')[0]

const routes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/prompts', changefreq: 'weekly', priority: '0.9' },
  { path: '/shot-to-prompt', changefreq: 'weekly', priority: '0.9' },
  { path: '/camera-moves', changefreq: 'monthly', priority: '0.8' },
  { path: '/pricing', changefreq: 'weekly', priority: '0.8' },
  { path: '/about', changefreq: 'monthly', priority: '0.6' },
  { path: '/contact', changefreq: 'monthly', priority: '0.6' },
  { path: '/prompts/product-ads', changefreq: 'weekly', priority: '0.7' },
  { path: '/prompts/short-form-social', changefreq: 'weekly', priority: '0.7' },
  { path: '/prompts/cinematic-storytelling', changefreq: 'weekly', priority: '0.7' },
  { path: '/prompts/world-building', changefreq: 'weekly', priority: '0.7' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.4' },
  { path: '/terms', changefreq: 'yearly', priority: '0.4' },
  { path: '/modern-moves', changefreq: 'monthly', priority: '0.5' }
]

const urls = routes
  .map(
    ({ path, changefreq, priority }) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

writeFileSync(OUTPUT_PATH, xml, 'utf8')
console.log(`Sitemap generated: ${OUTPUT_PATH} (${routes.length} URLs)`)
