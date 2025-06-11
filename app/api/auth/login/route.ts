import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Simple credential check (in production, this should be more secure)
    const validCredentials = [
      { username: 'admin@barberbook.com', password: 'admin123' },
      { username: 'admin', password: 'admin123' },
    ]

    const isValid = validCredentials.some(
      (cred) => cred.username === username && cred.password === password
    )

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Set authentication cookie (simple session)
    const cookieStore = cookies()
    cookieStore.set('auth-token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return NextResponse.json({ success: true, message: 'Login successful' })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
