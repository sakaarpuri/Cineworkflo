'use client'

import Link from 'next/link'
import { Loader2, Lock, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const isStrongPassword = (value) => {
  if (!value || value.length < 6) return false
  return /[\d\W_]/.test(value)
}

export default function SettingsClient() {
  const { user, displayName, updateFullName, updatePassword, signOut } = useAuth()
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || displayName || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loadingAction, setLoadingAction] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSaveName = async () => {
    setLoadingAction('name')
    setError('')
    setSuccess('')
    const { error: updateError } = await updateFullName(fullName)
    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess('Name updated.')
    }
    setLoadingAction('')
  }

  const handleSavePassword = async () => {
    setLoadingAction('password')
    setError('')
    setSuccess('')

    if (!isStrongPassword(password)) {
      setError('Password must be at least 6 characters and include a number or symbol.')
      setLoadingAction('')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setLoadingAction('')
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
    setLoadingAction('')
  }

  const handleSignOut = async () => {
    setLoadingAction('signout')
    await signOut()
    setLoadingAction('')
  }

  if (!user) {
    return (
      <div className="page-stack auth-shell">
        <section className="feature-card static-card auth-card">
          <div className="card-eyebrow">Settings</div>
          <h1>Sign in to manage your account.</h1>
          <p>Update your display name, change your password, and manage your CineWorkflo account from one place.</p>
          <div className="cta-row route-actions">
            <Link href="/sign-in?next=%2Fsettings" className="cta-primary">
              Sign in
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
    <div className="page-stack settings-shell">
      <div className="section-heading left compact-heading">
        <div className="eyebrow">Account settings</div>
        <h1>Keep your profile and security up to date.</h1>
        <p>Use the same account settings you already have in the current app — just moved into a dedicated Next page.</p>
      </div>

      {error ? <div className="error-card">{error}</div> : null}
      {success ? <div className="status-card success">{success}</div> : null}

      <div className="settings-grid">
        <section className="feature-card static-card settings-card">
          <div className="card-eyebrow">Profile</div>
          <h2>Display name</h2>
          <p>This is the name we show across your library and signed-in experience.</p>

          <label className="auth-field">
            <span>Name</span>
            <div className="input-with-icon">
              <User className="icon-sm muted" />
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="enhancer-input icon-input"
                placeholder="Your name"
              />
            </div>
          </label>

          <div className="cta-row route-actions">
            <button type="button" onClick={handleSaveName} disabled={loadingAction === 'name'} className="cta-primary">
              {loadingAction === 'name' ? <Loader2 className="icon-sm spin" /> : null}
              Save name
            </button>
          </div>
        </section>

        <section className="feature-card static-card settings-card">
          <div className="card-eyebrow">Security</div>
          <h2>Password</h2>
          <p>Keep using the same password rules as the main app: at least 6 characters, including a number or symbol.</p>

          <label className="auth-field">
            <span>New password</span>
            <div className="input-with-icon">
              <Lock className="icon-sm muted" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="enhancer-input icon-input"
                autoComplete="new-password"
                placeholder="••••••••"
              />
            </div>
          </label>

          <label className="auth-field">
            <span>Confirm new password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="enhancer-input"
              autoComplete="new-password"
              placeholder="Confirm new password"
            />
          </label>

          <div className="cta-row route-actions">
            <button type="button" onClick={handleSavePassword} disabled={loadingAction === 'password'} className="cta-primary">
              {loadingAction === 'password' ? <Loader2 className="icon-sm spin" /> : null}
              Change password
            </button>
          </div>
        </section>

        <section className="feature-card static-card settings-card settings-danger">
          <div className="card-eyebrow">Session</div>
          <h2>Sign out</h2>
          <p>End your current session on this device and return to the signed-out experience.</p>

          <div className="cta-row route-actions">
            <button type="button" onClick={handleSignOut} disabled={loadingAction === 'signout'} className="settings-signout-button">
              {loadingAction === 'signout' ? <Loader2 className="icon-sm spin" /> : null}
              Sign out
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
