import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { name, phone, address, city } = await request.json()

    const client = await clientPromise
    const db = client.db("test")

    const result = await db
      .collection("users")
      .updateOne({ email: session.user.email }, { $set: { name, phone, address, city } })

    if (result.modifiedCount === 1) {
      return NextResponse.json({ message: "Profile updated successfully" })
    } else {
      return NextResponse.json({ error: "Failed to update profile" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

