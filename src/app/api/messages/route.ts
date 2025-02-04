import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("your_database_name")

    const city = request.nextUrl.searchParams.get("city")
    if (!city) {
      return NextResponse.json({ error: "City is required" }, { status: 400 })
    }
    const messages = await db.collection("messages").find({ city }).sort({ createdAt: 1 }).toArray()
    return NextResponse.json(messages)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("test")

    const { content, username, city } = await request.json()
    if (!content || !username || !city) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    const message = await db.collection("messages").insertOne({ content, username, city, createdAt: new Date() })
    return NextResponse.json(message)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to post message" }, { status: 500 })
  }
}

