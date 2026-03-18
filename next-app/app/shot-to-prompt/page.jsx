import Link from 'next/link'
import { SHOT_TO_PROMPT_BENEFITS, SHOT_TO_PROMPT_FAQS } from '../../lib/prompt-data'

export const metadata = {
  title: 'Shot to Prompt | CineWorkflo Next Migration',
  description:
    'Single-shot reverse engineering in Next.js: upload a frame or short clip, then turn it into an image prompt plus a motion-aware video prompt.',
}

export default function ShotToPromptPage() {
  return (
    <main className="route-shell">
      <div className="container page-stack">
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Shot to Prompt</span>
        </div>

        <section className="section-grid shot-route-grid">
          <div className="section-heading left">
            <div className="eyebrow">Reference-first workflow</div>
            <h1>Start from a shot you love.</h1>
            <p>
              Upload a frame or a short single-shot clip and reverse-engineer the still-image look plus the motion
              language behind it. The Next route is still static in Phase 1, but the structure now mirrors the live
              product instead of a placeholder shell.
            </p>
            <div className="cta-row route-actions">
              <Link href="/prompts" className="cta-primary">
                Open Prompt Vault
              </Link>
              <Link href="/pricing" className="cta-secondary">
                See Pro plan
              </Link>
            </div>
            <ul className="benefit-list">
              {SHOT_TO_PROMPT_BENEFITS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="panel shot-demo-panel">
            <div className="panel-title">Upload shell</div>
            <div className="upload-shell">
              <div className="upload-icon">+</div>
              <div>
                <h2>Drop an image or short clip</h2>
                <p>Max 25MB · video up to 15s · best for one continuous shot</p>
              </div>
            </div>

            <div className="output-stack">
              <div className="output-card">
                <div className="output-header">
                  <span className="output-label image">Image Prompt</span>
                  <span className="output-button">Copy Image Prompt</span>
                </div>
                <p>
                  Rain-streaked neon street at night, shoulder-level close framing, saturated magenta and cyan spill on
                  wet pavement, reflective storefront glass, shallow depth, subject isolated against layered city haze.
                </p>
              </div>
              <div className="output-card">
                <div className="output-header">
                  <span className="output-label video">Video Prompt</span>
                  <span className="output-button">Copy Video Prompt</span>
                </div>
                <p>
                  Slow lateral tracking as the subject moves through rain and neon reflections, subtle handheld sway,
                  passing headlights streak through the background, camera preserves the same palette and framing while
                  revealing motion and pace from the clip.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="stack-section">
          <div className="section-heading left compact-heading">
            <div className="eyebrow">FAQs</div>
            <h2>How this route should behave after migration</h2>
          </div>
          <div className="faq-grid">
            {SHOT_TO_PROMPT_FAQS.map((item) => (
              <article key={item.question} className="feature-card static-card faq-card">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
