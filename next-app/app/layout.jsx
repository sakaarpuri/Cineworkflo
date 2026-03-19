import './globals.css'
import Link from 'next/link'
import AppProviders from '../components/AppProviders'
import AuthNav from '../components/AuthNav'
import { siteMetadataBase } from '../lib/seo'

export const metadata = {
  metadataBase: siteMetadataBase,
  title: {
    default: 'CineWorkflo — Prompt Vault, Prompt Enhancer & Shot to Prompt for AI Video',
    template: '%s',
  },
  description:
    'The prompt toolkit for AI filmmakers — Prompt Vault, Prompt Enhancer, Shot to Prompt, and Camera Moves for stronger image-to-video workflows.',
}

const navLinks = [
  { href: '/prompt-enhancer', label: 'Prompt Enhancer' },
  { href: '/prompts', label: 'Prompt Vault' },
  { href: '/shot-to-prompt', label: 'Shot to Prompt' },
  { href: '/camera-moves', label: 'Camera Moves' },
  { href: '/pricing', label: 'Pricing' },
]

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <div className="page-shell">
            <header className="site-header">
              <div className="container header-inner">
                <Link href="/" className="brand">
                  CineWorkflo
                </Link>
                <nav className="nav-links">
                  {navLinks.map((item) => (
                    <Link key={item.href} href={item.href}>
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="header-right">
                  <AuthNav />
                </div>
              </div>
            </header>
            {children}
            <footer className="site-footer">
              <div className="container footer-copy">CineWorkflo — less guessing, more directing.</div>
            </footer>
          </div>
        </AppProviders>
      </body>
    </html>
  )
}
