"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { connectToMongoDB } from "@/lib/mongodb"

interface ProfileData {
  name: string
  email: string
  city: string | null
}

interface ProfileResult {
  success: boolean
  error?: string
}

export async function updateProfile(data: ProfileData): Promise<ProfileResult> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" }
    }

    const { db } = await connectToMongoDB()

    // Update the user in the database
    const result = await db.collection("users").updateOne(
      { email: session.user.email },
      {
        $set: {
          name: data.name,
          city: data.city,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    )

    if (result.acknowledged) {
      revalidatePath("/dashboard/community")
      revalidatePath("/dashboard/profile")
      return { success: true }
    } else {
      return { success: false, error: "Failed to update profile" }
    }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { success: false, error: "An error occurred while updating your profile" }
  }
}

