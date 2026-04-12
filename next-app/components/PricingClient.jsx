'use client'

import Link from 'next/link'
import PricingCards from './PricingCards'

export default function PricingClient() {
  return (
    <div className="page-stack pricing-live-shell">
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>Pricing</span>
      </div>

      <section className="pricing-hero-shell">
        <h1>Simple pricing for working AI video workflows.</h1>
        <p>Start free, upgrade when you need more generations and the full Vault.</p>
        <div className="pricing-note-pill">
          Free gives you 5 shared generations per month. Pro unlocks unlimited generations and the full Prompt Vault.
        </div>
      </section>

      <PricingCards surface="page" />

      <section className="feature-card static-card pricing-support-card">
        <h2>Pricing FAQ</h2>
        <div className="pricing-faq-grid">
          <div>
            <h3>Is this a recurring subscription?</h3>
            <p>Yes. Monthly and yearly plans renew automatically until cancelled.</p>
          </div>
          <div>
            <h3>What do I get with Pro?</h3>
            <p>Pro unlocks unlimited Enhancer generations, Shot to Prompt, and the full Prompt Vault controls.</p>
          </div>
          <div>
            <h3>Is there a refund policy?</h3>
            <p>Yes. Purchases include a 30-day money-back guarantee.</p>
          </div>
        </div>
        <div className="info-link-row">
          <Link href="/prompts" className="text-link">Prompt Vault</Link>
          <Link href="/shot-to-prompt" className="text-link">Shot to Prompt</Link>
          <Link href="/camera-moves" className="text-link">Camera Moves</Link>
        </div>
      </section>
    </div>
  )
}
