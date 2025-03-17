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
      return NextResponse.json({ error: "Invalid alert ID" }, { status: 400 })
    }

    const { active } = await request.json()

    if (typeof active !== "boolean") {
      return NextResponse.json({ error: "Active status must be a boolean" }, { status: 400 })
    }

    const { db } = await connectToMongoDB()

    // Check if alert exists
    const existingAlert = await db.collection("alerts").findOne({ _id: new ObjectId(id) })
    if (!existingAlert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 })
    }

    // Update alert active status
    await db.collection("alerts").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          active,
          updatedAt: new Date(),
          updatedBy: session.user.email,
        },
      },
    )

    // Log activity
    await db.collection("activity_logs").insertOne({
      action: active ? "Alert Activated" : "Alert Deactivated",
      details: `${active ? "Activated" : "Deactivated"} alert: ${existingAlert.title}`,
      userId: session.user.email,
      timestamp: new Date(),
    })

    return NextResponse.json({
      message: `Alert ${active ? "activated" : "deactivated"} successfully`,
    })
  } catch (error) {
    console.error("Error toggling alert status:", error)
    return NextResponse.json({ error: "Failed to update alert status" }, { status: 500 })
  }
}

