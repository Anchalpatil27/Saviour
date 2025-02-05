import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { name, city } = await request.json()

    const { db } = await connectToDatabase()

    const result = await db
      .collection("users")
      .updateOne({ email: session.user.email }, { $set: { name, city } }, { upsert: true })

    console.log("Profile update result:", result)

    if (result.matchedCount === 0 && result.upsertedCount === 0) {
      throw new Error("Failed to update profile")
    }

    return NextResponse.json({ message: "Profile updated successfully" })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "An error occurred while updating your profile" }, { status: 500 })
  }
}

