import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/prisma/client"

const schema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  isAdmin: z.boolean().optional().default(false),
})

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const validation = schema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 })
    }

    const { name, email, isAdmin } = validation.data

    const user = await prisma.user.findUnique({
      where: { id: params.id },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        name,
        email,
        isAdmin,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    await prisma.user.delete({
      where: { id: params.id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}

