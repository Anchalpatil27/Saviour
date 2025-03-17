import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { connectToMongoDB } from "@/lib/mongodb"
import { hash } from "bcryptjs"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is admin
    if (!session?.user?.email || session.user.email !== "vikrantkrd@gmail.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToMongoDB()

    // Get admin's city
    const adminUser = await db.collection("users").findOne({ email: session.user.email }, { projection: { city: 1 } })

    if (!adminUser?.city) {
      return NextResponse.json(
        { error: "Admin profile not set up or city not found", adminSetupRequired: true },
        { status: 400 },
      )
    }

    const { name, email, role, password } = await request.json()

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Force the city to be the admin's city
    const city = adminUser.city

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const result = await db.collection("users").insertOne({
      name,
      email,
      city,
      role,
      password: hashedPassword,
      createdAt: new Date(),
    })

    // Log activity
    await db.collection("activity_logs").insertOne({
      action: "User Created",
      details: `Created user: ${name} (${email}) in city: ${city}`,
      userId: session.user.email,
      timestamp: new Date(),
    })

    return NextResponse.json({
      message: "User created successfully",
      userId: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

