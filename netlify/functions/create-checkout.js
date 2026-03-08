// Netlify Function: Create Stripe checkout session
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
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

    let session;

    if (plan === 'monthly') {
      // Monthly subscription
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'CineWorkflo Pro Monthly',
                description: 'Unlimited CineWorkflo access billed monthly'
              },
              unit_amount: 799, // $7.99 in cents
              recurring: { interval: 'month' }
            },
            quantity: 1
          }
        ],
        mode: 'subscription',
        client_reference_id: userId,
        success_url: `${process.env.URL || 'https://cineworkflo.com'}/success?session_id={CHECKOUT_SESSION_ID}&plan=monthly`,
        cancel_url: `${process.env.URL || 'https://cineworkflo.com'}/pricing?checkout=canceled&plan=monthly`,
        customer_email: email,
        subscription_data: {
          metadata: {
            plan: 'monthly',
            ...sharedMetadata
          }
        },
        metadata: {
          plan: 'monthly',
          ...sharedMetadata
        }
      });
    } else if (plan === 'yearly') {
      // Yearly subscription
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'CineWorkflo Pro Yearly',
                description: 'Unlimited CineWorkflo access billed yearly at a discounted rate'
              },
              unit_amount: 4900, // $49.00 in cents
              recurring: { interval: 'year' }
            },
            quantity: 1
          }
        ],
        mode: 'subscription',
        client_reference_id: userId,
        success_url: `${process.env.URL || 'https://cineworkflo.com'}/success?session_id={CHECKOUT_SESSION_ID}&plan=yearly`,
        cancel_url: `${process.env.URL || 'https://cineworkflo.com'}/pricing?checkout=canceled&plan=yearly`,
        customer_email: email,
        subscription_data: {
          metadata: {
            plan: 'yearly',
            ...sharedMetadata
          }
        },
        metadata: {
          plan: 'yearly',
          ...sharedMetadata
        }
      });
    }

    if (!session) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid plan. Expected monthly or yearly.' })
      };
    }

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
