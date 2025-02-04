import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"

export async function getUserCity(userId: string): Promise<string | null> {
  try {
    const client = await clientPromise
    const db = client.db("test")
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) }, { projection: { city: 1 } })

    return user?.city || null
  } catch (error) {
    console.error("Error fetching user city:", error)
    return null
  }
}

