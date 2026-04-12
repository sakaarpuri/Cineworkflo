import Link from 'next/link'
import HomeHeroPreview from '../components/HomeHeroPreview'
import HomeCameraMovesPreview from '../components/HomeCameraMovesPreview'
import HomeVaultPreviewGrid from '../components/HomeVaultPreviewGrid'
import PricingCards from '../components/PricingCards'
import { HOMEPAGE_CAMERA_MOVES_META } from '../lib/cameraMovesMeta'
import {
  FEATURED_STYLE_PRESETS,
  PLATFORM_BADGES,
  TESTIMONIALS,
} from '../lib/prompt-data'
import { PAGE_SEO } from '../lib/seo'

export const metadata = PAGE_SEO.home

const HOME_ENHANCER_MOODS = ['Epic', 'Dramatic', 'Thought-Provoking', 'Whimsical', 'Serene', 'Mysterious', 'Energetic', 'Eerie', 'Calm', 'Surreal', 'Hopeful', 'Melancholic', 'Tense', 'Playful', 'Dreamlike']
const HOME_ENHANCER_SELECTED_MOODS = new Set(['Epic', 'Tense', 'Dreamlike'])
const HOME_USE_CASES = ['Product Showcase', 'Brand Ad', 'Spec Ad', 'Logo Reveal', 'Short-form', 'Social Media', 'Event Promo', 'Recruitment', 'Storytelling', 'Short Film', 'Documentary', 'Visual Essay', 'Education', 'Explainer', 'Podcast Visuals']

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

          <HomeHeroPreview />
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
            <div className="enhancer-home-controls">
              <div className="enhancer-home-top">
                <div className="prompt-input-shell home-prompt-input">
                  e.g. a lone boxer wrapping hands in a fluorescent locker room before the fight…
                </div>
                <button className="enhance-primary" type="button">Enhance</button>
              </div>

              <div className="home-setting-stack">
                <div className="home-setting-row">
                  <span className="setting-label sentence">Level</span>
                  <div className="switch-pair">
                    <span className="switch-side active blue">Essential</span>
                    <span className="soft-switch static blue"><span className="soft-switch-knob" /></span>
                    <span className="switch-side">Pro</span>
                    <span className="setting-note-pill">camera + lens</span>
                  </div>
                  <div className="switch-pair">
                    <span className="switch-side">Images Off</span>
                    <span className="soft-switch static green on"><span className="soft-switch-knob" /></span>
                    <span className="switch-side active green-text">On</span>
                    <span className="setting-note-pill">create a START FRAME</span>
                  </div>
                </div>

                <div className="home-setting-caption">Simple language, optional add-ons</div>

                <div className="home-setting-row secondary">
                  <span className="setting-label sentence">SFX</span>
                  <div className="switch-pair">
                    <span className="switch-side active subtle">Off</span>
                    <span className="soft-switch static"><span className="soft-switch-knob" /></span>
                    <span className="switch-side">On</span>
                  </div>
                  <span className="home-setting-caption">Output stays visual-only</span>
                </div>
              </div>

              <div className="home-chip-group">
                <span className="control-label">Mood</span>
                <div className="chip-row wrap-row compact-gap">
                  {HOME_ENHANCER_MOODS.map((mood) => (
                    <span key={mood} className={`filter-chip ${HOME_ENHANCER_SELECTED_MOODS.has(mood) ? 'selected' : ''}`}>{mood}</span>
                  ))}
                </div>
              </div>
              <div className="home-chip-group">
                <div className="home-style-shell">
                  <div className="home-style-header">
                    <span className="control-label sentence">Style</span>
                    <div>
                      <div className="home-style-title">Style Presets</div>
                      <p className="preset-inline-copy">
                        Choose a cinematic visual grammar inspired by iconic filmmakers. Mood selection sets emotional tone, style presets set lensing, framing, lighting, palette, and movement language.
                      </p>
                    </div>
                  </div>
                  <div className="preset-grid live-preset-grid home-preset-grid">
                    {FEATURED_STYLE_PRESETS.map((preset) => (
                      <div key={preset.key} className="preset-card live-preset-card static-selected" style={{ '--preset-accent': preset.accent }}>
                        <div
                          className="preset-thumb"
                          style={{ backgroundImage: `url(/preset-thumbnails/${preset.key}.webp)` }}
                        />
                        <div>
                          <strong>{preset.label}</strong>
                          <span>{preset.subtitle}</span>
                          <em>
                            {preset.key === 'desert-minimalism'
                              ? 'Isolation, tension, existential scale, characters dwarfed by environment'
                              : preset.key === 'humid-neon-noir'
                                ? 'Romance, loneliness, urban intimacy, memory, longing, nocturnal mood'
                                : preset.key === 'golden-hour-immersion'
                                  ? 'Spiritual, transcendent, nature, memory, intimacy with the world, raw humanity'
                                  : 'Whimsy, nostalgia, storybook comedy, meticulously crafted worlds, deadpan'}
                          </em>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="home-style-footer">
                    <span className="home-style-note">Choose one featured preset or open more styles below.</span>
                    <button className="more-styles-pill" type="button">More styles</button>
                    <span className="muted-inline">Nordic Noir · Dreamscape · Tokyo Night Drift</span>
                  </div>
                </div>
              </div>
              <div className="home-chip-group">
                <span className="control-label sentence">Use</span>
                <div className="chip-row wrap-row compact-gap">
                  {HOME_USE_CASES.map((item) => (
                    <span key={item} className="filter-chip">{item}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="homepage-tool-section vault-home-section">
        <div className="container">
          <HomeVaultPreviewGrid />
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
            <h2 className="section-title">Camera Movements</h2>
            <p className="section-sub">
              Learn the language of the Camera to master the language of prompts.
            </p>
          </div>
          <div className="card-grid three-up moves-home-grid">
            {HOMEPAGE_CAMERA_MOVES_META.map((move) => (
              <div key={move.id} className="feature-card static-card move-home-card">
                <div className="move-home-badge-row">
                  <span className={`move-home-badge ${move.badgeType}`}>{move.badge}</span>
                </div>
                <div className="move-home-title-row">
                  <h3>{move.name}</h3>
                  <span className="move-home-tag">{move.tag}</span>
                </div>
                <HomeCameraMovesPreview title={move.name} />
                <p>{move.desc}</p>
                <div className="move-home-feel-row">
                  <span className="move-home-feel-icon">🎬</span>
                  <span><strong>Feels like:</strong> {move.feelText}</span>
                </div>
                <div className="move-home-prompt-shell">
                  <div className="move-home-prompt-label">ADD TO YOUR PROMPT</div>
                  <div className="move-home-prompt">
                    {move.prompts.map((prompt, index) => (
                      <span key={prompt}>
                        <span className="move-home-prompt-var">{prompt}</span>
                        {index < move.prompts.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
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
          <PricingCards surface="home" />
        </div>
      </section>
    </main>
  )
}
