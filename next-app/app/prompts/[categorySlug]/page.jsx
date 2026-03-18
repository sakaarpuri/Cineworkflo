import Link from 'next/link'
import { CATEGORY_BY_SLUG, CATEGORY_PAGES } from '../../../lib/prompt-data'

export function generateStaticParams() {
  return CATEGORY_PAGES.map((category) => ({ categorySlug: category.slug }))
}

export async function generateMetadata({ params }) {
  const category = CATEGORY_BY_SLUG[params.categorySlug]
  if (!category) {
    return { title: 'Prompt Category | CineWorkflo Next Migration' }
  }

  return {
    title: `${category.name} AI Video Prompts | CineWorkflo Next Migration`,
    description: `${category.description} This is the category-route scaffold for the Next.js migration.`,
  }
}

export default async function PromptCategoryPage({ params }) {
  const category = CATEGORY_BY_SLUG[params.categorySlug]

  if (!category) {
    return (
      <main className="route-shell">
        <div className="container">
          <div className="feature-card static-card">
            <div className="card-eyebrow">Category not found</div>
            <h1>Unknown category</h1>
            <p>This category slug does not exist in the migration scaffold.</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="route-shell">
      <div className="container category-shell">
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/prompts">Prompt Vault</Link>
          <span>/</span>
          <span>{category.name}</span>
        </div>

        <div className="category-hero feature-card static-card">
          <div className="card-eyebrow" style={{ color: category.accent }}>Prompt Category</div>
          <h1>{category.name}</h1>
          <p>{category.description}</p>
          <div className="category-meta">
            <span>{category.count}+ prompts in current library</span>
            <span>SEO route scaffolded in Next.js</span>
          </div>
        </div>

        <div className="section-grid">
          <div className="feature-card static-card">
            <div className="card-eyebrow">Why this route matters</div>
            <h2>Indexable category landing pages</h2>
            <p>
              These category pages are some of the highest-value public SEO surfaces after the homepage and main Prompt Vault.
            </p>
          </div>
          <div className="feature-card static-card">
            <div className="card-eyebrow">Next migration goal</div>
            <h2>Port real grid + metadata next</h2>
            <p>
              The next pass will bring over the actual category card grid, thumbnails, and prompt summaries while preserving the current URLs.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
