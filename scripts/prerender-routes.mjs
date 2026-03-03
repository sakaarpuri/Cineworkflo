import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { PROMPT_CATEGORY_SEO_PAGES } from '../src/data/promptCategorySeo.js'

const DIST_DIR = 'dist'
const BASE_FILE = join(DIST_DIR, 'index.html')

const ROUTES = [
  {
    path: '/',
    file: join(DIST_DIR, 'index.html'),
    title: 'CineWorkflo - AI Video Prompts for US, Canada, and UK Creators | Prompt Vault + Tools',
    description: 'Create AI video faster with Prompt Vault, Shot to Prompt, and Camera Moves. Built for filmmakers and creator teams across the US, Canada, and UK.',
    keywords: 'AI video prompts, Runway prompts, Pika prompts, Sora prompts, Meta prompts, AI filmmaking, video generation prompts, camera moves, shot to prompt, US Canada UK',
    fallbackHtml: `
      <main style="padding: 40px; font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1>CineWorkflo — Professional AI Video Prompts for Runway, Pika, Sora & Meta</h1>
        <p><strong>150+ tested prompts for AI video generation.</strong> Stop guessing. Copy, paste, create.</p>
        <p>CineWorkflo is a practical AI-video workflow for filmmakers and creator teams.</p>

        <h2>Core Tools</h2>
        <ul>
          <li><a href="/prompts">Prompt Vault</a> — curated prompts by style and use case</li>
          <li><a href="/shot-to-prompt">Shot to Prompt</a> — image reference to usable prompt</li>
          <li><a href="/camera-moves">Camera Moves</a> — visual guide for motion language in prompts</li>
        </ul>

        <h2>Supported Platforms</h2>
        <p>Runway, Pika, Kling, Luma, Sora, Meta, and similar video generation tools.</p>

        <h2>Key Pages</h2>
        <ul>
          <li><a href="/pricing">Pricing</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/privacy">Privacy</a></li>
          <li><a href="/terms">Terms</a></li>
        </ul>
      </main>
    `
  },
  {
    path: '/prompts',
    file: join(DIST_DIR, 'prompts', 'index.html'),
    title: 'Prompt Vault - AI Video Prompts for US, Canada, and UK Teams | CineWorkflo',
    description: 'Browse AI video prompts with Image Prompt, Video Prompt, and SFX blocks plus variable controls for creator workflows in the US, Canada, and UK.',
    keywords: 'prompt vault, AI video prompts, image prompt, video prompt, sfx prompt, variable prompts, Runway prompts, Kling prompts, Luma prompts, Sora prompts, US Canada UK',
    fallbackHtml: `
      <main style="padding: 40px; font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1>Prompt Vault</h1>
        <p>Pro prompts with Image Prompt, Video Prompt, and SFX blocks plus variable controls.</p>
        <ul>
          <li>Search across image/video/sfx prompts</li>
          <li>Copy each block independently</li>
          <li>Use variable controls to adapt prompts fast</li>
        </ul>
      </main>
    `
  },
  {
    path: '/vault',
    file: join(DIST_DIR, 'vault', 'index.html'),
    title: 'Prompt Vault (v1) - Classic Prompt Cards | CineWorkflo',
    description: 'The original Prompt Vault experience with classic prompt cards and quick copy.',
    keywords: 'prompt vault v1, AI prompts for video, prompt cards, copy prompts',
    fallbackHtml: `
      <main style="padding: 40px; font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1>Prompt Vault (v1)</h1>
        <p>The original Prompt Vault experience with classic prompt cards and quick copy.</p>
        <ul>
          <li>Browse prompts by category</li>
          <li>Search and copy quickly</li>
        </ul>
      </main>
    `
  },
  {
    path: '/shot-to-prompt',
    file: join(DIST_DIR, 'shot-to-prompt', 'index.html'),
    title: 'Shot to Prompt - Convert Frames into AI Video Prompts | CineWorkflo',
    description: 'Upload an image or short video reference and generate an AI video prompt. Built for previsualization workflows in the US, Canada, and UK.',
    keywords: 'shot to prompt, image to prompt, AI video prompt generator, filmmaking prompt tool, US Canada UK',
    fallbackHtml: `
      <main style="padding: 40px; font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1>Shot to Prompt</h1>
        <p>Convert a visual reference into an AI-video prompt draft.</p>
        <ul>
          <li>Upload a frame, still, or reference image</li>
          <li>Extract scene composition and camera intent</li>
          <li>Generate a reusable base prompt for iteration</li>
        </ul>
      </main>
    `
  },
  {
    path: '/camera-moves',
    file: join(DIST_DIR, 'camera-moves', 'index.html'),
    title: 'Camera Movements Guide - Classic, Dynamic, and AI-Native Moves | CineWorkflo',
    description: 'Learn camera movement language with interactive cards for dolly, pan, tracking, handheld, steadicam, orbit, drone, and more for US, Canada, and UK creators.',
    keywords: 'camera movements, dolly shot, pan shot, steadicam, handheld, whip pan, dutch angle, dolly zoom, AI camera moves, US Canada UK',
    fallbackHtml: `
      <main style="padding: 40px; font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1>Camera Movements Guide</h1>
        <p>Learn classic, dynamic, and AI-native camera moves for better prompting.</p>
        <ul>
          <li>Classic moves: dolly, pan, tilt, zoom, tracking, crane</li>
          <li>Dynamic moves: handheld, steadicam, whip pan, dutch angle</li>
          <li>AI-native moves: orbit, drone, dolly zoom, push through</li>
        </ul>
      </main>
    `
  },
  {
    path: '/pricing',
    file: join(DIST_DIR, 'pricing', 'index.html'),
    title: 'Pricing - CineWorkflo Plans for AI Video Creators in US, Canada, and UK',
    description: 'Compare Free and Pro plans for CineWorkflo. Unlock the ever-growing Prompt Vault and unlimited Prompt Enhancer generations for creator workflows in the US, Canada, and UK.',
    keywords: 'CineWorkflo pricing, AI video prompt pricing, Runway prompt subscription, Pika prompt plans, US Canada UK',
    fallbackHtml: `
      <main style="padding: 40px; font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1>CineWorkflo Pricing</h1>
        <p>Choose a plan for AI video prompt workflows.</p>
        <ul>
          <li>Free: 30 generations monthly + core prompt set</li>
          <li>Pro Monthly: unlimited generations + full prompt vault</li>
          <li>Pro Yearly: best value with full access and updates</li>
        </ul>
      </main>
    `
  },
  {
    path: '/about',
    file: join(DIST_DIR, 'about', 'index.html'),
    title: 'About CineWorkflo - AI Video Prompt Workflows',
    description: 'Learn how CineWorkflo helps filmmakers and creator teams in the US, Canada, and UK build reliable AI video workflows.',
    keywords: 'about CineWorkflo, AI video workflow platform, filmmaker prompt tools, US Canada UK',
    fallbackHtml: `
      <main style="padding: 40px; font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1>About CineWorkflo</h1>
        <p>CineWorkflo provides practical prompt workflows for AI video creators and filmmaking teams.</p>
      </main>
    `
  },
  {
    path: '/contact',
    file: join(DIST_DIR, 'contact', 'index.html'),
    title: 'Contact CineWorkflo Support',
    description: 'Contact CineWorkflo for support, billing, and partnership inquiries from the US, Canada, and UK.',
    keywords: 'contact CineWorkflo, CineWorkflo support, prompt tool support, US Canada UK',
    fallbackHtml: `
      <main style="padding: 40px; font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1>Contact</h1>
        <p>Reach support at support@cineworkflo.com for product and billing questions.</p>
      </main>
    `
  },
  {
    path: '/privacy',
    file: join(DIST_DIR, 'privacy', 'index.html'),
    title: 'Privacy Policy | CineWorkflo',
    description: 'Read the CineWorkflo privacy policy and how account, usage, and billing data are handled.',
    keywords: 'CineWorkflo privacy policy, data policy, creator tool privacy',
    fallbackHtml: `
      <main style="padding: 40px; font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1>Privacy Policy</h1>
        <p>This page explains how CineWorkflo handles account, usage, and billing-related data.</p>
      </main>
    `
  },
  {
    path: '/terms',
    file: join(DIST_DIR, 'terms', 'index.html'),
    title: 'Terms of Service | CineWorkflo',
    description: 'Read the CineWorkflo terms of service for platform usage and account policies.',
    keywords: 'CineWorkflo terms, terms of service, AI tool terms',
    fallbackHtml: `
      <main style="padding: 40px; font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1>Terms of Service</h1>
        <p>This page outlines service terms, account responsibilities, and usage policies.</p>
      </main>
    `
  }
]

const categoryRoutes = PROMPT_CATEGORY_SEO_PAGES.map((category) => ({
  path: `/prompts/${category.slug}`,
  file: join(DIST_DIR, 'prompts', category.slug, 'index.html'),
  title: `${category.name} AI Video Prompts | CineWorkflo`,
  description: `${category.description} Explore copy-ready prompts for ${category.name.toLowerCase()} workflows in the US, Canada, and UK.`,
  keywords: `${category.name.toLowerCase()} prompts, AI video prompts, cinematic prompt templates, US Canada UK`,
  fallbackHtml: `
    <main style="padding: 40px; font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
      <h1>${category.name} Prompts</h1>
      <p>${category.description}</p>
    </main>
  `
}))

const ALL_ROUTES = [...ROUTES, ...categoryRoutes]

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const upsertMetaName = (html, name, content) => {
  const pattern = new RegExp(`<meta\\s+name="${escapeRegExp(name)}"\\s+content="[^"]*"\\s*\\/?>`, 'i')
  const tag = `<meta name="${name}" content="${content}" />`
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `  ${tag}\n  </head>`)
}

const upsertMetaProperty = (html, property, content) => {
  const pattern = new RegExp(`<meta\\s+property="${escapeRegExp(property)}"\\s+content="[^"]*"\\s*\\/?>`, 'i')
  const tag = `<meta property="${property}" content="${content}" />`
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `  ${tag}\n  </head>`)
}

const upsertCanonical = (html, href) => {
  const pattern = /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i
  const tag = `<link rel="canonical" href="${href}" />`
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `  ${tag}\n  </head>`)
}

const updateFallbackMain = (html, fallbackHtml) =>
  html.replace(/<main style="padding: 40px;[\s\S]*?<\/main>/i, fallbackHtml.trim())

const buildRouteHtml = (baseHtml, route) => {
  const routeUrl = `https://cineworkflo.com${route.path}`
  let html = baseHtml
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${route.title}</title>`)
  html = upsertMetaName(html, 'description', route.description)
  html = upsertMetaName(html, 'keywords', route.keywords)
  html = upsertMetaName(html, 'twitter:title', route.title)
  html = upsertMetaName(html, 'twitter:description', route.description)
  html = upsertMetaProperty(html, 'og:title', route.title)
  html = upsertMetaProperty(html, 'og:description', route.description)
  html = upsertMetaProperty(html, 'og:url', routeUrl)
  html = upsertCanonical(html, routeUrl)
  html = updateFallbackMain(html, route.fallbackHtml)
  return html
}

const run = () => {
  const baseHtml = readFileSync(BASE_FILE, 'utf8')

  ALL_ROUTES.forEach((route) => {
    const html = buildRouteHtml(baseHtml, route)
    mkdirSync(dirname(route.file), { recursive: true })
    writeFileSync(route.file, html, 'utf8')
    console.log(`Prerendered: ${route.path} -> ${route.file}`)
  })
}

run()
