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
    console.log("SocketContext useEffect triggered", { status, session })
    console.log("NEXT_PUBLIC_BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL)
    if (status !== "authenticated" || !session?.user?.email) {
      console.log("Not authenticated or no user email", { status, session })
      setIsLoading(false)
      return
    }

    let socketInstance: Socket | null = null

    const fetchCityAndInitSocket = async () => {
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

        const responseText = await response.text()
        console.log("5. Raw response:", responseText)

        let data
        try {
          data = JSON.parse(responseText)
          console.log("6. Parsed city data:", data)
        } catch (e) {
          console.error("7. Error parsing JSON:", e)
          throw new Error("Invalid JSON response from server")
        }

        if (!response.ok) {
          console.log("8. Response not OK")
          throw new Error(`Failed to fetch city: ${response.status} ${data.error || responseText}`)
        }

        if (!data.city) {
          console.log("9. No city found in response data")
          throw new Error("City not found in user profile")
        }

        console.log("10. Setting current city:", data.city)
        setCurrentCity(data.city)

        console.log("11. Initializing socket with city:", data.city)
        socketInstance = io(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000", {
          path: "/api/socket",
        })

        if (socketInstance) {
          socketInstance.on("connect", () => {
            console.log("12. Socket connected, joining city:", data.city)
            setIsConnected(true)
            socketInstance?.emit("join-city", data.city)
          })

          socketInstance.on("connect_error", (error) => {
            console.error("13. Socket connection error:", error)
            setError(`Socket connection error: ${error.message}`)
          })

          socketInstance.on("disconnect", () => {
            console.log("14. Socket disconnected")
            setIsConnected(false)
          })

          setSocket(socketInstance)
          console.log("15. fetchCityAndInitSocket completed successfully")
        } else {
          console.error("Socket instance is null")
          setError("Failed to initialize socket")
        }
      } catch (error) {
        console.error("16. Error in fetchCityAndInitSocket:", error)
        setError(error instanceof Error ? error.message : "Failed to initialize chat")
        setCurrentCity(null)
      } finally {
        setIsLoading(false)
        console.log("17. Final state:", { currentCity, isConnected, isLoading, error })
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
  }, [session, status, currentCity, error, isConnected]) // Added isConnected to dependencies

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

