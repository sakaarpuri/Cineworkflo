import Link from 'next/link'

export default function InfoPage({ eyebrow, title, description, paragraphs = [], links = [] }) {
  return (
    <main className="route-shell">
      <div className="container info-page-shell">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>{title}</span>
        </nav>

        <section className="feature-card static-card info-page-card">
          <div className="card-eyebrow">{eyebrow}</div>
          <h1>{title}</h1>
          {description ? <p className="info-page-lead">{description}</p> : null}
          <div className="info-page-copy">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        {links.length ? (
          <section className="feature-card static-card info-page-card">
            <div className="card-eyebrow">Useful links</div>
            <div className="info-link-row">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="inline-text-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )
}
