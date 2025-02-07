"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
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
  console.log("SocketProvider rendering")
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [currentCity, setCurrentCity] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session, status } = useSession()

  const fetchCityAndInitSocket = useCallback(async () => {
    console.log("1. fetchCityAndInitSocket started", { status, session })
    try {
      setIsLoading(true)
      setError(null)

      if (!session?.user?.email) {
        console.log("2. No user email found in session")
        throw new Error("No user email found in session")
      }

      console.log("3. Fetching city data...")
      const response = await fetch("/api/user/city")
      console.log("4. City fetch response status:", response.status)

      const data = await response.json()
      console.log("5. Parsed city data:", data)

      if (!response.ok) {
        console.log("6. Response not OK")
        throw new Error(data.error || "Failed to fetch city")
      }

      if (!data.city) {
        console.log("7. No city found in response data")
        throw new Error("City not found in user profile")
      }

      console.log("8. Setting current city:", data.city)
      setCurrentCity(data.city)

      console.log("9. Initializing socket with city:", data.city)
      const socketInstance = io(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000", {
        path: "/api/socket",
      })

      socketInstance.on("connect", () => {
        console.log("10. Socket connected, joining city:", data.city)
        setIsConnected(true)
        socketInstance.emit("join-city", data.city)
      })

      socketInstance.on("connect_error", (error) => {
        console.error("11. Socket connection error:", error)
        setError(`Socket connection error: ${error.message}`)
      })

      socketInstance.on("disconnect", () => {
        console.log("12. Socket disconnected")
        setIsConnected(false)
      })

      setSocket(socketInstance)
      console.log("13. fetchCityAndInitSocket completed successfully")
    } catch (error) {
      console.error("14. Error in fetchCityAndInitSocket:", error)
      setError(error instanceof Error ? error.message : "Failed to initialize chat")
      setCurrentCity(null)
    } finally {
      setIsLoading(false)
      console.log("15. Final state:", { currentCity, isConnected, isLoading, error })
    }
  }, [session, status, currentCity]) // Added currentCity to dependencies

  useEffect(() => {
    console.log("SocketContext useEffect triggered", { status, session })
    console.log("NEXT_PUBLIC_BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL)

    if (status === "authenticated" && session?.user?.email) {
      console.log("Authenticated user, calling fetchCityAndInitSocket")
      fetchCityAndInitSocket()
    } else {
      console.log("Not authenticated or no user email", { status, session })
      setIsLoading(false)
      setError("User not authenticated")
    }

    return () => {
      console.log("SocketContext cleanup")
      if (socket) {
        console.log("Disconnecting socket")
        socket.disconnect()
      }
    }
  }, [session, status, fetchCityAndInitSocket, socket])

  console.log("SocketContext render", { isConnected, currentCity, isLoading, error })

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

