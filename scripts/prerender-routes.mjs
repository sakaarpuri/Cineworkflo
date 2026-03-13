import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { PROMPT_CATEGORY_SEO_PAGES } from '../src/data/promptCategorySeo.js'

const DIST_DIR = 'dist'
const BASE_FILE = join(DIST_DIR, 'index.html')

const ROUTES = [
  {
    path: '/',
    file: join(DIST_DIR, 'index.html'),
    title: 'CineWorkflo - AI Video Prompt Workflows for Creators Worldwide',
    description: 'Create AI video faster with Prompt Vault, Shot to Prompt, Camera Moves, and Prompt Enhancer. Built for filmmakers and creator teams worldwide.',
    keywords: 'AI video prompts, prompt vault, shot to prompt, camera moves, prompt enhancer, image to video workflows, AI filmmaking',
    fallbackHtml: `
      <main style="padding: 40px; font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1>CineWorkflo — AI Video Prompt Workflows for Creators Worldwide</h1>
        <p><strong>Prompt Vault, Shot to Prompt, Camera Moves, and Prompt Enhancer in one workflow.</strong></p>
        <p>CineWorkflo is a practical AI-video workflow for filmmakers and creator teams building image-to-video pipelines.</p>

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
    title: 'Prompt Vault - AI Video Prompts for Creators Worldwide | CineWorkflo',
    description: 'Browse AI video prompts with image prompt and video prompt structure for creator workflows worldwide.',
    keywords: 'prompt vault, AI video prompts, image prompt, video prompt, cinematic prompts, Runway prompts, Kling prompts, Luma prompts, Sora prompts',
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
    title: 'Shot to Prompt - Convert Frames into Image and Video Prompts | CineWorkflo',
    description: 'Upload an image reference and generate matching image and video prompts for previsualization workflows worldwide.',
    keywords: 'shot to prompt, image to prompt, AI video prompt generator, filmmaking prompt tool, image to video prompt',
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
    description: 'Learn camera movement language with interactive cards for dolly, pan, tracking, handheld, steadicam, orbit, drone, and more for creators worldwide.',
    keywords: 'camera movements, dolly shot, pan shot, steadicam, handheld, whip pan, dutch angle, dolly zoom, AI camera moves',
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
    description: 'Compare Free and Pro plans for CineWorkflo. Unlock the ever-growing Prompt Vault and unlimited Prompt Enhancer generations for creator workflows worldwide.',
    keywords: 'CineWorkflo pricing, AI video prompt pricing, prompt enhancer subscription, prompt vault plans',
    fallbackHtml: `
      <main style="padding: 40px; font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1>CineWorkflo Pricing</h1>
        <p>Choose a plan for AI video prompt workflows.</p>
        <ul>
          <li>Free: 5 generations monthly across Prompt Enhancer and Shot to Prompt + open Prompt Vault</li>
          <li>Pro Monthly: unlimited generations + Prompt Vault + Shot to Prompt</li>
          <li>Pro Yearly: discounted annual access with full workflow tools</li>
        </ul>
      </main>
    `
  },
  {
    path: '/about',
    file: join(DIST_DIR, 'about', 'index.html'),
    title: 'About CineWorkflo - AI Video Prompt Workflows',
    description: 'Learn how CineWorkflo helps filmmakers and creator teams worldwide build reliable AI video workflows.',
    keywords: 'about CineWorkflo, AI video workflow platform, filmmaker prompt tools',
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
    description: 'Contact CineWorkflo for support, billing, and partnership inquiries worldwide.',
    keywords: 'contact CineWorkflo, CineWorkflo support, prompt tool support',
    fallbackHtml: `
      <main style="padding: 40px; font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1>Contact</h1>
        <p>Reach studio@cineworkflo.com for product and billing questions.</p>
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
  description: `${category.description} Explore copy-ready prompts for ${category.name.toLowerCase()} workflows worldwide.`,
  keywords: `${category.name.toLowerCase()} prompts, AI video prompts, cinematic prompt templates`,
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

const updateFallbackShell = (html, fallbackHtml) =>
  html.replace(/<div id=\"seo-shell\">[\s\S]*?<\/div>\s*<div id=\"root\"><\/div>/i, `<div id=\"seo-shell\">\n${fallbackHtml.trim()}\n    </div>\n    <div id=\"root\"></div>`)

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
  html = updateFallbackShell(html, route.fallbackHtml)
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
