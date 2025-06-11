import { NextRequest, NextResponse } from 'next/server'
import { updateAppointmentSchema } from '@/lib/validation'
import { updateAppointment, deleteAppointment } from '@/lib/firestore'

/**
 * Updates, confirms, or cancels an appointment.
 * @param request - The HTTP request containing update data
 * @returns Promise<NextResponse> - Success or error response
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request data
    const validatedData = updateAppointmentSchema.parse(body)

    const { id, ...updates } = validatedData

    // If status is being updated to cancelled, we could optionally delete instead
    if (updates.status === 'cancelled') {
      // For this implementation, we'll update the status instead of deleting
      await updateAppointment(id, { status: 'cancelled' })

      return NextResponse.json(
        {
          success: true,
          message: 'Appointment cancelled successfully',
        },
        { status: 200 }
      )
    }

    // Update the appointment
    await updateAppointment(id, updates)

    const message =
      updates.status === 'confirmed'
        ? 'Appointment confirmed successfully'
        : 'Appointment updated successfully'

    return NextResponse.json(
      {
        success: true,
        message,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating appointment:', error)

    // Handle validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid update data', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 })
  }
}

/**
 * Deletes an appointment completely.
 * @param request - The HTTP request containing appointment ID
 * @returns Promise<NextResponse> - Success or error response
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 })
    }

    await deleteAppointment(id)

    return NextResponse.json(
      {
        success: true,
        message: 'Appointment deleted successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting appointment:', error)

    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 })
  }
}
