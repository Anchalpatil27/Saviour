import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { getUserCity } from "@/lib/getUserCity"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!session.user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    const userCity = await getUserCity(session.user?.id)
    if (!userCity) {
      return NextResponse.json({ error: "User city not found" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("test")

    const messages = await db
      .collection("messages")
      .find({ city: userCity })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray()

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
    if (!session.user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    const userCity = await getUserCity(session.user?.id)
    if (!userCity) {
      return NextResponse.json({ error: "User city not found" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("test")

    const { content } = await request.json()
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const message = await db.collection("messages").insertOne({
      content,
      username: session.user?.name || "Anonymous",
      city: userCity,
      createdAt: new Date(),
    })

    return NextResponse.json(message)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to post message" }, { status: 500 })
  }
}

