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

    console.log("User city API - Found user:", user)

    if (!user?.city) {
      console.log("User city API - No city found for user:", session.user.email)
      return NextResponse.json({ error: "City not set" }, { status: 404 })
    }

    console.log("User city API - Returning city:", user.city)
    return NextResponse.json({ city: user.city })
  } catch (error) {
    console.error("Error fetching user city:", error)
    return NextResponse.json({ error: "Failed to fetch city" }, { status: 500 })
  }
}

