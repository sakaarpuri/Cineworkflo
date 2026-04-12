import StoryFlowClient from '../../components/StoryFlowClient'
import { PAGE_SEO } from '../../lib/seo'

export const metadata = PAGE_SEO.storyFlow

export default function StoryFlowPage() {
  return <StoryFlowClient />
}
