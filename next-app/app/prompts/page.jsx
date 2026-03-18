import PromptVaultClient from '../../components/PromptVaultClient'

export const metadata = {
  title: 'Prompt Vault | CineWorkflo Next Migration',
  description: 'Browse Prompt Vault in the Next.js migration with real search, filters, thumbnails, and variable-driven prompt controls.',
}

export default function PromptsPage() {
  return (
    <main className="route-shell">
      <div className="container">
        <PromptVaultClient />
      </div>
    </main>
  )
}
