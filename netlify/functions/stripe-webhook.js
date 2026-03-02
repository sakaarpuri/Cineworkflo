const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  || process.env.SUPABASE_SERVICE_KEY
  || process.env.SUPABASE_SERVICE_ROLE
  || '';
const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

const toIsoOrNull = (unixSeconds) => {
  if (!unixSeconds) return null;
  return new Date(Number(unixSeconds) * 1000).toISOString();
};

const getUserIdFromPayload = (object) => {
  if (!object) return null;
  return object?.metadata?.user_id
    || object?.client_reference_id
    || null;
};

const updateUserProStatus = async (userId, updates) => {
  if (!supabaseAdmin) throw new Error('Supabase admin client is not configured');

  const { data: existing, error: getError } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (getError) throw getError;
  if (!existing?.user) throw new Error(`User not found for id ${userId}`);

  const nextMetadata = {
    ...(existing.user.user_metadata || {}),
    ...updates,
  };

  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: nextMetadata,
  });
  if (updateError) throw updateError;
};

const applySubscriptionState = async (subscription, fallbackUserId = null) => {
  const userId = getUserIdFromPayload(subscription) || fallbackUserId;
  if (!userId) return;

  const isActive = subscription.status === 'active' || subscription.status === 'trialing';
  await updateUserProStatus(userId, {
    is_pro: isActive,
    pro_status: subscription.status,
    pro_expires_at: isActive ? toIsoOrNull(subscription.current_period_end) : null,
    stripe_customer_id: subscription.customer ? String(subscription.customer) : '',
    stripe_subscription_id: subscription.id ? String(subscription.id) : '',
  });
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  if (!process.env.STRIPE_SECRET_KEY || !webhookSecret) {
    return jsonResponse(500, { error: 'Stripe webhook env vars are not configured' });
  }
  if (!supabaseAdmin) {
    return jsonResponse(500, { error: 'Supabase admin env vars are not configured' });
  }

  try {
    const signature = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
    if (!signature) {
      return jsonResponse(400, { error: 'Missing Stripe signature header' });
    }

    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body || '', 'base64')
      : Buffer.from(event.body || '', 'utf8');

    const stripeEvent = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    const object = stripeEvent.data.object;

    if (stripeEvent.type === 'checkout.session.completed') {
      if (object.mode === 'subscription' && object.subscription) {
        const userId = getUserIdFromPayload(object);
        const subscription = await stripe.subscriptions.retrieve(object.subscription);
        await applySubscriptionState(subscription, userId);
      }
    }

    if (
      stripeEvent.type === 'customer.subscription.created' ||
      stripeEvent.type === 'customer.subscription.updated' ||
      stripeEvent.type === 'customer.subscription.deleted'
    ) {
      await applySubscriptionState(object);
    }

    if (
      stripeEvent.type === 'invoice.paid' ||
      stripeEvent.type === 'invoice.payment_succeeded' ||
      stripeEvent.type === 'invoice.payment_failed'
    ) {
      const subscriptionId = object.subscription ? String(object.subscription) : '';
      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        await applySubscriptionState(subscription);
      }
    }

    return jsonResponse(200, { received: true });
  } catch (error) {
    return jsonResponse(400, { error: error.message || 'Webhook handling failed' });
  }
};
