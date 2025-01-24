import { connectToDatabase } from "@/lib/db/mongodb"
import { User } from "@/lib/db/schema"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, username, ...userData } = body

    await connectToDatabase()

    // Check if username is already taken
    const existingUsername = await User.findOne({ username })
    if (existingUsername) {
      return NextResponse.json({ error: "Username is already taken" }, { status: 400 })
    }

    // Create new user
    const user = await User.create({
      email,
      username,
      ...userData,
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("Error completing profile:", error)
    return NextResponse.json({ error: "Failed to complete profile" }, { status: 500 })
  }
}

