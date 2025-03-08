import mongoose from "mongoose"

// Define the Emergency Contact schema
const EmergencyContactSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true, // Add index for faster queries by userId
  },
  name: {
    type: String,
    required: true,
  },
  relation: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Create or retrieve the EmergencyContact model
export const EmergencyContact =
  mongoose.models.EmergencyContact || mongoose.model("EmergencyContact", EmergencyContactSchema)

// Define interface for TypeScript
export interface IEmergencyContact {
  _id: string
  userId: string
  name: string
  relation: string
  phoneNumber: string
  createdAt: Date
}

// DTO for client-side use
export interface EmergencyContactDTO {
  id: string
  name: string
  relation: string
  phoneNumber: string
}

