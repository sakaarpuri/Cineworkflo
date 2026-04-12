import PromptVaultClient from '../../components/PromptVaultClient'
import { PAGE_SEO } from '../../lib/seo'

export const metadata = PAGE_SEO.prompts

export default function PromptsPage() {
  return (
    <main className="route-shell">
      <div className="container">
        <PromptVaultClient />
      </div>
    </main>
  )
}
