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
    <section className="py-20 bg-gray-50" id="pricing">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Simple Pricing
          </h2>
          <p className="text-xl text-gray-600">
            One payment. Lifetime access. No subscriptions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`rounded-2xl p-8 ${
                plan.popular 
                  ? 'bg-gray-900 text-white ring-4 ring-brand-500 ring-offset-4' 
                  : 'bg-white border border-gray-200'
              }`}
            >
              {plan.popular && (
                <span className="inline-block bg-brand-500 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
                  Most Popular
                </span>
              )}
              <h3 className={`font-display text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h3>
              <p className={`mb-4 ${plan.popular ? 'text-gray-300' : 'text-gray-600'}`}>
                {plan.description}
              </p>
              <div className="mb-6">
                <span className={`font-display text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.price}
                </span>
                {plan.priceNote && (
                  <span className={`text-sm ml-2 ${plan.popular ? 'text-gray-300' : 'text-gray-500'}`}>
                    {plan.priceNote}
                  </span>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className={`h-5 w-5 ${plan.popular ? 'text-brand-400' : 'text-brand-600'}`} />
                    <span className={plan.popular ? 'text-gray-200' : 'text-gray-600'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <button 
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-brand-500 text-white hover:bg-brand-600'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 mt-12">
          30-day money-back guarantee. No questions asked.
        </p>
      </div>
    </section>
  )
}