import ShotToPromptClient from '../../components/ShotToPromptClient'
import { PAGE_SEO } from '../../lib/seo'

export const metadata = PAGE_SEO.shotToPrompt

export default function ShotToPromptPage() {
  return (
    <main className="route-shell">
      <div className="container">
        <ShotToPromptClient />
      </div>
    </main>
  )
}
