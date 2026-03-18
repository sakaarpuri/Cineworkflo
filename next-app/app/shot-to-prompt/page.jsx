import ShotToPromptClient from '../../components/ShotToPromptClient'

export const metadata = {
  title: 'Shot to Prompt | CineWorkflo Next Migration',
  description:
    'Upload a frame or short single-shot clip, then turn it into an image prompt plus a motion-aware video prompt.',
}

export default function ShotToPromptPage() {
  return (
    <main className="route-shell">
      <div className="container">
        <ShotToPromptClient />
      </div>
    </main>
  )
}
