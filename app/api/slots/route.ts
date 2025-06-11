import { NextRequest, NextResponse } from 'next/server'
import { getSlotsSchema } from '@/lib/validation'
import { getAvailableSlots } from '@/lib/firestore'

/**
 * Gets available time slots for a specific date.
 * @param request - The HTTP request with date query parameter
 * @returns Promise<NextResponse> - Available slots or error response
 */
export async function GET(request: NextRequest) {
  try {
    const date = request.nextUrl.searchParams.get('date')

    if (!date) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
    }

    // Validate date format
    const validatedData = getSlotsSchema.parse({ date })

    // Check if date is not in the past
    const selectedDate = new Date(validatedData.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      return NextResponse.json({ error: 'Cannot get slots for past dates' }, { status: 400 })
    }

    // Get available slots
    const availableSlots = await getAvailableSlots(validatedData.date)

    const response = NextResponse.json(
      {
        success: true,
        date: validatedData.date,
        availableSlots,
      },
      { status: 200 }
    )

    // Add caching headers as mentioned in the guide
    response.headers.set('Cache-Control', 'public, max-age=60')

    return response
  } catch (error) {
    console.error('Error getting available slots:', error)

    // Handle validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid date format', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Failed to get available slots' }, { status: 500 })
  }
}
