import { useState, useEffect } from 'react'
import { Menu, X, Film, Sun, Moon } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Header() {
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
            <Link
              to="/camera-moves"
              className="font-medium transition-colors hover:opacity-80"
              style={{ color: 'var(--text-secondary)' }}
            >
              Camera Moves
            </Link>
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

            <a 
              href="#pricing"
              className="px-5 py-2 rounded-lg font-semibold transition-all hover:-translate-y-0.5"
              style={{ 
                background: 'linear-gradient(145deg, #3B82F6, #2563EB)',
                color: '#fff',
                boxShadow: '4px 4px 8px rgba(37,99,235,0.25), -4px -4px 8px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              Get Pro
            </a>
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
                className="font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                Prompt Vault
              </Link>
              <Link 
                to="/shot-to-prompt" 
                className="font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                Shot to Prompt
              </Link>
              <Link
                to="/camera-moves"
                className="font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                Camera Moves
              </Link>
              <a 
                href="#pricing" 
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
                <a 
                  href="#pricing"
                  className="px-5 py-2 rounded-lg font-medium text-center flex-1"
                  style={{ 
                    background: 'var(--accent-blue)',
                    color: '#fff'
                  }}
                >
                  Get Pro
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}