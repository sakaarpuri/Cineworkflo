import SignInClient from '../../components/SignInClient'
import { PAGE_SEO } from '../../lib/seo'

export const metadata = PAGE_SEO.signIn

export default async function SignInPage({ searchParams }) {
  const params = await searchParams
  const nextPath = typeof params?.next === 'string' && params.next.startsWith('/') ? params.next : '/my-library'
  return <SignInClient nextPath={nextPath} />
}
