import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    // Get initial session - Use Promise chain
    supabase?.auth?.getSession()?.then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session?.user)
          fetchUserProfile(session?.user?.id)  // Fire-and-forget, NO AWAIT
        }
        setLoading(false)
      })?.catch((error) => {
        console.error('Error getting session:', error)
        setLoading(false)
      })

    // Listen for auth changes - NEVER ASYNC callback
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      (event, session) => {  // <- NO ASYNC keyword
        if (session?.user) {
          setUser(session?.user)
          fetchUserProfile(session?.user?.id)  // Fire-and-forget, NO AWAIT
        } else {
          setUser(null)
          setUserProfile(null)
        }
        setLoading(false)
        setAuthError(null) // Clear any previous auth errors
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return
      }

      setUserProfile(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const signUp = async (email, password, metadata = {}) => {
    try {
      setAuthError(null)
      setLoading(true)

      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })

      if (error) {
        setAuthError(error?.message)
        return { error }
      }

      return { data }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        setAuthError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.')
        return { error: { message: 'Connection failed' } }
      }
      
      setAuthError('Something went wrong. Please try again.')
      console.error('JavaScript error in signUp:', error)
      return { error: { message: 'Signup failed' } }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setAuthError(null)
      setLoading(true)

      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      })

      if (error) {
        setAuthError(error?.message)
        return { error }
      }

      return { data }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        setAuthError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.')
        return { error: { message: 'Connection failed' } }
      }
      
      setAuthError('Something went wrong. Please try again.')
      console.error('JavaScript error in signIn:', error)
      return { error: { message: 'Signin failed' } }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setAuthError(null)
      const { error } = await supabase?.auth?.signOut()
      
      if (error) {
        setAuthError(error?.message)
        return { error }
      }

      setUser(null)
      setUserProfile(null)
      return { data: true }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        setAuthError('Cannot connect to authentication service. You may already be signed out.')
        // Clear local state anyway
        setUser(null)
        setUserProfile(null)
        return { data: true }
      }
      
      setAuthError('Something went wrong during sign out.')
      console.error('JavaScript error in signOut:', error)
      return { error: { message: 'Signout failed' } }
    }
  }

  const updateProfile = async (updates) => {
    try {
      setAuthError(null)
      
      if (!user) {
        throw new Error('No user logged in')
      }

      const { data, error } = await supabase?.from('user_profiles')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.eq('id', user?.id)?.select()?.single()

      if (error) {
        setAuthError(error?.message)
        return { error }
      }

      setUserProfile(data)
      return { data }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        setAuthError('Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.')
        return { error: { message: 'Connection failed' } }
      }
      
      setAuthError('Failed to update profile')
      console.error('JavaScript error in updateProfile:', error)
      return { error: { message: 'Update failed' } }
    }
  }

  const resetPassword = async (email) => {
    try {
      setAuthError(null)

      const { data, error } = await supabase?.auth?.resetPasswordForEmail(email)

      if (error) {
        setAuthError(error?.message)
        return { error }
      }

      return { data }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        setAuthError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.')
        return { error: { message: 'Connection failed' } }
      }
      
      setAuthError('Something went wrong. Please try again.')
      console.error('JavaScript error in resetPassword:', error)
      return { error: { message: 'Reset failed' } }
    }
  }

  const clearError = () => {
    setAuthError(null)
  }

  const value = {
    user,
    userProfile,
    loading,
    authError,
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}