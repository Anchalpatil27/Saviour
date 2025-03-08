import mongoose from "mongoose"
import type { ObjectId } from "mongodb"

// Define the Message schema
const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userImage: {
    type: String,
  },
  city: {
    type: String,
    required: true,
    index: true, // Add index for faster queries by city
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Define interfaces for TypeScript
export interface IMessage {
  _id: ObjectId
  content: string
  userId: string
  userName: string
  userImage?: string
  city: string
  createdAt: Date
}

export interface MessageDTO {
  id: string
  content: string
  userId: string
  userName: string
  userImage?: string
  createdAt: Date
}

// Helper function to convert MongoDB document to DTO
export function messageToDTO(message: IMessage): MessageDTO {
  return {
    id: message._id.toString(),
    content: message.content,
    userId: message.userId,
    userName: message.userName,
    userImage: message.userImage,
    createdAt: message.createdAt,
  }
}

// Create or retrieve the Message model
export const MessageModel = mongoose.models.Message || mongoose.model("Message", MessageSchema)

