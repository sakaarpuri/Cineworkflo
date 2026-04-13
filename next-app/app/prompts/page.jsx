import PromptVaultClient from '../../components/PromptVaultClient'
import { PAGE_SEO } from '../../lib/seo'

export const metadata = PAGE_SEO.prompts

export default async function PromptsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams

  return (
    <main className="route-shell">
      <div className="container">
        <PromptVaultClient
          initialPromptId={resolvedSearchParams?.prompt || ''}
          autoExpandPrompt={resolvedSearchParams?.expand === '1' || resolvedSearchParams?.expand === 'true'}
        />
      </div>
    </main>
  )
}
