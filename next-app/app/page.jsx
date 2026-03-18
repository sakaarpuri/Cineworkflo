import Link from 'next/link'

const sections = [
  {
    title: 'Shot to Prompt',
    eyebrow: 'Featured Workflow',
    description:
      'Upload a frame or a short single-shot clip and reverse-engineer the still-image look plus the motion language behind it.',
    href: '/shot-to-prompt',
  },
  {
    title: 'Prompt Enhancer',
    eyebrow: 'Idea to Prompt',
    description:
      'Start from your own idea, then shape it with mood, style presets, and pro-level prompt detail before moving into production.',
    href: '/#prompt-enhancer',
  },
  {
    title: 'Prompt Vault',
    eyebrow: 'Curated Library',
    description:
      'Browse category-driven prompts with image, video, and variable-aware prompt building blocks for image-to-video workflows.',
    href: '/prompts',
  },
  {
    title: 'Camera Moves',
    eyebrow: 'Support Tool',
    description:
      'Learn the movement language that makes prompts feel directed instead of generic.',
    href: '/camera-moves',
  },
]

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">AI FILMMAKER TOOLKIT</div>
            <h1 className="hero-title">The prompt toolkit for AI filmmakers</h1>
            <p className="hero-copy">
              Start from an idea, a reference frame, or a proven prompt. This Next.js foundation mirrors the
              current product hierarchy so we can migrate routes without losing the live positioning work.
            </p>
            <div className="cta-row">
              <Link href="/shot-to-prompt" className="cta-primary">
                Try Shot to Prompt
              </Link>
              <Link href="/prompts" className="cta-secondary">
                Browse Prompt Vault
              </Link>
            </div>
          </div>

          <div className="panel">
            <div className="panel-title">Phase 1 migration shell</div>
            <div className="panel-card">
              <div className="panel-eyebrow">WHAT THIS GIVES US</div>
              <ul>
                <li>Real App Router layout and metadata foundation</li>
                <li>Current homepage hierarchy preserved in Next</li>
                <li>Separate Next workspace without breaking Vite</li>
                <li>Safe base for porting public routes one by one</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="cards">
        <div className="container card-grid">
          {sections.map((section) => (
            <Link key={section.title} href={section.href} className="feature-card">
              <div className="card-eyebrow">{section.eyebrow}</div>
              <h2>{section.title}</h2>
              <p>{section.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
