'use client'

import React, { useState, useEffect } from 'react'
import { ConfirmationResult } from 'firebase/auth'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslations } from '@/hooks/useTranslations'
import { initializeRecaptcha } from '@/lib/auth'
import CountryPhoneInput from '@/components/CountryPhoneInput'

interface PhoneVerificationProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export const PhoneVerification: React.FC<PhoneVerificationProps> = ({ onSuccess, onError }) => {
  const { sendPhoneVerification, verifyPhoneCode } = useAuth()
  const { t } = useTranslations()

  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    // Don't initialize reCAPTCHA here - let it be initialized when needed
    // This avoids race conditions with DOM element creation

    return () => {
      // Cleanup will be handled by the auth library
    }
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSendCode = async () => {
    if (!phoneNumber) {
      onError?.(t('auth.errors.phoneRequired'))
      return
    }

    setIsLoading(true)
    try {
      const result = await sendPhoneVerification(phoneNumber)
      setConfirmationResult(result)
      setStep('code')
      setCountdown(60) // 60 second countdown
    } catch (error: any) {
      onError?.(error.message || t('auth.errors.sendCode'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!verificationCode || !confirmationResult) {
      onError?.(t('auth.errors.codeRequired'))
      return
    }

    setIsLoading(true)
    try {
      await verifyPhoneCode(confirmationResult, verificationCode)
      onSuccess?.()
    } catch (error: any) {
      onError?.(error.message || t('auth.errors.invalidCode'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (countdown > 0) return
    await handleSendCode()
  }

  if (step === 'phone') {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">{t('auth.verifyPhone')}</h3>
          <p className="text-gray-600 text-sm mb-4">{t('auth.phoneVerificationDescription')}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('auth.phoneNumber')}
          </label>
          <CountryPhoneInput
            value={phoneNumber}
            onChange={setPhoneNumber}
            placeholder={t('auth.phoneNumberPlaceholder')}
          />
        </div>

        {/* Hidden reCAPTCHA container */}
        <div id="recaptcha-container" />

        <button
          onClick={handleSendCode}
          disabled={isLoading || !phoneNumber}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? t('auth.sendingCode') : t('auth.sendCode')}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">{t('auth.enterVerificationCode')}</h3>
        <p className="text-gray-600 text-sm">
          {t('auth.codeSentTo')} {phoneNumber}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('auth.verificationCode')}
        </label>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="123456"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col space-y-3">
        <button
          onClick={handleVerifyCode}
          disabled={isLoading || !verificationCode}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? t('auth.verifying') : t('auth.verify')}
        </button>

        <button
          onClick={handleResendCode}
          disabled={countdown > 0 || isLoading}
          className="text-blue-600 hover:text-blue-800 text-sm disabled:text-gray-400 transition-colors"
        >
          {countdown > 0 ? `${t('auth.resendCodeIn')} ${countdown}s` : t('auth.resendCode')}
        </button>

        <button
          onClick={() => {
            setStep('phone')
            setVerificationCode('')
            setConfirmationResult(null)
          }}
          className="text-gray-600 hover:text-gray-800 text-sm transition-colors"
        >
          {t('auth.changePhoneNumber')}
        </button>
      </div>
    </div>
  )
}
