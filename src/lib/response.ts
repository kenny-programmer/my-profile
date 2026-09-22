/**
 * Next.js API route response helpers
 */
import { NextResponse } from 'next/server'

export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status })
}

export function created<T>(data: T): NextResponse {
  return NextResponse.json({ success: true, data }, { status: 201 })
}

export function badRequest(message: string): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status: 400 })
}

export function notFound(resource = 'Resource'): NextResponse {
  return NextResponse.json(
    { success: false, error: `${resource} not found` },
    { status: 404 }
  )
}

export function serverError(message = 'Internal server error'): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status: 500 })
}

export function tooManyRequests(): NextResponse {
  return NextResponse.json(
    { success: false, error: 'Too many requests. Please try again later.' },
    { status: 429 }
  )
}
