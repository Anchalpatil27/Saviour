import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Message from "@/models/Message"

export async function GET(request: NextRequest) {
  await dbConnect()
  const city = request.nextUrl.searchParams.get("city")
  if (!city) {
    return NextResponse.json({ error: "City is required" }, { status: 400 })
  }
  const messages = await Message.find({ city }).sort("createdAt")
  return NextResponse.json(messages)
}

export async function POST(request: NextRequest) {
  await dbConnect()
  const { content, username, city } = await request.json()
  if (!content || !username || !city) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  const message = await Message.create({ content, username, city })
  return NextResponse.json(message)
}

