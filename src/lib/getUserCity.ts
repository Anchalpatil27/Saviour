import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"

export async function getUserCity(userId: string | undefined): Promise<string | null> {
  if (!userId) return null

  try {
    const client = await clientPromise
    const db = client.db("test")

    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })
    return user?.city || null
  } catch (error) {
    console.error("Error fetching user city:", error)
    return null
  }
}

