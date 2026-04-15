'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const NAV_LINKS = [
  { href: '/prompts', label: 'Prompt Vault' },
  { href: '/shot-to-prompt', label: 'Shot to Prompt' },
  { href: '/camera-moves', label: 'Camera Moves' },
  { href: '/pricing', label: 'Pricing' },
]

export default function AuthNav() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading, signOut, displayName, isPro } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [theme, setTheme] = useState('dark')
  const [isMounted, setIsMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null
    const nextTheme = saved === 'light' || saved === 'dark' ? saved : 'dark'
    setTheme(nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
    setIsMounted(true)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme)
    }
  }, [theme])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
    setIsSigningOut(false)
    router.push('/')
    router.refresh()
  }

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  const themeIcon = isMounted && theme === 'light' ? <Moon size={18} /> : <Sun size={18} />

  const signInHref = pathname === '/sign-in' ? '/sign-in' : `/sign-in?next=${encodeURIComponent(pathname || '/my-library')}`

  const authLinks = user ? (
    <>
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
    </>
  ) : (
    <>
      <Link href="/pricing" className="header-pro-cta">
        Get Pro
      </Link>
      <Link
        href={signInHref}
        className="header-auth-link"
      >
        Sign In
      </Link>
    </>
  )

  if (loading) {
    return (
      <div className="auth-nav">
        <button type="button" className="header-theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {themeIcon}
        </button>
        <div className="auth-nav-desktop">
          <Link href="/pricing" className="header-pro-cta">
            Get Pro
          </Link>
          <Link
            href={signInHref}
            className="header-auth-link"
          >
            Sign In
          </Link>
        </div>
        <button type="button" className="mobile-nav-button" onClick={() => setMobileMenuOpen((current) => !current)} aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen}>
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {mobileMenuOpen ? (
          <div className="mobile-nav-panel">
            <nav className="mobile-nav-links">
              {NAV_LINKS.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mobile-nav-actions">
              <Link href="/pricing" className="header-pro-cta">
                Get Pro
              </Link>
              <Link
                href={signInHref}
                className="header-auth-link"
              >
                Sign In
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <>
      <div className="auth-nav">
        <button type="button" className="header-theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {themeIcon}
        </button>
        <div className="auth-nav-desktop">{authLinks}</div>
        <button
          type="button"
          className="mobile-nav-button"
          onClick={() => setMobileMenuOpen((current) => !current)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {mobileMenuOpen ? (
        <div className="mobile-nav-panel">
          <nav className="mobile-nav-links">
            {NAV_LINKS.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/my-library">My Library</Link>
                <Link href="/settings">Settings</Link>
              </>
            ) : null}
          </nav>
          <div className="mobile-nav-actions">{authLinks}</div>
        </div>
      ) : null}
    </>
  )
}
