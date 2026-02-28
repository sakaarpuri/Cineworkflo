import { useMemo, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { PROMPT_CATEGORY_PAGES, PROMPT_LIBRARY } from '../data/promptCategories'

export default function PromptCategoryPage() {
  const { categorySlug } = useParams()
  const [copiedId, setCopiedId] = useState(null)

  const category = useMemo(
    () => PROMPT_CATEGORY_PAGES.find((item) => item.slug === categorySlug),
    [categorySlug]
  )

  const prompts = useMemo(() => {
    if (!category) return []
    return category.promptIds
      .map((promptId) => PROMPT_LIBRARY.find((prompt) => prompt.id === promptId))
      .filter(Boolean)
  }, [category])

  const copyPrompt = (prompt, id) => {
    navigator.clipboard.writeText(prompt)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1800)
  }

  if (!category) {
    return (
      <div className="min-h-screen py-16" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Prompt Category Not Found</h1>
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>This category does not exist.</p>
          <Link to="/prompts" className="underline" style={{ color: 'var(--accent-blue)' }}>
            Go back to Prompt Vault
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-5 text-sm flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
          <Link to="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link to="/prompts" className="hover:underline">Prompt Vault</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-secondary)' }}>{category.name}</span>
        </nav>

        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{category.name} Prompts</h1>
        <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{category.description}</p>
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          Search intent: {category.intent}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {prompts.map((prompt) => (
            <div
              key={prompt.id}
              className="p-5 rounded-2xl"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <div className="flex items-start justify-between mb-2 gap-2">
                <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{prompt.title}</h2>
                <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)' }}>
                  {prompt.tool}
                </span>
              </div>
              <p className="text-sm font-mono leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                {prompt.prompt}
              </p>
              <div className="flex flex-wrap gap-1 mb-4">
                {prompt.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded" style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)' }}>
                    #{tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => copyPrompt(prompt.prompt, prompt.id)}
                className="w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                style={{ background: copiedId === prompt.id ? 'var(--accent-green)' : 'var(--accent-blue)', color: '#fff' }}
              >
                {copiedId === prompt.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copiedId === prompt.id ? 'Copied' : 'Copy Prompt'}
              </button>
            </div>
          ))}
        </div>

        <section className="mt-8 rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Next step</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/shot-to-prompt" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: 'var(--accent-purple)', color: '#fff' }}>
              Convert a reference to prompt
            </Link>
            <Link to="/pricing" className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
              Unlock full prompt library
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
