'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from '@/hooks/useTranslations'
import { bookingSchema, type BookingData } from '@/lib/validation'
import CountryPhoneInput from '@/components/CountryPhoneInput'
import SimpleLanguageSwitcher from '@/components/SimpleLanguageSwitcher'
import { useAuth } from '@/contexts/AuthContext'
import { CustomerAuthModal } from '@/components/auth/CustomerAuthModal'
import UserProfile from '@/components/UserProfile'

export default function BookingPage() {
  const { t } = useTranslations()
  const { user, profile } = useAuth()
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<BookingData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      date: getTodayDate(),
    },
  })

  const selectedDate = watch('date')

  // Pre-fill form with user data when user/profile changes
  useEffect(() => {
    if (user && profile) {
      if (profile.displayName) {
        setValue('name', profile.displayName)
      }
      if (user.email) {
        setValue('email', user.email)
      }
      if (profile.phoneNumber) {
        setValue('phone', profile.phoneNumber)
      }
    }
  }, [user, profile, setValue])

  // Fetch available slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate)
    }
  }, [selectedDate])

  const fetchAvailableSlots = async (date: string) => {
    setIsLoadingSlots(true)
    try {
      const response = await fetch(`/api/slots?date=${date}`)
      const data = await response.json()

      if (data.success) {
        setAvailableSlots(data.availableSlots)
      } else {
        console.error('Failed to fetch slots:', data.error)
        setAvailableSlots([])
      }
    } catch (error) {
      console.error('Error fetching slots:', error)
      setAvailableSlots([])
    } finally {
      setIsLoadingSlots(false)
    }
  }

  const onSubmit = async (data: BookingData) => {
    // Require authentication to book
    if (!user) {
      setShowAuthModal(true)
      return
    }

    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const bookingData = {
        ...data,
        userId: user.uid,
        userEmail: user.email,
        userPhone: profile?.phoneNumber || data.phone,
      }

      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitMessage({
          type: 'success',
          message: t('booking.messages.success'),
        })
        reset({
          date: getTodayDate(),
          name: profile?.displayName || '',
          email: user.email || '',
          phone: profile?.phoneNumber || '',
        })
        setAvailableSlots([])
      } else {
        setSubmitMessage({
          type: 'error',
          message: result.error || t('booking.messages.error'),
        })
      }
    } catch (error) {
      console.error('Error submitting booking:', error)
      setSubmitMessage({
        type: 'error',
        message: t('booking.messages.networkError'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle logout callback to reset form
  const handleUserChange = () => {
    if (!user) {
      reset({ date: getTodayDate() })
      setSubmitMessage(null)
    }
  }

  // Monitor user changes for form reset
  useEffect(() => {
    handleUserChange()
  }, [user])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Language Switcher */}
        <div className="flex justify-end mb-4" dir="ltr">
          <SimpleLanguageSwitcher />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <span className="order-1">💈</span>
            <span className="order-2">{t('app.title')}</span>
          </h1>
          <p className="text-lg text-gray-600">{t('app.subtitle')}</p>
        </div>

        {/* Booking Form */}
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            {t('booking.title')}
          </h2>

          {/* Success/Error Message */}
          {submitMessage && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                submitMessage.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {submitMessage.message}
            </div>
          )}

          {/* User Profile Section */}
          <UserProfile onSignInClick={() => setShowAuthModal(true)} className="mb-6" />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                {t('booking.form.fullName')} *
              </label>
              <input
                type="text"
                id="name"
                {...register('name')}
                disabled={!user}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  !user ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                } ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder={!user ? 'Sign in to enable' : t('booking.form.fullNamePlaceholder')}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('booking.form.email')} *
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                disabled={!user}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  !user ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                } ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder={!user ? 'Sign in to enable' : t('booking.form.emailPlaceholder')}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                {t('booking.form.phoneNumber')} *
              </label>
              {!user ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed">
                  Sign in to enable phone input
                </div>
              ) : (
                <CountryPhoneInput
                  value={watch('phone') || ''}
                  onChange={(value) => setValue('phone', value, { shouldValidate: true })}
                  error={errors.phone?.message}
                  placeholder={t('booking.form.phonePlaceholder')}
                  className="w-full"
                />
              )}
              <input type="hidden" {...register('phone')} />
            </div>

            {/* Service Selection */}
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                {t('booking.form.service')} *
              </label>
              <select
                id="service"
                {...register('service')}
                disabled={!user}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  !user ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                } ${errors.service ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">
                  {!user ? 'Sign in to select service' : t('booking.form.servicePlaceholder')}
                </option>
                {user && (
                  <>
                    <option value="haircut">{t('booking.services.haircut')}</option>
                    <option value="beard">{t('booking.services.beard')}</option>
                    <option value="both">{t('booking.services.both')}</option>
                  </>
                )}
              </select>
              {errors.service && (
                <p className="mt-1 text-sm text-red-600">{errors.service.message}</p>
              )}
            </div>

            {/* Date Selection */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                {t('booking.form.date')} *
              </label>
              <input
                type="date"
                id="date"
                {...register('date')}
                min={getTodayDate()}
                disabled={!user}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  !user ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                } ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
            </div>

            {/* Time Selection */}
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                {t('booking.form.time')} *
              </label>
              {!user ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed">
                  Sign in to select time
                </div>
              ) : selectedDate ? (
                <>
                  {/* Show info when today is selected */}
                  {selectedDate === getTodayDate() && (
                    <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-700 flex items-center gap-1">
                        <span>ℹ️</span>
                        {t('booking.timeSlots.pastSlotsFiltered')}
                      </p>
                    </div>
                  )}

                  {isLoadingSlots ? (
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                      {t('booking.timeSlots.loading')}
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <select
                      id="time"
                      {...register('time')}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.time ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">{t('booking.form.timePlaceholder')}</option>
                      {availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                      {t('booking.timeSlots.noSlots')}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                  {t('booking.timeSlots.selectDate')}
                </div>
              )}
              {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!user || isSubmitting || isLoadingSlots}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                !user || isSubmitting || isLoadingSlots
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
              } text-white`}
            >
              {!user
                ? 'Sign in to book appointment'
                : isSubmitting
                  ? t('booking.form.submitting')
                  : t('booking.form.submit')}
            </button>
          </form>

          {/* Admin Link */}
          <div className="mt-6 text-center">
            <a
              href="./login"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {t('login.title')}
            </a>
          </div>
        </div>

        {/* Authentication Modal */}
        <CustomerAuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false)
            // Form will auto-fill via useEffect when profile updates
          }}
        />
      </div>
    </div>
  )
}
