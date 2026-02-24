import { useState } from 'react'
import { Search, Copy, Check, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'

const samplePrompts = [
  {
    id: 1,
    title: 'Cinematic Product Rotation',
    category: 'Product Demo',
    tool: 'Runway',
    prompt: 'Cinematic product shot, rotating 360° on seamless black background, studio lighting with soft reflections, shallow depth of field, 8K quality, motion blur on rotation, professional commercial aesthetic',
    tags: ['product', 'commercial', 'rotation']
  },
  {
    id: 2,
    title: 'Smooth Aerial Drone Shot',
    category: 'B-Roll',
    tool: 'Pika',
    prompt: 'Aerial drone footage, smooth gliding motion over landscape, golden hour lighting, cinematic color grade, slight lens flare, professional travel documentary style, 4K resolution',
    tags: ['drone', 'landscape', 'travel']
  },
  {
    id: 3,
    title: 'Dramatic Lighting Portrait',
    category: 'Interview',
    tool: 'Runway',
    prompt: 'Dramatic interview lighting, Rembrandt style, subject looking slightly off-camera, shallow depth of field, film grain texture, cinematic mood, dark background with rim light',
    tags: ['interview', 'portrait', 'dramatic']
  },
  {
    id: 4,
    title: 'Seamless Loop Background',
    category: 'Motion Graphics',
    tool: 'Runway',
    prompt: 'Abstract flowing particles, seamless loop, soft gradients in teal and coral, gentle organic motion, perfect for text overlay, 4K, smooth 60fps',
    tags: ['background', 'loop', 'abstract']
  },
  {
    id: 5,
    title: 'Handheld Documentary Style',
    category: 'B-Roll',
    tool: 'Pika',
    prompt: 'Handheld camera movement, subtle shake, following subject through environment, natural lighting, documentary style, authentic feel, slight motion blur on edges',
    tags: ['handheld', 'documentary', 'natural']
  },
  {
    id: 6,
    title: 'Luxury Product Showcase',
    category: 'Product Demo',
    tool: 'Runway',
    prompt: 'Luxury product cinematography, slow push-in movement, dramatic rim lighting on black background, shallow depth of field, premium aesthetic, reflections on glossy surface, high-end commercial',
    tags: ['luxury', 'product', 'premium']
  }
]

export default function PromptVault({ preview = false }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [copiedId, setCopiedId] = useState(null)

  const categories = ['All', 'Product Demo', 'B-Roll', 'Interview', 'Motion Graphics', 'Transition']

  const filteredPrompts = samplePrompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'All' || prompt.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const displayedPrompts = preview ? filteredPrompts.slice(0, 3) : filteredPrompts

  const copyPrompt = (prompt, id) => {
    navigator.clipboard.writeText(prompt)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <section className="py-20 bg-gray-50" id="prompts">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Prompt Vault
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {preview 
              ? 'Preview 6 of 150+ professional prompts. Get full access with Pro.' 
              : 'Browse our complete collection of tested prompts for AI video creation.'}
          </p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPrompts.map((prompt) => (
            <div key={prompt.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-1 rounded">
                    {prompt.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {prompt.tool}
                  </span>
                </div>
                <h3 className="font-display font-bold text-gray-900 mb-3">
                  {prompt.title}
                </h3>
                <p className="text-sm text-gray-600 font-mono bg-gray-50 p-3 rounded mb-4 line-clamp-4">
                  {prompt.prompt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {prompt.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-xs text-gray-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => copyPrompt(prompt.prompt, prompt.id)}
                    className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700"
                  >
                    {copiedId === prompt.id ? (
                      <><Check className="h-4 w-4" /> Copied</>
                    ) : (
                      <><Copy className="h-4 w-4" /> Copy</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {preview && (
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 text-gray-500 mb-4">
              <Lock className="h-4 w-4" />
              <span>147 more prompts available in Pro</span>
            </div>
            <Link
              to="/prompts"
              className="inline-block bg-brand-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-brand-700 transition-colors"
            >
              View All Prompts
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}