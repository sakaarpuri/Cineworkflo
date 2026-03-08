import { Link } from 'react-router-dom'
import Pricing from '../components/Pricing'
import SocialProofBar from '../components/SocialProofBar'

export default function PricingPage({ onAuthClick }) {
  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav
          aria-label="Breadcrumb"
          className="text-sm flex items-center gap-2"
          style={{ color: 'var(--text-muted)' }}
        >
          <Link to="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-secondary)' }}>Pricing</span>
        </nav>
      </div>

      <Pricing onAuthClick={onAuthClick} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <SocialProofBar variant="pricing" />

        <section
          className="rounded-2xl p-6 mt-6"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)'
          }}
        >
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Build your AI video workflow
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            Compare plans, then move through the full workflow used by creators in the US, Canada, and UK.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link to="/prompts" className="underline" style={{ color: 'var(--accent-blue)' }}>
              Prompt Vault
            </Link>
            <Link to="/shot-to-prompt" className="underline" style={{ color: 'var(--accent-blue)' }}>
              Shot to Prompt
            </Link>
            <Link to="/camera-moves" className="underline" style={{ color: 'var(--accent-blue)' }}>
              Camera Moves
            </Link>
            <Link to="/about" className="underline" style={{ color: 'var(--accent-blue)' }}>
              About CineWorkflo
            </Link>
          </div>
        </section>

        <section
          className="rounded-2xl p-6 mt-6"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)'
          }}
        >
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Pricing FAQ
          </h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                Is this a recurring subscription?
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Yes. You can choose monthly or yearly billing, and both renew automatically until cancelled.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                What do I get with Pro?
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Pro unlocks the ever-growing prompt vault, unlimited Prompt Enhancer generations, and advanced workflow tools including Shot to Prompt.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                Is there a refund policy?
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Yes. Purchases include a 30-day money-back guarantee.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
