'use client'

import React from 'react'
import { useTranslations } from '@/hooks/useTranslations'

interface LoadingSkeletonProps {
  className?: string
  width?: string
  height?: string
  rounded?: boolean
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  width = 'w-full',
  height = 'h-4',
  rounded = true,
}) => {
  return (
    <div
      className={`bg-gray-300 animate-pulse ${width} ${height} ${
        rounded ? 'rounded' : ''
      } ${className}`}
    />
  )
}

interface ProfileLoadingSkeletonProps {
  className?: string
  showLoadingText?: boolean
}

export const ProfileLoadingSkeleton: React.FC<ProfileLoadingSkeletonProps> = ({
  className = '',
  showLoadingText = true,
}) => {
  const { t } = useTranslations()

  return (
    <div
      className={`p-4 bg-gray-50 border border-gray-200 rounded-lg animate-fade-in ${className}`}
    >
      <div className="flex items-center space-x-3">
        {/* Loading Avatar */}
        <div className="flex-shrink-0">
          <LoadingSkeleton width="w-12" height="h-12" className="rounded-full" />
        </div>

        {/* Loading Content */}
        <div className="flex-1">
          <div className="space-y-2">
            <LoadingSkeleton width="w-3/4" height="h-4" />
            <LoadingSkeleton width="w-1/2" height="h-3" />
            <LoadingSkeleton width="w-2/3" height="h-3" />
          </div>
        </div>

        {/* Loading Button */}
        <LoadingSkeleton width="w-12" height="h-6" />
      </div>

      {/* Loading Text */}
      {showLoadingText && (
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-500 animate-pulse">{t('profile.loading')}</p>
        </div>
      )}
    </div>
  )
}

export default LoadingSkeleton
