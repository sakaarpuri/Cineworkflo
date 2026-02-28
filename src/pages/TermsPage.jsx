import { Link } from 'react-router-dom'

export default function TermsPage() {
  return (
    <div className="min-h-screen py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-5 text-sm flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
          <Link to="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-secondary)' }}>Terms</span>
        </nav>
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Terms of Service</h1>
        <div className="space-y-4 text-sm leading-7" style={{ color: 'var(--text-secondary)' }}>
          <p>Use of CineWorkflo is subject to lawful use, account integrity, and fair usage of platform features and APIs.</p>
          <p>Paid plans grant access according to plan terms. Abuse, reverse engineering, or fraudulent activity may result in account suspension.</p>
          <p>Service features may evolve over time as models, providers, and tooling change.</p>
          <p>Questions about terms can be sent to <a href="mailto:support@cineworkflo.com" className="underline">support@cineworkflo.com</a>.</p>
        </div>
      </div>
    </div>
  )
}
