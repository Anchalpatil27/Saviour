import { connectToDatabase } from "./mongodb"
import { ObjectId } from "mongodb"

export async function getUserCity(userId: string): Promise<string | null> {
  if (!userId) {
    console.error("getUserCity: No userId provided")
    return null
  }

  try {
    const { db } = await connectToDatabase()

    let user = null
    if (ObjectId.isValid(userId)) {
      user = await db.collection("users").findOne({ _id: new ObjectId(userId) }, { projection: { city: 1 } })
    }

    if (!user?.city) {
      console.error("getUserCity: No city found for user:", userId)
      return null
    }

    return user.city
  } catch (error) {
    console.error("Error in getUserCity:", error)
    return null
  }
}

