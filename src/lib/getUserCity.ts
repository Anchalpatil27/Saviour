import { connectToDatabase } from "./mongodb"
import { ObjectId } from "mongodb"

export async function getUserCity(userId: string): Promise<string | null> {
  console.log("getUserCity called with userId:", userId)

  if (!userId) {
    console.error("getUserCity: No userId provided")
    return null
  }

  try {
    const { db } = await connectToDatabase()

    let user = null

    // Try to find by ObjectId
    if (ObjectId.isValid(userId)) {
      user = await db.collection("users").findOne({ _id: new ObjectId(userId) }, { projection: { city: 1, email: 1 } })
      console.log("getUserCity: Attempt to find by ObjectId result:", user)
    }

    // If not found, try to find by email
    if (!user && userId.includes("@")) {
      user = await db.collection("users").findOne({ email: userId }, { projection: { city: 1, email: 1 } })
      console.log("getUserCity: Attempt to find by email result:", user)
    }

    if (!user) {
      console.error("getUserCity: No user found for ID:", userId)
      return null
    }

    if (!user.city) {
      console.error("getUserCity: User found but no city set:", user.email)
      return null
    }

    console.log("getUserCity: Returning city:", user.city)
    return user.city
  } catch (error) {
    console.error("Error in getUserCity:", error)
    return null
  }
}

