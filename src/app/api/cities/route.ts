import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("test")

    const cities = await db.collection("users").distinct("city")
    return NextResponse.json(cities)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to fetch cities" }, { status: 500 })
  }
}

