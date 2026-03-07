import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)
const directSignUp = async ({ email, password, fullName, redirectTo }) => (
  supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectTo,
      data: {
        full_name: fullName?.trim() || '',
      },
    },
  })
)

const getSignupEndpoint = () => (
  import.meta.env.VITE_AUTH_SIGNUP_ENDPOINT || '/.netlify/functions/auth-signup'
)

const readSignupError = async (response) => {
  try {
    const payload = await response.json()
    if (payload?.error) return payload.error
  } catch {
    // Ignore malformed JSON and fall back to generic messaging.
  }
  return 'Unable to create your account right now.'
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, fullName = '') => {
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/` : undefined

    if (typeof window === 'undefined') {
      return directSignUp({ email, password, fullName, redirectTo })
    }

    try {
      const response = await fetch(getSignupEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          fullName,
          redirectTo,
        }),
      })

      if (response.ok) {
        const data = await response.json().catch(() => ({}))
        return { data, error: null }
      }

      if (import.meta.env.DEV && (response.status === 404 || response.status === 405)) {
        return directSignUp({ email, password, fullName, redirectTo })
      }

      return {
        data: null,
        error: new Error(await readSignupError(response)),
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        return directSignUp({ email, password, fullName, redirectTo })
      }
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Unable to create your account right now.'),
      }
    }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const updateFullName = async (fullName) => {
    const { data, error } = await supabase.auth.updateUser({
      data: { full_name: fullName?.trim() || '' },
    })
    if (!error && data?.user) {
      setUser(data.user)
    }
    return { data, error }
  }

  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword })
    if (!error && data?.user) {
      setUser(data.user)
    }
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const displayName = user?.user_metadata?.full_name?.trim()
    || user?.email?.split('@')?.[0]
    || 'User'

  const isPro = () => {
    if (!user) return false
    // Check user_metadata for pro status
    const proExpiresAt = user.user_metadata?.pro_expires_at
    if (proExpiresAt) {
      return new Date(proExpiresAt) > new Date()
    }
    return user.user_metadata?.is_pro === true
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    updateFullName,
    updatePassword,
    signOut,
    isPro: isPro(),
    displayName,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
