import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Handle headers here in middleware
  const requestHeaders = new Headers(request.headers)
  
  // Add any custom headers if needed
  requestHeaders.set('x-middleware-cache', 'no-cache')

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}