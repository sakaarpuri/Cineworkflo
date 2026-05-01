export const PRICING_VARIANTS = {
  usd: {
    key: 'usd',
    currencyCode: 'USD',
    symbol: '$',
    monthlyDisplay: '$2.99',
    monthlyPeriod: '/month',
    yearlyDisplay: '$32.99',
    yearlyPeriod: '/year',
    monthlyCta: 'Go Pro — $2.99/mo',
    yearlyCta: 'Go Yearly — $32.99/yr',
  },
  inr: {
    key: 'inr',
    currencyCode: 'INR',
    symbol: '₹',
    monthlyDisplay: '₹99',
    monthlyPeriod: '/month',
    yearlyDisplay: '₹1099',
    yearlyPeriod: '/year',
    monthlyCta: 'Go Pro — ₹99/mo',
    yearlyCta: 'Go Yearly — ₹1099/yr',
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
      description: 'Save with annual billing. Best value if you know this will stay in your workflow.',
      hook: 'Save about 8% compared with paying monthly',
      badgeLabel: 'Best Value',
      featured: true,
      ctaLabel: variant.yearlyCta,
      ctaHref: '/pricing',
      features: ['Everything in Pro', 'Save with annual billing', 'Unlimited Prompt Enhancer generations', 'Prompt Vault (all prompts)', 'Shot to Prompt AI tool', 'Advanced search & filters', 'New prompts weekly'],
    },
  ]
}
