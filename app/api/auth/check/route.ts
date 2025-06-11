import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const authToken = cookieStore.get('auth-token')

    if (!authToken || authToken.value !== 'authenticated') {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    return NextResponse.json({ success: true, authenticated: true })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
