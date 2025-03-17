import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { connectToMongoDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is admin
    if (!session?.user?.email || session.user.email !== "vikrantkrd@gmail.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid resource ID" }, { status: 400 })
    }

    const { db } = await connectToMongoDB()

    const resource = await db.collection("resources").findOne({ _id: new ObjectId(id) })

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    return NextResponse.json({
      resource: {
        ...resource,
        id: resource._id.toString(),
      },
    })
  } catch (error) {
    console.error("Error fetching resource:", error)
    return NextResponse.json({ error: "Failed to fetch resource" }, { status: 500 })
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
      return NextResponse.json({ error: "Invalid resource ID" }, { status: 400 })
    }

    const { name, type, description, location, city, contact, available } = await request.json()

    // Validate required fields
    if (!name || !type || !description || !location || !city) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectToMongoDB()

    // Check if resource exists
    const existingResource = await db.collection("resources").findOne({ _id: new ObjectId(id) })
    if (!existingResource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    // Update resource
    await db.collection("resources").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          type,
          description,
          location,
          city,
          contact: contact || "",
          available,
          updatedAt: new Date(),
          updatedBy: session.user.email,
        },
      },
    )

    // Log activity
    await db.collection("activity_logs").insertOne({
      action: "Resource Updated",
      details: `Updated ${type} resource: ${name} in ${city}`,
      userId: session.user.email,
      timestamp: new Date(),
    })

    return NextResponse.json({ message: "Resource updated successfully" })
  } catch (error) {
    console.error("Error updating resource:", error)
    return NextResponse.json({ error: "Failed to update resource" }, { status: 500 })
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
      return NextResponse.json({ error: "Invalid resource ID" }, { status: 400 })
    }

    const { db } = await connectToMongoDB()

    // Check if resource exists
    const existingResource = await db.collection("resources").findOne({ _id: new ObjectId(id) })
    if (!existingResource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    // Delete resource
    await db.collection("resources").deleteOne({ _id: new ObjectId(id) })

    // Log activity
    await db.collection("activity_logs").insertOne({
      action: "Resource Deleted",
      details: `Deleted ${existingResource.type} resource: ${existingResource.name} in ${existingResource.city}`,
      userId: session.user.email,
      timestamp: new Date(),
    })

    return NextResponse.json({ message: "Resource deleted successfully" })
  } catch (error) {
    console.error("Error deleting resource:", error)
    return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 })
  }
}

