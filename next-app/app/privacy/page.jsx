import InfoPage from '../../components/InfoPage'
import { buildSeoMetadata } from '../../lib/seo'

export const metadata = buildSeoMetadata({
  title: 'Privacy Policy | CineWorkflo',
  description: 'Read the CineWorkflo privacy policy and how account, usage, and billing data are handled.',
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="Privacy policy"
      title="Privacy Policy"
      paragraphs={[
        'We collect account details, product usage events, and billing-related identifiers required to operate CineWorkflo.',
        'We use this information to provide access, process payments, secure accounts, and improve product reliability and performance.',
        'We do not sell personal data. Third-party processors may include payment and infrastructure providers used to run the service.',
        'For data requests, contact support@cineworkflo.com.',
      ]}
    />
  )
}
