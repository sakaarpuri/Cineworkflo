import { PAGE_SEO } from '../../lib/seo'

export const metadata = PAGE_SEO.cameraMoves

export default function CameraMovesPage() {
  return (
    <main className="route-shell">
      <div className="container">
        <div className="feature-card static-card">
          <div className="card-eyebrow">Phase 1 placeholder</div>
          <h1>Camera Moves</h1>
          <p>
            This public educational route is scaffolded first because it is easy to migrate without touching auth or
            backend behavior.
          </p>
        </div>
      </div>
    </main>
  )
}
