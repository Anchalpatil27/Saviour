import dbConnect from "@/lib/dbConnect"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const db = await dbConnect()
    const usersCollection = db.connection.collection("users")

    const result = await usersCollection.insertOne({
      email,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ success: true, user: { email: result.insertedId.toString() } })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
  }
}

