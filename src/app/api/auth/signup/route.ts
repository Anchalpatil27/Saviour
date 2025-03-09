import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    const db = await dbConnect()
    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const usersCollection = db.collection("users")

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const newUser = {
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
      profileCompleted: false,
    }

    await usersCollection.insertOne(newUser)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error signing up user:", error)
    return NextResponse.json({ error: "Failed to sign up user" }, { status: 500 })
  }
}

