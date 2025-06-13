import { z } from 'zod'

// Phone number validation for international format
// Validates that the number starts with + followed by country code and proper length
const phoneRegex = /^\+[1-9]\d{0,3}\d{6,15}$/

// Booking form validation schema
export const bookingSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .regex(
      /^[a-zA-Z\s\u00C0-\u017F\u0100-\u024F\u1E00-\u1EFF]+$/,
      'Name can only contain letters and spaces'
    ),
  email: z.string().email('Please enter a valid email address'),
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

// Enhanced booking schema for API with customer data
export const bookAppointmentSchema = bookingSchema.extend({
  userId: z.string().nullable().optional(), // Firebase Auth UID
  userEmail: z.string().email().nullable().optional(), // User's email
  userPhone: z.string().nullable().optional(), // User's verified phone
})

export const updateAppointmentSchema = z.object({
  id: z.string(),
  status: z.enum(['pending', 'confirmed', 'cancelled']).optional(),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
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
