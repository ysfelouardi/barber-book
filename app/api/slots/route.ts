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
    console.log('GET /api/slots called with URL:', request.nextUrl.toString())

    const date = request.nextUrl.searchParams.get('date')
    console.log('Date parameter:', date)

    if (!date) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
    }

    // Validate date format
    const validatedData = getSlotsSchema.parse({ date })
    console.log('Validated date:', validatedData.date)

    // Check if date is not in the past
    const selectedDate = new Date(validatedData.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      return NextResponse.json({ error: 'Cannot get slots for past dates' }, { status: 400 })
    }

    console.log('Calling getAvailableSlots...')
    // Get available slots
    const availableSlots = await getAvailableSlots(validatedData.date)
    console.log('Available slots:', availableSlots)

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
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })

    // Handle validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid date format', details: error.message },
        { status: 400 }
      )
    }

    // Return more detailed error in development
    const isDevelopment = process.env.NODE_ENV === 'development'
    return NextResponse.json(
      {
        error: 'Failed to get available slots',
        ...(isDevelopment &&
          error instanceof Error && {
            details: error.message,
            stack: error.stack,
          }),
      },
      { status: 500 }
    )
  }
}
