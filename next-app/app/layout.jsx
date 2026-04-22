import './globals.css'
import Link from 'next/link'
import { Film, Github, Mail, Sparkles, Twitter } from 'lucide-react'
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
  { href: '/prompts', label: 'Prompt Vault' },
  { href: '/shot-to-prompt', label: 'Shot to Prompt' },
  { href: '/camera-moves', label: 'Camera Moves' },
  { href: '/pricing', label: 'Pricing' },
]

const BUILD_TAG = 'v2026.03.03.2'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <div className="page-shell">
            <div className="header-banner">
              <div className="container header-banner-inner">
                <span className="header-banner-pill">
                  <Sparkles size={14} />
                  <span>
                    <strong>Beta v2</strong> is in the can — we&apos;re tuning the Enhancer and expanding the Vault.
                  </span>
                </span>
              </div>
            </div>
            <header className="site-header">
              <div className="container header-inner">
                <Link href="/" className="brand">
                  <Film size={24} />
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
              <div className="container footer-grid">
                <div className="footer-brand-block">
                  <div className="brand footer-brand">
                    <Film size={24} />
                    CineWorkflo
                  </div>
                  <p>The prompt toolkit for AI filmmakers. Less guessing, more directing.</p>
                </div>
                <div className="footer-links-block">
                  <h4>Product</h4>
                  <div className="footer-links">
                    <Link href="/prompts">Prompt Vault</Link>
                    <Link href="/shot-to-prompt">Shot to Prompt</Link>
                    <Link href="/camera-moves">Camera Moves</Link>
                    <Link href="/pricing">Pricing</Link>
                    <Link href="/about">About</Link>
                    <Link href="/contact">Contact</Link>
                  </div>
                </div>
                <div className="footer-links-block">
                  <h4>Connect</h4>
                  <a href="mailto:studio@cineworkflo.com" className="footer-contact-line">
                    studio@cineworkflo.com
                  </a>
                  <div className="footer-socials">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                      <Twitter size={18} />
                    </a>
                    <a href="mailto:studio@cineworkflo.com" aria-label="Email studio">
                      <Mail size={18} />
                    </a>
                    <a href="https://github.com/sakaarpuri/Cineworkflo" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                      <Github size={18} />
                    </a>
                  </div>
                </div>
              </div>
              <div className="container footer-meta">
                <span>© 2026 CineWorkflo. All rights reserved.</span>
                <div className="footer-meta-links">
                  <Link href="/privacy">Privacy</Link>
                  <Link href="/terms">Terms</Link>
                  <span className="footer-build-tag">{BUILD_TAG}</span>
                </div>
              </div>
            </footer>
          </div>
        </AppProviders>
      </body>
    </html>
  )
}
