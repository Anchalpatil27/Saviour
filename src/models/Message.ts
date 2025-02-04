import mongoose from "mongoose"

const MessageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  username: { type: String, required: true },
  city: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Message || mongoose.model("Message", MessageSchema)

