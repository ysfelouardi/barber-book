'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import {
  CustomerProfile,
  AuthContextType,
  onAuthStateChange,
  createOrUpdateCustomerProfile,
  signInWithGoogle as signInWithGoogleAuth,
  sendPhoneVerification as sendPhoneVerificationAuth,
  verifyPhoneCode as verifyPhoneCodeAuth,
  signOutUser as signOutUserAuth,
  updateUserProfile as updateUserProfileAuth,
} from '@/lib/auth'
import { db } from '@/lib/firebase'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<CustomerProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let profileUnsubscribe: (() => void) | null = null

    const unsubscribe = onAuthStateChange((user) => {
      setUser(user)

      // Clean up previous profile subscription
      if (profileUnsubscribe) {
        profileUnsubscribe()
        profileUnsubscribe = null
      }

      if (user) {
        // Update profile in Firestore (don't await here to avoid blocking)
        createOrUpdateCustomerProfile(user).catch(console.error)

        // Listen to profile changes in Firestore
        const profileRef = doc(db, 'customers', user.uid)
        profileUnsubscribe = onSnapshot(
          profileRef,
          (doc) => {
            if (doc.exists()) {
              setProfile(doc.data() as CustomerProfile)
            }
            setLoading(false)
          },
          (error) => {
            console.error('Error listening to profile changes:', error)
            setLoading(false)
          }
        )
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      unsubscribe()
      if (profileUnsubscribe) {
        profileUnsubscribe()
      }
    }
  }, [])

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signInWithGoogle: signInWithGoogleAuth,
    sendPhoneVerification: sendPhoneVerificationAuth,
    verifyPhoneCode: verifyPhoneCodeAuth,
    signOutUser: signOutUserAuth,
    updateUserProfile: updateUserProfileAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
