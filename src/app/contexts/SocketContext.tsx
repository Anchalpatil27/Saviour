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
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) return

    const fetchCityAndInitSocket = async () => {
      try {
        const response = await fetch("/api/user/city")
        if (!response.ok) throw new Error("Failed to fetch city")
        const data = await response.json()

        if (!data.city) {
          console.warn("City not set in user profile")
          setCurrentCity(null)
        } else {
          setCurrentCity(data.city)

          const socketInstance = io(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000", {
            path: "/api/socket",
          })

          socketInstance.on("connect", () => {
            console.log("Socket connected")
            setIsConnected(true)
            socketInstance.emit("join-city", data.city)
          })

          socketInstance.on("disconnect", () => {
            console.log("Socket disconnected")
            setIsConnected(false)
          })

          setSocket(socketInstance)
        }

        return () => {
          if (socket) {
            socket.disconnect()
          }
        }
      } catch (error) {
        console.error("Error initializing socket:", error)
        setCurrentCity(null)
      }
    }

    fetchCityAndInitSocket()
  }, [session, status, socket]) // Added socket to dependencies

  return <SocketContext.Provider value={{ socket, isConnected, currentCity }}>{children}</SocketContext.Provider>
}

export const useSocket = () => useContext(SocketContext)

