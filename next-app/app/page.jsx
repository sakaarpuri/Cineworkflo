import Link from 'next/link'
import { CATEGORY_PAGES, FEATURED_VAULT_CARDS } from '../lib/prompt-data'

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">AI FILMMAKER TOOLKIT</div>
            <h1 className="hero-title">The prompt toolkit for AI filmmakers</h1>
            <p className="hero-copy">
              Start from an idea, a reference frame, or a proven prompt. This Next.js homepage mirrors the live
              CineWorkflo hierarchy so we can migrate the public surface without losing the product story.
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
            <div className="panel-title">Output preview shell</div>
            <div className="panel-card">
              <div className="panel-eyebrow">WHAT YOU GET</div>
              <p className="panel-copy">
                Copy-ready prompt building blocks for still frames, motion, and shot language — the same workflow
                thinking used across Shot to Prompt, Prompt Enhancer, and the Vault.
              </p>
              <div className="loop-list">
                {FEATURED_VAULT_CARDS.map((card) => (
                  <span key={card.id} className="loop-chip">
                    prompt id #{card.id} · {card.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stack-section">
        <div className="container section-grid">
          <div className="feature-card static-card">
            <div className="card-eyebrow">Featured workflow</div>
            <h2>Shot to Prompt</h2>
            <p>
              Upload a frame or a short single-shot clip and reverse-engineer the still-image look plus the motion
              language behind it.
            </p>
            <div className="card-actions">
              <Link href="/shot-to-prompt" className="text-link">Open route</Link>
            </div>
          </div>

          <div className="feature-card static-card" id="prompt-enhancer">
            <div className="card-eyebrow">Idea to prompt</div>
            <h2>Prompt Enhancer</h2>
            <p>
              Start from your own idea, then shape it with mood, style presets, and pro-level prompt detail before
              moving into production.
            </p>
          </div>
        </div>
      </section>

      <section className="stack-section">
        <div className="container">
          <div className="section-heading">
            <div className="eyebrow">Curated Library</div>
            <h2>Prompt Vault</h2>
            <p>
              Browse a curated slice of the Vault, then open the full library for pro prompt controls, variables, and
              category filters.
            </p>
          </div>
          <div className="card-grid three-up">
            {FEATURED_VAULT_CARDS.map((card) => (
              <div key={card.id} className="feature-card static-card">
                <div className="card-eyebrow">{card.category}</div>
                <h3>#{card.id} · {card.title}</h3>
                <p>{card.description}</p>
              </div>
            ))}
          </div>
          <div className="center-row">
            <Link href="/prompts" className="cta-secondary">Open Prompt Vault</Link>
          </div>
        </div>
      </section>

      <section className="stack-section">
        <div className="container">
          <div className="section-heading">
            <div className="eyebrow">Category Pages</div>
            <h2>Prompt category SEO surface</h2>
            <p>
              The migration now includes dedicated Next category routes so the public prompt discovery surface can move
              with real metadata, not just the homepage.
            </p>
          </div>
          <div className="card-grid three-up">
            {CATEGORY_PAGES.slice(0, 6).map((category) => (
              <Link key={category.slug} href={`/prompts/${category.slug}`} className="feature-card static-card">
                <div className="card-eyebrow" style={{ color: category.accent }}>{category.name}</div>
                <h3>{category.count}+ prompts</h3>
                <p>{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="stack-section">
        <div className="container section-grid">
          <div className="feature-card static-card">
            <div className="card-eyebrow">Support Tool</div>
            <h2>Camera Moves</h2>
            <p>Learn the movement language that makes prompts feel directed instead of generic.</p>
          </div>
          <div className="feature-card static-card">
            <div className="card-eyebrow">Pricing</div>
            <h2>Simple pricing for working AI video workflows</h2>
            <p>Start free, upgrade when you need more generations and the full Vault.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
