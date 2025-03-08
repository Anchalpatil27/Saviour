import mongoose from "mongoose"

// Using the existing UserDetails interface
const UserSchema = new mongoose.Schema({
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

// Create or retrieve the User model
export const User = mongoose.models.User || mongoose.model("User", UserSchema)

