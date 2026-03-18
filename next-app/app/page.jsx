import Link from 'next/link'
import {
  CATEGORY_PAGES,
  EXTRA_STYLE_PRESET_NAMES,
  FEATURED_MOODS,
  FEATURED_STYLE_PRESETS,
  FEATURED_USE_CASES,
  FEATURED_VAULT_CARDS,
} from '../lib/prompt-data'

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">AI FILMMAKER TOOLKIT</div>
            <h1 className="hero-title">The prompt toolkit for AI filmmakers</h1>
            <p className="hero-copy">
              Start from an idea, a reference frame, or a proven prompt. This Next.js homepage now mirrors the live
              CineWorkflo hierarchy with stronger section shells, so we can migrate the public surface without losing
              the product story.
            </p>
            <div className="cta-row">
              <Link href="/shot-to-prompt" className="cta-primary">
                Try Shot to Prompt
              </Link>
              <Link href="#prompt-enhancer" className="cta-secondary">
                Open Prompt Enhancer
              </Link>
            </div>
          </div>

          <div className="panel hero-preview-panel">
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
        <div className="container home-feature-layout">
          <div className="feature-copy-card feature-card static-card">
            <div className="card-eyebrow">Featured workflow</div>
            <h2>Shot to Prompt</h2>
            <p>
              Upload a frame or a short single-shot clip and reverse-engineer the still-image look plus the motion
              language behind it. It is your cleanest “start from reference” entry point, which is why it now sits
              directly under the hero in the Next migration too.
            </p>
            <ul className="benefit-list compact">
              <li>One shot in, one structured prompt pair out.</li>
              <li>Video stays motion-aware without turning into scene parsing.</li>
              <li>Best for films, ads, and your own footage.</li>
            </ul>
            <div className="card-actions">
              <Link href="/shot-to-prompt" className="text-link">
                Open route
              </Link>
            </div>
          </div>

          <div className="feature-card static-card tool-preview-card">
            <div className="tool-preview-header">
              <span className="preview-dot image" />
              <span>Reference upload shell</span>
            </div>
            <div className="upload-shell compact-upload-shell">
              <div className="upload-icon">+</div>
              <div>
                <h3>Image or short video</h3>
                <p>Max 25MB · single-shot clip · 15s max</p>
              </div>
            </div>
            <div className="output-stack compact-output-stack">
              <div className="output-card compact-output-card">
                <div className="output-header">
                  <span className="output-label image">Image Prompt</span>
                  <span className="output-button">Copy</span>
                </div>
                <p>Reverse-engineered still-frame look, lighting, composition, and subject detail.</p>
              </div>
              <div className="output-card compact-output-card">
                <div className="output-header">
                  <span className="output-label video">Video Prompt</span>
                  <span className="output-button">Copy</span>
                </div>
                <p>Motion-aware continuation that explains camera behavior, subject movement, and pace.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stack-section" id="prompt-enhancer">
        <div className="container home-feature-layout enhancer-layout">
          <div className="feature-card static-card tool-preview-card enhancer-preview-card">
            <div className="tool-preview-header">
              <span className="preview-dot enhancer" />
              <span>Idea-first controls</span>
            </div>
            <div className="prompt-input-shell">
              An astronaut returns to a flooded childhood town where every street still glows with old carnival lights.
            </div>
            <div className="chip-row">
              {FEATURED_MOODS.map((mood) => (
                <span key={mood} className="filter-chip selected">
                  {mood}
                </span>
              ))}
            </div>
            <div className="preset-shell">
              <div className="preset-shell-header">
                <span>Style Presets</span>
                <span className="muted-inline">Top 4 visible by default</span>
              </div>
              <div className="preset-grid">
                {FEATURED_STYLE_PRESETS.map((preset) => (
                  <div key={preset.key} className="preset-card" style={{ '--preset-accent': preset.accent }}>
                    <div className="preset-thumb" />
                    <div>
                      <strong>{preset.label}</strong>
                      <span>{preset.subtitle}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="more-styles-row">
                <span className="more-styles-pill">More styles</span>
                <span className="muted-inline">{EXTRA_STYLE_PRESET_NAMES.join(' · ')}</span>
              </div>
            </div>
            <div className="chip-row subdued">
              {FEATURED_USE_CASES.map((item) => (
                <span key={item} className="filter-chip subtle">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="feature-copy-card feature-card static-card">
            <div className="card-eyebrow">Idea to prompt</div>
            <h2>Prompt Enhancer</h2>
            <p>
              Start from your own idea, then shape it with mood, cinematic style presets, and use-case intent before
              moving into production. This is the first hands-on workflow for people who arrive with a concept instead
              of a reference.
            </p>
            <p>
              In the Next migration, the public homepage should preview this system clearly even before the interactive
              client component is fully ported over.
            </p>
            <div className="output-stack compact-output-stack">
              <div className="output-card compact-output-card">
                <div className="output-header">
                  <span className="output-label image">Start Frame Prompt</span>
                  <span className="output-button">Essential</span>
                </div>
                <p>Visual grammar, lensing, palette, and composition anchored to the chosen mood and preset.</p>
              </div>
              <div className="output-card compact-output-card">
                <div className="output-header">
                  <span className="output-label video">Video Prompt</span>
                  <span className="output-button">Pro-ready</span>
                </div>
                <p>Camera movement, pacing, and continuity layered on top of the same visual identity.</p>
              </div>
            </div>
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
              category filters. The Next migration already has the category route system in place, so this section can
              move cleanly into real static pages.
            </p>
          </div>
          <div className="card-grid three-up">
            {FEATURED_VAULT_CARDS.map((card) => (
              <div key={card.id} className="feature-card static-card vault-card">
                <div className="vault-thumb" />
                <div className="card-eyebrow">{card.category}</div>
                <h3>#{card.id} · {card.title}</h3>
                <p>{card.description}</p>
                <div className="vault-footer-note">See pro prompt controls in the Vault</div>
              </div>
            ))}
          </div>
          <div className="category-strip">
            {CATEGORY_PAGES.slice(0, 6).map((category) => (
              <Link key={category.slug} href={`/prompts/${category.slug}`} className="category-pill">
                <span className="category-dot" style={{ background: category.accent }} />
                {category.name}
              </Link>
            ))}
          </div>
          <div className="center-row">
            <Link href="/prompts" className="cta-secondary">
              Open Prompt Vault
            </Link>
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
