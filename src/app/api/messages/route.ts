import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { db } = await connectToDatabase()

    const user = await db.collection("users").findOne({ email: session.user.email }, { projection: { city: 1 } })

    if (!user || !user.city) {
      return NextResponse.json({ error: "City not set in your profile" }, { status: 400 })
    }

    const messages = await db
      .collection("messages")
      .find({ city: user.city })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray()

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

