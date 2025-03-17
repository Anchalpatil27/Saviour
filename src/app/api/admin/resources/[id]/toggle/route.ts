import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { connectToMongoDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
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

    const { available } = await request.json()

    if (typeof available !== "boolean") {
      return NextResponse.json({ error: "Available status must be a boolean" }, { status: 400 })
    }

    const { db } = await connectToMongoDB()

    // Check if resource exists
    const existingResource = await db.collection("resources").findOne({ _id: new ObjectId(id) })
    if (!existingResource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    // Update resource availability
    await db.collection("resources").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          available,
          updatedAt: new Date(),
          updatedBy: session.user.email,
        },
      },
    )

    // Log activity
    await db.collection("activity_logs").insertOne({
      action: available ? "Resource Marked Available" : "Resource Marked Unavailable",
      details: `${available ? "Marked available" : "Marked unavailable"}: ${existingResource.name}`,
      userId: session.user.email,
      timestamp: new Date(),
    })

    return NextResponse.json({
      message: `Resource ${available ? "marked available" : "marked unavailable"} successfully`,
    })
  } catch (error) {
    console.error("Error toggling resource availability:", error)
    return NextResponse.json({ error: "Failed to update resource availability" }, { status: 500 })
  }
}

