import React, { Suspense, lazy, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import HeroGallery from './components/HeroGallery'
import Footer from './components/Footer'
import Success from './components/Success'
import AuthModal from './components/AuthModal'

const PromptEnhancer = lazy(() => import('./components/PromptEnhancer'))
const ShotToPrompt = lazy(() => import('./components/ShotToPrompt'))
const CameraMoveCards = lazy(() => import('./components/CameraMoveCards'))
const ModernAINativeMoves = lazy(() => import('./components/ModernAINativeMoves'))
const CameraMovesPage = lazy(() => import('./pages/CameraMovesPage'))
const Features = lazy(() => import('./components/Features'))
const PromptVault = lazy(() => import('./components/PromptVault'))
const Pricing = lazy(() => import('./components/Pricing'))

const SEO_DEFAULT = {
  title: 'CineWorkflo - Professional AI Video Prompts for Runway & Pika',
  description: 'Professional AI video prompt workflows for filmmakers. Access curated prompts, shot-to-prompt tools, and camera movement guides.',
  keywords: 'AI video prompts, Runway prompts, Pika prompts, AI filmmaking, video generation prompts',
  path: '/',
  noindex: false
}

const SEO_BY_PATH = {
  '/': {
    title: 'CineWorkflo - Professional AI Video Prompts for Runway & Pika | 150+ Tested Prompts',
    description: 'Stop guessing with AI video. 150+ professional prompts for Runway Gen-2, Pika Labs, and AI video tools. Copy, paste, create.',
    keywords: 'AI video prompts, Runway prompts, Pika prompts, AI filmmaking, video generation prompts, Runway Gen-2, Pika Labs',
    path: '/',
    noindex: false
  },
  '/prompts': {
    title: 'Prompt Vault - AI Video Prompts for Filmmakers | CineWorkflo',
    description: 'Browse curated AI video prompts by style, mood, and shot type. Built for creators using Runway, Pika, and other video tools.',
    keywords: 'prompt vault, AI prompts for video, Runway prompt library, Pika prompt library, cinematic AI prompts',
    path: '/prompts',
    noindex: false
  },
  '/shot-to-prompt': {
    title: 'Shot to Prompt - Turn Visual References into AI Video Prompts | CineWorkflo',
    description: 'Upload a shot reference and generate an optimized AI video prompt. Speed up concepting and previsualization workflows.',
    keywords: 'shot to prompt, image to prompt, AI video prompt generator, filmmaking prompt tool',
    path: '/shot-to-prompt',
    noindex: false
  },
  '/camera-moves': {
    title: 'Camera Movements Guide - Classic, Dynamic, and AI-Native Moves | CineWorkflo',
    description: 'Learn camera movement language with interactive cards for dolly, pan, tracking, handheld, steadicam, orbit, drone, and more.',
    keywords: 'camera movements, dolly shot, pan shot, steadicam, handheld, whip pan, dutch angle, dolly zoom, AI camera moves',
    path: '/camera-moves',
    noindex: false
  },
  '/modern-moves': {
    title: 'Modern AI-Native Camera Moves | CineWorkflo',
    description: 'Preview AI-native camera movement patterns for cinematic prompt design and previsualization.',
    keywords: 'AI-native camera moves, modern camera movement, orbit, drone, dolly zoom',
    path: '/modern-moves',
    noindex: false
  },
  '/success': {
    title: 'Purchase Success | CineWorkflo',
    description: 'Purchase confirmation page for CineWorkflo.',
    keywords: 'purchase success, confirmation',
    path: '/success',
    noindex: true
  }
}

function RouteSeo() {
  const location = useLocation()

  useEffect(() => {
    const normalizedPath = location.pathname !== '/' && location.pathname.endsWith('/')
      ? location.pathname.slice(0, -1)
      : location.pathname

    const seo = SEO_BY_PATH[normalizedPath] || { ...SEO_DEFAULT, path: normalizedPath || '/' }
    const origin = window.location.origin
    const canonicalUrl = `${origin}${seo.path}`

    document.title = seo.title

    const upsertMetaByName = (name, content) => {
      let element = document.head.querySelector(`meta[name="${name}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute('name', name)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    const upsertMetaByProperty = (property, content) => {
      let element = document.head.querySelector(`meta[property="${property}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute('property', property)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    const upsertLink = (rel, href) => {
      let element = document.head.querySelector(`link[rel="${rel}"]`)
      if (!element) {
        element = document.createElement('link')
        element.setAttribute('rel', rel)
        document.head.appendChild(element)
      }
      element.setAttribute('href', href)
    }

    upsertMetaByName('description', seo.description)
    upsertMetaByName('keywords', seo.keywords)
    upsertMetaByName('robots', seo.noindex ? 'noindex,nofollow' : 'index,follow')
    upsertMetaByProperty('og:type', 'website')
    upsertMetaByProperty('og:title', seo.title)
    upsertMetaByProperty('og:description', seo.description)
    upsertMetaByProperty('og:url', canonicalUrl)
    upsertMetaByProperty('og:site_name', 'CineWorkflo')
    upsertMetaByName('twitter:card', 'summary_large_image')
    upsertMetaByName('twitter:title', seo.title)
    upsertMetaByName('twitter:description', seo.description)
    upsertLink('canonical', canonicalUrl)

    const homeSchema = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'CineWorkflo',
        url: origin,
        description: SEO_BY_PATH['/'].description
      },
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'CineWorkflo',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        url: origin,
        offers: {
          '@type': 'Offer',
          price: '49.00',
          priceCurrency: 'USD'
        }
      }
    ]

    const pageName = seo.title.split(' | ')[0]
    const pageSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: pageName,
      description: seo.description,
      url: canonicalUrl
    }

    const breadcrumbSchema = normalizedPath === '/' ? null : {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: origin
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: pageName,
          item: canonicalUrl
        }
      ]
    }

    const schemaPayload = normalizedPath === '/'
      ? homeSchema
      : breadcrumbSchema
        ? [pageSchema, breadcrumbSchema]
        : [pageSchema]

    let script = document.head.querySelector('script#route-seo-jsonld')
    if (!script) {
      script = document.createElement('script')
      script.id = 'route-seo-jsonld'
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(schemaPayload)
  }, [location.pathname])

  return null
}

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false)

  const sectionFallback = (minHeight = 240) => (
    <div
      aria-hidden="true"
      style={{
        minHeight,
        background: 'var(--bg-primary)'
      }}
    />
  )

  return (
    <AuthProvider>
      <Router>
        <RouteSeo />
        <div className="min-h-screen transition-colors" style={{ background: 'var(--bg-primary)' }}>
          <Header onAuthClick={() => setAuthModalOpen(true)} />
          <main>
            <Routes>
              <Route path="/" element={
                <>
                  <HeroGallery />
                  <Suspense fallback={sectionFallback(260)}>
                    <PromptEnhancer />
                  </Suspense>
                  <Suspense fallback={sectionFallback(220)}>
                    <ShotToPrompt preview={true} />
                  </Suspense>
                  <Suspense fallback={sectionFallback(220)}>
                    <CameraMoveCards />
                  </Suspense>
                  <Suspense fallback={sectionFallback(160)}>
                    <Features />
                  </Suspense>
                  <Suspense fallback={sectionFallback(240)}>
                    <PromptVault preview={true} />
                  </Suspense>
                  <Suspense fallback={sectionFallback(180)}>
                    <Pricing />
                  </Suspense>
                </>
              } />
              <Route path="/prompts" element={<Suspense fallback={sectionFallback(300)}><PromptVault /></Suspense>} />
              <Route path="/shot-to-prompt" element={<Suspense fallback={sectionFallback(320)}><ShotToPrompt /></Suspense>} />
              <Route path="/camera-moves" element={<Suspense fallback={sectionFallback(320)}><CameraMovesPage /></Suspense>} />
              <Route path="/modern-moves" element={<Suspense fallback={sectionFallback(320)}><ModernAINativeMoves /></Suspense>} />
              <Route path="/success" element={<Success />} />
            </Routes>
          </main>
          <Footer />
          <AuthModal 
            isOpen={authModalOpen} 
            onClose={() => setAuthModalOpen(false)} 
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
