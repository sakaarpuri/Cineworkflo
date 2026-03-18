import Link from 'next/link'
import { CATEGORY_PAGES } from '../../lib/prompt-data'

export const metadata = {
  title: 'Prompt Vault | CineWorkflo Next Migration',
  description: 'Prompt Vault route scaffold for the Next.js migration, including category pages.',
}

export default function PromptsPage() {
  return (
    <main className="route-shell">
      <div className="container">
        <div className="section-heading left">
          <div className="eyebrow">Prompt Vault</div>
          <h1>Prompt discovery in Next.js</h1>
          <p>
            The public Vault surface is now scaffolded here with category routes, metadata, and room for the real
            prompt grid to move over without changing URLs.
          </p>
        </div>

        <div className="card-grid three-up">
          {CATEGORY_PAGES.map((category) => (
            <Link key={category.slug} href={`/prompts/${category.slug}`} className="feature-card static-card">
              <div className="card-eyebrow" style={{ color: category.accent }}>{category.name}</div>
              <h2>{category.count}+ prompts</h2>
              <p>{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
