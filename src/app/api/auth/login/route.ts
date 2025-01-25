import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { email, password } = await request.json()

    // Validate the input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Connect to the database
    const db = await dbConnect()
    const usersCollection = db.connection.collection("users")

    // Find the user by email
    const user = await usersCollection.findOne({ email })

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Compare the plaintext password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // If credentials are valid, return success
    return NextResponse.json(
      { message: "Login successful", user: { email: user.email } },
      { status: 200 }
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}