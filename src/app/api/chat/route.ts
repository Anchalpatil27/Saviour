import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(req: NextRequest) {
  try {
    const { messages, city, username } = await req.json()
    const client = await clientPromise
    const db = client.db("test")

    // Store the message
    await db.collection("messages").insertOne({
      content: messages[messages.length - 1].content,
      username,
      city,
      createdAt: new Date(),
    })

    // Fetch all messages for the city
    const allMessages = await db.collection("messages").find({ city }).sort({ createdAt: 1 }).toArray()

    return NextResponse.json(allMessages)
  } catch (error) {
    console.error("Error in chat route:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

