import CameraMovesClient from '../../components/CameraMovesClient'
import { PAGE_SEO } from '../../lib/seo'

export const metadata = PAGE_SEO.cameraMoves

export default function CameraMovesPage() {
  return (
    <main className="route-shell">
      <div className="container">
        <CameraMovesClient />
      </div>
    </main>
  )
}
