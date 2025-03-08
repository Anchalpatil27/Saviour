import mongoose, { Schema, type Document } from "mongoose"

// Define the User interface
export interface IUser extends Document {
  id: string
  name: string
  email: string
  phoneNumber?: string
  address?: string
  city?: string
  image?: string
  provider: string
  createdAt: Date
}

// Define the User schema
const userSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
    index: true, // Add index for faster queries by city
  },
  image: {
    type: String,
  },
  provider: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Create or retrieve the User model - with defensive programming
let UserModel: mongoose.Model<IUser>

// Check if mongoose.models exists and has User property
if (mongoose.models && mongoose.models.User) {
  UserModel = mongoose.models.User as mongoose.Model<IUser>
} else {
  // If not, create a new model
  UserModel = mongoose.model<IUser>("User", userSchema)
}

export const User = UserModel

