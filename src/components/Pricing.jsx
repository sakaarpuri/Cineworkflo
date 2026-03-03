import { useEffect, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getCheckoutAttributionPayload, trackCtaEvent } from '../lib/marketingAttribution'

const plans = [
  {
    name: 'Free',
    planType: 'free',
    price: '$0',
    description: 'Dip your toes in. No credit card, no catch.',
    features: [
      '5 total generations / month (Enhancer + Shot to Prompt)',
      'Prompt Vault (25 prompts)',
      'Basic search',
      'Copy to clipboard'
    ],
    cta: 'Start Free — No Card Needed',
    popular: false
  },
  {
    name: 'Pro',
    planType: 'monthly',
    price: '$7.99',
    priceNote: '/month',
    description: 'For creators who ship. Unlimited everything.',
    features: [
      'Unlimited Prompt Enhancer generations',
      'Full Prompt Vault (150+)',
      'Shot to Prompt AI tool',
      'Advanced search & filters',
      'New prompts weekly',
      'Cancel anytime'
    ],
    cta: 'Go Pro — $7.99/mo',
    popular: true
  }
]

export default function Pricing({ onAuthClick }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState(null)
  const [checkoutCanceled, setCheckoutCanceled] = useState(false)
  const [checkoutCanceledPlan, setCheckoutCanceledPlan] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const checkout = params.get('checkout')
    if (checkout === 'canceled') {
      setCheckoutCanceled(true)
      const plan = params.get('plan')
      if (plan === 'monthly') setCheckoutCanceledPlan(plan)
      params.delete('checkout')
      params.delete('plan')
      const query = params.toString()
      const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash || ''}`
      window.history.replaceState({}, '', nextUrl)
    }
  }, [])

  const handleCheckout = async (planType) => {
    trackCtaEvent(`pricing_${planType}_click`, '/pricing')

    if (planType === 'free') {
      navigate('/prompts')
      return
    }

    if (!user) {
      onAuthClick?.()
      return
    }

    startCheckout(planType)
  }

  const startCheckout = async (planType) => {
    setCheckoutError(null)
    setLoading(true)
    try {
      const response = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          userId: user.id,
          plan: planType,
          attribution: getCheckoutAttributionPayload()
        })
      })

      const text = await response.text()
      let data = {}
      try {
        data = text ? JSON.parse(text) : {}
      } catch {
        data = {}
      }

      if (!response.ok) {
        throw new Error(data?.error || `Failed to start checkout (HTTP ${response.status}).`)
      }

      if (!data?.url) {
        throw new Error('Stripe Checkout did not return a redirect URL. Please try again.')
      }

      window.location.assign(data.url)
    } catch (err) {
      console.error('Checkout error:', err)
      setCheckoutError(err?.message || 'Failed to start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getPlanCta = (plan) => plan.cta

  return (
    <section 
      className="py-16 transition-colors relative overflow-hidden"
      id="pricing"
      style={{ background: 'transparent' }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl lg:text-4xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Simple pricing. No enterprise tier nonsense.
          </h2>
          <p 
            className="text-xl"
            style={{ color: 'var(--text-secondary)' }}
          >
            Cancel anytime. No guilt trip, no pop-up begging you to stay.
          </p>
          <div className="mt-4 flex justify-center">
            <div
              className="px-4 py-2 rounded-2xl italic text-sm"
              style={{
                background: 'linear-gradient(145deg, rgba(59,130,246,0.10), rgba(139,92,246,0.10))',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                boxShadow: '0 10px 24px rgba(15,23,42,0.05), 6px 6px 12px rgba(15,23,42,0.07), -6px -6px 12px rgba(255,255,255,0.75)'
              }}
            >
              Support is coming soon. We’re currently hiring our best apologetic tone.
            </div>
          </div>
        </div>

        {checkoutCanceled && (
          <div className="neu-card rounded-2xl p-4 mb-6 text-center">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Checkout canceled{checkoutCanceledPlan ? ` (${checkoutCanceledPlan})` : ''}. You can restart anytime.
            </p>
          </div>
        )}

        {checkoutError && (
          <div
            className="neu-card rounded-2xl p-4 mb-6 text-center"
            style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)'
            }}
          >
            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
              {checkoutError}
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className="rounded-2xl p-8 transition-all flex flex-col"
              style={{
                background: plan.popular ? 'var(--pro-card-bg)' : 'var(--bg-card)',
                boxShadow: plan.popular ? 'var(--pro-card-shadow)' : 'var(--shadow-card)',
                border: `2px solid ${plan.popular ? 'var(--pro-card-border)' : 'var(--border-color)'}`,
              }}
            >
              {plan.popular && (
                <span 
                  className="inline-block text-sm font-bold px-3 py-1 rounded-full mb-4"
                  style={{
                    background: 'var(--pro-card-badge-bg)',
                    color: 'var(--pro-card-badge-text)'
                  }}
                >
                  Most Value
                </span>
              )}
              <h3 
                className="text-2xl font-bold mb-2"
                style={{ color: plan.popular ? 'var(--pro-card-text)' : 'var(--text-primary)' }}
              >
                {plan.name}
              </h3>
              <p 
                className="mb-4 text-sm"
                style={{ color: plan.popular ? 'var(--pro-card-subtext)' : 'var(--text-secondary)' }}
              >
                {plan.description}
              </p>
              <div className="mb-6">
                <span 
                  className="text-4xl font-bold"
                  style={{ color: plan.popular ? 'var(--pro-card-text)' : 'var(--text-primary)' }}
                >
                  {plan.price}
                </span>
                {plan.priceNote && (
                  <span 
                    className="text-sm ml-2"
                    style={{ color: plan.popular ? 'var(--pro-card-subtext)' : 'var(--text-muted)' }}
                  >
                    {plan.priceNote}
                  </span>
                )}
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check 
                      className="h-5 w-5 flex-shrink-0" 
                      style={{ 
                        color: plan.popular ? 'rgba(255,255,255,0.9)' : 'var(--accent-green)' 
                      }} 
                    />
                    <span 
                      style={{ 
                        color: plan.popular ? 'var(--pro-card-text)' : 'var(--text-secondary)' 
                      }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout(plan.planType)}
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  background: plan.popular ? 'var(--pro-cta-bg)' : 'linear-gradient(145deg, #3B82F6, #3B82F6DD)',
                  color: plan.popular ? 'var(--pro-cta-text)' : '#fff',
                  border: `2px solid ${plan.popular ? 'var(--pro-cta-border)' : '#3B82F650'}`,
                  boxShadow: plan.popular ? 'var(--pro-cta-shadow)' : 'inset 3px 3px 6px rgba(59,130,246,0.4), inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px rgba(59,130,246,0.4)',
                  transform: 'translateY(0) scale(1)',
                  opacity: loading ? 0.7 : 1
                }}
                onMouseDown={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(2px) scale(0.98)';
                    e.currentTarget.style.boxShadow = plan.popular
                      ? 'inset 4px 4px 8px rgba(0,0,0,0.18), inset -3px -3px 6px rgba(255,255,255,0.05), 0 2px 6px rgba(0,0,0,0.18)'
                      : 'inset 4px 4px 8px rgba(59,130,246,0.6), inset -3px -3px 6px rgba(255,255,255,0.3), 0 2px 6px rgba(59,130,246,0.3)';
                  }
                }}
                onMouseUp={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = plan.popular
                      ? 'var(--pro-cta-shadow)'
                      : 'inset 3px 3px 6px rgba(59,130,246,0.4), inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px rgba(59,130,246,0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = plan.popular
                      ? 'var(--pro-cta-shadow)'
                      : 'inset 3px 3px 6px rgba(59,130,246,0.4), inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px rgba(59,130,246,0.4)';
                  }
                }}
              >
                {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                {getPlanCta(plan)}
              </button>
            </div>
          ))}
        </div>

        <p 
          className="text-center mt-10"
          style={{ color: 'var(--text-muted)' }}
        >
          30-day money-back guarantee. No passive-aggressive follow-up emails either.
        </p>
      </div>
    </section>
  )
}
