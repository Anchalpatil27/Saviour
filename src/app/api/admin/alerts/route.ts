import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { connectToMongoDB } from "@/lib/mongodb"

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

    const { title, type, severity, message, active, expiresAt } = await request.json()

    // Validate required fields
    if (!title || !type || !severity || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Force the city to be the admin's city
    const city = adminUser.city

    // Create alert
    const result = await db.collection("alerts").insertOne({
      title,
      type,
      severity,
      message,
      city,
      active: active || false,
      createdAt: new Date(),
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdBy: session.user.email,
    })

    // Log activity
    await db.collection("activity_logs").insertOne({
      action: "Alert Created",
      details: `Created ${severity} ${type} alert: ${title} for city: ${city}`,
      userId: session.user.email,
      timestamp: new Date(),
    })

    return NextResponse.json({
      message: "Alert created successfully",
      alertId: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("Error creating alert:", error)
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 })
  }
}

