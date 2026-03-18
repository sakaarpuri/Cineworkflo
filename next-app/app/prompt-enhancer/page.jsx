import PromptEnhancerClient from '../../components/PromptEnhancerClient'

export const metadata = {
  title: 'Prompt Enhancer | CineWorkflo Next Migration',
  description:
    'Describe the shot in your head, then shape it with mood, style presets, and pro-level prompt detail in the Next.js migration.',
}

export default function PromptEnhancerPage() {
  return (
    <main className="route-shell">
      <div className="container">
        <PromptEnhancerClient />
      </div>
    </main>
  )
}
