import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const client = await clientPromise
    const db = client.db("test")

    const user = await db.collection("users").findOne({ email: session.user.email }, { projection: { city: 1 } })

    if (!user || !user.city) {
      return NextResponse.json({ error: "City not set in your profile" }, { status: 400 })
    }

    return NextResponse.json({ city: user.city })
  } catch (error) {
    console.error("Error fetching user city:", error)
    return NextResponse.json({ error: "Failed to fetch user city" }, { status: 500 })
  }
}

