import type { Server as NetServer } from "http"
import type { NextApiRequest } from "next"
import { Server as ServerIO } from "socket.io"
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

if (!process.env.NEXT_PUBLIC_BASE_URL) {
  throw new Error("NEXT_PUBLIC_BASE_URL is not defined")
}

export async function GET(req: NextApiRequest) {
  try {
    if ((global as any).io) {
      return NextResponse.json({ success: true })
    }

    const httpServer: NetServer = (global as any).httpServer
    const io = new ServerIO(httpServer, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_BASE_URL,
        methods: ["GET", "POST"],
      },
    })

    // Store the io instance globally
    ;(global as any).io = io

    // Handle socket connections
    io.on("connection", async (socket) => {
      console.log("Client connected:", socket.id)

      // Handle joining city-specific rooms
      socket.on("join-city", async (city: string) => {
        // Leave all previous rooms
        socket.rooms.forEach((room) => {
          if (room !== socket.id) {
            socket.leave(room)
          }
        })

        // Join new city room
        socket.join(city)
        console.log(`Client ${socket.id} joined city: ${city}`)

        // Send recent messages for the city
        try {
          const { db } = await connectToDatabase()
          const messages = await db.collection("messages").find({ city }).sort({ createdAt: -1 }).limit(50).toArray()

          socket.emit("recent-messages", messages)
        } catch (error) {
          console.error("Error fetching recent messages:", error)
          socket.emit("error", "Failed to fetch recent messages")
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
            console.error("Error saving message:", error)
            socket.emit("error", "Failed to save message")
          }
        },
      )

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

