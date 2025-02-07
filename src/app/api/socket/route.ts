import type { Server as NetServer } from "http"
import { Server as SocketIOServer } from "socket.io"
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

interface ServerInstance extends NetServer {
  io?: SocketIOServer
}

interface GlobalWithIO {
  io?: SocketIOServer
  httpServer?: ServerInstance
}

export async function GET() {
  try {
    if ((global as GlobalWithIO).io) {
      console.log("Socket.IO server already running")
      return NextResponse.json({ success: true })
    }

    console.log("Starting Socket.IO server...")

    const httpServer: ServerInstance = (global as GlobalWithIO).httpServer || ({} as ServerInstance)
    const io = new SocketIOServer(httpServer, {
      path: "/api/socket",
    })

    io.on("connection", (socket) => {
      console.log("New client connected")

      socket.on("join-city", (city) => {
        socket.join(city)
        console.log(`Client joined city: ${city}`)
      })

      socket.on("chat-message", async (message) => {
        try {
          const { db } = await connectToDatabase()
          const result = await db.collection("messages").insertOne({
            ...message,
            createdAt: new Date(),
          })
          const newMessage = { ...message, id: result.insertedId, createdAt: new Date() }
          io.to(message.city).emit("new-message", newMessage)
        } catch (error) {
          console.error("Error saving message:", error)
        }
      })

      socket.on("get-recent-messages", async (city) => {
        try {
          const { db } = await connectToDatabase()
          const messages = await db.collection("messages").find({ city }).sort({ createdAt: -1 }).limit(50).toArray()
          socket.emit("recent-messages", messages)
        } catch (error) {
          console.error("Error fetching recent messages:", error)
        }
      })

      socket.on("disconnect", () => {
        console.log("Client disconnected")
      })
    })
    ;(global as GlobalWithIO).io = io
    console.log("Socket.IO server started successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Socket initialization error:", error)
    return NextResponse.json({ error: "Failed to start socket server" }, { status: 500 })
  }
}

