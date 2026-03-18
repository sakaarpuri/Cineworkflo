'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, Lock, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const hasStrongPassword = (value) => {
  if (!value || value.length < 6) return false
  return /[\d\W_]/.test(value)
}

export default function SignInClient({ nextPath = '/my-library' }) {
  const router = useRouter()
  const { user, loading: authLoading, signIn, signUp, displayName } = useAuth()
  const [mode, setMode] = useState('login')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [confirmationSent, setConfirmationSent] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(nextPath)
    }
  }, [authLoading, nextPath, router, user])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const { error: signInError } = await signIn(email, password)
        if (signInError) throw signInError
        router.replace(nextPath)
        router.refresh()
      } else {
        if (!hasStrongPassword(password)) {
          throw new Error('Password must be at least 6 characters and include a number or symbol.')
        }
        const { error: signUpError } = await signUp(email, password, fullName)
        if (signUpError) throw signUpError
        setConfirmationSent(true)
        setPassword('')
      }
    } catch (submissionError) {
      setError(submissionError.message || 'Unable to continue right now.')
    } finally {
      setLoading(false)
    }
  }

  if (!authLoading && user) {
    return (
      <div className="page-stack auth-shell">
        <section className="feature-card static-card auth-card">
          <div className="card-eyebrow">Signed in</div>
          <h1>Welcome back, {displayName}.</h1>
          <p>You&apos;re already signed in. Head to your library or jump back into the tools.</p>
          <div className="cta-row route-actions">
            <Link href={nextPath} className="cta-primary">
              Continue
            </Link>
            <Link href="/" className="cta-secondary">
              Back home
            </Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="page-stack auth-shell">
      <section className="feature-card static-card auth-card">
        <div className="card-eyebrow">{confirmationSent ? 'Check your inbox' : mode === 'login' ? 'Sign in' : 'Create account'}</div>
        <h1>{confirmationSent ? 'Confirmation email sent' : mode === 'login' ? 'Welcome back' : 'Create your CineWorkflo account'}</h1>
        <p>
          {confirmationSent
            ? `A confirmation email has been sent to ${email}. Open it, confirm your account, then come back here to sign in.`
            : mode === 'login'
              ? 'Sign in to access your saved prompts, Pro tools, and your migration-ready library in Next.'
              : 'Use email and password to get into CineWorkflo. We’ll keep the setup simple and the handoff clear.'}
        </p>

        {error ? <div className="error-card">{error}</div> : null}

        {confirmationSent ? (
          <div className="cta-row route-actions">
            <button
              type="button"
              className="cta-primary"
              onClick={() => {
                setMode('login')
                setConfirmationSent(false)
                setError('')
              }}
            >
              Back to sign in
            </button>
            <Link href="/" className="cta-secondary">
              Back home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'signup' ? (
              <label className="auth-field">
                <span>Name</span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Your name"
                  className="enhancer-input"
                  required
                />
              </label>
            ) : null}

            <label className="auth-field">
              <span>Email</span>
              <div className="input-with-icon">
                <Mail className="icon-sm muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="enhancer-input icon-input"
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className="auth-field">
              <span>Password</span>
              <div className="input-with-icon">
                <Lock className="icon-sm muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="enhancer-input icon-input"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  minLength={6}
                  required
                />
              </div>
              {mode === 'signup' ? <small>Must be at least 6 characters and include a number or symbol.</small> : null}
            </label>

            <button type="submit" className="enhance-primary auth-submit" disabled={loading}>
              {loading ? <Loader2 className="icon-sm spin" /> : null}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        )}

        {!confirmationSent ? (
          <div className="auth-switch-row">
            <span>{mode === 'login' ? 'Need an account?' : 'Already have an account?'}</span>
            <button
              type="button"
              className="text-link-button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login')
                setConfirmationSent(false)
                setError('')
              }}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        ) : null}
      </section>
    </div>
  )
}
