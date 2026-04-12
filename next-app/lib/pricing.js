export const PRICING_VARIANTS = {
  usd: {
    key: 'usd',
    currencyCode: 'USD',
    symbol: '$',
    monthlyDisplay: '$7.99',
    monthlyPeriod: '/month',
    yearlyDisplay: '$49',
    yearlyPeriod: '/year',
    monthlyCta: 'Go Pro — $7.99/mo',
    yearlyCta: 'Go Yearly — $49/yr',
  },
  inr: {
    key: 'inr',
    currencyCode: 'INR',
    symbol: '₹',
    monthlyDisplay: '₹99',
    monthlyPeriod: '/month',
    yearlyDisplay: '₹599',
    yearlyPeriod: '/year',
    monthlyCta: 'Go Pro — ₹99/mo',
    yearlyCta: 'Go Yearly — ₹599/yr',
  },
}

export const DEFAULT_PRICING_VARIANT = PRICING_VARIANTS.usd

export function buildPricingTiers(variant = DEFAULT_PRICING_VARIANT) {
  return [
    {
      name: 'Free',
      planType: 'free',
      price: '$0',
      period: '/month',
      description: 'Dip your toes in. No credit card, no catch.',
      hook: 'Good for testing the workflow.',
      featured: false,
      ctaLabel: 'Start Free — No Card Needed',
      ctaHref: '/prompts',
      features: ['5 total generations / month (Enhancer + Shot to Prompt)', 'Prompt Vault (all prompts)', 'Basic search', 'Copy to clipboard'],
    },
    {
      name: 'Pro',
      planType: 'monthly',
      price: variant.monthlyDisplay,
      period: variant.monthlyPeriod,
      description: 'For creators who ship every month. Unlimited everything.',
      hook: 'Most popular for active image-to-video work.',
      featured: false,
      ctaLabel: variant.monthlyCta,
      ctaHref: '/pricing',
      features: ['Unlimited Prompt Enhancer generations', 'Prompt Vault (all prompts)', 'Shot to Prompt AI tool', 'Advanced search & filters', 'New prompts weekly', 'Cancel anytime'],
    },
    {
      name: 'Pro Yearly',
      planType: 'yearly',
      price: variant.yearlyDisplay,
      period: variant.yearlyPeriod,
      description: 'Huge discount versus monthly. Best value if you plan to stay.',
      hook: 'Save 49% compared with paying monthly',
      featured: true,
      ctaLabel: variant.yearlyCta,
      ctaHref: '/pricing',
      features: ['Everything in Pro', 'Save 49% vs monthly billing', 'Unlimited Prompt Enhancer generations', 'Prompt Vault (all prompts)', 'Shot to Prompt AI tool', 'Advanced search & filters', 'New prompts weekly'],
    },
  ]
}
