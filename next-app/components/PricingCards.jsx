'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { buildPricingTiers, DEFAULT_PRICING_VARIANT, PRICING_VARIANTS } from '../lib/pricing'

export default function PricingCards({ surface = 'page' }) {
  const router = useRouter()
  const { user } = useAuth()
  const [loadingPlan, setLoadingPlan] = useState('')
  const [checkoutError, setCheckoutError] = useState('')
  const [checkoutCanceled, setCheckoutCanceled] = useState(false)
  const [checkoutCanceledPlan, setCheckoutCanceledPlan] = useState('')
  const [pricingVariant, setPricingVariant] = useState(DEFAULT_PRICING_VARIANT)

  useEffect(() => {
    let cancelled = false

    const loadPricingContext = async () => {
      try {
        const response = await fetch('/.netlify/functions/pricing-context')
        const payload = await response.json().catch(() => ({}))
        if (cancelled) return
        if (payload?.pricingVariant === 'inr') {
          setPricingVariant(PRICING_VARIANTS.inr)
        } else {
          setPricingVariant(DEFAULT_PRICING_VARIANT)
        }
      } catch {
        if (!cancelled) setPricingVariant(DEFAULT_PRICING_VARIANT)
      }
    }

    loadPricingContext()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (surface !== 'page') return
    const params = new URLSearchParams(window.location.search)
    const checkout = params.get('checkout')
    if (checkout === 'canceled') {
      const plan = params.get('plan')
      setCheckoutCanceled(true)
      setCheckoutCanceledPlan(plan === 'monthly' || plan === 'yearly' ? plan : '')
    }
  }, [surface])

  const plans = useMemo(() => buildPricingTiers(pricingVariant), [pricingVariant])

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
    <>
      {checkoutCanceled && surface === 'page' ? <div className="error-card">Checkout canceled{checkoutCanceledPlan ? ` (${checkoutCanceledPlan})` : ''}. You can restart anytime.</div> : null}
      {checkoutError ? <div className="error-card">{checkoutError}</div> : null}

      <section className={surface === 'page' ? 'pricing-grid-live' : 'card-grid three-up pricing-home-grid'}>
        {plans.map((plan) => {
          const isLoading = loadingPlan === plan.planType
          return (
            <article key={plan.name} className={`pricing-tier-card ${plan.planType === 'yearly' ? 'featured yearly' : ''}`}>
              {plan.planType === 'yearly' ? <div className="pricing-feature-chip">{plan.badgeLabel || 'Best Value'}</div> : null}
              <div className="pricing-tier-name">{plan.name}</div>
              <p className="pricing-tier-desc">{plan.description}</p>
              {plan.planType === 'yearly' ? <div className="pricing-tier-hook">{plan.hook}</div> : null}
              <div className="pricing-tier-price-row">
                <span className="pricing-tier-price">{plan.price}</span>
                <span className="pricing-tier-period">{plan.period}</span>
              </div>
              {plan.planType !== 'yearly' ? <div className="pricing-tier-hook muted-hook">{plan.hook}</div> : null}
              <ul className="pricing-tier-features">
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <Check className="icon-xs" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {surface === 'home' && plan.planType === 'free' ? (
                <Link href="/prompts" className="pricing-tier-cta">
                  {plan.ctaLabel}
                </Link>
              ) : (
                <button
                  type="button"
                  className={`pricing-tier-cta ${plan.planType === 'yearly' ? 'featured' : ''}`}
                  onClick={() => handleCheckout(plan.planType)}
                  disabled={Boolean(loadingPlan)}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="icon-xs spin" />
                      Redirecting…
                    </>
                  ) : (
                    plan.ctaLabel
                  )}
                </button>
              )}
            </article>
          )
        })}
      </section>
    </>
  )
}
