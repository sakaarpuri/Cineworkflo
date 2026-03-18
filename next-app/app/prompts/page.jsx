import Link from 'next/link'
import { CATEGORY_PAGES, FEATURED_VAULT_CARDS } from '../../lib/prompt-data'

export const metadata = {
  title: 'Prompt Vault | CineWorkflo Next Migration',
  description: 'Prompt Vault route scaffold for the Next.js migration, including category pages and a richer discovery shell.',
}

export default function PromptsPage() {
  return (
    <main className="route-shell">
      <div className="container page-stack">
        <div className="section-heading left">
          <div className="eyebrow">Prompt Vault</div>
          <h1>Prompt discovery in Next.js</h1>
          <p>
            The public Vault surface now has a real discovery shell: category routes, featured prompts, and room for
            the live grid and search behavior to move over without changing URLs.
          </p>
        </div>

        <section className="feature-card static-card vault-hero-shell">
          <div className="vault-hero-copy">
            <div className="card-eyebrow">Why this route matters</div>
            <h2>Vault is more than prompt volume</h2>
            <p>
              It is the curated reference layer of CineWorkFlo: searchable, category-led, and built for image-to-video
              workflows rather than generic prompt dumping.
            </p>
          </div>
          <div className="card-grid three-up compact-three-up">
            {FEATURED_VAULT_CARDS.map((card) => (
              <div key={card.id} className="feature-card static-card vault-card compact-vault-card">
                <div className="vault-thumb" />
                <div className="card-eyebrow">{card.category}</div>
                <h3>#{card.id} · {card.title}</h3>
                <p>{card.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="card-grid three-up">
          {CATEGORY_PAGES.map((category) => (
            <Link key={category.slug} href={`/prompts/${category.slug}`} className="feature-card static-card">
              <div className="card-eyebrow" style={{ color: category.accent }}>
                {category.name}
              </div>
              <h2>{category.count}+ prompts</h2>
              <p>{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
