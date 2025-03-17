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

    const { name, type, description, location, contact, available } = await request.json()

    // Validate required fields
    if (!name || !type || !description || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Force the city to be the admin's city
    const city = adminUser.city

    // Create resource
    const result = await db.collection("resources").insertOne({
      name,
      type,
      description,
      location,
      city,
      contact: contact || "",
      available: available !== undefined ? available : true,
      createdAt: new Date(),
      createdBy: session.user.email,
    })

    // Log activity
    await db.collection("activity_logs").insertOne({
      action: "Resource Created",
      details: `Created ${type} resource: ${name} in city: ${city}`,
      userId: session.user.email,
      timestamp: new Date(),
    })

    return NextResponse.json({
      message: "Resource created successfully",
      resourceId: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("Error creating resource:", error)
    return NextResponse.json({ error: "Failed to create resource" }, { status: 500 })
  }
}

