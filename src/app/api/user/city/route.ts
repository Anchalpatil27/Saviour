import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  console.log("User city API - Request received")
  const session = await getServerSession(authOptions)

  console.log("User city API - Session:", session)

  if (!session?.user?.email) {
    console.error("User city API - No authenticated session found")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    console.log("User city API - Connecting to database")
    const { db } = await connectToDatabase()
    console.log("User city API - Connected to database")

    console.log("User city API - Fetching city for email:", session.user.email)
    const user = await db
      .collection("users")
      .findOne({ email: session.user.email }, { projection: { city: 1, _id: 0 } })

    console.log("User city API - Database response:", user)

    if (!user) {
      console.log("User city API - No user found for email:", session.user.email)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (!user.city) {
      console.log("User city API - No city found for user:", session.user.email)
      return NextResponse.json({ error: "City not set" }, { status: 404 })
    }

    console.log("User city API - Successfully found city:", user.city)
    return NextResponse.json({ city: user.city })
  } catch (error) {
    console.error("Error fetching user city:", error)
    return NextResponse.json({ error: "Failed to fetch city" }, { status: 500 })
  }
}

