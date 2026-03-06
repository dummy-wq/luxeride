import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export interface AuthPayload {
  userId: string
  email: string
  role?: string
}

export function verifyAuth(request: NextRequest): AuthPayload | null {
  try {
    const token =
      request.headers.get('authorization')?.replace('Bearer ', '') ||
      request.cookies.get('auth_token')?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as AuthPayload

    return decoded
  } catch (error) {
    console.error('Auth verification error:', error)
    return null
  }
}
