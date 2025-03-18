import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { connectToMongoDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

type Context = {
  params?: {
    id: string
  }
}

export async function PATCH(
  request: Request,
  { params }: Context // ✅ FIXED Type Issue
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email || session.user.email !== "vikrantkrd@gmail.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!params || !params.id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 })
    }

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid alert ID" }, { status: 400 })
    }

    const { db } = await connectToMongoDB()
    const alert = await db.collection("alerts").findOne({ _id: new ObjectId(params.id) })

    if (!alert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 })
    }

    // ✅ Toggle logic yahan karo
    const updatedAlert = await db.collection("alerts").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { active: !alert.active } }
    )

    return NextResponse.json({
      success: true,
      message: `Alert toggled successfully`,
    })
  } catch (error) {
    console.error("Error toggling alert:", error)
    return NextResponse.json({ error: "Failed to toggle alert" }, { status: 500 })
  }
}
