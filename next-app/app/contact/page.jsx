import InfoPage from '../../components/InfoPage'
import { buildSeoMetadata } from '../../lib/seo'

export const metadata = buildSeoMetadata({
  title: 'Contact CineWorkflo Support',
  description: 'Contact CineWorkflo for support, billing, and partnership questions.',
  path: '/contact',
})

export default function ContactPage() {
  return (
    <InfoPage
      eyebrow="Contact"
      title="Contact"
      description="For support, account issues, billing questions, or partnerships, reach us at support@cineworkflo.com."
      paragraphs={[
        'We typically respond within 1–2 business days.',
        'If you are writing about billing, include the email address on your CineWorkflo account so we can help faster.',
      ]}
      links={[
        { href: '/prompts', label: 'Browse Prompt Vault' },
        { href: '/shot-to-prompt', label: 'Open Shot to Prompt' },
        { href: '/camera-moves', label: 'Learn Camera Moves' },
        { href: '/pricing', label: 'View Pricing' },
      ]}
    />
  )
}
