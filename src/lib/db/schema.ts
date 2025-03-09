import mongoose, { Schema, type Document } from "mongoose"
import type { ObjectId } from "mongodb"

// Define the User interface
export interface IUser extends Document {
  _id: ObjectId // Explicitly define _id as ObjectId
  id?: string
  name: string
  email: string
  username?: string
  phoneNumber?: string
  address?: string
  city?: string
  image?: string
  provider?: string
  password?: string
  createdAt: Date
  updatedAt?: Date
}

// Define the User schema
const userSchema = new Schema({
  id: {
    type: String,
    unique: true,
    sparse: true, // Allow null/undefined values
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
  username: {
    type: String,
    unique: true,
    sparse: true, // Allow null/undefined values
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
  },
  password: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
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

