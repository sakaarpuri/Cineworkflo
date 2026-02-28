const FIRST_TOUCH_KEY = 'cwf_attribution_first'
const LAST_TOUCH_KEY = 'cwf_attribution_last'
const CTA_EVENTS_KEY = 'cwf_cta_events'

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']

const safeJsonParse = (raw, fallback) => {
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

const readStorage = (key, fallback = null) => {
  const raw = localStorage.getItem(key)
  return raw ? safeJsonParse(raw, fallback) : fallback
}

const writeStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const pickUtm = (searchParams) =>
  UTM_KEYS.reduce((payload, key) => {
    const value = searchParams.get(key)
    if (value) payload[key] = value
    return payload
  }, {})

export const captureAttributionTouch = ({ pathname, search, referrer = '' }) => {
  const searchParams = new URLSearchParams(search || '')
  const utm = pickUtm(searchParams)
  if (Object.keys(utm).length === 0) return

  const touch = {
    ...utm,
    landing_path: pathname,
    referrer: referrer || '',
    seen_at: new Date().toISOString()
  }

  const firstTouch = readStorage(FIRST_TOUCH_KEY, null)
  if (!firstTouch) writeStorage(FIRST_TOUCH_KEY, touch)
  writeStorage(LAST_TOUCH_KEY, touch)
}

export const trackCtaEvent = (ctaName, ctaPath = '') => {
  const events = readStorage(CTA_EVENTS_KEY, [])
  const nextEvents = [
    ...events,
    {
      cta_name: ctaName,
      cta_path: ctaPath,
      at: new Date().toISOString()
    }
  ].slice(-20)
  writeStorage(CTA_EVENTS_KEY, nextEvents)
}

export const getCheckoutAttributionPayload = () => {
  const firstTouch = readStorage(FIRST_TOUCH_KEY, null)
  const lastTouch = readStorage(LAST_TOUCH_KEY, null)
  const events = readStorage(CTA_EVENTS_KEY, [])
  const lastEvent = events.length ? events[events.length - 1] : null

  return {
    first_touch: firstTouch || {},
    last_touch: lastTouch || {},
    cta_last: lastEvent || {},
    cta_count: events.length
  }
}
