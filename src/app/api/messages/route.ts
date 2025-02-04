import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const city = request.nextUrl.searchParams.get("city")
    if (!city) {
      return NextResponse.json({ error: "City is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("test")

    const messages = await db.collection("messages").find({ city }).sort({ createdAt: -1 }).limit(50).toArray()

    return NextResponse.json(messages.reverse())
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("test")

    const { content, city } = await request.json()
    if (!content || !city) {
      return NextResponse.json({ error: "Content and city are required" }, { status: 400 })
    }

    const message = await db.collection("messages").insertOne({
      content,
      username: session.user?.name || "Anonymous",
      city,
      createdAt: new Date(),
    })

    return NextResponse.json(message)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to post message" }, { status: 500 })
  }
}

