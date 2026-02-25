import { Film, Twitter, Mail, Github } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Film className="h-6 w-6 text-brand-400" />
              <span className="font-display font-bold text-xl text-white">CineWorkflo</span>
            </div>
            <p className="text-gray-400 max-w-sm">
              Professional AI video prompts for filmmakers. 
              Create stunning content with Runway, Pika, and more.
            </p>
          </div>
          <div>
            <h4 className="font-display font-bold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/prompts" className="hover:text-white transition-colors">Prompt Vault</Link></li>
              <li><Link to="/shot-to-prompt" className="hover:text-white transition-colors">Shot to Prompt</Link></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-white mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="mailto:support@cineworkflo.com" className="hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href="https://github.com/sakaarpuri/Cineworkflo" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2026 CineWorkflo. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}