import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { db } = await connectToDatabase()

    const user = await db.collection("users").findOne({ email: session.user.email })

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

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const user = await db.collection("users").findOne({ email: session.user.email })

    if (!user || !user.city) {
      return NextResponse.json({ error: "User not found or city not set in profile" }, { status: 400 })
    }

    const newMessage = {
      content,
      city: user.city,
      userId: user._id.toString(),
      userName: user.name || session.user.name || "Anonymous",
      createdAt: new Date(),
    }

    const result = await db.collection("messages").insertOne(newMessage)

    return NextResponse.json({
      id: result.insertedId.toString(),
      ...newMessage,
    })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
  }
}

