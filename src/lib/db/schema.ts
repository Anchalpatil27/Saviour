import { Schema, model, models, type Document } from "mongoose"

export interface IUser extends Document {
  email: string
  username?: string
  password?: string
  name?: string
  image?: string
  phoneNumber?: string
  address?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true, sparse: true },
  password: String,
  name: String,
  image: String,
  phoneNumber: String,
  address: String,
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export const User = models.User || model<IUser>("User", userSchema)

