import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Get started with AI video prompts',
    features: [
      '25 core prompts',
      'Basic search',
      'Copy to clipboard',
      'Email support'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Pro',
    price: '$49',
    priceNote: 'one-time payment',
    description: 'Complete toolkit for serious creators',
    features: [
      '150+ professional prompts',
      'Shot to Prompt AI tool',
      'Advanced search & filters',
      'Workflow templates',
      'Monthly new prompts',
      'Priority support',
      'Lifetime access'
    ],
    cta: 'Get Pro Access',
    popular: true
  }
]

export default function Pricing() {
  return (
    <section 
      className="py-16 transition-colors"
      id="pricing"
      style={{ background: 'var(--bg-primary)' }}
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
            One payment. Lifetime access. No subscriptions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
                className="w-full py-3 rounded-xl font-medium transition-all"
                style={{
                  background: plan.popular ? '#fff' : 'var(--accent-blue)',
                  color: plan.popular ? 'var(--accent-blue)' : '#fff',
                  boxShadow: plan.popular ? '0 4px 14px rgba(0,0,0,0.2)' : '0 4px 14px rgba(37,99,235,0.25)'
                }}
              >
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
