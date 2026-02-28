import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-5 text-sm flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
          <Link to="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-secondary)' }}>About</span>
        </nav>
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>About CineWorkflo</h1>
        <div className="space-y-4 text-sm leading-7" style={{ color: 'var(--text-secondary)' }}>
          <p>CineWorkflo helps filmmakers and creators produce better AI video outputs with practical prompt workflows.</p>
          <p>The product combines a curated prompt vault, reference-to-prompt tooling, and camera movement education to reduce trial-and-error in generation.</p>
          <p>Our focus is practical production outcomes: faster concepting, cleaner direction, and more consistent visual quality.</p>
        </div>
      </div>
    </div>
  )
}
