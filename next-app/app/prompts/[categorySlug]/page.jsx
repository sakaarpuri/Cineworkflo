import PromptVaultClient from '../../../components/PromptVaultClient'
import { CATEGORY_BY_SLUG, PROMPT_CATEGORY_PAGES } from '../../../lib/vault-data'

export function generateStaticParams() {
  return PROMPT_CATEGORY_PAGES.map((category) => ({ categorySlug: category.slug }))
}

export async function generateMetadata({ params }) {
  const category = CATEGORY_BY_SLUG[params.categorySlug]
  if (!category) {
    return { title: 'Prompt Category | CineWorkflo Next Migration' }
  }

  return {
    title: `${category.name} AI Video Prompts | CineWorkflo Next Migration`,
    description: category.description,
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
          <a href="/">Home</a>
          <span>/</span>
          <a href="/prompts">Prompt Vault</a>
          <span>/</span>
          <span>{category.name}</span>
        </div>

        <div className="category-hero feature-card static-card">
          <div className="card-eyebrow" style={{ color: category.accent }}>Prompt Category</div>
          <h1>{category.name}</h1>
          <p>{category.description}</p>
          <div className="category-meta">
            <span>{category.count}+ prompts in current library</span>
            <span>Now rendered from the real Next Vault grid</span>
          </div>
        </div>

        <PromptVaultClient initialCategory={category.name} />
      </div>
    </main>
  )
}
