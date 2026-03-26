'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { PRICING_TIERS } from '../lib/prompt-data'

export default function PricingClient() {
  const router = useRouter()
  const { user } = useAuth()
  const [loadingPlan, setLoadingPlan] = useState('')
  const [checkoutError, setCheckoutError] = useState('')

  const plans = useMemo(
    () =>
      PRICING_TIERS.map((plan) => ({
        ...plan,
        planType:
          plan.name === 'Free'
            ? 'free'
            : plan.name === 'Pro'
              ? 'monthly'
              : 'yearly',
        popular: plan.name === 'Pro Yearly',
      })),
    [],
  )

  const handleCheckout = async (planType) => {
    setCheckoutError('')

    if (planType === 'free') {
      router.push('/prompts')
      return
    }

    if (!user) {
      router.push(`/sign-in?next=%2Fpricing`)
      return
    }

    setLoadingPlan(planType)
    try {
      const response = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          userId: user.id,
          plan: planType,
        }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data?.url) {
        throw new Error(data?.error || 'Unable to start checkout right now.')
      }

      window.location.assign(data.url)
    } catch (error) {
      setCheckoutError(error?.message || 'Unable to start checkout right now.')
      setLoadingPlan('')
    }
  }

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

      {checkoutError ? <div className="error-card">{checkoutError}</div> : null}

      <section className="pricing-grid-live">
        {plans.map((plan) => {
          const isLoading = loadingPlan === plan.planType
          return (
            <article key={plan.name} className={`pricing-tier-card ${plan.popular ? 'featured yearly' : ''}`}>
              {plan.popular ? <div className="pricing-feature-chip">Huge Discount</div> : null}
              <div className="pricing-tier-name">{plan.name}</div>
              <p className="pricing-tier-desc">{plan.description}</p>
              {plan.popular ? <div className="pricing-tier-hook">Save 49% compared with paying monthly</div> : null}
              <div className="pricing-tier-price-row">
                <span className="pricing-tier-price">{plan.price}</span>
                <span className="pricing-tier-period">{plan.period}</span>
              </div>
              <ul className="pricing-tier-features">
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <Check className="icon-xs" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={`pricing-tier-cta ${plan.popular ? 'featured' : ''}`}
                onClick={() => handleCheckout(plan.planType)}
                disabled={Boolean(loadingPlan)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="icon-xs spin" />
                    Redirecting…
                  </>
                ) : plan.planType === 'free' ? (
                  'Start Free — No Card Needed'
                ) : plan.planType === 'monthly' ? (
                  'Go Pro — $7.99/mo'
                ) : (
                  'Go Yearly — $49/yr'
                )}
              </button>
            </article>
          )
        })}
      </section>

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
