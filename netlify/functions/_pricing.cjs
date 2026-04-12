const INDIA_COUNTRY_CODES = new Set(['IN'])

const normalizeCountry = (value) => String(value || '').trim().toUpperCase()

const parseGeoHeaderCountry = (value) => {
  if (!value) return ''
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value
    return normalizeCountry(
      parsed?.country?.code ||
      parsed?.country?.code_alpha2 ||
      parsed?.country?.codeAlpha2 ||
      parsed?.country?.country_code ||
      parsed?.country?.name ||
      parsed?.country?.iso_code,
    )
  } catch {
    return ''
  }
}

const detectCountry = (event = {}, context = {}) => {
  const headers = event.headers || {}
  const candidates = [
    context?.geo?.country?.code,
    context?.geo?.country?.codeAlpha2,
    context?.geo?.country?.code_alpha2,
    context?.geo?.country?.country_code,
    headers['x-country'],
    headers['X-Country'],
    headers['x-vercel-ip-country'],
    headers['cf-ipcountry'],
    headers['CF-IPCountry'],
    parseGeoHeaderCountry(headers['x-nf-geo']),
    parseGeoHeaderCountry(headers['X-Nf-Geo']),
  ]

  for (const candidate of candidates) {
    const normalized = normalizeCountry(candidate)
    if (normalized && normalized !== 'XX') return normalized
  }

  return 'US'
}

const getPricingVariantKey = (countryCode) => (INDIA_COUNTRY_CODES.has(normalizeCountry(countryCode)) ? 'inr' : 'usd')

const resolvePricingContext = (event = {}, context = {}) => {
  const countryCode = detectCountry(event, context)
  const pricingVariant = getPricingVariantKey(countryCode)
  return {
    countryCode,
    pricingVariant,
    currencyCode: pricingVariant === 'inr' ? 'INR' : 'USD',
  }
}

module.exports = {
  detectCountry,
  getPricingVariantKey,
  resolvePricingContext,
}
