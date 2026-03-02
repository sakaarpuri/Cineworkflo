import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function MyLibraryPage() {
  const { user } = useAuth()
  const [savedPrompts, setSavedPrompts] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadSavedPrompts = async () => {
      if (!user) {
        setSavedPrompts([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')
      const { data, error: fetchError } = await supabase
        .from('saved_prompts')
        .select('id, idea, prompt, mood, use_case, skill_level, include_audio_sfx, include_image_details, created_at')
        .order('created_at', { ascending: false })

      if (fetchError) {
        setError(fetchError.message || 'Failed to load saved prompts.')
        setSavedPrompts([])
      } else {
        setSavedPrompts(data || [])
      }
      setLoading(false)
    }

    loadSavedPrompts()
  }, [user])

  const handleCopy = (id, prompt) => {
    navigator.clipboard.writeText(prompt)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1800)
  }

  const handleDelete = async (id) => {
    const { error: deleteError } = await supabase
      .from('saved_prompts')
      .delete()
      .eq('id', id)

    if (deleteError) {
      setError(deleteError.message || 'Failed to delete saved prompt.')
      return
    }

    setSavedPrompts((previous) => previous.filter((item) => item.id !== id))
  }

  if (!user) {
    return (
      <section className="py-16" style={{ background: 'transparent' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            My Library
          </h1>
          <p className="mb-5" style={{ color: 'var(--text-secondary)' }}>
            Sign in to save prompts and access them from any device.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 rounded-lg font-semibold"
            style={{ background: 'var(--accent-blue)', color: '#fff' }}
          >
            Go to Prompt Enhancer
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12" style={{ background: 'transparent' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              My Library
            </h1>
            <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
              Saved prompts from Prompt Enhancer.
            </p>
          </div>
          <Link
            to="/#prompt-enhancer"
            className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            Create New Prompt
          </Link>
        </div>

        {loading && (
          <div className="neu-card rounded-2xl p-6" style={{ color: 'var(--text-secondary)' }}>
            Loading saved prompts...
          </div>
        )}

        {!loading && error && (
          <div className="neu-card rounded-2xl p-6 mb-5" style={{ color: 'var(--accent-red)' }}>
            {error}
          </div>
        )}

        {!loading && !error && savedPrompts.length === 0 && (
          <div className="neu-card rounded-2xl p-6" style={{ color: 'var(--text-secondary)' }}>
            No saved prompts yet. Generate one in Prompt Enhancer and click Save Prompt.
          </div>
        )}

        {!loading && savedPrompts.length > 0 && (
          <div className="grid md:grid-cols-2 gap-5">
            {savedPrompts.map((item) => (
              <article key={item.id} className="neu-card rounded-2xl p-5">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(item.id, item.prompt)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{
                        border: '1px solid var(--border-color)',
                        color: copiedId === item.id ? '#fff' : 'var(--text-secondary)',
                        background: copiedId === item.id ? 'var(--accent-green)' : 'var(--bg-primary)'
                      }}
                    >
                      {copiedId === item.id ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
                      style={{ background: 'var(--accent-red)', color: '#fff' }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  {item.idea || 'Untitled idea'}
                </p>
                <div
                  className="rounded-xl p-3 text-sm leading-relaxed"
                  style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                >
                  {item.prompt}
                </div>
                <div className="flex gap-2 flex-wrap mt-3">
                  {item.skill_level && (
                    <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)' }}>
                      {item.skill_level}
                    </span>
                  )}
                  {item.mood && (
                    <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)' }}>
                      {item.mood}
                    </span>
                  )}
                  {item.use_case && (
                    <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)' }}>
                      {item.use_case}
                    </span>
                  )}
                  {item.include_audio_sfx && (
                    <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)' }}>
                      SFX
                    </span>
                  )}
                  {item.include_image_details && (
                    <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)' }}>
                      Images
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
