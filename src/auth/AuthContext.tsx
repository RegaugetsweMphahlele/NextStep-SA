import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  getCurrentProfile,
  getCurrentUser,
  registerAccount,
  saveCurrentProfile,
  signInAccount,
  signOutAccount,
  type LocalUser,
  type ProfileValues,
} from '../lib/localStore'
import type { Profile } from '../types'

type AuthContextValue = {
  loading: boolean
  user: LocalUser | null
  profile: Profile | null
  profileError: string
  register: (email: string, password: string, values: ProfileValues) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  refreshProfile: () => Promise<void>
  saveProfile: (values: ProfileValues) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileError, setProfileError] = useState('')

  const refreshProfile = async () => {
    try {
      setUser(getCurrentUser())
      setProfile(getCurrentProfile())
      setProfileError('')
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Unable to load your locally saved profile.')
    }
  }

  useEffect(() => {
    void refreshProfile().finally(() => setLoading(false))
    const handleStorageChange = () => void refreshProfile()
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('nextstep-data-changed', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('nextstep-data-changed', handleStorageChange)
    }
  }, [])

  const register = async (email: string, password: string, values: ProfileValues) => {
    const result = await registerAccount(email, password, values)
    setUser(result.user)
    setProfile(result.profile)
    setProfileError('')
  }

  const signIn = async (email: string, password: string) => {
    const result = await signInAccount(email, password)
    setUser(result.user)
    setProfile(result.profile)
    setProfileError('')
  }

  const saveProfile = async (values: ProfileValues) => {
    const savedProfile = saveCurrentProfile(values)
    setProfile(savedProfile)
    setProfileError('')
  }

  const signOut = async () => {
    signOutAccount()
    setUser(null)
    setProfile(null)
  }

  const value = useMemo(() => ({
    loading,
    user,
    profile,
    profileError,
    register,
    signIn,
    refreshProfile,
    saveProfile,
    signOut,
  }), [loading, user, profile, profileError])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider.')
  return context
}
