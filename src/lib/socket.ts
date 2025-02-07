import type { Server as NetServer } from "http"
import { Server as SocketIOServer } from "socket.io"
import type { NextApiResponse } from "next"
import { connectToDatabase } from "./mongodb"

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export const initSocket = (res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server)
    res.socket.server.io = io

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id)

      socket.on("join-city", async (city: string) => {
        // Leave all other rooms
        socket.rooms.forEach((room) => {
          if (room !== socket.id) {
            socket.leave(room)
          }
        })

        // Join the city room
        socket.join(city)
        console.log(`User ${socket.id} joined city: ${city}`)
      })

      socket.on("send-message", async (data: { content: string; city: string; userId: string; userName: string }) => {
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
      })

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id)
      })
    })
  }
  return res.socket.server.io
}

