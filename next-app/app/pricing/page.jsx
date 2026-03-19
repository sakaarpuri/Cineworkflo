import { PAGE_SEO } from '../../lib/seo'

export const metadata = PAGE_SEO.pricing

export default function PricingPage() {
  return (
    <main className="route-shell">
      <div className="container">
        <div className="feature-card static-card">
          <div className="card-eyebrow">Phase 1 placeholder</div>
          <h1>Pricing</h1>
          <p>
            Pricing is scaffolded here so route-level metadata and HTML exist in Next from the start. Stripe checkout
            and the current backend stay untouched in Phase 1.
          </p>
        </div>
      </div>
    </main>
  )
}
