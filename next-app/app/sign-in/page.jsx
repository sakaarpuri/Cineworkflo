import SignInClient from '../../components/SignInClient'

export const metadata = {
  title: 'Sign In — CineWorkflo',
  description: 'Sign in to CineWorkflo to access your Prompt Vault saves, Pro tools, and synced library.',
}

export default async function SignInPage({ searchParams }) {
  const params = await searchParams
  const nextPath = typeof params?.next === 'string' && params.next.startsWith('/') ? params.next : '/my-library'
  return <SignInClient nextPath={nextPath} />
}
