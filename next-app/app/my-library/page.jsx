import MyLibraryClient from '../../components/MyLibraryClient'
import { PAGE_SEO } from '../../lib/seo'

export const metadata = PAGE_SEO.myLibrary

export default function MyLibraryPage() {
  return <MyLibraryClient />
}
