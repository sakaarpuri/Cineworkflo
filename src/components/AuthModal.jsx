import { useState } from 'react'
import { X, Mail, Lock, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [confirmationSent, setConfirmationSent] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const { signIn, signUp } = useAuth()

  if (!isOpen) return null

  const hasStrongPassword = (value) => {
    if (!value || value.length < 6) return false
    return /[\d\W_]/.test(value)
  }

  const resetToLogin = () => {
    setMode('login')
    setConfirmationSent(false)
    setPassword('')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password)
        if (error) throw error
        onSuccess?.()
        onClose()
      } else {
        if (!hasStrongPassword(password)) {
          throw new Error('Password must be at least 6 characters and include a number or symbol.')
        }
        const { error } = await signUp(email, password, fullName)
        if (error) throw error
        setConfirmationSent(true)
        setPassword('')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div 
        className="max-w-md w-full rounded-2xl p-6 relative"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors"
          style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)' }}
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          {confirmationSent ? 'Confirmation Email Sent' : mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          {confirmationSent
            ? `A confirmation email has been sent to ${email}. Open it and click the confirmation link to sign in and enter the app.`
            : mode === 'login' 
            ? 'Sign in to access your Pro features' 
            : 'Sign up to start generating AI video prompts'}
        </p>

        {error && (
          <div 
            className="mb-4 p-3 rounded-lg text-sm"
            style={{ 
              background: error.includes('Check your email') ? 'var(--accent-green)15' : 'var(--accent-red)15',
              color: error.includes('Check your email') ? 'var(--accent-green)' : 'var(--accent-red)',
              border: `1px solid ${error.includes('Check your email') ? 'var(--accent-green)30' : 'var(--accent-red)30'}`
            }}
          >
            {error}
          </div>
        )}

        {confirmationSent ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={resetToLogin}
              className="w-full py-3 rounded-xl font-semibold transition-all"
              style={{ background: 'linear-gradient(145deg, #3B82F6, #2563EB)', color: '#fff' }}
            >
              Back to Sign In
            </button>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{
                  background: 'var(--bg-primary)',
                  border: '2px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--text-muted)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all"
                style={{
                  background: 'var(--bg-primary)',
                  border: '2px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--text-muted)' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all"
                style={{
                  background: 'var(--bg-primary)',
                  border: '2px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
            {mode === 'signup' && (
              <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                Must be at least 6 characters and include a number or symbol.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(145deg, #3B82F6, #2563EB)',
              color: '#fff',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        )}

        {!confirmationSent && (
          <p className="mt-4 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login')
                setError('')
                setConfirmationSent(false)
              }}
              className="font-medium hover:underline"
              style={{ color: 'var(--accent-blue)' }}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
