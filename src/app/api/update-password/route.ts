import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { userId, currentPassword, newPassword } = await request.json()

    const client = await clientPromise
    const db = client.db("test")

    let query
    if (ObjectId.isValid(userId)) {
      query = { _id: new ObjectId(userId) }
    } else {
      query = { email: userId }
    }

    const user = await db.collection("users").findOne(query)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    const result = await db.collection("users").updateOne(query, { $set: { password: hashedNewPassword } })

    if (result.modifiedCount === 1) {
      return NextResponse.json({ message: "Password updated successfully" })
    } else {
      return NextResponse.json({ error: "Failed to update password" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error updating password:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

