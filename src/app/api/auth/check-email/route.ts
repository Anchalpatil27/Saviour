import { connectToDatabase } from "@/lib/db/mongodb"
import { User } from "@/lib/db/schema"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    await connectToDatabase()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists. Please log in." }, { status: 400 })
    }

    return NextResponse.json({ available: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to check email" }, { status: 500 })
  }
}

