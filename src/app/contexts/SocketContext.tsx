"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"
import { useSession } from "next-auth/react"

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  currentCity: string | null
  isLoading: boolean
  error: string | null
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  currentCity: null,
  isLoading: true,
  error: null,
})

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [currentCity, setCurrentCity] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) {
      setIsLoading(false)
      return
    }

    let socketInstance: Socket | null = null

    const fetchCityAndInitSocket = async () => {
      console.log("fetchCityAndInitSocket started", { status, session })
      try {
        setIsLoading(true)
        setError(null)

        if (!session?.user?.email) {
          throw new Error("No user email found in session")
        }

        console.log("Fetching city data...")
        const response = await fetch("/api/user/city")
        console.log("City fetch response status:", response.status)

        const responseText = await response.text()
        console.log("Raw response:", responseText)

        let data
        try {
          data = JSON.parse(responseText)
        } catch (e) {
          console.error("Error parsing JSON:", e)
          throw new Error("Invalid JSON response from server")
        }

        console.log("City data received:", data)

        if (!response.ok) {
          throw new Error(`Failed to fetch city: ${response.status} ${data.error || responseText}`)
        }

        if (!data.city) {
          throw new Error("City not found in user profile")
        }

        setCurrentCity(data.city)

        console.log("Initializing socket with city:", data.city)
        socketInstance = io(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000", {
          path: "/api/socket",
        })

        socketInstance.on("connect", () => {
          console.log("Socket connected, joining city:", data.city)
          setIsConnected(true)
          socketInstance?.emit("join-city", data.city)
        })

        socketInstance.on("connect_error", (error) => {
          console.error("Socket connection error:", error)
          setError(`Socket connection error: ${error.message}`)
        })

        socketInstance.on("disconnect", () => {
          console.log("Socket disconnected")
          setIsConnected(false)
        })

        setSocket(socketInstance)
        console.log("fetchCityAndInitSocket completed successfully")
      } catch (error) {
        console.error("Error in fetchCityAndInitSocket:", error)
        setError(error instanceof Error ? error.message : "Failed to initialize chat")
        setCurrentCity(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCityAndInitSocket()

    return () => {
      console.log("SocketContext cleanup", { socketInstance })
      if (socketInstance) {
        console.log("Disconnecting socket")
        socketInstance.disconnect()
      }
    }
  }, [session, status])

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        currentCity,
        isLoading,
        error,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)

