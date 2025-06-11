import { Appointment } from '@/lib/firestore'
import { getAnimalAvatar, getAdminAvatar } from '@/lib/avatarUtils'
import { useTranslations } from '@/hooks/useTranslations'

interface AppointmentDetailsPopupProps {
  appointment: Appointment | null
  isOpen: boolean
  onClose: () => void
  onConfirm?: (id: string) => void
  onCancel?: (id: string) => void
  onDelete?: (id: string) => void
  isUpdating?: string | null
}

export default function AppointmentDetailsPopup({
  appointment,
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  onDelete,
  isUpdating,
}: AppointmentDetailsPopupProps) {
  const { t, locale } = useTranslations()

  if (!isOpen || !appointment) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <svg
            className="w-4 h-4 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'cancelled':
        return (
          <svg
            className="w-4 h-4 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )
      default:
        return (
          <svg
            className="w-4 h-4 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const date = new Date()
    date.setHours(parseInt(hours), parseInt(minutes))
    return date.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-xl">{getAdminAvatar()}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{t('appointmentDetails.title')}</h3>
                <p className="text-blue-100 text-sm">{t('appointmentDetails.subtitle')}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
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
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Customer Info */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                <span className="text-2xl">{getAnimalAvatar(appointment.name)}</span>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900">{appointment.name}</h4>
                <p className="text-gray-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {appointment.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-3">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">{t('appointmentDetails.date')}</p>
                <p className="font-medium text-gray-900">{formatDate(appointment.date)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">{t('appointmentDetails.time')}</p>
                <p className="font-medium text-gray-900">{formatTime(appointment.time)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 16a3 3 0 00-2.332 4.687L7 21h2.332M15 16a3 3 0 012.332 4.687L17 21h-2.332z"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">{t('appointmentDetails.service')}</p>
                <p className="font-medium text-gray-900 capitalize">
                  {t(`booking.services.${appointment.service}`)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {getStatusIcon(appointment.status)}
              <div>
                <p className="text-sm text-gray-500">{t('appointmentDetails.status')}</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}
                >
                  {t(`admin.status.${appointment.status}`)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {appointment.status === 'pending' && (
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <button
                onClick={() => onConfirm?.(appointment.id!)}
                disabled={isUpdating === appointment.id}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{t('appointmentDetails.actions.confirm')}</span>
              </button>
              <button
                onClick={() => onCancel?.(appointment.id!)}
                disabled={isUpdating === appointment.id}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span>{t('appointmentDetails.actions.cancel')}</span>
              </button>
            </div>
          )}

          {/* Delete Button */}
          <button
            onClick={() => onDelete?.(appointment.id!)}
            disabled={isUpdating === appointment.id}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span>{t('appointmentDetails.actions.delete')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
