import { useEffect, useState } from 'react'
import { X, User, Lock, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const isStrongPassword = (value) => {
  if (!value || value.length < 6) return false
  return /[\d\W_]/.test(value)
}

export default function UserSettingsModal({ isOpen, onClose }) {
  const { user, displayName, updateFullName, updatePassword, signOut } = useAuth()
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!isOpen) return
    setFullName(user?.user_metadata?.full_name || displayName || '')
    setPassword('')
    setConfirmPassword('')
    setError('')
    setSuccess('')
  }, [isOpen, user, displayName])

  if (!isOpen) return null

  const handleSaveName = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    const { error: updateError } = await updateFullName(fullName)
    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess('Name updated.')
    }
    setLoading(false)
  }

  const handleSavePassword = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    if (!isStrongPassword(password)) {
      setError('Password must be at least 6 characters and include a number or symbol.')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    const { error: updateError } = await updatePassword(password)
    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess('Password updated.')
      setPassword('')
      setConfirmPassword('')
    }
    setLoading(false)
  }

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="neu-card max-w-md w-full rounded-2xl p-6 relative"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors"
          style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)' }}
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          User Settings
        </h2>
        <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
          Update your profile and account security.
        </p>

        {error && (
          <div className="mb-3 p-3 rounded-lg text-sm" style={{ background: 'var(--accent-red)15', color: 'var(--accent-red)', border: '1px solid var(--accent-red)30' }}>
            {error}
          </div>
        )}
        {success && (
          <div className="mb-3 p-3 rounded-lg text-sm" style={{ background: 'var(--accent-green)15', color: 'var(--accent-green)', border: '1px solid var(--accent-green)30' }}>
            {success}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--text-muted)' }} />
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all"
                style={{ background: 'var(--bg-primary)', border: '2px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>
            <button
              onClick={handleSaveName}
              disabled={loading}
              className="mt-2 px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: 'var(--accent-blue)', color: '#fff', opacity: loading ? 0.75 : 1 }}
            >
              {loading ? 'Saving...' : 'Save Name'}
            </button>
          </div>

          <div className="pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              New Password
            </label>
            <div className="relative mb-2">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--text-muted)' }} />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all"
                style={{ background: 'var(--bg-primary)', border: '2px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              placeholder="Confirm new password"
              className="w-full px-4 py-3 rounded-xl outline-none transition-all"
              style={{ background: 'var(--bg-primary)', border: '2px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
            <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              Must be at least 6 characters and include a number or symbol.
            </p>
            <button
              onClick={handleSavePassword}
              disabled={loading}
              className="mt-2 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
              style={{ background: 'var(--accent-blue)', color: '#fff', opacity: loading ? 0.75 : 1 }}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Saving...' : 'Change Password'}
            </button>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ background: 'var(--accent-red)', color: '#fff' }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
