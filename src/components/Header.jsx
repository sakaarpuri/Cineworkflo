import { useState } from 'react'
import { Menu, X, Film } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <Film className="h-8 w-8 text-brand-600" />
            <span className="font-display font-bold text-xl text-gray-900">CineWorkflo</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/prompts" className="text-gray-600 hover:text-gray-900 font-medium">
              Prompt Vault
            </Link>
            <Link to="/shot-to-prompt" className="text-gray-600 hover:text-gray-900 font-medium">
              Shot to Prompt
            </Link>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">
              Pricing
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a 
              href="#pricing"
              className="bg-brand-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors"
            >
              Get Pro
            </a>
          </div>

          <button 
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              <Link to="/prompts" className="text-gray-600 hover:text-gray-900 font-medium">
                Prompt Vault
              </Link>
              <Link to="/shot-to-prompt" className="text-gray-600 hover:text-gray-900 font-medium">
                Shot to Prompt
              </Link>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">
                Pricing
              </a>
              <a 
                href="#pricing"
                className="bg-brand-600 text-white px-5 py-2 rounded-lg font-medium text-center"
              >
                Get Pro
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}