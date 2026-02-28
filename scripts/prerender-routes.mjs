import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const DIST_DIR = 'dist'
const BASE_FILE = join(DIST_DIR, 'index.html')

const ROUTES = [
  {
    path: '/',
    file: join(DIST_DIR, 'index.html'),
    title: 'CineWorkflo - Professional AI Video Prompts for Runway & Pika | 150+ Tested Prompts',
    description: 'Stop guessing with AI video. 150+ professional prompts for Runway Gen-2, Pika Labs, and AI video tools. Copy, paste, create.',
    keywords: 'AI video prompts, Runway prompts, Pika prompts, AI filmmaking, video generation prompts, Runway Gen-2, Pika Labs',
    fallbackHtml: `
      <main style="padding: 40px; font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1>CineWorkflo — Professional AI Video Prompts for Runway & Pika</h1>
        <p><strong>150+ tested prompts for AI video generation.</strong> Stop guessing. Copy, paste, create.</p>
        <p>Explore Prompt Vault, Shot to Prompt, and Camera Moves to build complete AI-video workflows.</p>
      </main>
    `
  },
  {
    path: '/prompts',
    file: join(DIST_DIR, 'prompts', 'index.html'),
    title: 'Prompt Vault - AI Video Prompts for Filmmakers | CineWorkflo',
    description: 'Browse curated AI video prompts by style, mood, and shot type. Built for creators using Runway, Pika, and other video tools.',
    keywords: 'prompt vault, AI prompts for video, Runway prompt library, Pika prompt library, cinematic AI prompts',
    fallbackHtml: `
      <main style="padding: 40px; font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1>Prompt Vault</h1>
        <p>Curated AI video prompts for filmmakers and creators.</p>
        <ul>
          <li>Search prompts by style, use case, and tool</li>
          <li>Copy ready-to-use prompt templates</li>
          <li>Use with Runway, Pika, Kling, Luma, and related tools</li>
        </ul>
      </main>
    `
  },
  {
    path: '/shot-to-prompt',
    file: join(DIST_DIR, 'shot-to-prompt', 'index.html'),
    title: 'Shot to Prompt - Turn Visual References into AI Video Prompts | CineWorkflo',
    description: 'Upload a shot reference and generate an optimized AI video prompt. Speed up concepting and previsualization workflows.',
    keywords: 'shot to prompt, image to prompt, AI video prompt generator, filmmaking prompt tool',
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
    description: 'Learn camera movement language with interactive cards for dolly, pan, tracking, handheld, steadicam, orbit, drone, and more.',
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
    title: 'Pricing - CineWorkflo Plans for AI Video Creators',
    description: 'Compare Free, Pro Monthly, and Pro Yearly plans for CineWorkflo. Unlock full prompt vault access and advanced AI video workflow tools.',
    keywords: 'CineWorkflo pricing, AI video prompt pricing, Runway prompt subscription, Pika prompt plans',
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
    description: 'Learn about CineWorkflo and how it helps filmmakers and creators build reliable AI video workflows.',
    keywords: 'about CineWorkflo, AI video workflow platform, filmmaker prompt tools',
    fallbackHtml: `
      <main style="padding: 40px; font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1>About CineWorkflo</h1>
        <p>CineWorkflo provides practical prompt workflows for AI video creators and filmmaking teams.</p>
      </main>
    `
  },
  {
    path: '/prompts/product-ads',
    file: join(DIST_DIR, 'prompts', 'product-ads', 'index.html'),
    title: 'Product Ads AI Video Prompts | CineWorkflo',
    description: 'Copy-ready AI video prompts for product ads, launch visuals, and commercial-style product storytelling.',
    keywords: 'product ad prompts, AI commercial prompts, product showcase video prompts',
    fallbackHtml: `
      <main style="padding: 40px; font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1>Product Ads Prompts</h1>
        <p>Commercial-focused prompt templates for product storytelling and launch assets.</p>
      </main>
    `
  },
  {
    path: '/prompts/short-form-social',
    file: join(DIST_DIR, 'prompts', 'short-form-social', 'index.html'),
    title: 'Short-Form Social AI Video Prompts | CineWorkflo',
    description: 'High-impact AI video prompts built for short-form and vertical social content.',
    keywords: 'short-form prompts, social video prompts, vertical video prompt templates',
    fallbackHtml: `
      <main style="padding: 40px; font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1>Short-Form Social Prompts</h1>
        <p>Prompt templates for hooks, vertical framing, and social-first pacing.</p>
      </main>
    `
  },
  {
    path: '/prompts/cinematic-storytelling',
    file: join(DIST_DIR, 'prompts', 'cinematic-storytelling', 'index.html'),
    title: 'Cinematic Storytelling AI Video Prompts | CineWorkflo',
    description: 'Narrative-first AI video prompts for cinematic scenes, mood-driven visuals, and story progression.',
    keywords: 'cinematic storytelling prompts, narrative video prompts, dramatic AI video prompts',
    fallbackHtml: `
      <main style="padding: 40px; font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1>Cinematic Storytelling Prompts</h1>
        <p>Narrative prompt templates for cinematic scene progression and mood direction.</p>
      </main>
    `
  },
  {
    path: '/prompts/world-building',
    file: join(DIST_DIR, 'prompts', 'world-building', 'index.html'),
    title: 'World Building AI Video Prompts | CineWorkflo',
    description: 'Environment and atmosphere-driven AI video prompts for world-building and cinematic reveals.',
    keywords: 'world-building prompts, environment prompts, cinematic establishing shot prompts',
    fallbackHtml: `
      <main style="padding: 40px; font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1>World Building Prompts</h1>
        <p>Atmosphere and environment-first prompts for scale, immersion, and world reveals.</p>
      </main>
    `
  },
  {
    path: '/contact',
    file: join(DIST_DIR, 'contact', 'index.html'),
    title: 'Contact CineWorkflo Support',
    description: 'Contact CineWorkflo for support, billing, and partnership inquiries.',
    keywords: 'contact CineWorkflo, CineWorkflo support, prompt tool support',
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

  ROUTES.forEach((route) => {
    const html = buildRouteHtml(baseHtml, route)
    mkdirSync(dirname(route.file), { recursive: true })
    writeFileSync(route.file, html, 'utf8')
    console.log(`Prerendered: ${route.path} -> ${route.file}`)
  })
}

run()
