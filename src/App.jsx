import React, { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import HeroGallery from './components/HeroGallery'
import Footer from './components/Footer'
import Success from './components/Success'
import AuthModal from './components/AuthModal'
import { PROMPT_CATEGORY_PAGES } from './data/promptCategories'
import { captureAttributionTouch } from './lib/marketingAttribution'

const PromptEnhancer = lazy(() => import('./components/PromptEnhancer'))
const ShotToPrompt = lazy(() => import('./components/ShotToPrompt'))
const CameraMoveCards = lazy(() => import('./components/CameraMoveCards'))
const ModernAINativeMoves = lazy(() => import('./components/ModernAINativeMoves'))
const CameraMovesPage = lazy(() => import('./pages/CameraMovesPage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))
const PromptCategoryPage = lazy(() => import('./pages/PromptCategoryPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const Features = lazy(() => import('./components/Features'))
const PromptVault = lazy(() => import('./components/PromptVault'))
const Pricing = lazy(() => import('./components/Pricing'))

const SEO_DEFAULT = {
  title: 'CineWorkflo - Professional AI Video Prompts for Runway, Pika, Sora & Meta',
  description: 'Professional AI video prompt workflows for filmmakers. Access curated prompts, shot-to-prompt tools, and camera movement guides.',
  keywords: 'AI video prompts, Runway prompts, Pika prompts, Sora prompts, Meta prompts, AI filmmaking, video generation prompts',
  path: '/',
  noindex: false
}

const SEO_BY_PATH = {
  '/': {
    title: 'CineWorkflo - Professional AI Video Prompts for Runway, Pika, Sora & Meta | 150+ Tested Prompts',
    description: 'Stop guessing with AI video. 150+ professional prompts for Runway Gen-2, Pika Labs, Sora, Meta, and AI video tools. Copy, paste, create.',
    keywords: 'AI video prompts, Runway prompts, Pika prompts, Sora prompts, Meta prompts, AI filmmaking, video generation prompts, Runway Gen-2, Pika Labs',
    path: '/',
    noindex: false
  },
  '/prompts': {
    title: 'Prompt Vault - AI Video Prompts for Filmmakers | CineWorkflo',
    description: 'Browse curated AI video prompts by style, mood, and shot type. Built for creators using Runway, Pika, Sora, Meta, and other video tools.',
    keywords: 'prompt vault, AI prompts for video, Runway prompt library, Pika prompt library, Sora prompt library, Meta prompt library, cinematic AI prompts',
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
  '/pricing': {
    title: 'Pricing - CineWorkflo Plans for AI Video Creators',
    description: 'Compare Free, Pro Monthly, and Pro Yearly plans for CineWorkflo. Unlock full prompt vault access and advanced AI video workflow tools.',
    keywords: 'CineWorkflo pricing, AI video prompt pricing, Runway prompt subscription, Pika prompt plans, Sora prompt plans, Meta prompt plans',
    path: '/pricing',
    noindex: false
  },
  '/about': {
    title: 'About CineWorkflo - AI Video Prompt Workflows',
    description: 'Learn about CineWorkflo and how it helps filmmakers and creators build reliable AI video workflows.',
    keywords: 'about CineWorkflo, AI video workflow platform, filmmaker prompt tools',
    path: '/about',
    noindex: false
  },
  '/contact': {
    title: 'Contact CineWorkflo Support',
    description: 'Contact CineWorkflo for support, billing, and partnership inquiries.',
    keywords: 'contact CineWorkflo, CineWorkflo support, prompt tool support',
    path: '/contact',
    noindex: false
  },
  '/privacy': {
    title: 'Privacy Policy | CineWorkflo',
    description: 'Read the CineWorkflo privacy policy and how account, usage, and billing data are handled.',
    keywords: 'CineWorkflo privacy policy, data policy, creator tool privacy',
    path: '/privacy',
    noindex: false
  },
  '/terms': {
    title: 'Terms of Service | CineWorkflo',
    description: 'Read the CineWorkflo terms of service for platform usage and account policies.',
    keywords: 'CineWorkflo terms, terms of service, AI tool terms',
    path: '/terms',
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

const FAQ_BY_PATH = {
  '/prompts': [
    {
      question: 'Are these prompts specific to one tool?',
      answer: 'They are optimized for AI video tools like Runway, Pika, Sora, and Meta, but also work as a strong base for most text-to-video workflows.'
    },
    {
      question: 'Should I copy prompts exactly as-is?',
      answer: 'Start with the base prompt, then customize subject, style, lens, and motion terms to fit your scene.'
    },
    {
      question: 'How do I get more consistent outputs?',
      answer: 'Pair prompts with strong references in Shot to Prompt and use precise camera move language from the Camera Moves guide.'
    }
  ],
  '/shot-to-prompt': [
    {
      question: 'What image works best for analysis?',
      answer: 'Use a clean frame with visible subject, environment, and lighting. Blurry or very dark images reduce accuracy.'
    },
    {
      question: 'Can I use movie stills or my own footage frames?',
      answer: 'Yes. You can upload references from films, ads, or your own shots to reverse-engineer camera language.'
    },
    {
      question: 'What should I do after generating the first prompt?',
      answer: 'Treat it as a base draft, then add style, lens, and motion terms to match your final look.'
    }
  ],
  '/camera-moves': [
    {
      question: 'What is the difference between tracking and steadicam?',
      answer: 'Tracking usually means camera and subject move together on a matched path; steadicam means stabilized free movement that still follows naturally.'
    },
    {
      question: 'Which camera moves are best for beginners?',
      answer: 'Start with dolly, pan, tilt, and zoom. They are easy to describe in prompts and build a solid camera-language foundation.'
    },
    {
      question: 'When should I use AI-native moves like push through or dolly zoom?',
      answer: 'Use them for stylized transitions, dramatic tension, and shots that are expensive or physically difficult in real production.'
    }
  ],
  '/pricing': [
    {
      question: 'Is this a recurring subscription?',
      answer: 'The yearly plan is billed once for annual access. Monthly is billed per month and can be cancelled anytime.'
    },
    {
      question: 'What do I get with Pro?',
      answer: 'Pro unlocks the full prompt vault, unlimited AI generations, and advanced workflow tools including Shot to Prompt.'
    },
    {
      question: 'Is there a refund policy?',
      answer: 'Yes. Purchases include a 30-day money-back guarantee.'
    }
  ]
}

function RouteSeo() {
  const location = useLocation()

  useEffect(() => {
    const normalizedPath = location.pathname !== '/' && location.pathname.endsWith('/')
      ? location.pathname.slice(0, -1)
      : location.pathname

    const categorySlug = normalizedPath.startsWith('/prompts/')
      ? normalizedPath.replace('/prompts/', '')
      : null
    const promptCategory = categorySlug
      ? PROMPT_CATEGORY_PAGES.find((category) => category.slug === categorySlug)
      : null

    const promptCategorySeo = promptCategory
      ? {
          title: `${promptCategory.name} AI Video Prompts | CineWorkflo`,
          description: `${promptCategory.description} Explore copy-ready prompts for ${promptCategory.name.toLowerCase()} workflows.`,
          keywords: `${promptCategory.name.toLowerCase()} prompts, AI video prompts, cinematic prompt templates, ${promptCategory.slug.replace('-', ' ')}`,
          path: normalizedPath,
          noindex: false
        }
      : null

    const seo = SEO_BY_PATH[normalizedPath] || promptCategorySeo || { ...SEO_DEFAULT, path: normalizedPath || '/' }
    const origin = window.location.origin
    const canonicalUrl = `${origin}${seo.path}`
    const ogImageUrl = `${origin}/og-default.svg`

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
    upsertMetaByProperty('og:image', ogImageUrl)
    upsertMetaByName('twitter:card', 'summary_large_image')
    upsertMetaByName('twitter:title', seo.title)
    upsertMetaByName('twitter:description', seo.description)
    upsertMetaByName('twitter:image', ogImageUrl)
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
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'CineWorkflo',
        url: origin,
        logo: `${origin}/og-default.svg`
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

    const faqEntries = FAQ_BY_PATH[normalizedPath]
    const faqSchema = faqEntries?.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqEntries.map((entry) => ({
            '@type': 'Question',
            name: entry.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: entry.answer
            }
          }))
        }
      : null

    const schemaPayload = normalizedPath === '/'
      ? homeSchema
      : breadcrumbSchema
        ? [pageSchema, breadcrumbSchema]
        : [pageSchema]

    if (faqSchema) {
      schemaPayload.push(faqSchema)
    }

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

function AttributionTracker() {
  const location = useLocation()

  useEffect(() => {
    captureAttributionTouch({
      pathname: location.pathname,
      search: location.search,
      referrer: document.referrer || ''
    })
  }, [location.pathname, location.search])

  return null
}

function DeferredSection({ children, minHeight = 240, rootMargin = '320px 0px' }) {
  const [shouldRender, setShouldRender] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const node = containerRef.current
    if (!node || shouldRender) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry?.isIntersecting) {
          setShouldRender(true)
          observer.disconnect()
        }
      },
      { rootMargin }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [rootMargin, shouldRender])

  return (
    <div ref={containerRef} style={{ minHeight, contentVisibility: 'auto', containIntrinsicSize: `${minHeight}px` }}>
      {shouldRender ? children : null}
    </div>
  )
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
        <AttributionTracker />
        <div className="min-h-screen transition-colors" style={{ background: 'var(--bg-primary)' }}>
          <Header onAuthClick={() => setAuthModalOpen(true)} />
          <main>
            <Routes>
              <Route path="/" element={
                <>
                  <HeroGallery />
                  <DeferredSection minHeight={260}>
                    <Suspense fallback={sectionFallback(260)}>
                      <PromptEnhancer />
                    </Suspense>
                  </DeferredSection>
                  <DeferredSection minHeight={220}>
                    <Suspense fallback={sectionFallback(220)}>
                      <ShotToPrompt preview={true} />
                    </Suspense>
                  </DeferredSection>
                  <DeferredSection minHeight={220}>
                    <Suspense fallback={sectionFallback(220)}>
                      <CameraMoveCards />
                    </Suspense>
                  </DeferredSection>
                  <DeferredSection minHeight={160}>
                    <Suspense fallback={sectionFallback(160)}>
                      <Features />
                    </Suspense>
                  </DeferredSection>
                  <DeferredSection minHeight={240}>
                    <Suspense fallback={sectionFallback(240)}>
                      <PromptVault preview={true} />
                    </Suspense>
                  </DeferredSection>
                  <DeferredSection minHeight={180}>
                    <Suspense fallback={sectionFallback(180)}>
                      <Pricing onAuthClick={() => setAuthModalOpen(true)} />
                    </Suspense>
                  </DeferredSection>
                </>
              } />
              <Route path="/prompts" element={<Suspense fallback={sectionFallback(300)}><PromptVault /></Suspense>} />
              <Route path="/prompts/:categorySlug" element={<Suspense fallback={sectionFallback(320)}><PromptCategoryPage /></Suspense>} />
              <Route path="/shot-to-prompt" element={<Suspense fallback={sectionFallback(320)}><ShotToPrompt /></Suspense>} />
              <Route path="/camera-moves" element={<Suspense fallback={sectionFallback(320)}><CameraMovesPage /></Suspense>} />
              <Route path="/modern-moves" element={<Suspense fallback={sectionFallback(320)}><ModernAINativeMoves /></Suspense>} />
              <Route path="/pricing" element={<Suspense fallback={sectionFallback(320)}><PricingPage onAuthClick={() => setAuthModalOpen(true)} /></Suspense>} />
              <Route path="/about" element={<Suspense fallback={sectionFallback(220)}><AboutPage /></Suspense>} />
              <Route path="/contact" element={<Suspense fallback={sectionFallback(220)}><ContactPage /></Suspense>} />
              <Route path="/privacy" element={<Suspense fallback={sectionFallback(220)}><PrivacyPage /></Suspense>} />
              <Route path="/terms" element={<Suspense fallback={sectionFallback(220)}><TermsPage /></Suspense>} />
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
