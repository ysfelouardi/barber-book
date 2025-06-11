import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getAllAppointments } from '@/lib/firestore'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = cookies()
    const authToken = cookieStore.get('auth-token')?.value

    if (!authToken) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch real appointments from Firebase
    const appointments = await getAllAppointments()

    return NextResponse.json({
      success: true,
      appointments: appointments,
    })
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
