import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"

export async function getUserCity(userId: string | undefined): Promise<string | null> {
  if (!userId) return null

  try {
    const client = await clientPromise
    const db = client.db("test") // specifically using "test" database

    // Convert string ID to ObjectId and find user in users collection
    const user = await db.collection("users").findOne({
      _id: new ObjectId(userId),
    })

    // Debug logging
    console.log("Found user:", user)

    if (!user || !user.city) {
      console.log("No city found for user:", userId)
      return null
    }

    return user.city
  } catch (error) {
    console.error("Error fetching user city:", error)
    return null
  }
}

