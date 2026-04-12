import PromptEnhancerClient from '../../components/PromptEnhancerClient'
import { PAGE_SEO } from '../../lib/seo'

export const metadata = PAGE_SEO.promptEnhancer

export default function PromptEnhancerPage() {
  return (
    <main className="route-shell">
      <div className="container">
        <PromptEnhancerClient />
      </div>
    </main>
  )
}
