import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'

export interface Appointment {
  id?: string
  name: string
  email?: string // Optional for backward compatibility
  phone: string
  service: 'haircut' | 'beard' | 'both'
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: Timestamp
  // Customer authentication data
  customerId?: string | null // Firebase Auth UID
  customerEmail?: string | null // Customer's email
  customerPhone?: string | null // Customer's verified phone
}

export interface TimeSlot {
  date: string
  time: string
  available: boolean
}

// Collections
export const appointmentsCollection = collection(db, 'appointments')
export const availabilityCollection = collection(db, 'availability')

/**
 * Creates a new appointment
 * @param appointmentData - The appointment data
 * @returns Promise<string> - The document ID
 */
export async function createAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt'>) {
  const docRef = await addDoc(appointmentsCollection, {
    ...appointmentData,
    createdAt: Timestamp.now(),
  })
  return docRef.id
}

/**
 * Gets all appointments
 * @returns Promise<Appointment[]>
 */
export async function getAllAppointments(): Promise<Appointment[]> {
  // Use simple query first, then sort in JavaScript to avoid index requirement
  const querySnapshot = await getDocs(appointmentsCollection)
  const appointments = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Appointment[]

  // Sort by date and time in JavaScript
  return appointments.sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date)
    if (dateCompare !== 0) return dateCompare
    return a.time.localeCompare(b.time)
  })
}

/**
 * Updates an appointment
 * @param id - The appointment ID
 * @param updates - The fields to update
 */
export async function updateAppointment(id: string, updates: Partial<Appointment>) {
  const docRef = doc(db, 'appointments', id)
  await updateDoc(docRef, updates)
}

/**
 * Deletes an appointment
 * @param id - The appointment ID
 */
export async function deleteAppointment(id: string) {
  const docRef = doc(db, 'appointments', id)
  await deleteDoc(docRef)
}

/**
 * Gets available time slots for a specific date
 * @param date - The date in YYYY-MM-DD format
 * @returns Promise<string[]> - Array of available time slots
 */
export async function getAvailableSlots(date: string): Promise<string[]> {
  // Default time slots (you can modify these as needed)
  const defaultSlots = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
  ]

  // Check if the selected date is today
  const today = new Date()
  const selectedDate = new Date(date)
  const isToday = selectedDate.toDateString() === today.toDateString()

  // If it's today, filter out past time slots
  let availableSlots = defaultSlots
  if (isToday) {
    const currentTime = today.getHours() * 60 + today.getMinutes() // Current time in minutes
    availableSlots = defaultSlots.filter((slot) => {
      const [hours, minutes] = slot.split(':').map(Number)
      const slotTimeInMinutes = hours * 60 + minutes
      // Add 30 minutes buffer to current time to allow some preparation time
      return slotTimeInMinutes > currentTime + 30
    })
  }

  // Get booked appointments for this date
  const q = query(
    appointmentsCollection,
    where('date', '==', date),
    where('status', 'in', ['pending', 'confirmed'])
  )
  const querySnapshot = await getDocs(q)
  const bookedSlots = querySnapshot.docs.map((doc) => doc.data().time)

  // Return available slots (not booked and not in the past if today)
  return availableSlots.filter((slot) => !bookedSlots.includes(slot))
}
