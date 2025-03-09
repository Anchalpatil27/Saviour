import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"

export async function POST(request: Request) {
  try {
    const { username, name, email } = await request.json()

    const db = await dbConnect()
    // Fix: Use db directly and add null check
    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const usersCollection = db.collection("users")

    // Check if username is already taken
    const existingUsername = await usersCollection.findOne({ username })
    if (existingUsername) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 })
    }

    // Check if email already exists
    const existingEmail = await usersCollection.findOne({ email })
    if (!existingEmail) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 })
    }

    // Update user profile
    await usersCollection.updateOne(
      { email },
      {
        $set: {
          username,
          name,
          profileCompleted: true,
        },
      },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error completing profile:", error)
    return NextResponse.json({ error: "Failed to complete profile" }, { status: 500 })
  }
}

