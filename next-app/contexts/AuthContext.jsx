'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)
const FORCE_PRO_EMAILS = new Set(['puri.sakaar@gmail.com'])

const hasProAccess = (user) => {
  if (!user) return false
  if (FORCE_PRO_EMAILS.has(String(user.email || '').trim().toLowerCase())) return true
  const proExpiresAt = user.user_metadata?.pro_expires_at
  if (proExpiresAt) return new Date(proExpiresAt) > new Date()
  return user.user_metadata?.is_pro === true
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data: { session: nextSession } }) => {
      if (!mounted) return
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email, password, fullName = '') => {
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/` : undefined
    return supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          full_name: fullName?.trim() || '',
        },
      },
    })
  }

  const signIn = async (email, password) =>
    supabase.auth.signInWithPassword({
      email,
      password,
    })

  const signOut = async () => supabase.auth.signOut()

  const updateFullName = async (fullName) => {
    const response = await supabase.auth.updateUser({
      data: { full_name: fullName?.trim() || '' },
    })
    if (!response.error && response.data?.user) {
      setUser(response.data.user)
    }
    return response
  }

  const updatePassword = async (newPassword) => {
    const response = await supabase.auth.updateUser({ password: newPassword })
    if (!response.error && response.data?.user) {
      setUser(response.data.user)
    }
    return response
  }

  const refreshAuthSession = async () => {
    const response = await supabase.auth.refreshSession()
    if (!response.error && response.data?.session) {
      setSession(response.data.session)
      setUser(response.data.session.user ?? null)
    }
    return response
  }

  const getValidAccessToken = async () => {
    if (!user) return ''
    if (session?.access_token) return session.access_token
    const { data: latestAuth } = await supabase.auth.getSession()
    if (latestAuth?.session?.access_token) return latestAuth.session.access_token
    const { data: refreshed, error } = await refreshAuthSession()
    if (error) return ''
    return refreshed?.session?.access_token || ''
  }

  const displayName =
    user?.user_metadata?.full_name?.trim() || user?.email?.split('@')?.[0] || 'User'

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      updateFullName,
      updatePassword,
      refreshAuthSession,
      getValidAccessToken,
      isPro: hasProAccess(user),
      displayName,
    }),
    [displayName, loading, session, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
