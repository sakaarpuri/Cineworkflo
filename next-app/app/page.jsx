import Link from 'next/link'
import {
  CATEGORY_PAGES,
  FEATURED_STYLE_PRESETS,
  FEATURED_VAULT_CARDS,
  HOME_CAMERA_MOVES,
  PLATFORM_BADGES,
  PRICING_TIERS,
  TESTIMONIALS,
} from '../lib/prompt-data'
import { PAGE_SEO } from '../lib/seo'

export const metadata = PAGE_SEO.home

export default function HomePage() {
  return (
    <main className="home-redesign">
      <section className="hero hero-redesign">
        <div className="container hero-grid redesign-hero-grid">
          <div>
            <div className="eyebrow">AI FILMMAKER TOOLKIT</div>
            <h1 className="hero-title redesign-title">
              Your prompt is <span>your director&apos;s eye</span>
            </h1>
            <p className="hero-copy redesign-copy">
              Describe, enhance, and steal cinematic shots — for Runway, Kling, Veo, Sora, and more. Built for
              filmmakers who think in frames, not keywords.
            </p>
            <div className="platform-badge-row">
              {PLATFORM_BADGES.map((badge) => (
                <span key={badge.label} className={`platform-pill ${badge.tone === 'new' ? 'new' : ''}`}>
                  {badge.label}
                  {badge.tone === 'new' ? <em>NEW</em> : null}
                </span>
              ))}
            </div>
            <div className="cta-row hero-redesign-actions">
              <Link href="/shot-to-prompt" className="cta-primary">
                Try Shot to Prompt
              </Link>
              <Link href="/prompt-enhancer" className="cta-secondary">
                Open Prompt Enhancer
              </Link>
            </div>
            <p className="hero-free-note">
              Free to start. <span>Upgrade when the workflow becomes part of your real production stack.</span>
            </p>
          </div>

          <div className="panel hero-preview-redesign">
            <div className="panel-title">Live workflow preview</div>
            <div className="hero-preview-media">
              <div className="hero-preview-chip">prompt id #247 · Stepwell descent</div>
            </div>
            <div className="panel-card">
              <div className="panel-eyebrow">WHAT YOU GET</div>
              <p className="panel-copy">
                Still-frame language, motion-aware direction, and prompt structures that stay useful across Shot to
                Prompt, Prompt Enhancer, and the Vault.
              </p>
              <div className="loop-list">
                {FEATURED_VAULT_CARDS.map((card) => (
                  <span key={card.id} className="loop-chip active-home-chip">
                    prompt id #{card.id} · {card.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="homepage-tool-section spotlight-section">
        <div className="container homepage-two-col">
          <div className="section-copy-block">
            <div className="section-chip">Featured workflow</div>
            <h2 className="section-title">See a shot you love? Steal the prompt.</h2>
            <p className="section-sub">
              Upload a frame or short single-shot clip and reverse-engineer both the still-image look and the motion
              language behind it. This is the fastest way to turn references into usable prompt structure.
            </p>
            <ul className="feature-bullet-list">
              <li>Best for one clear shot, not a whole edit.</li>
              <li>Video stays motion-aware without becoming scene parsing.</li>
              <li>Works for films, ads, and your own footage.</li>
            </ul>
            <div className="free-gen-note">5 free generations per month across Enhancer + Shot to Prompt</div>
          </div>

          <div className="section-demo-card upload-demo-card">
            <div className="upload-demo-shell">
              <div className="upload-icon">＋</div>
              <div>
                <h3>Drop an image or short clip here</h3>
                <p>Max 25MB · video up to 15s · best for one continuous shot</p>
              </div>
            </div>
            <div className="output-stack compact-output-stack">
              <div className="output-card compact-output-card">
                <div className="output-header">
                  <span className="output-label image">Image Prompt</span>
                  <span className="output-button">Copy</span>
                </div>
                <p>Reverse-engineered still-frame look, composition, lighting, and texture fidelity.</p>
              </div>
              <div className="output-card compact-output-card">
                <div className="output-header">
                  <span className="output-label video">Video Prompt</span>
                  <span className="output-button">Copy</span>
                </div>
                <p>Motion-aware continuation that explains subject movement, camera behavior, and shot pace.</p>
              </div>
            </div>
            <div className="section-card-actions">
              <Link href="/shot-to-prompt" className="text-link">
                Open Shot to Prompt
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="homepage-tool-section enhancer-home-section">
        <div className="container enhancer-home-stack">
          <div className="section-heading redesign-heading center-text">
            <div className="section-chip">Idea-first workflow</div>
            <h2 className="section-title">Describe the shot in your head. We&apos;ll translate it for the machine.</h2>
            <p className="section-sub">
              Start from your own idea, then shape it with mood, style presets, and production-ready detail before you
              move into generation tools.
            </p>
          </div>

          <div className="feature-card static-card homepage-enhancer-shell">
            <div className="enhancer-home-top">
              <div className="prompt-input-shell home-prompt-input">
                An astronaut returns to a flooded childhood town where every street still glows with old carnival lights.
              </div>
              <button className="enhance-primary" type="button">Enhance</button>
            </div>
            <div className="enhancer-home-controls">
              <div className="home-toggle-row">
                <span className="mini-toggle active blue">Essential</span>
                <span className="mini-toggle">Pro</span>
                <span className="mini-toggle active green">Images On</span>
                <span className="mini-toggle">SFX Off</span>
              </div>
              <div className="home-chip-group">
                <span className="control-label">Mood</span>
                <div className="chip-row wrap-row compact-gap">
                  <span className="filter-chip selected">Epic</span>
                  <span className="filter-chip selected">Dreamlike</span>
                  <span className="filter-chip selected">Tense</span>
                </div>
              </div>
              <div className="home-chip-group">
                <span className="control-label">Style Presets</span>
                <p className="preset-inline-copy">
                  Choose a cinematic visual grammar inspired by iconic filmmakers.
                </p>
                <div className="preset-grid live-preset-grid home-preset-grid">
                  {FEATURED_STYLE_PRESETS.map((preset) => (
                    <div key={preset.key} className="preset-card live-preset-card selected" style={{ '--preset-accent': preset.accent }}>
                      <div
                        className="preset-thumb"
                        style={{ backgroundImage: `url(/preset-thumbnails/${preset.key}.webp)` }}
                      />
                      <div>
                        <strong>{preset.label}</strong>
                        <span>{preset.subtitle}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="home-output-preview-grid">
                <div className="output-card compact-output-card">
                  <div className="output-header">
                    <span className="output-label image">Start Frame Prompt</span>
                    <span className="output-button">Essential</span>
                  </div>
                  <p>Visual grammar, palette, lensing, and composition anchored to the chosen mood and preset.</p>
                </div>
                <div className="output-card compact-output-card">
                  <div className="output-header">
                    <span className="output-label video">Video Prompt</span>
                    <span className="output-button">Pro-ready</span>
                  </div>
                  <p>Camera movement, pacing, and continuity layered onto the same visual identity.</p>
                </div>
              </div>
            </div>
            <div className="section-card-actions">
              <Link href="/prompt-enhancer" className="text-link">
                Open Prompt Enhancer
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="homepage-tool-section vault-home-section">
        <div className="container">
          <div className="section-heading redesign-heading center-text">
            <div className="section-chip">Curated library</div>
            <h2 className="section-title">Prompt Vault is where you go deeper.</h2>
            <p className="section-sub">
              Not just 300+ prompts — a curated image-to-video library with variables, categories, and pro controls that
              make references actually usable in production.
            </p>
          </div>
          <div className="vault-home-cats">
            {CATEGORY_PAGES.slice(0, 6).map((category) => (
              <Link key={category.slug} href={`/prompts/${category.slug}`} className="category-pill">
                <span className="category-dot" style={{ background: category.accent }} />
                {category.name}
              </Link>
            ))}
          </div>
          <div className="card-grid three-up">
            {FEATURED_VAULT_CARDS.map((card) => (
              <div key={card.id} className="feature-card static-card vault-card redesigned-vault-card">
                <div
                  className="vault-thumb"
                  style={{ backgroundImage: `url(/prompt-thumbnails/${String(card.id).padStart(3, '0')}.jpg)` }}
                />
                <div className="card-eyebrow">{card.category}</div>
                <h3>#{card.id} · {card.title}</h3>
                <p>{card.description}</p>
                <div className="vault-footer-note">See pro prompt controls in the Vault</div>
              </div>
            ))}
          </div>
          <div className="center-row">
            <Link href="/prompts" className="cta-secondary">
              Open Prompt Vault
            </Link>
          </div>
        </div>
      </section>

      <section className="homepage-tool-section camera-moves-home">
        <div className="container">
          <div className="section-heading redesign-heading center-text">
            <div className="section-chip">Support tool</div>
            <h2 className="section-title">Camera Moves keeps prompts from feeling generic.</h2>
            <p className="section-sub">
              Learn the movement language that makes AI prompts feel directed instead of guessed.
            </p>
          </div>
          <div className="card-grid three-up moves-home-grid">
            {HOME_CAMERA_MOVES.map((move) => (
              <div key={move.title} className="feature-card static-card move-home-card">
                <div className="move-home-thumb">
                  <span className="move-home-chip">Preview</span>
                </div>
                <h3>{move.title}</h3>
                <p>{move.description}</p>
                <div className="move-home-prompt">{move.prompt}</div>
              </div>
            ))}
          </div>
          <div className="center-row">
            <Link href="/camera-moves" className="cta-secondary">
              Explore Camera Moves
            </Link>
          </div>
        </div>
      </section>

      <section className="homepage-tool-section proof-home-section">
        <div className="container">
          <div className="section-heading redesign-heading center-text">
            <div className="section-chip">Social proof</div>
            <h2 className="section-title">Built for people actually making AI video work.</h2>
            <p className="section-sub">These are the kinds of reactions the product should earn as the workflow sharpens.</p>
          </div>
          <div className="card-grid three-up proof-grid-home">
            {TESTIMONIALS.map((item) => (
              <div key={item.name} className="feature-card static-card testimonial-card">
                <p className="testimonial-quote">“{item.quote}”</p>
                <div className="testimonial-meta">
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="homepage-tool-section pricing-home-section">
        <div className="container pricing-home-wrap">
          <div className="section-heading redesign-heading center-text">
            <div className="section-chip">Pricing</div>
            <h2 className="section-title">Simple pricing for working AI video workflows.</h2>
            <p className="section-sub">Start free. Upgrade when CineWorkFlo becomes part of how you actually build.</p>
          </div>
          <div className="card-grid three-up pricing-home-grid">
            {PRICING_TIERS.map((tier) => (
              <div key={tier.name} className={`pricing-tier-card ${tier.featured ? 'featured' : ''}`}>
                <div className="pricing-tier-name">{tier.name}</div>
                <p className="pricing-tier-desc">{tier.description}</p>
                <div className="pricing-tier-price-row">
                  <span className="pricing-tier-price">{tier.price}</span>
                  <span className="pricing-tier-period">{tier.period}</span>
                </div>
                <div className={`pricing-tier-hook ${tier.featured ? 'featured-hook' : ''}`}>{tier.hook}</div>
                <ul className="pricing-tier-features">
                  {tier.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <Link href={tier.ctaHref} className={`pricing-tier-cta ${tier.featured ? 'featured' : ''}`}>
                  {tier.ctaLabel}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
