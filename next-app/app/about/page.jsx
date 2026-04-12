import InfoPage from '../../components/InfoPage'
import { buildSeoMetadata } from '../../lib/seo'

export const metadata = buildSeoMetadata({
  title: 'About CineWorkflo — AI Video Prompt Workflows',
  description: 'Learn how CineWorkflo helps filmmakers and creative teams build stronger AI video workflows.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <InfoPage
      eyebrow="About"
      title="About CineWorkflo"
      description="CineWorkflo helps filmmakers and creators produce better AI video outputs with practical prompt workflows."
      paragraphs={[
        'The product combines a curated Prompt Vault, reference-to-prompt tooling, and camera movement education to reduce trial-and-error in generation.',
        'Our focus is practical production outcomes: faster concepting, cleaner direction, and more consistent visual quality.',
        'CineWorkflo is built for filmmakers and creative teams working across image-to-video tools, not for generic prompt dumping.',
      ]}
      links={[
        { href: '/prompts', label: 'Prompt Vault' },
        { href: '/shot-to-prompt', label: 'Shot to Prompt' },
        { href: '/camera-moves', label: 'Camera Moves' },
        { href: '/pricing', label: 'Pricing' },
      ]}
    />
  )
}
