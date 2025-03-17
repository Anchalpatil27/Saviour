import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { connectToMongoDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

const schema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  city: z.string().min(1),
  role: z.string().default("user"),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToMongoDB()

    const user = await db.collection("users").findOne(
      { _id: new ObjectId(params.id) },
      { projection: { password: 0 } }, // Exclude password
    )

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      city: user.city,
      role: user.role || "user",
      createdAt: user.createdAt,
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const validation = schema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 })
    }

    const { name, email, city, role } = validation.data

    const { db } = await connectToMongoDB()

    const user = await db.collection("users").findOne({ _id: new ObjectId(params.id) })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const result = await db.collection("users").findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          name,
          email,
          city,
          role,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    // Check if result is null or if value is null
    const updatedUser = result?.value

    if (!updatedUser) {
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
    }

    return NextResponse.json({
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      city: updatedUser.city,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToMongoDB()

    const user = await db.collection("users").findOne({ _id: new ObjectId(params.id) })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    await db.collection("users").deleteOne({ _id: new ObjectId(params.id) })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}

