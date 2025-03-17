import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { connectToMongoDB } from "@/lib/mongodb"
import { hash } from "bcryptjs"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Ensure only the admin can access this endpoint
    if (!session?.user?.email || session.user.email !== "vikrantkrd@gmail.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, email, city, role } = await request.json()

    // Validate required fields
    if (!name || !email || !city || role !== "admin") {
      return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 })
    }

    // Ensure email matches the admin email
    if (email !== "vikrantkrd@gmail.com") {
      return NextResponse.json({ error: "Email cannot be changed" }, { status: 400 })
    }

    const { db } = await connectToMongoDB()

    // Check if admin already exists
    const existingAdmin = await db.collection("users").findOne({ email })

    if (existingAdmin) {
      // Update existing admin
      await db.collection("users").updateOne(
        { email },
        {
          $set: {
            name,
            city,
            role,
            updatedAt: new Date(),
          },
        },
      )
    } else {
      // Create new admin user
      // Generate a secure random password (since admin uses OAuth, this won't be used for login)
      const securePassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10)
      const hashedPassword = await hash(securePassword, 10)

      await db.collection("users").insertOne({
        name,
        email,
        city,
        role,
        password: hashedPassword,
        createdAt: new Date(),
      })
    }

    // Log activity
    await db.collection("activity_logs").insertOne({
      action: existingAdmin ? "Admin Profile Updated" : "Admin Profile Created",
      details: `${existingAdmin ? "Updated" : "Created"} admin profile for ${name} (${email}) with city: ${city}`,
      userId: email,
      timestamp: new Date(),
    })

    return NextResponse.json({
      message: existingAdmin ? "Admin profile updated successfully" : "Admin profile created successfully",
    })
  } catch (error) {
    console.error("Error setting up admin profile:", error)
    return NextResponse.json(
      {
        error: `Failed to set up admin profile: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}

