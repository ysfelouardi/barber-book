import { useState } from 'react'
import { Appointment } from '@/lib/firestore'
import { getAnimalAvatar } from '@/lib/avatarUtils'
import { useTranslations } from '@/hooks/useTranslations'

interface EnhancedCalendarProps {
  appointments: Appointment[]
  onDateClick?: (date: string) => void
  onAppointmentClick?: (appointment: Appointment) => void
  selectedDate?: string
}

type ViewType = 'month' | 'week'

export default function EnhancedCalendar({
  appointments,
  onDateClick,
  onAppointmentClick,
  selectedDate,
}: EnhancedCalendarProps) {
  const { t, locale } = useTranslations()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewType, setViewType] = useState<ViewType>('week')

  const today = new Date()

  // Time slots for week view (9 AM to 6 PM)
  const timeSlots = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
  ]

  // Month names
  const monthNames = [
    t('calendar.months.january'),
    t('calendar.months.february'),
    t('calendar.months.march'),
    t('calendar.months.april'),
    t('calendar.months.may'),
    t('calendar.months.june'),
    t('calendar.months.july'),
    t('calendar.months.august'),
    t('calendar.months.september'),
    t('calendar.months.october'),
    t('calendar.months.november'),
    t('calendar.months.december'),
  ]

  // Day names
  const dayNames = [
    t('calendar.days.sunday'),
    t('calendar.days.monday'),
    t('calendar.days.tuesday'),
    t('calendar.days.wednesday'),
    t('calendar.days.thursday'),
    t('calendar.days.friday'),
    t('calendar.days.saturday'),
  ]
  const shortDayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  // Get week dates
  const getWeekDates = (date: Date) => {
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - day)

    const week = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      week.push(day)
    }
    return week
  }

  // Format date for comparison
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  // Group appointments by date
  const appointmentsByDate = appointments.reduce(
    (acc, appointment) => {
      const date = appointment.date
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(appointment)
      return acc
    },
    {} as Record<string, Appointment[]>
  )

  // Navigation
  const goToPrevious = () => {
    if (viewType === 'week') {
      const newDate = new Date(currentDate)
      newDate.setDate(currentDate.getDate() - 7)
      setCurrentDate(newDate)
    } else {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      setCurrentDate(newDate)
    }
  }

  const goToNext = () => {
    if (viewType === 'week') {
      const newDate = new Date(currentDate)
      newDate.setDate(currentDate.getDate() + 7)
      setCurrentDate(newDate)
    } else {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
      setCurrentDate(newDate)
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Get status color for appointment
  const getAppointmentColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500 text-white border-green-600'
      case 'pending':
        return 'bg-yellow-500 text-white border-yellow-600'
      case 'cancelled':
        return 'bg-red-500 text-white border-red-600'
      default:
        return 'bg-gray-500 text-white border-gray-600'
    }
  }

  // Check if date is today
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString()
  }

  // Check if date is selected
  const isSelected = (date: Date) => {
    return selectedDate === formatDate(date)
  }

  // Convert time to minutes for positioning
  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  // Week View Component
  const WeekView = () => {
    const weekDates = getWeekDates(currentDate)
    const startTime = timeToMinutes('09:00')
    const endTime = timeToMinutes('18:00')
    const totalMinutes = endTime - startTime

    return (
      <div className="flex flex-col">
        {/* Week Header */}
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-4"></div> {/* Empty cell for time column */}
          {weekDates.map((date, index) => (
            <div
              key={index}
              className={`p-4 text-center border-l border-gray-200 cursor-pointer hover:bg-gray-50 ${
                isSelected(date) ? 'bg-blue-50 border-blue-200' : ''
              } ${isToday(date) ? 'bg-blue-100' : ''}`}
              onClick={() => onDateClick?.(formatDate(date))}
            >
              <div className="text-xs text-gray-500 uppercase">{dayNames[index]}</div>
              <div
                className={`text-lg font-semibold ${
                  isToday(date) ? 'text-blue-600' : 'text-gray-900'
                }`}
              >
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Time Grid */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-8" style={{ minHeight: '600px' }}>
            {/* Time Column */}
            <div className="border-r border-gray-200">
              {timeSlots.map((time, index) => (
                <div key={time} className="h-12 border-b border-gray-100 px-2 py-1">
                  <span className="text-xs text-gray-500">{time}</span>
                </div>
              ))}
            </div>

            {/* Day Columns */}
            {weekDates.map((date, dayIndex) => {
              const dateStr = formatDate(date)
              const dayAppointments = appointmentsByDate[dateStr] || []

              return (
                <div key={dayIndex} className="border-r border-gray-200 relative">
                  {/* Hour lines */}
                  {timeSlots.map((time, timeIndex) => (
                    <div key={timeIndex} className="h-12 border-b border-gray-100"></div>
                  ))}

                  {/* Appointments */}
                  {dayAppointments.map((appointment, appIndex) => {
                    const appointmentTime = timeToMinutes(appointment.time)
                    const top = ((appointmentTime - startTime) / totalMinutes) * 100

                    return (
                      <div
                        key={appIndex}
                        className={`absolute left-1 right-1 rounded px-2 py-1 text-xs cursor-pointer border-l-4 ${getAppointmentColor(appointment.status)} shadow-sm hover:shadow-md transition-shadow`}
                        style={{
                          top: `${top}%`,
                          height: '40px',
                          zIndex: 10,
                        }}
                        onClick={() => onAppointmentClick?.(appointment)}
                      >
                        <div className="font-medium truncate flex items-center space-x-1">
                          <span className="text-sm">{getAnimalAvatar(appointment.name)}</span>
                          <span>{appointment.name}</span>
                        </div>
                        <div className="text-xs opacity-90 truncate">
                          {appointment.time} • {appointment.service}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Month View Component (simplified version of original)
  const MonthView = () => {
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
    const daysInMonth = lastDayOfMonth.getDate()
    const startingDayOfWeek = firstDayOfMonth.getDay()

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {shortDayNames.map((day) => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}

        {/* Empty cells */}
        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="h-20"></div>
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1
          const date = new Date(currentYear, currentMonth, day)
          const dateString = formatDate(date)
          const dayAppointments = appointmentsByDate[dateString] || []

          return (
            <div
              key={day}
              className={`h-20 p-1 border border-gray-100 cursor-pointer hover:bg-gray-50 ${
                isSelected(date) ? 'bg-blue-50 border-blue-200' : ''
              } ${isToday(date) ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => onDateClick?.(dateString)}
            >
              <div className="flex flex-col h-full">
                <span
                  className={`text-sm font-medium ${
                    isToday(date) ? 'text-blue-600' : 'text-gray-900'
                  }`}
                >
                  {day}
                </span>
                <div className="flex-1 overflow-hidden">
                  {dayAppointments.slice(0, 2).map((appointment, idx) => (
                    <div
                      key={idx}
                      className={`text-xs p-1 mb-1 rounded truncate ${getAppointmentColor(appointment.status)}`}
                    >
                      {appointment.time}
                    </div>
                  ))}
                  {dayAppointments.length > 2 && (
                    <div className="text-xs text-gray-400">+{dayAppointments.length - 2}</div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Get current period title
  const getCurrentPeriodTitle = () => {
    if (viewType === 'week') {
      const weekDates = getWeekDates(currentDate)
      const start = weekDates[0]
      const end = weekDates[6]

      if (start.getMonth() === end.getMonth()) {
        return `${monthNames[start.getMonth()]} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`
      } else {
        return `${monthNames[start.getMonth()]} ${start.getDate()} - ${monthNames[end.getMonth()]} ${end.getDate()}, ${start.getFullYear()}`
      }
    } else {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900">{getCurrentPeriodTitle()}</h2>
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewType('month')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewType === 'month'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('calendar.viewModes.month')}
            </button>
            <button
              onClick={() => setViewType('week')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewType === 'week'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('calendar.viewModes.week')}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevious}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
          >
            {t('calendar.navigation.today')}
          </button>
          <button
            onClick={goToNext}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="p-4">{viewType === 'week' ? <WeekView /> : <MonthView />}</div>

      {/* Legend */}
      <div className="px-4 pb-4 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">Confirmed</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-gray-600">Pending</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-600">Cancelled</span>
        </div>
      </div>
    </div>
  )
}
