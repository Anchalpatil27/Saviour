import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const db = await dbConnect()
    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const usersCollection = db.collection("users")

    // Find user
    const user = await usersCollection.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || "default_secret", {
      expiresIn: "7d",
    })

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profileCompleted: user.profileCompleted,
      },
    })
  } catch (error) {
    console.error("Error logging in:", error)
    return NextResponse.json({ error: "Failed to login" }, { status: 500 })
  }
}

