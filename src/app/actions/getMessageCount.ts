"use server"

import { connectToDatabase } from "@/lib/mongodb"

export async function getMessageCount(city: string): Promise<number> {
  try {
    const { db } = await connectToDatabase()
    return await db.collection("messages").countDocuments({ city })
  } catch (error) {
    console.error("Error fetching message count:", error)
    return 0
  }
}

