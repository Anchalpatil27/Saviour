import type { Server as NetServer } from "http"
import { Server as ServerIO } from "socket.io"
import { NextResponse } from "next/server"
import type { Socket } from "socket.io"

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

    const httpServer: ServerInstance = (global as GlobalWithIO).httpServer || ({} as ServerInstance)
    const io = new ServerIO(httpServer, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_BASE_URL,
        methods: ["GET", "POST"],
      },
    })

    // Store the io instance globally
    ;(global as GlobalWithIO).io = io

    // Handle socket connections
    io.on("connection", (socket: Socket) => {
      console.log("Client connected:", socket.id)

      // Handle joining city-specific rooms
      socket.on("join-city", (city: string) => {
        // Leave all previous rooms
        socket.rooms.forEach((room) => {
          if (room !== socket.id) {
            socket.leave(room)
          }
        })
        // Join new city room
        socket.join(city)
        console.log(`Client ${socket.id} joined city: ${city}`)
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
            // Broadcast the message to the specific city room
            io.to(data.city).emit("new-message", {
              ...data,
              timestamp: new Date().toISOString(),
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Socket initialization error:", error)
    return NextResponse.json({ error: "Failed to initialize socket server" }, { status: 500 })
  }
}

