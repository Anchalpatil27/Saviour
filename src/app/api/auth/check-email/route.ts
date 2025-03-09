import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    const db = await dbConnect()
    // Fix: db doesn't have a connection property, use db directly
    if (!db) {
      throw new Error("Database connection failed")
    }
    const usersCollection = db.collection("users")

    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ exists: true })
    }

    return NextResponse.json({ exists: false })
  } catch (error) {
    console.error("Error checking email:", error)
    return NextResponse.json({ error: "Failed to check email" }, { status: 500 })
  }
}

