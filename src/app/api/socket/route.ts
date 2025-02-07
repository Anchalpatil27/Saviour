import type { Server as NetServer } from "http"
import { Server as ServerIO } from "socket.io"
import { NextResponse } from "next/server"
import type { Socket } from "socket.io"
import { connectToDatabase } from "@/lib/mongodb"
import { createServer } from "http"

interface ServerInstance extends NetServer {
  io?: ServerIO
}

interface GlobalWithIO {
  io?: ServerIO
  httpServer?: ServerInstance
}

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

if (!process.env.NEXT_PUBLIC_BASE_URL) {
  throw new Error("NEXT_PUBLIC_BASE_URL is not defined")
}

export async function GET() {
  try {
    if ((global as GlobalWithIO).io) {
      console.log("Socket.IO server already running")
      return NextResponse.json({ success: true })
    }

    console.log("Starting Socket.IO server...")

    // Create HTTP server if it doesn't exist
    if (!(global as GlobalWithIO).httpServer) {
      ;(global as GlobalWithIO).httpServer = createServer()
    }

    const httpServer: ServerInstance = (global as GlobalWithIO).httpServer!
    const io = new ServerIO(httpServer, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_BASE_URL,
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ["websocket", "polling"],
    })

    // Store the io instance globally
    ;(global as GlobalWithIO).io = io

    // Handle socket connections
    io.on("connection", async (socket: Socket) => {
      console.log("Client connected:", socket.id)

      // Handle joining city-specific rooms
      socket.on("join-city", async (city: string) => {
        try {
          // Leave all previous rooms
          socket.rooms.forEach((room) => {
            if (room !== socket.id) {
              socket.leave(room)
            }
          })

          // Join new city room
          socket.join(city)
          console.log(`Client ${socket.id} joined city: ${city}`)

          // Fetch and send recent messages
          const { db } = await connectToDatabase()
          const messages = await db.collection("messages").find({ city }).sort({ createdAt: -1 }).limit(50).toArray()

          socket.emit("recent-messages", messages)
        } catch (error) {
          console.error("Error joining city:", error)
          socket.emit("error", "Failed to join city chat")
        }
      })

      // Handle chat messages
      socket.on(
        "chat-message",
        async (data: {
          content: string
          city: string
          userId: string
          userName: string
        }) => {
          try {
            const { db } = await connectToDatabase()
            const newMessage = {
              ...data,
              createdAt: new Date(),
            }

            const result = await db.collection("messages").insertOne(newMessage)

            // Broadcast to everyone in the same city
            io.to(data.city).emit("new-message", {
              id: result.insertedId.toString(),
              ...newMessage,
            })
          } catch (error) {
            console.error("Error handling chat message:", error)
            socket.emit("error", "Failed to process message")
          }
        },
      )

      // Handle disconnections
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id)
      })
    })

    // Start listening on the HTTP server
    const port = process.env.SOCKET_PORT || 3001
    httpServer.listen(port)
    console.log(`Socket.IO server listening on port ${port}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Socket initialization error:", error)
    return NextResponse.json({ error: "Failed to initialize socket server" }, { status: 500 })
  }
}

