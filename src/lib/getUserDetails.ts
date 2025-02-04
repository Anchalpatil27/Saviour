import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"
import type { UserDetails } from "@/types/user"

export async function getUserDetails(userId: string): Promise<UserDetails | null> {
  try {
    const client = await clientPromise
    const db = client.db("test")
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })

    if (!user) return null

    return {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      city: user.city || "",
      image: user.image || "",
    }
  } catch (error) {
    console.error("Error fetching user details:", error)
    return null
  }
}

