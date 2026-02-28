import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          full_name: fullName?.trim() || '',
        },
      },
    })
    return { data, error }
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
