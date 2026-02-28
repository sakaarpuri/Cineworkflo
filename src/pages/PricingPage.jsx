import { Link } from 'react-router-dom'
import Pricing from '../components/Pricing'

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
        <section
          className="rounded-2xl p-6"
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
                The yearly plan is billed once for annual access. Monthly is billed per month and can be cancelled anytime.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                What do I get with Pro?
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Pro unlocks the full prompt vault, unlimited AI generations, and advanced workflow tools including Shot to Prompt.
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
