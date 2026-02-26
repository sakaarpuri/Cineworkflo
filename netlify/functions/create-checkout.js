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
    const { email, plan } = JSON.parse(event.body);

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
                description: 'Unlimited AI generations + all Pro features'
              },
              unit_amount: 499, // $4.99 in cents
              recurring: { interval: 'month' }
            },
            quantity: 1
          }
        ],
        mode: 'subscription',
        success_url: `${process.env.URL || 'https://cineworkflo.com'}/success?session_id={CHECKOUT_SESSION_ID}&plan=monthly`,
        cancel_url: `${process.env.URL || 'https://cineworkflo.com'}/#pricing`,
        customer_email: email,
        metadata: {
          plan: 'monthly'
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
                description: '1 year unlimited access to 150+ AI video prompts and all Pro features'
              },
              unit_amount: 4900, // $49.00 in cents
              recurring: { interval: 'year' }
            },
            quantity: 1
          }
        ],
        mode: 'subscription',
        success_url: `${process.env.URL || 'https://cineworkflo.com'}/success?session_id={CHECKOUT_SESSION_ID}&plan=yearly`,
        cancel_url: `${process.env.URL || 'https://cineworkflo.com'}/#pricing`,
        customer_email: email,
        metadata: {
          plan: 'yearly'
        }
      });
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