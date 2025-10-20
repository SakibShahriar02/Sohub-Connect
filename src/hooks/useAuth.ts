import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

interface Profile {
  id: string
  email: string
  full_name: string | null
  role: string
  phone: string | null
  status: string
  profile_picture: string | null
  nid_front: string | null
  nid_back: string | null
  certificate: string | null
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId)
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, email, full_name, role, phone, status, 
          profile_picture, nid_front, nid_back, certificate,
          roles (name)
        `)
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Profile fetch error:', error)
        // If profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating new profile')
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            const newProfileData = {
              id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
              role: 'User',
              status: 'Active'
            }
            console.log('Creating profile with data:', newProfileData)
            
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert(newProfileData)
              .select()
              .single()
            
            if (createError) {
              console.error('Error creating profile:', createError)
            } else {
              console.log('Profile created successfully:', newProfile)
              setProfile(newProfile)
            }
          }
        }
      } else {
        console.log('Profile fetched successfully:', data)
        setProfile(data)
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
  }
}