import { readFileSync } from 'node:fs'

const checks = []

const read = (path) => readFileSync(path, 'utf8')

const addCheck = (label, condition) => {
  checks.push({ label, pass: Boolean(condition) })
}

const robots = read('public/robots.txt')
const sitemap = read('public/sitemap.xml')
const netlifyToml = read('netlify.toml')
const appJsx = read('src/App.jsx')
const packageJson = JSON.parse(read('package.json'))

addCheck('robots.txt includes sitemap directive', robots.includes('Sitemap: https://cineworkflo.com/sitemap.xml'))
addCheck('sitemap includes /', sitemap.includes('<loc>https://cineworkflo.com/</loc>'))
addCheck('sitemap includes /prompts', sitemap.includes('<loc>https://cineworkflo.com/prompts</loc>'))
addCheck('sitemap includes /shot-to-prompt', sitemap.includes('<loc>https://cineworkflo.com/shot-to-prompt</loc>'))
addCheck('sitemap includes /camera-moves', sitemap.includes('<loc>https://cineworkflo.com/camera-moves</loc>'))

addCheck('netlify build command uses build:seo', netlifyToml.includes('command = "npm run build:seo"'))
addCheck('netlify has /prompts trailing slash redirect', netlifyToml.includes('from = "/prompts/"'))
addCheck('netlify has /shot-to-prompt trailing slash redirect', netlifyToml.includes('from = "/shot-to-prompt/"'))
addCheck('netlify has /camera-moves trailing slash redirect', netlifyToml.includes('from = "/camera-moves/"'))

addCheck('App route metadata has /prompts', appJsx.includes("'/prompts': {"))
addCheck('App route metadata has /shot-to-prompt', appJsx.includes("'/shot-to-prompt': {"))
addCheck('App route metadata has /camera-moves', appJsx.includes("'/camera-moves': {"))
addCheck('App routes include /prompts', appJsx.includes('<Route path="/prompts"'))
addCheck('App routes include /shot-to-prompt', appJsx.includes('<Route path="/shot-to-prompt"'))
addCheck('App routes include /camera-moves', appJsx.includes('<Route path="/camera-moves"'))

addCheck('package scripts include seo:sitemap', Boolean(packageJson.scripts?.['seo:sitemap']))
addCheck('package scripts include prerender:routes', Boolean(packageJson.scripts?.['prerender:routes']))
addCheck('package scripts include build:seo', Boolean(packageJson.scripts?.['build:seo']))

const failed = checks.filter((check) => !check.pass)
checks.forEach((check) => {
  console.log(`${check.pass ? 'PASS' : 'FAIL'} - ${check.label}`)
})

if (failed.length > 0) {
  console.error(`\nPhase 1 verify failed: ${failed.length} check(s) did not pass.`)
  process.exit(1)
}

console.log(`\nPhase 1 verify passed: ${checks.length}/${checks.length} checks.`)
