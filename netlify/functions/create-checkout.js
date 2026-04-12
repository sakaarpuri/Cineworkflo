// Netlify Function: Create Stripe checkout session
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { resolvePricingContext } = require('./_pricing.cjs');

const PLAN_CONFIG = {
  monthly: {
    mode: 'subscription',
    priceIds: {
      usd: {
        env: 'STRIPE_PRICE_MONTHLY_USD',
        fallback: 'price_1TKhk7IVdn8cddGgVx3Wfuuf',
      },
      inr: {
        env: 'STRIPE_PRICE_MONTHLY_INR',
        fallback: 'price_1TLUSqIVdn8cddGgL2IFHGeK',
      },
    },
    name: 'CineWorkflo Pro Monthly',
    description: 'Unlimited CineWorkflo access billed monthly',
    successPlan: 'monthly',
    metadata: { billing_interval: 'month', access_type: 'subscription' },
  },
  yearly: {
    mode: 'subscription',
    priceIds: {
      usd: {
        env: 'STRIPE_PRICE_YEARLY_USD',
        fallback: 'price_1TKhkMIVdn8cddGg0AtekgTl',
      },
      inr: {
        env: 'STRIPE_PRICE_YEARLY_INR',
        fallback: 'price_1TLUSwIVdn8cddGguFhB1cYp',
      },
    },
    name: 'CineWorkflo Pro Yearly',
    description: 'Unlimited CineWorkflo access billed yearly at a discounted rate',
    successPlan: 'yearly',
    metadata: { billing_interval: 'year', access_type: 'subscription' },
  },
};

const getSiteUrl = () => process.env.URL || process.env.DEPLOY_PRIME_URL || 'https://cineworkflo.com';
const getPlanConfig = (plan) => PLAN_CONFIG[plan] || null;
const getPriceId = (planConfig, pricingVariant) => {
  const selected = planConfig?.priceIds?.[pricingVariant] || planConfig?.priceIds?.usd;
  if (!selected) return '';
  return process.env[selected.env] || selected.fallback || '';
};

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'STRIPE_SECRET_KEY is not configured' })
      };
    }

    const { email, plan, userId, attribution = {} } = JSON.parse(event.body);
    if (!email || !plan || !userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'email, userId, and plan are required' })
      };
    }

    const normalize = (value) => String(value || '').slice(0, 500);
    const firstTouch = attribution.first_touch || {};
    const lastTouch = attribution.last_touch || {};
    const lastCta = attribution.cta_last || {};
    const sharedMetadata = {
      user_id: normalize(userId),
      email: normalize(email),
      first_utm_source: normalize(firstTouch.utm_source),
      first_utm_medium: normalize(firstTouch.utm_medium),
      first_utm_campaign: normalize(firstTouch.utm_campaign),
      last_utm_source: normalize(lastTouch.utm_source),
      last_utm_medium: normalize(lastTouch.utm_medium),
      last_utm_campaign: normalize(lastTouch.utm_campaign),
      last_landing_path: normalize(lastTouch.landing_path),
      last_referrer: normalize(lastTouch.referrer),
      cta_last_name: normalize(lastCta.cta_name),
      cta_last_path: normalize(lastCta.cta_path),
      cta_count: normalize(attribution.cta_count)
    };

    const planConfig = getPlanConfig(plan);
    if (!planConfig) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid plan. Expected monthly or yearly.' })
      }
    }

    const pricingContext = resolvePricingContext(event, context)
    const priceId = getPriceId(planConfig, pricingContext.pricingVariant)
    if (!priceId) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: `Price ID is not configured for ${plan} in ${pricingContext.currencyCode}.` })
      }
    }

    const siteUrl = getSiteUrl()
    const checkoutPayload = {
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: planConfig.mode,
      client_reference_id: userId,
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}&plan=${planConfig.successPlan}`,
      cancel_url: `${siteUrl}/pricing?checkout=canceled&plan=${planConfig.successPlan}`,
      customer_email: email,
      allow_promotion_codes: true,
      metadata: {
        plan,
        product_name: planConfig.name,
        product_description: planConfig.description,
        billing_currency: pricingContext.currencyCode,
        billing_country: pricingContext.countryCode,
        ...planConfig.metadata,
        ...sharedMetadata
      }
    }

    if (planConfig.mode === 'subscription') {
      checkoutPayload.subscription_data = {
        metadata: {
          plan,
          product_name: planConfig.name,
          product_description: planConfig.description,
          billing_currency: pricingContext.currencyCode,
          billing_country: pricingContext.countryCode,
          ...planConfig.metadata,
          ...sharedMetadata
        }
      }
    }

    const session = await stripe.checkout.sessions.create(checkoutPayload);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ sessionId: session.id, url: session.url })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
