"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"
import { useSession } from "next-auth/react"

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  currentCity: string | null
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  currentCity: null,
})

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [currentCity, setCurrentCity] = useState<string | null>(null)
  const { data: session } = useSession()

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000", {
      path: "/api/socket",
      addTrailingSlash: false,
    })

    socketInstance.on("connect", () => {
      console.log("Socket connected")
      setIsConnected(true)
    })

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected")
      setIsConnected(false)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.close()
    }
  }, [])

  // Auto-join city room when session is available
  useEffect(() => {
    if (!socket || !session?.user?.email) return

    async function joinUserCity() {
      try {
        const response = await fetch("/api/user/city")
        const data = await response.json()

        if (data.city && socket) {
          socket.emit("join-city", data.city)
          setCurrentCity(data.city)
          console.log("Joined city room:", data.city)
        }
      } catch (error) {
        console.error("Failed to join city room:", error)
      }
    }

    joinUserCity()
  }, [socket, session])

  return <SocketContext.Provider value={{ socket, isConnected, currentCity }}>{children}</SocketContext.Provider>
}

export const useSocket = () => useContext(SocketContext)

