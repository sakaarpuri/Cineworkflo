import { Link } from 'react-router-dom'

export default function ContactPage() {
  return (
    <div className="min-h-screen py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-5 text-sm flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
          <Link to="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-secondary)' }}>Contact</span>
        </nav>
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Contact</h1>
        <div className="space-y-4 text-sm leading-7" style={{ color: 'var(--text-secondary)' }}>
          <p>For support, account issues, billing questions, or partnerships, email us at <a href="mailto:support@cineworkflo.com" className="underline">support@cineworkflo.com</a>.</p>
          <p>We typically respond within 1–2 business days.</p>
        </div>
      </div>
    </div>
  )
}
