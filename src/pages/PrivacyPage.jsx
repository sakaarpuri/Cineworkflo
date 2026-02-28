import { Link } from 'react-router-dom'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-5 text-sm flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
          <Link to="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-secondary)' }}>Privacy Policy</span>
        </nav>
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Privacy Policy</h1>
        <div className="space-y-4 text-sm leading-7" style={{ color: 'var(--text-secondary)' }}>
          <p>We collect account details, product usage events, and billing-related identifiers required to operate CineWorkflo.</p>
          <p>We use this information to provide access, process payments, secure accounts, and improve product reliability and performance.</p>
          <p>We do not sell personal data. Third-party processors may include payment and infrastructure providers used to run the service.</p>
          <p>For data requests, contact <a href="mailto:support@cineworkflo.com" className="underline">support@cineworkflo.com</a>.</p>
        </div>
      </div>
    </div>
  )
}
