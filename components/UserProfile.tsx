'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslations } from '@/hooks/useTranslations'
import { ProfileLoadingSkeleton } from './LoadingSkeleton'

interface UserProfileProps {
  onSignInClick?: () => void
  showSignInPrompt?: boolean
  className?: string
}

export const UserProfile: React.FC<UserProfileProps> = ({
  onSignInClick,
  showSignInPrompt = true,
  className = '',
}) => {
  const { user, profile, loading, signOutUser } = useAuth()
  const { t } = useTranslations()

  const handleLogout = async () => {
    try {
      await signOutUser()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Show loading state while authentication is being determined
  if (loading) {
    return <ProfileLoadingSkeleton className={className} />
  }

  // If user is not authenticated, show sign-in prompt
  if (!user) {
    if (!showSignInPrompt) return null

    return (
      <div className={`p-4 bg-blue-50 border border-blue-200 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="text-blue-600 text-2xl mb-2">🔐</div>
          <p className="text-blue-800 font-medium mb-2">{t('auth.signInRequired')}</p>
          <p className="text-blue-700 text-sm mb-4">{t('auth.signInForPersonalizedExperience')}</p>
          {onSignInClick && (
            <button
              onClick={onSignInClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              {t('auth.signInOrSignUp')}
            </button>
          )}
        </div>
      </div>
    )
  }

  // If user is authenticated, show profile
  return (
    <div className={`p-4 bg-green-50 border border-green-200 rounded-lg ${className}`}>
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={t('profile.avatar')}
              className="w-12 h-12 rounded-full border-2 border-green-300 object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-green-300 rounded-full flex items-center justify-center">
              <span className="text-green-700 font-semibold text-lg">
                {(profile?.displayName || user.email || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              {/* Welcome Message */}
              <p className="font-medium text-green-800 mb-1">
                {profile?.displayName
                  ? `${t('profile.welcome')} ${profile.displayName}!`
                  : t('profile.welcomeBack')}
              </p>

              {/* User Details - Only show what we have */}
              <div className="space-y-1 text-sm text-green-600">
                {/* Email - only show if we have it */}
                {user.email && (
                  <div className="flex items-center">
                    <span className="mr-2" aria-label="Email">
                      📧
                    </span>
                    <span className="truncate">{user.email}</span>
                  </div>
                )}

                {/* Phone - only show if verified and exists */}
                {profile?.phoneNumber && (
                  <div className="flex items-center">
                    <span className="mr-2" aria-label="Phone">
                      📱
                    </span>
                    <span>{profile.phoneNumber}</span>
                  </div>
                )}

                {/* Authentication Provider - show with appropriate icons */}
                {profile?.provider && profile.provider.length > 0 && (
                  <div className="flex items-center">
                    <span className="mr-2" aria-label="Signed in with">
                      {profile.provider.includes('google.com') ? '🔍' : '📱'}
                    </span>
                    <span className="text-xs bg-green-100 px-2 py-1 rounded">
                      {profile.provider.includes('google.com') && 'Google'}
                      {profile.provider.includes('phone') && 'Phone'}
                      {profile.provider.length > 1 && ` +${profile.provider.length - 1}`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="ml-2 text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors flex-shrink-0"
              title={t('auth.signOut')}
            >
              {t('auth.signOut')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
