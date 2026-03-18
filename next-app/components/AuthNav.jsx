'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function AuthNav() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading, signOut, displayName, isPro } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
    setIsSigningOut(false)
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return <div className="auth-nav loading">Checking session…</div>
  }

  if (!user) {
    return (
      <div className="auth-nav">
        <Link
          href={pathname === '/sign-in' ? '/my-library' : `/sign-in?next=${encodeURIComponent(pathname || '/my-library')}`}
          className="header-auth-link"
        >
          Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="auth-nav">
      <Link href="/my-library" className="header-auth-link">
        My Library
      </Link>
      <Link href="/settings" className="header-auth-link">
        Settings
      </Link>
      <div className="header-user-pill">
        <span>{displayName}</span>
        {isPro ? <span className="header-pro-pill">Pro</span> : null}
      </div>
      <button type="button" onClick={handleSignOut} className="header-auth-link" disabled={isSigningOut}>
        {isSigningOut ? 'Signing out…' : 'Sign Out'}
      </button>
    </div>
  )
}
