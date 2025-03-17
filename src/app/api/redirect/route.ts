import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const path = searchParams.get("path")

  if (!path) {
    return NextResponse.redirect(new URL("/admin/users", request.url))
  }

  return NextResponse.redirect(new URL(path, request.url))
}

