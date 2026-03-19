import InfoPage from '../../components/InfoPage'
import { buildSeoMetadata } from '../../lib/seo'

export const metadata = buildSeoMetadata({
  title: 'Terms of Service | CineWorkflo',
  description: 'Read the CineWorkflo terms of service for platform usage and account policies.',
  path: '/terms',
})

export default function TermsPage() {
  return (
    <InfoPage
      eyebrow="Terms"
      title="Terms of Service"
      paragraphs={[
        'Use of CineWorkflo is subject to lawful use, account integrity, and fair usage of platform features and APIs.',
        'Paid plans grant access according to plan terms. Abuse, reverse engineering, or fraudulent activity may result in account suspension.',
        'Service features may evolve over time as models, providers, and tooling change.',
        'Questions about terms can be sent to support@cineworkflo.com.',
      ]}
    />
  )
}
