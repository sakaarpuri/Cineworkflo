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
    description: 'Get started with AI video prompts',
    features: [
      '10 Prompt Enhancer generations / month',
      '5 Shot to Prompt generations / month',
      'Prompt Vault (open access)',
      'Basic search',
      'Copy to clipboard'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Pro',
    planType: 'monthly',
    price: '$7.99',
    priceNote: '/month',
    description: 'Full access for active creators',
    features: [
      'Unlimited Prompt Enhancer generations',
      'Ever-growing Prompt Vault',
      'Multiple style interpretations',
      'Shot to Prompt AI tool',
      'Advanced search & filters',
      'New prompts monthly',
      'Cancel anytime'
    ],
    cta: 'Start Pro',
    popular: true
  }
]

export default function Pricing({ onAuthClick }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [confirmPlan, setConfirmPlan] = useState(null) // 'monthly' | null
  const [checkoutError, setCheckoutError] = useState(null)
  const [checkoutCanceled, setCheckoutCanceled] = useState(false)
  const [checkoutCanceledPlan, setCheckoutCanceledPlan] = useState(null)
  const [ctaVariant, setCtaVariant] = useState('a')
  const navigate = useNavigate()

  const closeConfirm = () => {
    if (!loading) setConfirmPlan(null)
  }

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
    const forcedVariant = params.get('cta_variant')
    if (forcedVariant === 'a' || forcedVariant === 'b') {
      localStorage.setItem('cwf_pricing_cta_variant', forcedVariant)
      setCtaVariant(forcedVariant)
      return
    }
    const stored = localStorage.getItem('cwf_pricing_cta_variant')
    if (stored === 'a' || stored === 'b') {
      setCtaVariant(stored)
      return
    }
    const random = Math.random() < 0.5 ? 'a' : 'b'
    localStorage.setItem('cwf_pricing_cta_variant', random)
    setCtaVariant(random)
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

    // Add a quick, explicit confirm step so users can back out without leaving the site.
    setCheckoutError(null)
    setConfirmPlan(planType)
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

  const getPlanCta = (plan) => {
    if (plan.planType === 'monthly') return ctaVariant === 'a' ? 'Start Pro' : 'Go Pro'
    return plan.cta
  }

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
            Simple Pricing
          </h2>
          <p 
            className="text-xl"
            style={{ color: 'var(--text-secondary)' }}
          >
            Cancel anytime.
          </p>
        </div>

        {checkoutCanceled && (
          <div className="neu-card rounded-2xl p-4 mb-6 text-center">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Checkout canceled{checkoutCanceledPlan ? ` (${checkoutCanceledPlan})` : ''}. You can restart anytime.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className="rounded-2xl p-8 transition-all flex flex-col"
              style={{
                background: plan.popular ? 'linear-gradient(145deg, #3B82F6, #2563EB)' : 'var(--bg-card)',
                boxShadow: plan.popular 
                  ? 'inset 4px 4px 8px rgba(59,130,246,0.3), inset -4px -4px 8px rgba(255,255,255,0.1), 0 8px 24px rgba(59,130,246,0.3)'
                  : 'var(--shadow-card)',
                border: `2px solid ${plan.popular ? 'rgba(255,255,255,0.2)' : 'var(--border-color)'}`,
              }}
            >
              {plan.popular && (
                <span 
                  className="inline-block text-sm font-bold px-3 py-1 rounded-full mb-4"
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: '#fff'
                  }}
                >
                  Most Value
                </span>
              )}
              <h3 
                className="text-2xl font-bold mb-2"
                style={{ color: plan.popular ? '#fff' : 'var(--text-primary)' }}
              >
                {plan.name}
              </h3>
              <p 
                className="mb-4 text-sm"
                style={{ color: plan.popular ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)' }}
              >
                {plan.description}
              </p>
              <div className="mb-6">
                <span 
                  className="text-4xl font-bold"
                  style={{ color: plan.popular ? '#fff' : 'var(--text-primary)' }}
                >
                  {plan.price}
                </span>
                {plan.priceNote && (
                  <span 
                    className="text-sm ml-2"
                    style={{ color: plan.popular ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}
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
                        color: plan.popular ? 'rgba(255,255,255,0.9)' : 'var(--text-secondary)' 
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
                  background: plan.popular
                    ? 'linear-gradient(145deg, #fff, #f3f4f6)'
                    : 'linear-gradient(145deg, #3B82F6, #3B82F6DD)',
                  color: plan.popular ? '#3B82F6' : '#fff',
                  border: `2px solid ${plan.popular ? '#E5E7EB' : '#3B82F650'}`,
                  boxShadow: plan.popular
                    ? 'inset 3px 3px 6px rgba(0,0,0,0.1), inset -3px -3px 6px rgba(255,255,255,1), 0 4px 12px rgba(0,0,0,0.15)'
                    : 'inset 3px 3px 6px rgba(59,130,246,0.4), inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px rgba(59,130,246,0.4)',
                  transform: 'translateY(0) scale(1)',
                  opacity: loading ? 0.7 : 1
                }}
                onMouseDown={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(2px) scale(0.98)';
                    e.currentTarget.style.boxShadow = plan.popular
                      ? 'inset 4px 4px 8px rgba(0,0,0,0.15), inset -3px -3px 6px rgba(255,255,255,0.8), 0 2px 6px rgba(0,0,0,0.1)'
                      : 'inset 4px 4px 8px rgba(59,130,246,0.6), inset -3px -3px 6px rgba(255,255,255,0.3), 0 2px 6px rgba(59,130,246,0.3)';
                  }
                }}
                onMouseUp={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = plan.popular
                      ? 'inset 3px 3px 6px rgba(0,0,0,0.1), inset -3px -3px 6px rgba(255,255,255,1), 0 4px 12px rgba(0,0,0,0.15)'
                      : 'inset 3px 3px 6px rgba(59,130,246,0.4), inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px rgba(59,130,246,0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = plan.popular
                      ? 'inset 3px 3px 6px rgba(0,0,0,0.1), inset -3px -3px 6px rgba(255,255,255,1), 0 4px 12px rgba(0,0,0,0.15)'
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
          30-day money-back guarantee. No questions asked.
        </p>
      </div>

      {confirmPlan && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={closeConfirm}
        >
          <div
            className="neu-card w-full max-w-md rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Continue to secure checkout?
            </h3>
            <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
              You are about to leave CineWorkflo and open Stripe Checkout. You can cancel on Stripe and come back here.
            </p>
            {checkoutError && (
              <div
                className="rounded-xl p-3 mb-4 text-sm"
                style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: 'var(--text-primary)'
                }}
              >
                {checkoutError}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={closeConfirm}
                className="flex-1 py-3 rounded-xl font-semibold"
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  opacity: loading ? 0.6 : 1
                }}
                disabled={loading}
              >
                Stay here
              </button>
              <button
                onClick={() => startCheckout(confirmPlan)}
                className="flex-1 py-3 rounded-xl font-semibold"
                style={{
                  background: 'linear-gradient(145deg, #3B82F6, #2563EB)',
                  color: '#fff',
                  opacity: loading ? 0.7 : 1
                }}
                disabled={loading}
              >
                {loading ? 'Opening…' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
