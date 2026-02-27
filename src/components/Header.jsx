import { useState, useEffect } from 'react'
import { Menu, X, Film, Sun, Moon, User, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Header({ onAuthClick }) {
  const { user, signOut, isPro } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <header 
      className="sticky top-0 z-50 transition-colors duration-300"
      style={{ 
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <Film className="h-8 w-8" style={{ color: 'var(--accent-blue)' }} />
            <span 
              className="font-display font-bold text-xl"
              style={{ color: 'var(--text-primary)' }}
            >
              CineWorkflo
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/prompts" 
              className="font-medium transition-colors hover:opacity-80"
              style={{ color: 'var(--text-secondary)' }}
            >
              Prompt Vault
            </Link>
            <Link 
              to="/shot-to-prompt" 
              className="font-medium transition-colors hover:opacity-80"
              style={{ color: 'var(--text-secondary)' }}
            >
              Shot to Prompt
            </Link>
            <a
              href="/camera-moves.html"
              className="font-medium transition-colors hover:opacity-80"
              style={{ color: 'var(--text-secondary)' }}
            >
              Camera Moves
            </a>
            <a 
              href="#pricing" 
              className="font-medium transition-colors hover:opacity-80"
              style={{ color: 'var(--text-secondary)' }}
            >
              Pricing
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all"
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)'
              }}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
              ) : (
                <Sun className="h-5 w-5" style={{ color: 'var(--accent-blue)' }} />
              )}
            </button>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-3">
                {isPro && (
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      background: 'linear-gradient(145deg, #8B5CF6, #7C3AED)',
                      color: '#fff'
                    }}
                  >
                    PRO
                  </span>
                )}
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {user.email}
                </span>
                <button
                  onClick={signOut}
                  className="p-2 rounded-lg transition-all"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-muted)'
                  }}
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={onAuthClick}
                  className="font-medium transition-colors hover:opacity-80"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Sign In
                </button>
                <a
                  href="#pricing"
                  className="px-5 py-2 rounded-lg font-semibold transition-all duration-200"
                  style={{
                    background: 'linear-gradient(145deg, #3B82F6, #3B82F6DD)',
                    color: '#fff',
                    border: '2px solid #3B82F650',
                    boxShadow: 'inset 3px 3px 6px rgba(59,130,246,0.4), inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px rgba(59,130,246,0.4)',
                    transform: 'translateY(0) scale(1)'
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'translateY(2px) scale(0.96)';
                    e.currentTarget.style.boxShadow = 'inset 4px 4px 8px rgba(59,130,246,0.6), inset -3px -3px 6px rgba(255,255,255,0.3), 0 2px 6px rgba(59,130,246,0.3)';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'inset 3px 3px 6px rgba(59,130,246,0.4), inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px rgba(59,130,246,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'inset 3px 3px 6px rgba(59,130,246,0.4), inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px rgba(59,130,246,0.4)';
                  }}
                >
                  Get Pro
                </a>
              </>
            )}
          </div>

          <button 
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            style={{ color: 'var(--text-primary)' }}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div 
            className="md:hidden py-4 border-t transition-colors"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <nav className="flex flex-col gap-4">
              <Link 
                to="/prompts" 
                onClick={() => setIsOpen(false)}
                className="font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                Prompt Vault
              </Link>
              <Link 
                to="/shot-to-prompt" 
                onClick={() => setIsOpen(false)}
                className="font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                Shot to Prompt
              </Link>
              <a
                href="/camera-moves.html"
                onClick={() => setIsOpen(false)}
                className="font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                Camera Moves
              </a>
              <a 
                href="#pricing" 
                onClick={() => setIsOpen(false)}
                className="font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                Pricing
              </a>
              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </button>
                {user ? (
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                      {user.email}
                    </span>
                    <button
                      onClick={() => { signOut(); setIsOpen(false); }}
                      className="px-4 py-2 rounded-lg font-medium"
                      style={{
                        background: 'var(--accent-red)',
                        color: '#fff'
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { onAuthClick(); setIsOpen(false); }}
                    className="px-5 py-2 rounded-lg font-medium text-center flex-1"
                    style={{
                      background: 'var(--accent-blue)',
                      color: '#fff'
                    }}
                  >
                    Sign In
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}