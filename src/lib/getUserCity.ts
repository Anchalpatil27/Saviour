import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"

export async function getUserCity(userId: string): Promise<string | null> {
  if (!userId) {
    console.error("getUserCity: No userId provided")
    return null
  }

  try {
    const client = await clientPromise
    const db = client.db("test")

    // First try to find by ObjectId
    let user = null
    if (ObjectId.isValid(userId)) {
      user = await db.collection("users").findOne({ _id: new ObjectId(userId) }, { projection: { city: 1, email: 1 } })
      console.log("getUserCity: Found user by ID:", user)
    }

    // If no user found by ID, try to find by email
    if (!user) {
      user = await db.collection("users").findOne({ email: userId }, { projection: { city: 1, email: 1 } })
      console.log("getUserCity: Found user by email:", user)
    }

    if (!user) {
      console.error("getUserCity: No user found for ID:", userId)
      return null
    }

    if (!user.city) {
      console.error("getUserCity: User found but no city set:", user.email)
      return null
    }

    return user.city
  } catch (error) {
    console.error("Error in getUserCity:", error)
    return null
  }
}

