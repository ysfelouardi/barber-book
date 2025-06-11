import { NextRequest, NextResponse } from 'next/server'
import { bookAppointmentSchema } from '@/lib/validation'
import { createAppointment } from '@/lib/firestore'

/**
 * Books a new appointment.
 * @param request - The HTTP request containing booking data
 * @returns Promise<NextResponse> - Success or error response
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request data
    const validatedData = bookAppointmentSchema.parse(body)

    // Check if date is not in the past
    const selectedDate = new Date(validatedData.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      return NextResponse.json(
        { error: 'Cannot book appointments for past dates' },
        { status: 400 }
      )
    }

    // Create the appointment with pending status
    const appointmentId = await createAppointment({
      ...validatedData,
      status: 'pending',
    })

    return NextResponse.json(
      {
        success: true,
        appointmentId,
        message: 'Appointment booked successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error booking appointment:', error)

    // Handle validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid booking data', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Failed to book appointment' }, { status: 500 })
  }
}
