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

export async function GET(
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
