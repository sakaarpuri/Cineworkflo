const { createClient } = require('@supabase/supabase-js');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const BRAND_NAME = process.env.AUTH_EMAIL_BRAND || 'CineWorkflo';
const FROM_EMAIL = process.env.AUTH_EMAIL_FROM || 'onboarding@resend.dev';
const REPLY_TO_EMAIL = process.env.AUTH_EMAIL_REPLY_TO || '';
const DEFAULT_REDIRECT_URL = process.env.AUTH_CONFIRM_REDIRECT_URL || process.env.URL || 'https://cineworkflo.com/';
const RESEND_API_URL = 'https://api.resend.com/emails';

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
const escapeHtml = (value) => String(value || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const buildConfirmationEmail = ({ actionLink, brandName, fullName }) => {
  const firstName = String(fullName || '').trim().split(/\s+/)[0];
  const greeting = firstName ? `Hi ${escapeHtml(firstName)},` : 'Hi,';
  const safeBrandName = escapeHtml(brandName);
  const safeActionLink = escapeHtml(actionLink);

  return {
    subject: `Confirm your ${brandName} account`,
    text: [
      greeting,
      '',
      `Confirm your ${brandName} account by opening this link:`,
      actionLink,
      '',
      `Once confirmed, you will be signed in and sent back to ${brandName}.`,
      '',
      `If you did not start this signup, you can ignore this email.`
    ].join('\n'),
    html: `
      <div style="margin:0;padding:40px 16px;background:#f8f7fb;font-family:Inter,Arial,sans-serif;color:#0f172a;">
        <div style="max-width:620px;margin:0 auto;">
          <div style="background:linear-gradient(90deg, rgba(37,99,235,0.12), rgba(139,92,246,0.12));border:1px solid #ddd6fe;border-radius:999px;padding:12px 20px;text-align:center;box-shadow:0 10px 24px rgba(15,23,42,0.06);margin:0 auto 18px;max-width:520px;">
            <span style="font-size:13px;font-weight:800;letter-spacing:0.02em;color:#2563eb;">✦ ${safeBrandName}</span>
            <span style="font-size:13px;color:#475569;">&nbsp;email confirmation</span>
          </div>

          <div style="background:rgba(255,255,255,0.98);border:1px solid #eadde7;border-radius:28px;padding:36px 34px;box-shadow:0 18px 40px rgba(15,23,42,0.08);">
            <p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:#334155;">${greeting}</p>

            <h1 style="margin:0 0 14px;font-size:34px;line-height:1.08;letter-spacing:-0.03em;color:#0f172a;">
              Confirm your account
            </h1>

            <p style="margin:0 0 22px;font-size:17px;line-height:1.7;color:#475569;">
              You’re one click away from using ${safeBrandName}. Confirm your email and we’ll sign you in and send you back to the app.
            </p>

            <div style="margin:0 0 24px;">
              <a
                href="${safeActionLink}"
                style="display:inline-block;background:linear-gradient(145deg,#3b82f6,#2563eb);color:#ffffff;text-decoration:none;font-weight:800;font-size:15px;padding:15px 24px;border-radius:999px;box-shadow:0 10px 22px rgba(37,99,235,0.24);"
              >
                Confirm email
              </a>
            </div>

            <div style="margin:0 0 22px;padding:16px 18px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:18px;">
              <p style="margin:0 0 8px;font-size:12px;font-weight:800;letter-spacing:0.08em;color:#64748b;">WHAT HAPPENS NEXT</p>
              <p style="margin:0;font-size:14px;line-height:1.7;color:#475569;">
                Confirming this email logs you in and sends you back to ${safeBrandName}. If this was not you, ignore this email.
              </p>
            </div>

            <p style="margin:0 0 10px;font-size:13px;line-height:1.7;color:#64748b;">
              If the button doesn’t work, use this link:
            </p>
            <p style="margin:0 0 20px;font-size:13px;line-height:1.7;word-break:break-word;">
              <a href="${safeActionLink}" style="color:#2563eb;text-decoration:none;">${safeActionLink}</a>
            </p>

            <div style="padding-top:18px;border-top:1px solid #e9e2ea;">
              <p style="margin:0;font-size:12px;line-height:1.7;color:#94a3b8;">
                ${safeBrandName} · cinematic prompt tools for AI video workflows
              </p>
            </div>
          </div>
        </div>
      </div>
    `
  };
};

const sendResendEmail = async ({ from, to, subject, html, text, replyTo }) => {
  const body = {
    from,
    to,
    subject,
    html,
    text
  };

  if (replyTo) {
    body.reply_to = replyTo;
  }

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || 'Resend email request failed');
  }

  return payload;
};

exports.handler = async (event) => {
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

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.' })
    };
  }

  if (!RESEND_API_KEY || RESEND_API_KEY === 're_xxxxxxxxx') {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Set RESEND_API_KEY to your real Resend API key instead of re_xxxxxxxxx.' })
    };
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    const { email, password, fullName = '', redirectTo } = JSON.parse(event.body || '{}');

    if (!isEmail(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'A valid email is required.' })
      };
    }

    if (String(password || '').length < 6 || !/[\d\W_]/.test(String(password))) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Password must be at least 6 characters and include a number or symbol.' })
      };
    }

    const finalRedirectTo = String(redirectTo || DEFAULT_REDIRECT_URL).trim() || DEFAULT_REDIRECT_URL;
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email: String(email).trim().toLowerCase(),
      password: String(password),
      options: {
        data: {
          full_name: String(fullName || '').trim(),
        },
        redirectTo: finalRedirectTo,
      },
    });

    if (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: error.message })
      };
    }

    const actionLink = data?.properties?.action_link;
    if (!actionLink) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Supabase did not return a confirmation link.' })
      };
    }

    const emailContent = buildConfirmationEmail({
      actionLink,
      brandName: BRAND_NAME,
      fullName,
    });

    await sendResendEmail({
      from: FROM_EMAIL,
      to: String(email).trim(),
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
      replyTo: REPLY_TO_EMAIL,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Unable to send confirmation email.' })
    };
  }
};
