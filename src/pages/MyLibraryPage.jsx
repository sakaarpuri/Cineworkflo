import { useEffect, useMemo, useState } from 'react'
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

  const groupedPrompts = useMemo(() => {
    const groups = []
    const byGroupId = new Map()

    for (const item of savedPrompts) {
      const groupId = item.metadata?.group_id
      if (!groupId) {
        groups.push({ id: item.id, groupId: null, title: item.idea || 'Untitled idea', createdAt: item.created_at, items: [item], legacy: true })
        continue
      }

      if (!byGroupId.has(groupId)) {
        const nextGroup = {
          id: groupId,
          groupId,
          title: item.metadata?.original_idea || item.idea || 'Untitled idea',
          createdAt: item.created_at,
          items: [],
          legacy: false,
        }
        byGroupId.set(groupId, nextGroup)
        groups.push(nextGroup)
      }

      byGroupId.get(groupId).items.push(item)
    }

    const order = { start_frame: 0, end_frame: 1, motion_prompt: 2, video_prompt: 3 }
    return groups.map((group) => ({
      ...group,
      items: [...group.items].sort((a, b) => {
        const aType = a.metadata?.variant_type || a.metadata?.frame_role || 'video_prompt'
        const bType = b.metadata?.variant_type || b.metadata?.frame_role || 'video_prompt'
        return (order[aType] ?? 99) - (order[bType] ?? 99)
      })
    }))
  }, [savedPrompts])

  const getVariantLabel = (item) => {
    const type = item.metadata?.variant_type || item.metadata?.frame_role
    if (type === 'start_frame') return 'Start Frame'
    if (type === 'end_frame') return 'End Frame'
    if (type === 'motion_prompt') return 'Motion Prompt'
    if (type === 'video_prompt') return 'Video Prompt'
    return item.skill_level || 'Prompt'
  }

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
        .select('id, idea, prompt, mood, use_case, skill_level, include_audio_sfx, include_image_details, metadata, created_at')
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
            {groupedPrompts.map((group) => (
              <article key={group.id} className="neu-card rounded-2xl p-5">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {new Date(group.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {group.title}
                    </p>
                  </div>
                  {!group.legacy && (
                    <div className="flex gap-2 flex-wrap justify-end">
                      {group.items.map((item) => (
                        <span key={`${group.id}-${item.id}`} className="text-xs px-2 py-1 rounded" style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)' }}>
                          {getVariantLabel(item)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {group.items.map((item) => (
                    <div key={item.id} className="rounded-xl p-4" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                      <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                            {getVariantLabel(item)}
                          </span>
                          {item.mood && <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>{item.mood}</span>}
                          {item.use_case && <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>{item.use_case}</span>}
                          {item.include_audio_sfx && <span className="text-xs px-2 py-1 rounded" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>SFX</span>}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCopy(item.id, item.prompt)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                            style={{
                              border: '1px solid var(--border-color)',
                              color: copiedId === item.id ? '#fff' : 'var(--text-secondary)',
                              background: copiedId === item.id ? 'var(--accent-green)' : 'var(--bg-secondary)'
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
                      <div className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                        {item.prompt}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
