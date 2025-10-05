'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/types'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        if (user) {
          await fetchProfile(user.id)
        }
      } catch (error) {
        console.warn('Supabase not configured, running in demo mode:', error)
      }
      
      setLoading(false)
    }

    getUser()

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user ?? null)
          
          if (session?.user) {
            await fetchProfile(session.user.id)
          } else {
            setProfile(null)
          }
          
          setLoading(false)
        }
      )

      return () => subscription.unsubscribe()
    } catch (error) {
      console.warn('Supabase not configured, running in demo mode:', error)
      setLoading(false)
    }
  }, [supabase.auth])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.warn('Error fetching profile (Supabase not configured):', error)
        return
      }

      setProfile(data)
    } catch (error) {
      console.warn('Error fetching profile (Supabase not configured):', error)
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.warn('Error signing out (Supabase not configured):', error)
    }
    setUser(null)
    setProfile(null)
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  const value = {
    user,
    profile,
    loading,
    signOut,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
