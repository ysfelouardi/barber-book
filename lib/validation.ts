import { z } from 'zod'

// Phone number validation for international format
// Validates that the number starts with + followed by country code and proper length
const phoneRegex = /^\+[1-9]\d{0,3}\d{6,15}$/

// Booking form validation schema
export const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(phoneRegex, 'Please enter a valid phone number'),
  service: z.enum(['haircut', 'beard', 'both'], {
    required_error: 'Please select a service',
  }),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
})

// Login form validation schema
export const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// API route validation schemas
export const bookAppointmentSchema = bookingSchema

export const updateAppointmentSchema = z.object({
  id: z.string(),
  status: z.enum(['pending', 'confirmed', 'cancelled']).optional(),
  name: z.string().min(2).optional(),
  phone: z.string().regex(phoneRegex).optional(),
  service: z.enum(['haircut', 'beard', 'both']).optional(),
  date: z.string().optional(),
  time: z.string().optional(),
})

export const getSlotsSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
})

// Type inference from schemas
export type BookingData = z.infer<typeof bookingSchema>
export type LoginData = z.infer<typeof loginSchema>
export type UpdateAppointmentData = z.infer<typeof updateAppointmentSchema>
export type GetSlotsData = z.infer<typeof getSlotsSchema>
