import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Get started with AI video prompts',
    features: [
      '30 AI generations per month',
      '25 core prompts',
      'Basic search',
      'Copy to clipboard',
      'Email support'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Pro Monthly',
    price: '$4.99',
    priceNote: '/month',
    description: 'Full access for active creators',
    features: [
      'Unlimited AI generations',
      '150+ professional prompts',
      'Multiple style interpretations',
      'Shot to Prompt AI tool',
      'Advanced search & filters',
      'New prompts monthly',
      'Priority support',
      'Cancel anytime'
    ],
    cta: 'Start Monthly Plan',
    popular: false
  },
  {
    name: 'Pro Yearly',
    price: '$49',
    priceNote: '/year',
    description: 'Best value for committed creators',
    features: [
      'Everything in Pro Monthly',
      '1 year access',
      'All future updates',
      'Workflow templates (Coming Soon)',
      '30-day money-back guarantee'
    ],
    cta: 'Get Yearly Access',
    popular: true
  }
]

export default function Pricing({ onAuthClick }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleCheckout = async (planType) => {
    if (!user) {
      onAuthClick?.()
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          plan: planType
        })
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error('Checkout error:', err)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section 
      className="py-16 transition-colors relative overflow-hidden"
      id="pricing"
      style={{ background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 50%, var(--bg-secondary) 100%)' }}
    >
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
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
            One payment. Lifetime access. No subscriptions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className="rounded-2xl p-8 transition-all"
              style={{
                background: plan.popular ? 'var(--accent-blue)' : 'var(--bg-card)',
                boxShadow: 'var(--shadow-card)',
                border: `2px solid ${plan.popular ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                transform: plan.popular ? 'scale(1.02)' : 'scale(1)'
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
                  Most Popular
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
              <ul className="space-y-3 mb-8">
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
                onClick={() => handleCheckout(plan.name.includes('Monthly') ? 'monthly' : 'yearly')}
                disabled={loading}
                className="w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                style={{
                  background: plan.popular ? '#fff' : 'var(--accent-blue)',
                  color: plan.popular ? 'var(--accent-blue)' : '#fff',
                  boxShadow: plan.popular ? '0 4px 14px rgba(0,0,0,0.2)' : '0 4px 14px rgba(37,99,235,0.25)',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                {plan.cta}
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
    </section>
  )
}
