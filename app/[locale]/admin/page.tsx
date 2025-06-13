'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from '@/hooks/useTranslations'
import SimpleLanguageSwitcher from '@/components/SimpleLanguageSwitcher'
import EnhancedCalendar from '@/components/EnhancedCalendar'
import AppointmentDetailsPopup from '@/components/AppointmentDetailsPopup'
import ConfirmDialog from '@/components/ConfirmDialog'
import { Appointment } from '@/lib/firestore'

export default function AdminPage() {
  const { t, locale } = useTranslations()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table')

  // Appointment details popup
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isAppointmentPopupOpen, setIsAppointmentPopupOpen] = useState(false)

  // Delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    appointmentId: string
    appointmentName: string
  }>({
    isOpen: false,
    appointmentId: '',
    appointmentName: '',
  })

  useEffect(() => {
    checkAuth()
    fetchAppointments()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [appointments, statusFilter, dateFilter, selectedDate])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check')
      const result = await response.json()

      if (!result.success) {
        router.push(`/${locale}/login`)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push(`/${locale}/login`)
    }
  }

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments')
      const data = await response.json()

      if (data.success) {
        setAppointments(data.appointments)
      } else {
        setError(data.error || t('admin.errors.fetchError'))
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error)
      setError(t('admin.errors.networkError'))
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...appointments]

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((appointment) => appointment.status === statusFilter)
    }

    // Date filter
    const today = new Date().toISOString().split('T')[0]
    if (dateFilter === 'today') {
      filtered = filtered.filter((appointment) => appointment.date === today)
    } else if (dateFilter === 'selected' && viewMode === 'table') {
      filtered = filtered.filter((appointment) => appointment.date === selectedDate)
    }

    setFilteredAppointments(filtered)
  }

  const updateAppointmentStatus = async (
    id: string,
    status: 'pending' | 'confirmed' | 'cancelled'
  ) => {
    setIsUpdating(id)
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      const result = await response.json()

      if (result.success) {
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment.id === id ? { ...appointment, status } : appointment
          )
        )
      } else {
        setError(result.error || t('admin.errors.updateError'))
      }
    } catch (error) {
      console.error('Failed to update appointment:', error)
      setError(t('admin.errors.networkError'))
    } finally {
      setIsUpdating(null)
    }
  }

  const deleteAppointment = async (id: string) => {
    setIsUpdating(id)
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        setAppointments((prev) => prev.filter((appointment) => appointment.id !== id))
        setDeleteDialog({ isOpen: false, appointmentId: '', appointmentName: '' })
      } else {
        setError(result.error || 'Failed to delete appointment')
      }
    } catch (error) {
      console.error('Failed to delete appointment:', error)
      setError(t('admin.errors.networkError'))
    } finally {
      setIsUpdating(null)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push(`/${locale}/login`)
    } catch (error) {
      console.error('Logout failed:', error)
      router.push(`/${locale}/login`)
    }
  }

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsAppointmentPopupOpen(true)
  }

  const closeAppointmentPopup = () => {
    setIsAppointmentPopupOpen(false)
    setSelectedAppointment(null)
  }

  const handleAppointmentDelete = async (id: string) => {
    const appointment = appointments.find((a) => a.id === id)
    if (appointment) {
      closeAppointmentPopup()
      setDeleteDialog({
        isOpen: true,
        appointmentId: id,
        appointmentName: appointment.name,
      })
    }
  }

  const openDeleteDialog = (id: string, name: string) => {
    setDeleteDialog({
      isOpen: true,
      appointmentId: id,
      appointmentName: name,
    })
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      appointmentId: '',
      appointmentName: '',
    })
  }

  const confirmDeleteAppointment = async () => {
    await deleteAppointment(deleteDialog.appointmentId)
  }

  const handleCalendarDateClick = (date: string) => {
    setSelectedDate(date)
    setDateFilter('selected')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatDateTime = (timestamp: any) => {
    try {
      // Handle null/undefined timestamps
      if (!timestamp) {
        return 'N/A'
      }

      // Handle Firestore Timestamp
      if (timestamp?.toDate && typeof timestamp.toDate === 'function') {
        const date = timestamp.toDate()
        return date.toLocaleString(locale, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      }

      // Handle string or number timestamps
      const date = new Date(timestamp)

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'N/A'
      }

      return date.toLocaleString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch (error) {
      console.error('Error formatting timestamp:', error, timestamp)
      return 'N/A'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">{t('common.loading')}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <span className="order-1">💈</span>
              <span className="order-2">{t('admin.title')}</span>
            </h1>
            <p className="text-gray-600 mt-1">{t('admin.subtitle')}</p>
          </div>
          <div className="flex items-center space-x-4" dir="ltr">
            <a
              href="./api-docs"
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-600 hover:border-blue-800 rounded-lg transition-colors flex items-center space-x-2"
              title="API Documentation"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>API Docs</span>
            </a>
            <SimpleLanguageSwitcher />
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-800 border border-red-600 hover:border-red-800 rounded-lg transition-colors"
            >
              {t('admin.logout')}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
            {error}
          </div>
        )}

        {/* Refresh Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={fetchAppointments}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>{isLoading ? t('admin.refreshing') : t('admin.refresh')}</span>
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="mb-6 flex space-x-1 bg-gray-200 rounded-lg p-1 w-fit">
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'table'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📋 {t('admin.viewModes.table')}
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'calendar'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📅 {t('admin.viewModes.calendar')}
          </button>
        </div>

        {viewMode === 'calendar' ? (
          /* Calendar View */
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <EnhancedCalendar
              appointments={appointments}
              onDateClick={handleCalendarDateClick}
              onAppointmentClick={handleAppointmentClick}
              selectedDate={selectedDate}
            />
          </div>
        ) : (
          /* Table View */
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('admin.stats.total')}
                </h3>
                <p className="text-3xl font-bold text-blue-600">{appointments.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('admin.stats.pending')}
                </h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {appointments.filter((a) => a.status === 'pending').length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('admin.stats.confirmed')}
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {appointments.filter((a) => a.status === 'confirmed').length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('admin.stats.cancelled')}
                </h3>
                <p className="text-3xl font-bold text-red-600">
                  {appointments.filter((a) => a.status === 'cancelled').length}
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('admin.filters.title')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.filters.status.label')}
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">{t('admin.filters.status.all')}</option>
                    <option value="pending">{t('admin.filters.status.pending')}</option>
                    <option value="confirmed">{t('admin.filters.status.confirmed')}</option>
                    <option value="cancelled">{t('admin.filters.status.cancelled')}</option>
                  </select>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.filters.date.label')}
                  </label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">{t('admin.filters.date.all')}</option>
                    <option value="today">{t('admin.filters.date.today')}</option>
                    <option value="selected">{t('admin.filters.date.selected')}</option>
                  </select>
                </div>

                {/* Date Picker */}
                {dateFilter === 'selected' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('admin.filters.date.selectDate')}
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Appointments Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {t('admin.appointmentsTable.title')}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {t('admin.appointmentsTable.showing')
                      .replace('{filtered}', filteredAppointments.length.toString())
                      .replace('{total}', appointments.length.toString())}
                  </p>
                </div>
              </div>

              {filteredAppointments.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  {t('admin.appointmentsTable.noAppointments')}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.appointmentsTable.headers.customer')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.appointmentsTable.headers.service')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.appointmentsTable.headers.dateTime')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.appointmentsTable.headers.status')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.appointmentsTable.headers.created')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('admin.appointmentsTable.headers.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAppointments.map((appointment) => (
                        <tr
                          key={appointment.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleAppointmentClick(appointment)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {appointment.name}
                              </div>
                              {appointment.email && (
                                <div className="text-sm text-gray-500">{appointment.email}</div>
                              )}
                              <div className="text-sm text-gray-500">{appointment.phone}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {t(`booking.services.${appointment.service}`)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(appointment.date)}
                            </div>
                            <div className="text-sm text-gray-500">{appointment.time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                appointment.status
                              )}`}
                            >
                              {t(`admin.status.${appointment.status}`)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDateTime(appointment.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              {appointment.status === 'pending' && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      updateAppointmentStatus(appointment.id!, 'confirmed')
                                    }}
                                    disabled={isUpdating === appointment.id}
                                    className="px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-md text-xs font-medium disabled:opacity-50 transition-colors"
                                  >
                                    {t('admin.actions.confirm')}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      updateAppointmentStatus(appointment.id!, 'cancelled')
                                    }}
                                    disabled={isUpdating === appointment.id}
                                    className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-xs font-medium disabled:opacity-50 transition-colors"
                                  >
                                    {t('admin.actions.cancel')}
                                  </button>
                                </>
                              )}
                              {appointment.status === 'confirmed' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    updateAppointmentStatus(appointment.id!, 'cancelled')
                                  }}
                                  disabled={isUpdating === appointment.id}
                                  className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-xs font-medium disabled:opacity-50 transition-colors"
                                >
                                  {t('admin.actions.cancel')}
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openDeleteDialog(appointment.id!, appointment.name)
                                }}
                                disabled={isUpdating === appointment.id}
                                className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-xs font-medium disabled:opacity-50 transition-colors"
                              >
                                {t('admin.actions.delete')}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Additional Links */}
        <div className="mt-8 text-center space-x-4">
          <a href="/admin/swagger" className="text-blue-600 hover:text-blue-800 transition-colors">
            {t('admin.apiDocumentation')}
          </a>
          <span className="text-gray-400">•</span>
          <a href={`/${locale}`} className="text-gray-500 hover:text-gray-700 transition-colors">
            {t('common.backToHome')}
          </a>
        </div>
      </div>

      {/* Appointment Details Popup */}
      {selectedAppointment && (
        <AppointmentDetailsPopup
          appointment={selectedAppointment}
          isOpen={isAppointmentPopupOpen}
          onClose={closeAppointmentPopup}
          onConfirm={async (id) => {
            await updateAppointmentStatus(id, 'confirmed')
            closeAppointmentPopup()
            fetchAppointments()
          }}
          onCancel={async (id) => {
            await updateAppointmentStatus(id, 'cancelled')
            closeAppointmentPopup()
            fetchAppointments()
          }}
          onDelete={async (id) => {
            await handleAppointmentDelete(id)
            closeAppointmentPopup()
            fetchAppointments()
          }}
          isUpdating={isUpdating}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title={t('admin.deleteDialog.title')}
        message={t('admin.deleteDialog.message').replace('{name}', deleteDialog.appointmentName)}
        onConfirm={confirmDeleteAppointment}
        onClose={closeDeleteDialog}
        confirmText={t('admin.deleteDialog.confirm')}
        cancelText={t('admin.deleteDialog.cancel')}
        isDangerous={true}
      />
    </div>
  )
}
