import Link from 'next/link'
import { CheckCircle, Download, Mail, Sparkles } from 'lucide-react'
import { buildSeoMetadata } from '../../lib/seo'

export const metadata = buildSeoMetadata({
  title: 'Purchase Success | CineWorkflo',
  description: 'Purchase confirmation page for CineWorkflo.',
  path: '/success',
  noindex: true,
})

export default async function SuccessPage({ searchParams }) {
  const params = await searchParams
  const rawPlan = params?.plan
  const plan = rawPlan === 'monthly' ? 'monthly' : 'yearly'

  return (
    <main className="route-shell">
      <div className="container success-page-shell">
        <section className="feature-card static-card success-card">
          <div className="success-icon">
            <CheckCircle className="icon-lg" />
          </div>

          <div className="success-pill">
            <Sparkles className="icon-xs" />
            {plan === 'monthly' ? 'Pro Monthly Activated' : 'Pro Yearly Activated'}
          </div>

          <h1>Welcome to Pro!</h1>
          <p className="success-copy">
            {plan === 'monthly'
              ? 'Payment received. Your Pro subscription is being finalized securely and usually appears within seconds.'
              : 'Payment received. Your Pro yearly access is being finalized securely and usually appears within seconds.'}
          </p>

          <div className="success-actions">
            <Link href="/prompts" className="cta-primary">
              <Download className="icon-sm" />
              Browse All Prompts
            </Link>
            <Link href="/shot-to-prompt" className="cta-secondary">
              Try Shot to Prompt
            </Link>
          </div>

          <div className="success-support">
            <p>Check your email for your receipt and access details.</p>
            <a href="mailto:studio@cineworkflo.com" className="inline-text-link success-support-link">
              <Mail className="icon-xs" />
              Contact Support
            </a>
          </div>
        </section>
      </div>
    </main>
  )
}
