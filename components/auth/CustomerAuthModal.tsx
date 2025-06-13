'use client'

import React, { useState } from 'react'
import { useTranslations } from '@/hooks/useTranslations'
import { GoogleSignInButton } from './GoogleSignInButton'
import { PhoneVerification } from './PhoneVerification'

interface CustomerAuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslations()
  const [error, setError] = useState('')
  const [authMethod, setAuthMethod] = useState<'google' | 'phone'>('google')

  const handleSuccess = () => {
    onSuccess?.()
    onClose()
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">{t('auth.signInOrSignUp')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Auth Method Selector */}
          <div className="flex border-b mb-6">
            <button
              onClick={() => {
                setAuthMethod('google')
                setError('')
              }}
              className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                authMethod === 'google'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('auth.googleLogin')}
            </button>
            <button
              onClick={() => {
                setAuthMethod('phone')
                setError('')
              }}
              className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                authMethod === 'phone'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('auth.phoneLogin')}
            </button>
          </div>

          {/* Auth Content */}
          {authMethod === 'google' ? (
            <GoogleSignInButton onSuccess={handleSuccess} onError={handleError} />
          ) : (
            <PhoneVerification onSuccess={handleSuccess} onError={handleError} />
          )}

          {/* Terms and Privacy */}
          <div className="mt-6 text-xs text-gray-500 text-center">{t('auth.termsAndPrivacy')}</div>
        </div>
      </div>
    </div>
  )
}
