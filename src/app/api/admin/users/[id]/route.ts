import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { connectToMongoDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { hash } from "bcryptjs"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is admin
    if (!session?.user?.email || session.user.email !== "vikrantkrd@gmail.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const { db } = await connectToMongoDB()

    const user = await db.collection("users").findOne({ _id: new ObjectId(id) })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Don't return the password
    const { password, ...userWithoutPassword } = user

    return NextResponse.json({
      user: {
        ...userWithoutPassword,
        id: user._id.toString(),
      },
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is admin
    if (!session?.user?.email || session.user.email !== "vikrantkrd@gmail.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const { name, email, city, role, password } = await request.json()

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectToMongoDB()

    // Check if user exists
    const existingUser = await db.collection("users").findOne({ _id: new ObjectId(id) })
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get the old city for activity logging
    const oldCity = existingUser.city || "Not set"

    // Prepare update data
    const updateData: any = {
      name,
      email,
      city,
      role,
      updatedAt: new Date(),
    }

    // Only update password if provided
    if (password && password.trim() !== "") {
      updateData.password = await hash(password, 10)
    }

    // Update user
    await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    // Log activity with city change information
    const cityChangeInfo = oldCity !== city ? ` (City changed from ${oldCity} to ${city})` : ""
    await db.collection("activity_logs").insertOne({
      action: "User Updated",
      details: `Updated user: ${name} (${email})${cityChangeInfo}`,
      userId: session.user.email,
      timestamp: new Date(),
    })

    return NextResponse.json({ message: "User updated successfully" })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is admin
    if (!session?.user?.email || session.user.email !== "vikrantkrd@gmail.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const { db } = await connectToMongoDB()

    // Check if user exists
    const existingUser = await db.collection("users").findOne({ _id: new ObjectId(id) })
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete user
    await db.collection("users").deleteOne({ _id: new ObjectId(id) })

    // Log activity
    await db.collection("activity_logs").insertOne({
      action: "User Deleted",
      details: `Deleted user: ${existingUser.name} (${existingUser.email}) from city: ${existingUser.city || "Not set"}`,
      userId: session.user.email,
      timestamp: new Date(),
    })

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}

