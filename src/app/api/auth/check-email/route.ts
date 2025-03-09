import dbConnect from "@/lib/dbConnect"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    const db = await dbConnect()
    const usersCollection = db.collection("users")

    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists. Please log in." }, { status: 400 })
    }

    return NextResponse.json({ available: true })
  } catch (error) {
    console.error("Error checking email:", error)
    return NextResponse.json({ error: "Failed to check email" }, { status: 500 })
  }
}

