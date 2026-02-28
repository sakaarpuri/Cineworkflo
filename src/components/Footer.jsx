import { Film, Twitter, Mail, Github } from 'lucide-react'
import { Link } from 'react-router-dom'

const BUILD_TAG = 'v2026.02.28.4'

export default function Footer() {
  return (
    <footer 
      className="py-12 transition-colors"
      style={{ 
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Film className="h-6 w-6" style={{ color: 'var(--accent-blue)' }} />
              <span 
                className="font-display font-bold text-xl"
                style={{ color: 'var(--text-primary)' }}
              >
                CineWorkflo
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)' }} className="max-w-sm">
              Professional AI video prompts for filmmakers. 
              Create stunning content with Runway, Pika, and more.
            </p>
          </div>
          <div>
            <h4 
              className="font-display font-bold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/prompts" 
                  className="transition-colors hover:opacity-80"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Prompt Vault
                </Link>
              </li>
              <li>
                <Link 
                  to="/shot-to-prompt" 
                  className="transition-colors hover:opacity-80"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Shot to Prompt
                </Link>
              </li>
              <li>
                <Link 
                  to="/camera-moves" 
                  className="transition-colors hover:opacity-80"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Camera Moves
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="transition-colors hover:opacity-80"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="transition-colors hover:opacity-80"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="transition-colors hover:opacity-80"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 
              className="font-display font-bold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Connect
            </h4>
            <div className="flex gap-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="transition-colors hover:opacity-80"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="mailto:support@cineworkflo.com" 
                className="transition-colors hover:opacity-80"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Mail className="h-5 w-5" />
              </a>
              <a 
                href="https://github.com/sakaarpuri/Cineworkflo" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="transition-colors hover:opacity-80"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div 
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <p style={{ color: 'var(--text-muted)' }} className="text-sm">
            © 2026 CineWorkflo. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link
              to="/privacy"
              className="transition-colors hover:opacity-80"
              style={{ color: 'var(--text-muted)' }}
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="transition-colors hover:opacity-80"
              style={{ color: 'var(--text-muted)' }}
            >
              Terms
            </Link>
            <span
              className="px-2 py-1 rounded-md text-xs font-semibold"
              style={{
                color: 'var(--text-muted)',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)'
              }}
            >
              {BUILD_TAG}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
