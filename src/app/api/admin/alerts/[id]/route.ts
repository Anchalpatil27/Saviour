import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { connectToMongoDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { ParsedUrlQuery } from "querystring" // ✅ FIXED Type Error

export async function GET(
  request: Request,
  context: { params: ParsedUrlQuery }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email || session.user.email !== "vikrantkrd@gmail.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // ✅ Typecast params using ParsedUrlQuery
    const { id } = context.params as { id: string }

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
