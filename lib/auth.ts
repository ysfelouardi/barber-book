import {
  Auth,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  RecaptchaVerifier,
  ConfirmationResult,
  UserCredential,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'

// Simplified Customer Profile Interface
export interface CustomerProfile {
  uid: string
  email: string | null
  displayName: string | null
  phoneNumber: string | null
  photoURL: string | null
  emailVerified: boolean
  phoneVerified: boolean
  provider: string[]
  createdAt: Date
  updatedAt: Date
  preferences: {
    language: string
    notifications: {
      email: boolean
      sms: boolean
    }
  }
  bookingHistory: string[] // Array of appointment IDs
}

// Auth Context Type
export interface AuthContextType {
  user: User | null
  profile: CustomerProfile | null
  loading: boolean
  signInWithGoogle: () => Promise<UserCredential>
  sendPhoneVerification: (phoneNumber: string) => Promise<ConfirmationResult>
  verifyPhoneCode: (confirmationResult: ConfirmationResult, code: string) => Promise<void>
  signOutUser: () => Promise<void>
  updateUserProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>
}

// Google Auth Provider
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account',
})

// RecaptchaVerifier instance
let recaptchaVerifier: RecaptchaVerifier | null = null

// Initialize RecaptchaVerifier
export const initializeRecaptcha = (containerId: string): RecaptchaVerifier => {
  try {
    // Clear existing verifier if it exists
    if (recaptchaVerifier) {
      try {
        recaptchaVerifier.clear()
      } catch (error) {
        console.warn('Error clearing existing reCAPTCHA verifier:', error)
      }
      recaptchaVerifier = null
    }

    // Check if container exists
    const container = document.getElementById(containerId)
    if (!container) {
      throw new Error(`reCAPTCHA container with ID '${containerId}' not found`)
    }

    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('reCAPTCHA solved')
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired')
      },
    })

    return recaptchaVerifier
  } catch (error) {
    console.error('Error initializing reCAPTCHA:', error)
    throw error
  }
}

// Create or update customer profile in Firestore
export const createOrUpdateCustomerProfile = async (user: User): Promise<CustomerProfile> => {
  const userRef = doc(db, 'customers', user.uid)
  const userSnap = await getDoc(userRef)

  const now = new Date()
  const providers = user.providerData.map((provider) => provider.providerId)

  const profileData: Partial<CustomerProfile> = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    phoneNumber: user.phoneNumber,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    phoneVerified: !!user.phoneNumber,
    provider: providers,
    updatedAt: now,
  }

  if (userSnap.exists()) {
    // Update existing profile
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: serverTimestamp(),
    })

    return { ...(userSnap.data() as CustomerProfile), ...profileData }
  } else {
    // Create new profile
    const newProfile: CustomerProfile = {
      ...(profileData as CustomerProfile),
      createdAt: now,
      preferences: {
        language: 'en',
        notifications: {
          email: true,
          sms: true,
        },
      },
      bookingHistory: [],
    }

    await setDoc(userRef, {
      ...newProfile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return newProfile
  }
}

// Google Sign In
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    await createOrUpdateCustomerProfile(result.user)
    return result
  } catch (error) {
    console.error('Error signing in with Google:', error)
    throw error
  }
}

// Phone Verification
export const sendPhoneVerification = async (phoneNumber: string): Promise<ConfirmationResult> => {
  try {
    if (!recaptchaVerifier) {
      // Try to initialize reCAPTCHA if not already done
      recaptchaVerifier = initializeRecaptcha('recaptcha-container')
    }

    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
    return confirmationResult
  } catch (error) {
    console.error('Error sending phone verification:', error)

    // Reset reCAPTCHA on error
    if (recaptchaVerifier) {
      try {
        recaptchaVerifier.clear()
      } catch (clearError) {
        console.warn('Error clearing reCAPTCHA after failure:', clearError)
      }
      recaptchaVerifier = null
    }

    throw error
  }
}

export const verifyPhoneCode = async (
  confirmationResult: ConfirmationResult,
  code: string
): Promise<void> => {
  try {
    const result = await confirmationResult.confirm(code)
    await createOrUpdateCustomerProfile(result.user)
  } catch (error) {
    console.error('Error verifying phone code:', error)
    throw error
  }
}

// Sign Out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth)
    if (recaptchaVerifier) {
      recaptchaVerifier.clear()
      recaptchaVerifier = null
    }
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

// Update Profile
export const updateUserProfile = async (data: {
  displayName?: string
  photoURL?: string
}): Promise<void> => {
  try {
    if (!auth.currentUser) {
      throw new Error('No user signed in')
    }

    await updateProfile(auth.currentUser, data)
    await createOrUpdateCustomerProfile(auth.currentUser)
  } catch (error) {
    console.error('Error updating profile:', error)
    throw error
  }
}

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}
