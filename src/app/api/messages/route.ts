import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const client = await clientPromise
    const db = client.db("test")

    // Get user details including city
    const user = await db.collection("users").findOne({ email: session.user.email })

    console.log("User found in messages API:", user)

    if (!user || !user.city) {
      console.error("No city found for user:", session.user.email)
      return NextResponse.json({ error: "City not set in your profile" }, { status: 400 })
    }

    const messages = await db
      .collection("messages")
      .find({ city: user.city })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray()

    console.log(`Found ${messages.length} messages for city:`, user.city)

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
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("test")

    const user = await db.collection("users").findOne({ email: session.user.email })

    if (!user || !user.city) {
      console.error("No city found for user in POST:", session.user.email)
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

    console.log("New message created:", { id: result.insertedId, ...newMessage })

    return NextResponse.json({
      id: result.insertedId,
      ...newMessage,
    })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
  }
}

