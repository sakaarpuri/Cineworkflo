import PricingClient from '../../components/PricingClient'
import { PAGE_SEO } from '../../lib/seo'

export const metadata = PAGE_SEO.pricing

export default function PricingPage() {
  return (
    <main className="route-shell">
      <div className="container">
        <PricingClient />
      </div>
    </main>
  )
}
