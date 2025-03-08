import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { connectToMongoDB } from "@/lib/mongodb"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToMongoDB()

    const user = await db.collection("users").findOne({ email: session.user.email }, { projection: { city: 1 } })

    if (!user || !user.city) {
      return NextResponse.json({ error: "City not found for user" }, { status: 404 })
    }

    return NextResponse.json({ city: user.city })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to fetch user city" }, { status: 500 })
  }
}

