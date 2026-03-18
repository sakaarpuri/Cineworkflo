import './globals.css'
import Link from 'next/link'
import AppProviders from '../components/AppProviders'
import AuthNav from '../components/AuthNav'

export const metadata = {
  title: 'CineWorkflo — Next.js Migration',
  description:
    'Parallel Next.js App Router foundation for migrating CineWorkflo from the current Vite app.',
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
                  <div className="migration-pill">Next.js migration foundation</div>
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
