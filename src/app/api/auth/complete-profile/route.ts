import dbConnect from "@/lib/dbConnect"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, username, ...userData } = body

    const db = await dbConnect()
    const usersCollection = db.connection.collection("users")

    // Check if username is already taken
    const existingUsername = await usersCollection.findOne({ username })
    if (existingUsername) {
      return NextResponse.json({ error: "Username is already taken" }, { status: 400 })
    }

    // Update existing user or create new user
    const result = await usersCollection.findOneAndUpdate(
      { email },
      {
        $set: {
          username,
          ...userData,
          updatedAt: new Date(),
        },
      },
      { upsert: true, returnDocument: "after" },
    )

    return NextResponse.json({ success: true, user: result?.value || null })
  } catch (error) {
    console.error("Error completing profile:", error)
    return NextResponse.json({ error: "Failed to complete profile" }, { status: 500 })
  }
}

