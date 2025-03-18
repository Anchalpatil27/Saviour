import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { connectToMongoDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email || session.user.email !== "vikrantkrd@gmail.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid alert ID" }, { status: 400 })
    }

    const { db } = await connectToMongoDB()
    const alert = await db.collection("alerts").findOne({ _id: new ObjectId(id) })

    if (!alert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 })
    }

    return NextResponse.json({
      alert: {
        ...alert,
        id: alert._id.toString(),
      },
    })
  } catch (error) {
    console.error("Error fetching alert:", error)
    return NextResponse.json({ error: "Failed to fetch alert" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email || session.user.email !== "vikrantkrd@gmail.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid alert ID" }, { status: 400 })
    }

    const { title, type, severity, message, city, active, expiresAt } = await request.json()

    if (!title || !type || !severity || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectToMongoDB()

    const existingAlert = await db.collection("alerts").findOne({ _id: new ObjectId(id) })
    if (!existingAlert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 })
    }

    await db.collection("alerts").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          type,
          severity,
          message,
          city: city || null,
          active,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          updatedAt: new Date(),
          updatedBy: session.user.email,
        },
      },
    )

    await db.collection("activity_logs").insertOne({
      action: "Alert Updated",
      details: `Updated ${severity} ${type} alert: ${title}`,
      userId: session.user.email,
      timestamp: new Date(),
    })

    return NextResponse.json({ message: "Alert updated successfully" })
  } catch (error) {
    console.error("Error updating alert:", error)
    return NextResponse.json({ error: "Failed to update alert" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email || session.user.email !== "vikrantkrd@gmail.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid alert ID" }, { status: 400 })
    }

    const { db } = await connectToMongoDB()

    const existingAlert = await db.collection("alerts").findOne({ _id: new ObjectId(id) })
    if (!existingAlert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 })
    }

    await db.collection("alerts").deleteOne({ _id: new ObjectId(id) })

    await db.collection("activity_logs").insertOne({
      action: "Alert Deleted",
      details: `Deleted ${existingAlert.severity} ${existingAlert.type} alert: ${existingAlert.title}`,
      userId: session.user.email,
      timestamp: new Date(),
    })

    return NextResponse.json({ message: "Alert deleted successfully" })
  } catch (error) {
    console.error("Error deleting alert:", error)
    return NextResponse.json({ error: "Failed to delete alert" }, { status: 500 })
  }
}
