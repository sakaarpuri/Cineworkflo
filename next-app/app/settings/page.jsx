import SettingsClient from '../../components/SettingsClient'
import { PAGE_SEO } from '../../lib/seo'

export const metadata = PAGE_SEO.settings

export default function SettingsPage() {
  return <SettingsClient />
}
