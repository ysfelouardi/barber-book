import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { updateAppointment, deleteAppointment } from '@/lib/firestore'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const cookieStore = cookies()
    const authToken = cookieStore.get('auth-token')?.value

    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const { status } = await request.json()

    // Validate status
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 })
    }

    // Update appointment in Firebase
    await updateAppointment(id, { status })

    return NextResponse.json({
      success: true,
      message: 'Appointment updated successfully',
    })
  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const cookieStore = cookies()
    const authToken = cookieStore.get('auth-token')?.value

    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Delete appointment from Firebase
    await deleteAppointment(id)

    return NextResponse.json({
      success: true,
      message: 'Appointment deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
