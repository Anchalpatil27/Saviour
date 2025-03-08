"use server"

import { revalidatePath } from "next/cache"
import { connectToMongoDB } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// Define the Message interface to match what the component expects
export interface MessageInterface {
  id: string
  content: string
  userId: string
  userName: string
  userImage?: string
  createdAt: Date
}

// Define the MongoDB document structure
interface MessageDocument {
  _id: ObjectId
  content: string
  userId: string
  userName: string
  userImage?: string
  city: string
  createdAt: Date
  __v?: number
}

interface SendMessageProps {
  content: string
  userId: string
  city: string | undefined
}

export async function sendMessage({ content, userId, city }: SendMessageProps) {
  try {
    if (!city) {
      throw new Error("User city is not defined")
    }

    const { db } = await connectToMongoDB()

    // Get user details
    let user

    try {
      // Try to find by MongoDB ObjectId
      user = await db.collection("users").findOne({
        _id: new ObjectId(userId),
      })
    } catch {
      // If that fails, try to find by string id
      user = await db.collection("users").findOne({
        id: userId,
      })
    }

    if (!user) {
      throw new Error("User not found")
    }

    // Create new message
    const message = {
      content,
      userId,
      userName: user.name,
      userImage: user.image,
      city,
      createdAt: new Date(),
    }

    await db.collection("messages").insertOne(message)

    revalidatePath("/dashboard/community")

    return { success: true }
  } catch (error) {
    console.error("Error sending message:", error)
    return { success: false, error: "Failed to send message" }
  }
}

export async function getCityMessages(city: string | undefined): Promise<MessageInterface[]> {
  try {
    if (!city) {
      return []
    }

    const { db } = await connectToMongoDB()

    // Get messages for the specified city, sorted by creation time
    const messages = (await db
      .collection("messages")
      .find({ city })
      .sort({ createdAt: 1 })
      .limit(100)
      .toArray()) as MessageDocument[]

    // Map the MongoDB documents to match the Message interface
    return messages.map((message: MessageDocument) => ({
      id: message._id.toString(),
      content: message.content,
      userId: message.userId,
      userName: message.userName,
      userImage: message.userImage,
      createdAt: message.createdAt,
    }))
  } catch (error) {
    console.error("Error fetching city messages:", error)
    return []
  }
}

