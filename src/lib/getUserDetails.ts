import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"
import type { UserDetails } from "@/types/user"

export async function getUserDetails(identifier: string): Promise<UserDetails | null> {
  try {
    const client = await clientPromise
    const db = client.db("test")

    let user
    // Check if the identifier is a valid ObjectId
    if (ObjectId.isValid(identifier)) {
      user = await db.collection("users").findOne({ _id: new ObjectId(identifier) })
    }

    // If user not found by ID, try to find by email
    if (!user) {
      user = await db.collection("users").findOne({ email: identifier })
    }

    if (!user) return null

    return {
      id: user._id.toString(),
      name: user.name || "",
      email: user.email || "",
      phoneNumber: user.phone || "",
      address: user.address || "",
      city: user.city || "",
      image: user.image || "",
      provider: user.provider || "credentials",
    }
  } catch (error) {
    console.error("Error fetching user details:", error)
    return null
  }
}

